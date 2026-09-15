import { type AppLanguage } from '@/features/language/translations'
import { type SafetyQuestion } from './questions'

// Localize display text only: IDs, difficulty and verdict remain authoritative.
export const englishQuestions: Record<string, readonly [string, string, string, string]> = {
  'seed-phrase-dm': [
    'Phishing',
    'A DM from support',
    'Someone claiming to be support asks you to enter your 12-word secret recovery phrase “to restore access”.',
    'Legitimate support will never ask for your recovery phrase or private key. Never enter or send them to anyone.',
  ],
  'verified-bookmark': [
    'Official website',
    'A verified bookmark',
    'You open a bookmark previously checked against official information, then check the domain and connection destination again.',
    'Avoiding search ads and DM links, and checking the domain against a verified bookmark, is a useful precaution.',
  ],
  'urgent-airdrop': [
    'Fake airdrop',
    'Only three minutes to claim',
    'An unknown account says your reward will expire unless you connect now, pressuring you to connect your wallet.',
    'Urgency, unexpected DMs and requests to connect a wallet are common scam warning signs.',
  ],
  'unexpected-fee': [
    'Fake airdrop',
    'An upfront unlocking fee',
    'To receive free tokens, you are asked to first send 0.2 SOL to a specified address.',
    'An upfront transfer demanded as a condition for receiving rewards is dangerous. Do not send funds.',
  ],
  'solana-uri-transfer': [
    'Solana URI',
    'An unfamiliar QR request',
    'The scanned URI contains “solana:unknown-recipient?amount=1”, and the confirmation screen shows a transfer of 1 SOL.',
    'Solana URIs can contain payment details. Cancel if the recipient is unknown or the amount is not what you intended.',
  ],
  'verified-solana-pay': [
    'Solana URI',
    'Solana Pay at a shop',
    'During checkout, you scan the shop’s QR code and confirm that the shop name, recipient and amount all match the register display.',
    'For a payment you initiated, independently checking the recipient and amount improves safety; it is not a guarantee.',
  ],
  'unlimited-approval': [
    'Transaction',
    'Excessive permissions',
    'You expected only to claim an NFT, but the simulation shows permission to move all your tokens.',
    'Do not approve powerful permissions unrelated to your goal. Cancel signatures you do not understand.',
  ],
  'message-domain-nonce': [
    'Signing',
    'A readable login message',
    'On an official dApp you opened yourself, you check a login message containing only the domain, expiry and nonce.',
    'A login message rather than a payment transaction can be reasonable when you verify the site and message content.',
  ],
  'short-link': [
    'Phishing',
    'A shortened mint link',
    'Someone you do not follow sends a shortened URL promising a guaranteed mint if you connect your wallet.',
    'Shortened URLs hide the real domain. Navigate to the site yourself through official channels.',
  ],
  'hardware-display': [
    'Transfer check',
    'Check the device display',
    'For a small transfer you created yourself, the recipient and amount also match on your hardware wallet’s screen.',
    'Checking the recipient and amount on a separate trusted display helps prevent tampering and input mistakes.',
  ],
  'nft-link': [
    'Spam NFT',
    'An unexpected NFT',
    'An NFT you did not expect contains an image telling you to visit a URL to collect a reward.',
    'Do not open URLs inside spam NFTs. Use your wallet’s hide or report options.',
  ],
  'official-update': [
    'Wallet management',
    'Update through the official store',
    'You open your device’s official app store yourself, verify the developer and update your wallet app.',
    'Update through the official store after checking the developer, not through files sent in DMs.',
  ],
  'unicode-lookalike-domain': [
    'Phishing',
    'A lookalike domain',
    'A site opened through a search ad looks official, but one character in its URL has been replaced with a different character.',
    'Fake domains can use similar-looking characters. Avoid ads and inspect the URL character by character.',
  ],
  'verified-simulation': [
    'Simulation',
    'A transaction that matches',
    'For a swap you initiated, the simulated payment, received amount and fees match your input.',
    'Check that asset changes, fees and destinations match the action you initiated.',
  ],
  'opaque-message': [
    'Signing',
    'An unreadable login signature',
    'A supposed login message is a long string of symbols, so you cannot verify its purpose or expiry.',
    'Do not approve signatures you cannot understand. Check the displayed content even on an official site.',
  ],
  'revoke-old-access': [
    'Permission management',
    'Remove unused permissions',
    'You open the official permission manager yourself, review an unused dApp’s delegated permissions and revoke only those permissions.',
    'Regularly reviewing and revoking unused delegated permissions through legitimate tools can limit potential damage.',
  ],
  'authority-change': [
    'Transaction',
    'An authority-change instruction',
    'A supposed profile update includes an instruction changing the authority over wallet assets to another address.',
    'An authority change unrelated to your goal is very dangerous. Do not sign; disconnect from the site.',
  ],
  'known-mobile-deeplink': [
    'Deep link',
    'Moving between official apps',
    'You open an official dApp yourself and check that the displayed source domain and the wallet’s request match.',
    'A deep link you initiated can be reasonable when you verify both the source and the request.',
  ],
  'unexpected-delegate': [
    'Delegated permissions',
    'A delegate hidden in a claim',
    'An action meant only to claim a commemorative NFT includes a delegate permission letting a third party move your tokens.',
    'Do not approve delegation unrelated to a claim. Always check which assets it covers and its limits.',
  ],
  'verified-limit-order': [
    'DEX',
    'A verified limit order',
    'On an official DEX, you review a limit order you created and confirm the sell quantity, desired price and token mint all match.',
    'On an official service, checking quantity, price and mint helps confirm that the action matches your intent.',
  ],
  'blind-signing': [
    'Hardware wallet',
    'A request for blind signing',
    'An unknown site tells you to enable blind signing and approve because it cannot display the contents.',
    'An unreadable signature can be dangerous even with a hardware wallet. Cancel unknown requests.',
  ],
  'mint-address-check': [
    'Token verification',
    'Check tokens with the same name',
    'Before receiving a token, you use official documents and an explorer to verify its mint address, not just its name.',
    'Names and logos can be copied. Verify the mint address against official information.',
  ],
  'address-poisoning': [
    'Address poisoning',
    'Copying from transaction history',
    'An address in your history resembles an earlier recipient at the start and end, and you plan to copy it without checking the full address.',
    'Attackers can plant lookalike addresses in history. Compare the entire recipient address with trusted information.',
  ],
  'separate-verification-channel': [
    'Recipient verification',
    'Verify through another channel',
    'Before a large transfer, you call the recipient using a known phone number and compare the entire address they sent.',
    'Checking the recipient through a separate trusted channel helps protect against account takeovers.',
  ],
}

export function localizeQuestion(question: SafetyQuestion, language: AppLanguage): SafetyQuestion {
  const text = language === 'en' ? englishQuestions[question.id] : undefined
  if (!text) return question
  const [category, title, scenario, clue] = text
  return { ...question, category, title, scenario, clue }
}
