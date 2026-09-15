import { describe, expect, it } from 'vitest'
import { analyseQrContent } from '@/features/qr-check/qr-analysis'
import { isAppLanguage, translate } from './translations'

describe('app language', () => {
  it('accepts only supported saved language values', () => {
    expect(isAppLanguage('ja')).toBe(true)
    expect(isAppLanguage('en')).toBe(true)
    for (const value of [null, '', 'fr', {}, 'EN']) expect(isAppLanguage(value)).toBe(false)
  })
  it('keeps Japanese and unknown text unchanged', () => {
    expect(translate('ja', 'QRを読み取る')).toBe('QRを読み取る')
    expect(translate('en', 'Moimoi Shield Quest')).toBe('Moimoi Shield Quest')
  })
  it('translates the QR action and safety disclaimer', () => {
    expect(translate('en', 'QRを読み取る')).toBe('Scan a QR code')
    expect(translate('en', '確認できるのは、QRに含まれる文字列です')).toContain('only the text')
  })
  it('localizes unsupported QR formats', () => {
    const result = analyseQrContent('exp+moimoi-mobile://test', 'en')
    expect(result.kind).toBe('text')
    expect(result.label).toBe('Text / unsupported format')
    expect(result.fields[0].label).toBe('Character count')
    expect(result.notes.join(' ')).not.toMatch(/[ぁ-龯]/)
  })
  it('localizes URL fields and cautions without modifying query data', () => {
    const result = analyseQrContent('http://user@bit.ly/path?q=hello', 'en')
    expect(result.fields.find((field) => field.label === 'Query')?.value).toBe('q=hello')
    expect(result.fields.find((field) => field.label === 'Port')?.value).toBe('Not specified')
    expect(result.notes.join(' ')).toContain('shortened URL')
    expect(result.notes.join(' ')).not.toMatch(/[ぁ-龯]/)
  })
  it('preserves creator-supplied Japanese data, even when it matches a placeholder', () => {
    const result = analyseQrContent('solana:recipient?label=' + encodeURIComponent('記載なし'), 'en')
    expect(result.fields.find((field) => field.label === 'Label (label)')?.value).toBe('記載なし')
    expect(result.fields.find((field) => field.label === 'Amount (amount)')?.value).toBe('Not specified')
    expect(result.notes.join(' ')).not.toMatch(/[ぁ-龯]/)
  })
  it('keeps Japanese as the default QR language', () => {
    expect(analyseQrContent('hello').label).toBe('文字列・未対応形式')
  })
})
