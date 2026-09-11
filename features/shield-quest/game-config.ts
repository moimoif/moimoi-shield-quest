export type QuestModeId = 'rookie' | 'guardian' | 'expert'

export type StampRank = 'bronze' | 'silver' | 'gold' | 'diamond'

export type QuestMode = {
  accent: string
  answerDelayMs: number
  description: string
  durationSeconds: number
  id: QuestModeId
  label: string
  maxQuestionDifficulty: 1 | 2 | 3
  minQuestionDifficulty: 1 | 2 | 3
  multiplier: number
  requiredCorrectAnswers: number
  shortLabel: string
}

export const questModes: Record<QuestModeId, QuestMode> = {
  rookie: {
    id: 'rookie',
    label: 'ROOKIE',
    shortLabel: '入門',
    description: '基本的な詐欺サインをゆっくり確認',
    durationSeconds: 75,
    requiredCorrectAnswers: 5,
    answerDelayMs: 1100,
    multiplier: 1,
    minQuestionDifficulty: 1,
    maxQuestionDifficulty: 1,
    accent: '#34D399',
  },
  guardian: {
    id: 'guardian',
    label: 'GUARDIAN',
    shortLabel: '標準',
    description: '基本と実践を組み合わせた標準訓練',
    durationSeconds: 60,
    requiredCorrectAnswers: 7,
    answerDelayMs: 900,
    multiplier: 2,
    minQuestionDifficulty: 1,
    maxQuestionDifficulty: 2,
    accent: '#4C8DFF',
  },
  expert: {
    id: 'expert',
    label: 'EXPERT',
    shortLabel: '上級',
    description: '判断の難しい実践ケースに挑戦',
    durationSeconds: 45,
    requiredCorrectAnswers: 8,
    answerDelayMs: 700,
    multiplier: 3,
    minQuestionDifficulty: 2,
    maxQuestionDifficulty: 3,
    accent: '#A78BFA',
  },
}

export const questModeOrder: QuestModeId[] = ['rookie', 'guardian', 'expert']

export const stampRankDetails: Record<StampRank, { color: string; label: string; title: string }> = {
  bronze: { color: '#D89562', label: 'BRONZE', title: 'Shield Scout' },
  silver: { color: '#BFD3E6', label: 'SILVER', title: 'Safety Guardian' },
  gold: { color: '#F6C85F', label: 'GOLD', title: 'Chain Sentinel' },
  diamond: { color: '#7DE8FF', label: 'DIAMOND', title: 'Shield Master' },
}

export function pointsForCorrectAnswer(streak: number, multiplier: number): number {
  const comboBonus = Math.min(Math.max(streak - 1, 0), 5) * 25
  return (100 + comboBonus) * multiplier
}

export function getStampRank(mode: QuestModeId, accuracy: number): StampRank {
  if (mode === 'expert' && accuracy === 100) {
    return 'diamond'
  }
  if (mode === 'expert') {
    return 'gold'
  }
  if (mode === 'guardian') {
    return 'silver'
  }
  return 'bronze'
}

export function isQuestModeId(value: unknown): value is QuestModeId {
  return value === 'rookie' || value === 'guardian' || value === 'expert'
}

export function isStampRank(value: unknown): value is StampRank {
  return value === 'bronze' || value === 'silver' || value === 'gold' || value === 'diamond'
}
