import AsyncStorage from '@react-native-async-storage/async-storage'

const QR_CHECK_STORAGE_KEY = '@moimoi/qr-check/last-completed-date/v1'

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export async function markQrCheckedToday(now = new Date()): Promise<void> {
  try {
    await AsyncStorage.setItem(QR_CHECK_STORAGE_KEY, localDateKey(now))
  } catch {
    // QR results remain usable even if device storage is unavailable.
  }
}

export async function hasCheckedQrToday(now = new Date()): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(QR_CHECK_STORAGE_KEY)) === localDateKey(now)
  } catch {
    return false
  }
}
