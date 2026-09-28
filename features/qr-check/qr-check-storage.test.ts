import AsyncStorage from '@react-native-async-storage/async-storage'
import { beforeEach, describe, expect, it } from 'vitest'
import { hasCheckedQrToday, markQrCheckedToday } from '@/features/qr-check/qr-check-storage'

describe('QR check storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it('marks only the current local day as complete', async () => {
    const checkedAt = new Date(2026, 8, 28, 23, 30)

    await markQrCheckedToday(checkedAt)

    expect(await hasCheckedQrToday(new Date(2026, 8, 28, 23, 59))).toBe(true)
    expect(await hasCheckedQrToday(new Date(2026, 8, 29, 0, 1))).toBe(false)
  })
})
