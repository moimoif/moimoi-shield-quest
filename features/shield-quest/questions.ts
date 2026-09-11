export type SafetyVerdict = 'safe' | 'danger'

export type SafetyQuestion = {
  category: string
  clue: string
  difficulty: 1 | 2 | 3
  id: string
  scenario: string
  title: string
  verdict: SafetyVerdict
}

export const safetyQuestions: SafetyQuestion[] = [
  {
    id: 'seed-phrase-dm',
    difficulty: 1,
    category: 'フィッシング',
    title: 'サポート担当からのDM',
    scenario: '「復旧のため」と言われ、シークレットリカバリーフレーズ12語の入力を求められた。',
    verdict: 'danger',
    clue: '正規サポートがリカバリーフレーズや秘密鍵を聞くことはありません。誰にも入力・送信しないでください。',
  },
  {
    id: 'verified-bookmark',
    difficulty: 1,
    category: '公式サイト',
    title: '確認済みブックマーク',
    scenario: '以前に公式案内と照合して保存したブックマークから開き、ドメインと接続先をもう一度確認した。',
    verdict: 'safe',
    clue: '検索広告やDMのリンクを避け、確認済みブックマークとドメイン照合を組み合わせるのは有効です。',
  },
  {
    id: 'urgent-airdrop',
    difficulty: 1,
    category: '偽エアドロップ',
    title: '残り3分の限定Claim',
    scenario: '知らないアカウントから「今すぐ接続しないと失効」と届き、ウォレット接続を急かされている。',
    verdict: 'danger',
    clue: '強い緊急性、突然のDM、ウォレット接続の要求は典型的な詐欺のサインです。',
  },
  {
    id: 'unexpected-fee',
    difficulty: 1,
    category: '偽エアドロップ',
    title: '受取前の解除手数料',
    scenario: '無料トークンを受け取るため、先に0.2 SOLを指定アドレスへ送るよう求められた。',
    verdict: 'danger',
    clue: '報酬の受取条件として先払い送金を要求する案件は危険です。送金しないでください。',
  },
  {
    id: 'solana-uri-transfer',
    difficulty: 2,
    category: 'Solana URI',
    title: '見知らぬQRのURI',
    scenario: '読み取ったURIに「solana:見知らぬ宛先?amount=1」とあり、確認画面には1 SOL送金と表示された。',
    verdict: 'danger',
    clue: 'Solana URIは送金内容を含められます。知らない宛先・意図しない金額なら必ず中止してください。',
  },
  {
    id: 'verified-solana-pay',
    difficulty: 2,
    category: 'Solana URI',
    title: '店頭のSolana Pay',
    scenario: '会計中の店舗でQRを読み、店名・受取先・請求額がレジ表示とすべて一致している。',
    verdict: 'safe',
    clue: '自分が開始した支払いで、受取先と金額を別の表示でも照合できていれば安全性が高まります。',
  },
  {
    id: 'unlimited-approval',
    difficulty: 2,
    category: 'トランザクション',
    title: '無制限の権限要求',
    scenario: 'NFTのClaimだけのはずが、シミュレーションに「すべてのトークンを移動できる権限」が表示された。',
    verdict: 'danger',
    clue: '目的と一致しない強い権限は承認しないでください。表示内容が不明な署名も中止が基本です。',
  },
  {
    id: 'message-domain-nonce',
    difficulty: 2,
    category: '署名',
    title: '内容を読めるログイン署名',
    scenario: '自分で開いた公式dAppで、ドメイン・有効期限・nonceだけを含むログインメッセージを確認した。',
    verdict: 'safe',
    clue: '送金トランザクションではなく、サイトと内容を確認できるログイン署名なら妥当です。',
  },
  {
    id: 'short-link',
    difficulty: 1,
    category: 'フィッシング',
    title: '短縮URLのMint案内',
    scenario: 'フォローしていない人物から短縮URLが届き、「ウォレットを接続すれば確実にMintできる」と書かれている。',
    verdict: 'danger',
    clue: '短縮URLは本当のドメインを隠します。公式チャンネルから自分でサイトへ移動してください。',
  },
  {
    id: 'hardware-display',
    difficulty: 1,
    category: '送金確認',
    title: '端末画面で再確認',
    scenario: '自分で作成した少額送金で、ハードウェアウォレット画面の宛先と金額も一致した。',
    verdict: 'safe',
    clue: '信頼できる別画面で宛先と金額を照合するのは、改ざんや入力ミスを防ぐ重要な習慣です。',
  },
  {
    id: 'nft-link',
    difficulty: 1,
    category: 'スパムNFT',
    title: '突然届いたNFT',
    scenario: '覚えのないNFTの画像に「報酬を受け取るには記載URLへ」と書かれている。',
    verdict: 'danger',
    clue: 'スパムNFT内のURLは開かず、ウォレットの非表示・報告機能を使ってください。',
  },
  {
    id: 'official-update',
    difficulty: 1,
    category: 'ウォレット管理',
    title: '公式ストアから更新',
    scenario: '端末の公式アプリストアを自分で開き、開発元を確認してウォレットアプリを更新する。',
    verdict: 'safe',
    clue: 'DMの配布ファイルではなく、公式ストアと正しい開発元を確認して更新するのが基本です。',
  },
  {
    id: 'unicode-lookalike-domain',
    difficulty: 2,
    category: 'フィッシング',
    title: 'よく似た公式ドメイン',
    scenario: '検索広告から開いたサイト名は公式と同じに見えるが、URLの1文字だけが別の文字に置き換わっている。',
    verdict: 'danger',
    clue: '見た目が似た文字を使う偽ドメインがあります。広告を避け、URLを一文字ずつ確認してください。',
  },
  {
    id: 'verified-simulation',
    difficulty: 2,
    category: 'シミュレーション',
    title: '内容が一致する取引',
    scenario: '自分で開始したSwapで、シミュレーションの支払額・受取額・手数料が入力内容と一致している。',
    verdict: 'safe',
    clue: '自分で開始した操作で、資産変化・手数料・相手先が意図どおりか確認することが重要です。',
  },
  {
    id: 'opaque-message',
    difficulty: 2,
    category: '署名',
    title: '読めないログイン署名',
    scenario: 'ログインのためと言われたが、署名メッセージは長い記号の羅列で、目的や有効期限を確認できない。',
    verdict: 'danger',
    clue: '内容を理解できない署名は承認しないでください。正規サイトでも表示内容の確認が必要です。',
  },
  {
    id: 'revoke-old-access',
    difficulty: 2,
    category: '権限管理',
    title: '使わない権限を解除',
    scenario: '公式の権限管理画面を自分で開き、もう使わないdAppへの委任権限だけを確認して解除する。',
    verdict: 'safe',
    clue: '不要な委任権限を定期的に確認し、正規画面から解除することは被害範囲の縮小に役立ちます。',
  },
  {
    id: 'authority-change',
    difficulty: 3,
    category: 'トランザクション',
    title: '所有権変更のInstruction',
    scenario: 'プロフィール更新のはずなのに、確認画面にウォレット資産のAuthorityを別アドレスへ変更する処理がある。',
    verdict: 'danger',
    clue: '操作目的と無関係なAuthority変更は非常に危険です。署名せず、接続を解除してください。',
  },
  {
    id: 'known-mobile-deeplink',
    difficulty: 3,
    category: 'ディープリンク',
    title: '公式アプリ間の移動',
    scenario: '自分で公式dAppを開き、表示された接続先ドメインとウォレット側の要求内容が一致している。',
    verdict: 'safe',
    clue: '自分で開始し、接続元と要求内容を両方確認できるディープリンクは妥当です。',
  },
  {
    id: 'unexpected-delegate',
    difficulty: 3,
    category: '委任権限',
    title: 'Claimに含まれるDelegate',
    scenario: '記念NFTを受け取るだけの操作に、保有トークンを第三者が移動できるDelegate設定が含まれている。',
    verdict: 'danger',
    clue: 'Claimと無関係な委任権限は承認しないでください。権限の対象と上限を必ず確認します。',
  },
  {
    id: 'verified-limit-order',
    difficulty: 3,
    category: 'DEX',
    title: '確認済み指値注文',
    scenario: '公式DEXで自分が設定した指値注文を確認し、売却数量・希望価格・対象Mintがすべて一致している。',
    verdict: 'safe',
    clue: '公式サービスで自分が開始し、数量・価格・Mintを確認できていれば意図した操作と判断できます。',
  },
  {
    id: 'blind-signing',
    difficulty: 3,
    category: 'ハードウェア',
    title: 'Blind Signingを要求',
    scenario: '内容を表示できないためBlind Signingを有効化し、そのまま承認するよう知らないサイトに指示された。',
    verdict: 'danger',
    clue: '内容を確認できない署名はハードウェアウォレットでも危険です。不明な要求は中止してください。',
  },
  {
    id: 'mint-address-check',
    difficulty: 3,
    category: 'トークン確認',
    title: '同名トークンの照合',
    scenario: '受け取る前に公式資料とエクスプローラーを使い、トークン名だけでなくMintアドレスも一致確認した。',
    verdict: 'safe',
    clue: '名称やロゴはコピーできます。トークンは公式情報とMintアドレスを照合してください。',
  },
  {
    id: 'address-poisoning',
    difficulty: 3,
    category: 'アドレス汚染',
    title: '履歴から宛先をコピー',
    scenario: '以前の送金先と先頭・末尾が似たアドレスが履歴にあり、全体を確認せずコピーしようとしている。',
    verdict: 'danger',
    clue: '履歴に類似アドレスを混ぜる攻撃があります。履歴だけに頼らず、宛先全体を信頼できる情報と照合します。',
  },
  {
    id: 'separate-verification-channel',
    difficulty: 3,
    category: '本人確認',
    title: '別経路で送金先確認',
    scenario: '高額送金の前に、既知の電話番号で相手へ連絡し、送られてきたアドレス全体を読み合わせた。',
    verdict: 'safe',
    clue: 'メッセージとは別の信頼できる経路で宛先を確認すると、アカウント乗っ取り対策になります。',
  },
]

export function shuffledQuestions(minDifficulty: 1 | 2 | 3 = 1, maxDifficulty: 1 | 2 | 3 = 3): SafetyQuestion[] {
  const result = safetyQuestions.filter(
    (question) => question.difficulty >= minDifficulty && question.difficulty <= maxDifficulty,
  )

  for (let index = result.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1))
    const current = result[index]
    result[index] = result[nextIndex]
    result[nextIndex] = current
  }

  return result
}
