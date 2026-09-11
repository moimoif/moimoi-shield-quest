import AsyncStorage from '@react-native-async-storage/async-storage'
import { beforeEach, describe, expect, it } from 'vitest'
import { loadPassport, recordQuestResult } from '@/features/shield-quest/passport-storage'

const storageKey = '@moimoi/shield-passport/v1'

describe('passport storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it('records ranked quest results and best points', async () => {
    const passport = await recordQuestResult({
      success: true,
      correctAnswers: 8,
      bestStreak: 6,
      mode: 'expert',
      points: 2400,
      rank: 'gold',
    })

    expect(passport.bestPoints).toBe(2400)
    expect(passport.stamps[0]).toMatchObject({ mode: 'expert', points: 2400, rank: 'gold' })
  })

  it('keeps Phase 2 stamps when loading the upgraded passport', async () => {
    await AsyncStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 1,
        stamps: [
          {
            id: 'phase-2-stamp',
            earnedAt: '2026-09-10T12:00:00.000Z',
            correctAnswers: 7,
            bestStreak: 7,
          },
        ],
        bestScore: 7,
        bestStreak: 7,
        playCount: 1,
        lastPlayedAt: '2026-09-10T12:00:00.000Z',
      }),
    )

    const passport = await loadPassport()

    expect(passport.bestPoints).toBe(700)
    expect(passport.stamps[0]).toMatchObject({ mode: 'guardian', points: 700, rank: 'silver' })
  })
})
