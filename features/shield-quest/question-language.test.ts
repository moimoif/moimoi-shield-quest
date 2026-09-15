import { describe, expect, it } from 'vitest'
import { translate } from '@/features/language/translations'
import { questModes } from './game-config'
import { englishQuestions, localizeQuestion } from './question-language'
import { safetyQuestions, shuffledQuestions } from './questions'

describe('Shield Quest language', () => {
  it('covers every question without extra or missing IDs', () => {
    expect(Object.keys(englishQuestions).sort()).toEqual(safetyQuestions.map((q) => q.id).sort())
  })

  it.each(safetyQuestions)('localizes $id without changing gameplay or the source', (question) => {
    const original = { ...question }
    const en = localizeQuestion(question, 'en')
    expect(en.id).toBe(question.id)
    expect(en.difficulty).toBe(question.difficulty)
    expect(en.verdict).toBe(question.verdict)
    for (const field of ['category', 'title', 'scenario', 'clue'] as const) {
      expect(en[field].length).toBeGreaterThan(0)
      expect(en[field]).not.toMatch(/[ぁ-んァ-ヶ一-龯]/)
    }
    expect(question).toEqual(original)
    expect(localizeQuestion(question, 'ja')).toBe(question)
  })

  it('keeps the mode difficulty pools unchanged', () => {
    for (const mode of Object.values(questModes)) {
      const pool = shuffledQuestions(mode.minQuestionDifficulty, mode.maxQuestionDifficulty)
      const en = pool.map((q) => localizeQuestion(q, 'en'))
      expect(en.map((q) => q.id)).toEqual(pool.map((q) => q.id))
      expect(translate('en', mode.description)).not.toMatch(/[ぁ-んァ-ヶ一-龯]/)
      expect(translate('en', mode.shortLabel)).not.toMatch(/[ぁ-んァ-ヶ一-龯]/)
    }
  })

  it('translates Passport and result actions', () => {
    for (const text of [
      'Passportを読み込み中…',
      '最初のStampを獲得しよう',
      'Shield Questに挑戦',
      '正答率',
      'もう一度挑戦',
      'Homeへ戻る',
      'Shield Stamp 獲得！',
    ]) {
      expect(translate('en', text)).not.toMatch(/[ぁ-んァ-ヶ一-龯]/)
      expect(translate('ja', text)).toBe(text)
    }
  })
})
