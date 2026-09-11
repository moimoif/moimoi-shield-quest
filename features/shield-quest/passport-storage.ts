import AsyncStorage from '@react-native-async-storage/async-storage'
import { isQuestModeId, isStampRank, type QuestModeId, type StampRank } from '@/features/shield-quest/game-config'

const PASSPORT_STORAGE_KEY = '@moimoi/shield-passport/v1'

export type ShieldStamp = {
  bestStreak: number
  correctAnswers: number
  earnedAt: string
  id: string
  mode: QuestModeId
  points: number
  rank: StampRank
}

export type StampPassport = {
  bestScore: number
  bestStreak: number
  bestPoints: number
  lastPlayedAt: string | null
  playCount: number
  stamps: ShieldStamp[]
  version: 1
}

export type QuestResult = {
  bestStreak: number
  correctAnswers: number
  mode: QuestModeId
  points: number
  rank: StampRank
  success: boolean
}

export const emptyPassport: StampPassport = {
  version: 1,
  stamps: [],
  bestScore: 0,
  bestStreak: 0,
  bestPoints: 0,
  playCount: 0,
  lastPlayedAt: null,
}

function parseShieldStamp(value: unknown): ShieldStamp | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const stamp = value as Partial<ShieldStamp>
  if (
    typeof stamp.id !== 'string' ||
    typeof stamp.earnedAt !== 'string' ||
    typeof stamp.correctAnswers !== 'number' ||
    typeof stamp.bestStreak !== 'number'
  ) {
    return null
  }

  return {
    id: stamp.id,
    earnedAt: stamp.earnedAt,
    correctAnswers: stamp.correctAnswers,
    bestStreak: stamp.bestStreak,
    mode: isQuestModeId(stamp.mode) ? stamp.mode : 'guardian',
    points: typeof stamp.points === 'number' ? stamp.points : stamp.correctAnswers * 100,
    rank: isStampRank(stamp.rank) ? stamp.rank : 'silver',
  }
}

function parsePassport(value: string | null): StampPassport {
  if (!value) {
    return emptyPassport
  }

  try {
    const parsed = JSON.parse(value) as Partial<StampPassport>
    if (parsed.version !== 1 || !Array.isArray(parsed.stamps)) {
      return emptyPassport
    }

    const stamps = parsed.stamps.map(parseShieldStamp).filter((stamp): stamp is ShieldStamp => stamp !== null)

    return {
      version: 1,
      stamps,
      bestScore: typeof parsed.bestScore === 'number' ? parsed.bestScore : 0,
      bestStreak: typeof parsed.bestStreak === 'number' ? parsed.bestStreak : 0,
      bestPoints:
        typeof parsed.bestPoints === 'number' ? parsed.bestPoints : Math.max(0, ...stamps.map((stamp) => stamp.points)),
      playCount: typeof parsed.playCount === 'number' ? parsed.playCount : 0,
      lastPlayedAt: typeof parsed.lastPlayedAt === 'string' ? parsed.lastPlayedAt : null,
    }
  } catch {
    return emptyPassport
  }
}

export async function loadPassport(): Promise<StampPassport> {
  try {
    return parsePassport(await AsyncStorage.getItem(PASSPORT_STORAGE_KEY))
  } catch {
    return emptyPassport
  }
}

export async function recordQuestResult(result: QuestResult): Promise<StampPassport> {
  const passport = await loadPassport()
  const now = new Date().toISOString()
  const stamp: ShieldStamp | null = result.success
    ? {
        id: `shield-${now}-${Math.random().toString(36).slice(2, 8)}`,
        earnedAt: now,
        correctAnswers: result.correctAnswers,
        bestStreak: result.bestStreak,
        mode: result.mode,
        points: result.points,
        rank: result.rank,
      }
    : null

  const nextPassport: StampPassport = {
    version: 1,
    stamps: stamp ? [stamp, ...passport.stamps] : passport.stamps,
    bestScore: Math.max(passport.bestScore, result.correctAnswers),
    bestStreak: Math.max(passport.bestStreak, result.bestStreak),
    bestPoints: Math.max(passport.bestPoints, result.points),
    playCount: passport.playCount + 1,
    lastPlayedAt: now,
  }

  try {
    await AsyncStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(nextPassport))
  } catch {
    // The result remains usable for this session even if device storage is unavailable.
  }

  return nextPassport
}

function localDateKey(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export function hasStampToday(passport: StampPassport): boolean {
  const today = localDateKey(new Date())
  return passport.stamps.some((stamp) => localDateKey(stamp.earnedAt) === today)
}

export function getPlayStreak(passport: StampPassport): number {
  const uniqueDays = new Set(passport.stamps.map((stamp) => localDateKey(stamp.earnedAt)))
  const cursor = new Date()
  cursor.setHours(12, 0, 0, 0)

  if (!uniqueDays.has(localDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (uniqueDays.has(localDateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}
