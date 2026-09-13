import { describe, expect, it } from 'vitest'
import { analyseQrContent } from '@/features/qr-check/qr-analysis'

describe('analyseQrContent', () => {
  it('shows Solana Pay fields without judging safety', () => {
    const result = analyseQrContent(
      'solana:RecipientAddress?amount=1.25&spl-token=MintAddress&label=Shop&message=Lunch',
    )

    expect(result.kind).toBe('solana')
    expect(result.fields).toEqual(
      expect.arrayContaining([
        { label: '受取先', value: 'RecipientAddress' },
        { label: '金額（amount）', value: '1.25' },
        { label: 'トークンMint（spl-token）', value: 'MintAddress' },
      ]),
    )
    expect(result.notes.join(' ')).not.toMatch(/安全です|安全と判定/)
  })

  it('does not fetch a Solana transaction request URL', () => {
    const result = analyseQrContent('solana:https%3A%2F%2Fexample.com%2Ftransaction')

    expect(result.kind).toBe('solana')
    expect(result.fields[0]).toEqual({ label: '取引要求URL', value: 'https://example.com/transaction' })
    expect(result.notes.join(' ')).toContain('アクセスも取引データの取得も行いません')
  })

  it('separates the actual host from user information', () => {
    const result = analyseQrContent('https://official.example@evil.example/claim')

    expect(result.kind).toBe('url')
    expect(result.fields).toContainEqual({ label: 'ドメイン', value: 'evil.example' })
    expect(result.notes.join(' ')).toContain('「@」より後ろが実際の接続先')
  })

  it('labels unknown content without declaring it safe or dangerous', () => {
    const result = analyseQrContent('hello from a QR code')

    expect(result.kind).toBe('text')
    expect(result.notes.join(' ')).toContain('証明にはなりません')
  })
})
