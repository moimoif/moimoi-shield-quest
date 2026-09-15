export type AppLanguage = 'ja' | 'en'

export function isAppLanguage(value: unknown): value is AppLanguage {
  return value === 'ja' || value === 'en'
}

const english: Record<string, string> = {
  'Solana の安全確認を、毎日のミッションとして。': 'Make Solana safety checks a daily mission.',
  連続プレイ: 'Play streak',
  今日のミッション: 'Today’s missions',
  ウォレットを接続する: 'Connect your wallet',
  'Shield Game をクリアする': 'Complete the Shield Game',
  'QR を確認する': 'Check a QR code',
  完了: 'Complete',
  未完了: 'Incomplete',
  挑戦可能: 'Ready to play',
  確認可能: 'Ready to check',
  未接続: 'Not connected',
  'Wallet Lab を開く': 'Open Wallet Lab',
  '今日の Shield に挑戦': 'Play today’s Shield Quest',
  'Stamp Passport を見る': 'View Stamp Passport',
  'QR の内容を確認': 'Check QR content',
  ホームに戻る: 'Back to Home',
  QR安全確認画面を開きます: 'Opens the QR safety check screen',
  QR内容の確認: 'QR content check',
  '確認できるのは、QRに含まれる文字列です': 'This checks only the text encoded in the QR code',
  '教育目的の説明であり、安全性を保証するものではありません。リンクを開く・署名する・送金する処理は行いません。':
    'For education only; this does not guarantee safety. It does not open links, sign messages or transactions, or send funds.',
  'カメラ権限を確認しています…': 'Checking camera permission…',
  カメラの許可: 'Camera permission',
  'QRコードを端末内で読み取る場合のみ、カメラを使用します。':
    'The camera is used only to scan QR codes on this device.',
  カメラの使用を許可する: 'Allow camera access',
  'カメラが許可されていません。必要な場合のみ、端末の設定から変更してください。':
    'Camera access is not allowed. Change it in your device settings only if needed.',
  'カメラ権限を確認できませんでした。': 'Could not check camera permission.',
  'カメラを開始できませんでした。アプリを閉じてから、もう一度お試しください。':
    'Could not start the camera. Close the app and try again.',
  枠内にQRコードを合わせてください: 'Position the QR code inside the frame',
  読取りを中止: 'Stop scanning',
  QRを読み取る: 'Scan a QR code',
  別のQRを読み取る: 'Scan another QR code',
  読み取った原文: 'Original decoded text',
  '（空の文字列）': '(Empty text)',
  確認するポイント: 'Points to check',
  '読取り結果は履歴保存せず、この画面から外部へ送信しません。QR内の表示名や説明文も未検証です。':
    'Scan results are not saved to history or sent externally by this screen. Names and descriptions inside the QR code are also unverified.',
  結果を消す: 'Clear result',
  記載なし: 'Not specified',
  方式: 'Protocol',
  ドメイン: 'Domain',
  ポート: 'Port',
  パス: 'Path',
  クエリ: 'Query',
  取引要求URL: 'Transaction request URL',
  受取先: 'Recipient',
  '金額（amount）': 'Amount (amount)',
  'トークンMint（spl-token）': 'Token mint (spl-token)',
  '参照（reference）': 'Reference (reference)',
  'ラベル（label）': 'Label (label)',
  'メッセージ（message）': 'Message (message)',
  'メモ（memo）': 'Memo (memo)',
  '文字列・未対応形式': 'Text / unsupported format',
  文字数: 'Character count',
  '表示されたドメインを、公式サイトや店舗の案内と別の方法で照合してください。':
    'Independently compare the displayed domain with the official website or information provided by the store.',
  'HTTPSの表示だけでは、運営者や内容の正当性は確認できません。':
    'HTTPS alone does not verify the operator or the legitimacy of the content.',
  '暗号化されていないHTTP形式です。入力や接続は行わず、接続先を確認してください。':
    'This is unencrypted HTTP. Do not enter information or connect a wallet; verify the destination.',
  'URLに「@」より前のユーザー情報があります。「@」より後ろが実際の接続先です。':
    'The URL contains user information before “@”. The actual destination comes after “@”.',
  '国際化ドメインのPunycode表記を含みます。見た目が似た文字に注意してください。':
    'The domain includes internationalized Punycode notation. Watch for look-alike characters.',
  '短縮URLです。転送先はこの画面では確認していません。':
    'This is a shortened URL. This screen has not checked its redirect destination.',
  'この画面はリンクを開かず、転送先・サイト内容・評判を確認しません。':
    'This screen does not open links or check redirects, website content, or reputation.',
  'Solana URIという形式だけでは、作成者・受取先・取引内容の正当性は確認できません。':
    'The Solana URI format alone does not verify the creator, recipient, or transaction.',
  '取引要求URLが含まれています。この画面ではアクセスも取引データの取得も行いません。':
    'A transaction request URL is included. This screen does not access it or fetch transaction data.',
  '受取先アドレスを、店舗表示や信頼できる公式案内と別の方法で照合してください。':
    'Independently compare the recipient address with the store’s display or trusted official information.',
  'amountはQR作成者が指定した値です。単位と支払う意思を別の画面でも確認してください。':
    'The QR creator specified the amount. Independently confirm its units and whether you intend to pay.',
  'amountの記載はありません。金額がないことは、安全性を示すものではありません。':
    'No amount is specified. An absent amount does not indicate safety.',
  'spl-tokenはトークン名ではなくMintアドレスで照合してください。':
    'Verify spl-token using its mint address, not its token name.',
  'spl-tokenがない場合は通常SOLの要求として扱われることがあります。':
    'Without spl-token, the request may normally be interpreted as a SOL request.',
  'label・message・memoはQR作成者が自由に入力でき、本人確認には使えません。':
    'The creator can freely set label, message, and memo; these cannot verify identity.',
  'HTTP(S) URLまたはSolana URIとして分類できませんでした。':
    'This could not be classified as an HTTP(S) URL or Solana URI.',
  '別アプリを起動する形式、連絡先、通常の文章、不完全なデータなどの可能性があります。':
    'It may be an app-launch link, contact details, ordinary text, incomplete data, or another format.',
  '分類できないことは、安全または危険であることの証明にはなりません。':
    'Being unclassified proves neither safety nor danger.',
}

export function translate(language: AppLanguage, source: string): string {
  return language === 'en' ? (english[source] ?? source) : source
}
