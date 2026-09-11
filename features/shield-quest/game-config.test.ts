import { describe, expect, it } from 'vitest'
import { getStampRank, pointsForCorrectAnswer } from '@/features/shield-quest/game-config'

describe('pointsForCorrectAnswer', () => {
  it('starts with the base points for the selected multiplier', () => {
    expect(pointsForCorrectAnswer(1, 2)).toBe(200)
  })

  it('adds a combo bonus', () => {
    expect(pointsForCorrectAnswer(4, 2)).toBe(350)
  })

  it('caps the combo bonus after six consecutive answers', () => {
    expect(pointsForCorrectAnswer(20, 3)).toBe(675)
  })
})

describe('getStampRank', () => {
  it('awards the rank associated with the selected mode', () => {
    expect(getStampRank('rookie', 100)).toBe('bronze')
    expect(getStampRank('guardian', 100)).toBe('silver')
    expect(getStampRank('expert', 90)).toBe('gold')
  })

  it('awards diamond for a perfect expert result', () => {
    expect(getStampRank('expert', 100)).toBe('diamond')
  })
})
