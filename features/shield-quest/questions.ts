export type SafetyVerdict = 'safe' | 'danger'

export type SafetyQuestion = {
  category: string
  clue: string
  id: string
  scenario: string
  title: string
  verdict: SafetyVerdict
}

export const safetyQuestions: SafetyQuestion[] = [
  {
    id: 'seed-phrase-dm',
    category: 'フィッシング',
    title: 'サポート担当からのDM',
    scenario: '「復旧のため」と言われ、シークレットリカバリーフレーズ12語の入力を求められた。',
    verdict: 'danger',
    clue: '正規サポートがリカバリーフレーズや秘密鍵を聞くことはありません。誰にも入力・送信しないでください。',
  },
  {
    id: 'verified-bookmark',
    category: '公式サイト',
    title: '確認済みブックマーク',
    scenario: '以前に公式案内と照合して保存したブックマークから開き、ドメインと接続先をもう一度確認した。',
    verdict: 'safe',
    clue: '検索広告やDMのリンクを避け、確認済みブックマークとドメイン照合を組み合わせるのは有効です。',
  },
  {
    id: 'urgent-airdrop',
    category: '偽エアドロップ',
    title: '残り3分の限定Claim',
    scenario: '知らないアカウントから「今すぐ接続しないと失効」と届き、ウォレット接続を急かされている。',
    verdict: 'danger',
    clue: '強い緊急性、突然のDM、ウォレット接続の要求は典型的な詐欺のサインです。',
  },
  {
    id: 'unexpected-fee',
    category: '偽エアドロップ',
    title: '受取前の解除手数料',
    scenario: '無料トークンを受け取るため、先に0.2 SOLを指定アドレスへ送るよう求められた。',
    verdict: 'danger',
    clue: '報酬の受取条件として先払い送金を要求する案件は危険です。送金しないでください。',
  },
  {
    id: 'solana-uri-transfer',
    category: 'Solana URI',
    title: '見知らぬQRのURI',
    scenario: '読み取ったURIに「solana:見知らぬ宛先?amount=1」とあり、確認画面には1 SOL送金と表示された。',
    verdict: 'danger',
    clue: 'Solana URIは送金内容を含められます。知らない宛先・意図しない金額なら必ず中止してください。',
  },
  {
    id: 'verified-solana-pay',
    category: 'Solana URI',
    title: '店頭のSolana Pay',
    scenario: '会計中の店舗でQRを読み、店名・受取先・請求額がレジ表示とすべて一致している。',
    verdict: 'safe',
    clue: '自分が開始した支払いで、受取先と金額を別の表示でも照合できていれば安全性が高まります。',
  },
  {
    id: 'unlimited-approval',
    category: 'トランザクション',
    title: '無制限の権限要求',
    scenario: 'NFTのClaimだけのはずが、シミュレーションに「すべてのトークンを移動できる権限」が表示された。',
    verdict: 'danger',
    clue: '目的と一致しない強い権限は承認しないでください。表示内容が不明な署名も中止が基本です。',
  },
  {
    id: 'message-domain-nonce',
    category: '署名',
    title: '内容を読めるログイン署名',
    scenario: '自分で開いた公式dAppで、ドメイン・有効期限・nonceだけを含むログインメッセージを確認した。',
    verdict: 'safe',
    clue: '送金トランザクションではなく、サイトと内容を確認できるログイン署名なら妥当です。',
  },
  {
    id: 'short-link',
    category: 'フィッシング',
    title: '短縮URLのMint案内',
    scenario: 'フォローしていない人物から短縮URLが届き、「ウォレットを接続すれば確実にMintできる」と書かれている。',
    verdict: 'danger',
    clue: '短縮URLは本当のドメインを隠します。公式チャンネルから自分でサイトへ移動してください。',
  },
  {
    id: 'hardware-display',
    category: '送金確認',
    title: '端末画面で再確認',
    scenario: '自分で作成した少額送金で、ハードウェアウォレット画面の宛先と金額も一致した。',
    verdict: 'safe',
    clue: '信頼できる別画面で宛先と金額を照合するのは、改ざんや入力ミスを防ぐ重要な習慣です。',
  },
  {
    id: 'nft-link',
    category: 'スパムNFT',
    title: '突然届いたNFT',
    scenario: '覚えのないNFTの画像に「報酬を受け取るには記載URLへ」と書かれている。',
    verdict: 'danger',
    clue: 'スパムNFT内のURLは開かず、ウォレットの非表示・報告機能を使ってください。',
  },
  {
    id: 'official-update',
    category: 'ウォレット管理',
    title: '公式ストアから更新',
    scenario: '端末の公式アプリストアを自分で開き、開発元を確認してウォレットアプリを更新する。',
    verdict: 'safe',
    clue: 'DMの配布ファイルではなく、公式ストアと正しい開発元を確認して更新するのが基本です。',
  },
]

export function shuffledQuestions(): SafetyQuestion[] {
  const result = [...safetyQuestions]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1))
    const current = result[index]
    result[index] = result[nextIndex]
    result[nextIndex] = current
  }

  return result
}
