import { translate, type AppLanguage } from '@/features/language/translations'
export type QrField = {
  label: string
  value: string
}

export type QrAnalysis = {
  fields: QrField[]
  kind: 'solana' | 'url' | 'text'
  label: string
  notes: string[]
}

const shortenerHosts = new Set(['bit.ly', 'cutt.ly', 'is.gd', 'rb.gy', 'shorturl.at', 't.co', 'tiny.cc', 'tinyurl.com'])

function valueOrNotSpecified(value: string | null, language: AppLanguage): string {
  return value?.trim() ? value : translate(language, '記載なし')
}

function hostNotes(url: URL): string[] {
  const notes = [
    '表示されたドメインを、公式サイトや店舗の案内と別の方法で照合してください。',
    'HTTPSの表示だけでは、運営者や内容の正当性は確認できません。',
  ]

  if (url.protocol === 'http:') {
    notes.unshift('暗号化されていないHTTP形式です。入力や接続は行わず、接続先を確認してください。')
  }
  if (url.username || url.password) {
    notes.unshift('URLに「@」より前のユーザー情報があります。「@」より後ろが実際の接続先です。')
  }
  if (url.hostname.startsWith('xn--')) {
    notes.unshift('国際化ドメインのPunycode表記を含みます。見た目が似た文字に注意してください。')
  }
  if (shortenerHosts.has(url.hostname.toLowerCase())) {
    notes.unshift('短縮URLです。転送先はこの画面では確認していません。')
  }

  return notes
}

function analyseWebUrl(raw: string, language: AppLanguage): QrAnalysis | null {
  const displayValue = (value: string | null) => valueOrNotSpecified(value, language)
  try {
    const url = new URL(raw)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null
    }

    return {
      kind: 'url',
      label: 'Web URL',
      fields: [
        { label: '方式', value: url.protocol.replace(':', '').toUpperCase() },
        { label: 'ドメイン', value: url.hostname },
        { label: 'ポート', value: displayValue(url.port) },
        { label: 'パス', value: displayValue(url.pathname) },
        { label: 'クエリ', value: displayValue(url.search ? url.search.slice(1) : '') },
      ],
      notes: [...hostNotes(url), 'この画面はリンクを開かず、転送先・サイト内容・評判を確認しません。'],
    }
  } catch {
    return null
  }
}

function analyseSolanaUri(raw: string, language: AppLanguage): QrAnalysis {
  const displayValue = (value: string | null) => valueOrNotSpecified(value, language)
  const payload = raw.slice(raw.indexOf(':') + 1)
  const separator = payload.indexOf('?')
  const target = decodeURIComponent(separator >= 0 ? payload.slice(0, separator) : payload)
  const query = separator >= 0 ? payload.slice(separator + 1) : ''
  const params = new URLSearchParams(query)
  const isTransactionRequest = /^https?:\/\//i.test(target)
  const fields: QrField[] = [
    { label: isTransactionRequest ? '取引要求URL' : '受取先', value: displayValue(target) },
    { label: '金額（amount）', value: displayValue(params.get('amount')) },
    { label: 'トークンMint（spl-token）', value: displayValue(params.get('spl-token')) },
    { label: '参照（reference）', value: displayValue(params.get('reference')) },
    { label: 'ラベル（label）', value: displayValue(params.get('label')) },
    { label: 'メッセージ（message）', value: displayValue(params.get('message')) },
    { label: 'メモ（memo）', value: displayValue(params.get('memo')) },
  ]

  const notes = [
    'Solana URIという形式だけでは、作成者・受取先・取引内容の正当性は確認できません。',
    isTransactionRequest
      ? '取引要求URLが含まれています。この画面ではアクセスも取引データの取得も行いません。'
      : '受取先アドレスを、店舗表示や信頼できる公式案内と別の方法で照合してください。',
    params.has('amount')
      ? 'amountはQR作成者が指定した値です。単位と支払う意思を別の画面でも確認してください。'
      : 'amountの記載はありません。金額がないことは、安全性を示すものではありません。',
    params.has('spl-token')
      ? 'spl-tokenはトークン名ではなくMintアドレスで照合してください。'
      : 'spl-tokenがない場合は通常SOLの要求として扱われることがあります。',
    'label・message・memoはQR作成者が自由に入力でき、本人確認には使えません。',
  ]

  return { kind: 'solana', label: 'Solana URI', fields, notes }
}

function analyseRawContent(raw: string, language: AppLanguage): QrAnalysis {
  const value = raw.trim()

  if (/^solana:/i.test(value)) {
    return analyseSolanaUri(value, language)
  }

  const webUrl = analyseWebUrl(value, language)
  if (webUrl) {
    return webUrl
  }

  return {
    kind: 'text',
    label: '文字列・未対応形式',
    fields: [{ label: '文字数', value: String(value.length) }],
    notes: [
      'HTTP(S) URLまたはSolana URIとして分類できませんでした。',
      '別アプリを起動する形式、連絡先、通常の文章、不完全なデータなどの可能性があります。',
      '分類できないことは、安全または危険であることの証明にはなりません。',
    ],
  }
}

export function analyseQrContent(raw: string, language: AppLanguage = 'ja'): QrAnalysis {
  const result = analyseRawContent(raw, language)
  return {
    ...result,
    label: translate(language, result.label),
    fields: result.fields.map((field) => ({ ...field, label: translate(language, field.label) })),
    notes: result.notes.map((note) => translate(language, note)),
  }
}
