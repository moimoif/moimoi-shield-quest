import { colors, radii, spacing } from '@/constants/theme'
import { recordQuestResult, type StampPassport } from '@/features/shield-quest/passport-storage'
import { SafetyVerdict, shuffledQuestions } from '@/features/shield-quest/questions'
import { ShieldBackground } from '@/features/shield-quest/shield-background'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const QUEST_DURATION_SECONDS = 60
const REQUIRED_CORRECT_ANSWERS = 6
const ANSWER_DELAY_MS = 950

type GamePhase = 'ready' | 'playing' | 'result'

type GameResult = {
  answered: number
  bestStreak: number
  correct: number
  passport: StampPassport
  success: boolean
}

export function ShieldQuestScreen() {
  const router = useRouter()
  const [phase, setPhase] = useState<GamePhase>('ready')
  const [questions, setQuestions] = useState(shuffledQuestions)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(QUEST_DURATION_SECONDS)
  const [feedback, setFeedback] = useState<{ correct: boolean; clue: string } | null>(null)
  const [result, setResult] = useState<GameResult | null>(null)
  const [savingResult, setSavingResult] = useState(false)

  const runningRef = useRef(false)
  const answerLockedRef = useRef(false)
  const answerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const correctRef = useRef(0)
  const streakRef = useRef(0)
  const bestStreakRef = useRef(0)
  const answeredRef = useRef(0)
  const cardScale = useSharedValue(1)
  const feedbackOpacity = useSharedValue(0)

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }))

  const feedbackAnimatedStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
  }))

  const finishGame = useCallback(async () => {
    if (!runningRef.current) {
      return
    }

    runningRef.current = false
    answerLockedRef.current = true
    const success = correctRef.current >= REQUIRED_CORRECT_ANSWERS
    setSavingResult(true)
    setPhase('result')

    if (success) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    }

    const passport = await recordQuestResult({
      success,
      correctAnswers: correctRef.current,
      bestStreak: bestStreakRef.current,
    })

    setResult({
      success,
      correct: correctRef.current,
      bestStreak: bestStreakRef.current,
      answered: answeredRef.current,
      passport,
    })
    setSavingResult(false)
  }, [])

  useEffect(() => {
    if (phase !== 'playing') {
      return
    }

    const interval = setInterval(() => {
      setTimeRemaining((current) => {
        if (current <= 1) {
          void finishGame()
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [finishGame, phase])

  useEffect(
    () => () => {
      runningRef.current = false
      if (answerTimeoutRef.current) {
        clearTimeout(answerTimeoutRef.current)
      }
    },
    [],
  )

  function startGame() {
    if (answerTimeoutRef.current) {
      clearTimeout(answerTimeoutRef.current)
    }

    setQuestions(shuffledQuestions())
    setQuestionIndex(0)
    setCorrectAnswers(0)
    setCurrentStreak(0)
    setBestStreak(0)
    setAnswered(0)
    setTimeRemaining(QUEST_DURATION_SECONDS)
    setFeedback(null)
    setResult(null)
    setSavingResult(false)
    correctRef.current = 0
    streakRef.current = 0
    bestStreakRef.current = 0
    answeredRef.current = 0
    answerLockedRef.current = false
    runningRef.current = true
    feedbackOpacity.set(0)
    cardScale.set(1)
    setPhase('playing')
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  function answer(verdict: SafetyVerdict) {
    if (!runningRef.current || answerLockedRef.current) {
      return
    }

    answerLockedRef.current = true
    const question = questions[questionIndex % questions.length]
    const isCorrect = question.verdict === verdict
    const nextAnswered = answeredRef.current + 1
    answeredRef.current = nextAnswered
    setAnswered(nextAnswered)

    if (isCorrect) {
      const nextCorrect = correctRef.current + 1
      const nextStreak = streakRef.current + 1
      const nextBestStreak = Math.max(bestStreakRef.current, nextStreak)
      correctRef.current = nextCorrect
      streakRef.current = nextStreak
      bestStreakRef.current = nextBestStreak
      setCorrectAnswers(nextCorrect)
      setCurrentStreak(nextStreak)
      setBestStreak(nextBestStreak)
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } else {
      streakRef.current = 0
      setCurrentStreak(0)
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }

    setFeedback({ correct: isCorrect, clue: question.clue })
    cardScale.set(withSequence(withTiming(0.985, { duration: 90 }), withSpring(1)))
    feedbackOpacity.set(0)
    feedbackOpacity.set(withTiming(1, { duration: 180 }))

    answerTimeoutRef.current = setTimeout(() => {
      if (!runningRef.current) {
        return
      }
      feedbackOpacity.set(withTiming(0, { duration: 120 }))
      setQuestionIndex((current) => current + 1)
      setFeedback(null)
      answerLockedRef.current = false
    }, ANSWER_DELAY_MS)
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ShieldBackground />
      {phase === 'ready' ? (
        <ReadyView onBack={() => router.back()} onStart={startGame} />
      ) : phase === 'playing' ? (
        <ScrollView contentContainerStyle={styles.playContent}>
          <View style={styles.headerRow}>
            <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>‹</Text>
            </Pressable>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.eyebrow}>SHIELD QUEST</Text>
              <Text style={styles.headerTitle}>安全判断</Text>
            </View>
            <View style={[styles.timerPill, timeRemaining <= 10 && styles.timerPillDanger]}>
              <Text style={[styles.timerText, timeRemaining <= 10 && styles.timerTextDanger]}>{timeRemaining}</Text>
              <Text style={styles.timerUnit}>秒</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(timeRemaining / QUEST_DURATION_SECONDS) * 100}%` }]} />
          </View>

          <View style={styles.scoreRow}>
            <ScoreStat label="正解" value={`${correctAnswers}`} accent={colors.emerald} />
            <ScoreStat label="連続" value={`${currentStreak}`} accent={colors.purple} />
            <ScoreStat label="最高連続" value={`${bestStreak}`} accent={colors.blue} />
          </View>

          <Animated.View style={[styles.questionCard, cardAnimatedStyle]}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{questions[questionIndex % questions.length].category}</Text>
            </View>
            <Text style={styles.questionCount}>QUESTION {answered + 1}</Text>
            <Text style={styles.questionTitle}>{questions[questionIndex % questions.length].title}</Text>
            <Text style={styles.scenario}>{questions[questionIndex % questions.length].scenario}</Text>

            <Animated.View style={[styles.feedbackSlot, feedbackAnimatedStyle]}>
              {feedback ? (
                <View style={[styles.feedbackBox, feedback.correct ? styles.correctBox : styles.wrongBox]}>
                  <Text style={[styles.feedbackTitle, feedback.correct ? styles.correctText : styles.wrongText]}>
                    {feedback.correct ? '✓ 正解' : '× 要注意'}
                  </Text>
                  <Text style={styles.feedbackClue}>{feedback.clue}</Text>
                </View>
              ) : (
                <Text style={styles.chooseText}>この状況は安全？危険？</Text>
              )}
            </Animated.View>
          </Animated.View>

          <View style={styles.answerRow}>
            <AnswerButton
              accessibilityLabel="SAFE 安全"
              color={colors.emerald}
              label="SAFE"
              subtitle="安全"
              symbol="✓"
              onPress={() => answer('safe')}
            />
            <AnswerButton
              accessibilityLabel="DANGER 危険"
              color={colors.danger}
              label="DANGER"
              subtitle="危険"
              symbol="!"
              onPress={() => answer('danger')}
            />
          </View>
          <Text style={styles.safetyNote}>実際の送金やMainnet接続は行わない教育用ゲームです。</Text>
        </ScrollView>
      ) : (
        <ResultView
          result={result}
          saving={savingResult}
          onAgain={startGame}
          onHome={() => router.replace('/')}
          onPassport={() => router.replace('/passport')}
        />
      )}
    </SafeAreaView>
  )
}

function ReadyView({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.centerContent}>
      <Pressable accessibilityRole="button" onPress={onBack} style={[styles.backButton, styles.readyBack]}>
        <Text style={styles.backButtonText}>‹</Text>
      </Pressable>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.heroShield}>
        <View style={styles.heroShieldInner}>
          <Text style={styles.heroShieldIcon}>◇</Text>
        </View>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(150).duration(450)} style={styles.readyTextWrap}>
        <Text style={styles.eyebrow}>PHASE 2 · SAFETY TRAINING</Text>
        <Text style={styles.readyTitle}>60秒で守る力を。</Text>
        <Text style={styles.readySubtitle}>
          表示される場面が安全ならSAFE、危険ならDANGER。{REQUIRED_CORRECT_ANSWERS}問正解でShield Stampを獲得できます。
        </Text>
      </Animated.View>
      <View style={styles.rulesCard}>
        <Rule number="60" label="秒のチャレンジ" />
        <View style={styles.ruleDivider} />
        <Rule number={`${REQUIRED_CORRECT_ANSWERS}`} label="問正解でクリア" />
        <View style={styles.ruleDivider} />
        <Rule number="1" label="Shield Stamp" />
      </View>
      <Pressable accessibilityRole="button" onPress={onStart} style={styles.startButton}>
        <Text style={styles.startButtonText}>QUEST START</Text>
        <Text style={styles.startArrow}>→</Text>
      </Pressable>
      <Text style={styles.safetyNote}>学習専用 · 実資金・送金・Mainnetは使用しません</Text>
    </ScrollView>
  )
}

function ResultView({
  onAgain,
  onHome,
  onPassport,
  result,
  saving,
}: {
  onAgain: () => void
  onHome: () => void
  onPassport: () => void
  result: GameResult | null
  saving: boolean
}) {
  if (saving || !result) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.eyebrow}>SAVING RESULT</Text>
        <Text style={styles.readyTitle}>記録しています…</Text>
      </View>
    )
  }

  const accuracy = result.answered > 0 ? Math.round((result.correct / result.answered) * 100) : 0

  return (
    <ScrollView contentContainerStyle={styles.resultContent}>
      <Animated.View
        entering={FadeInDown.springify()}
        style={[styles.resultOrb, !result.success && styles.resultOrbFailed]}
      >
        <Text style={styles.resultOrbIcon}>{result.success ? '◇' : '△'}</Text>
      </Animated.View>
      <Text style={styles.eyebrow}>{result.success ? 'QUEST COMPLETE' : 'TRAINING COMPLETE'}</Text>
      <Text style={styles.resultTitle}>{result.success ? 'Shield Stamp 獲得！' : 'あと少しでクリア！'}</Text>
      <Text style={styles.resultSubtitle}>
        {result.success
          ? '安全を見抜く力が、新しいスタンプとしてPassportに記録されました。'
          : `${REQUIRED_CORRECT_ANSWERS}問正解を目指して、もう一度チャレンジしましょう。`}
      </Text>
      <View style={styles.resultStats}>
        <ScoreStat label="正解" value={`${result.correct}`} accent={colors.emerald} />
        <ScoreStat label="正答率" value={`${accuracy}%`} accent={colors.blue} />
        <ScoreStat label="最高連続" value={`${result.bestStreak}`} accent={colors.purple} />
      </View>
      {result.success ? (
        <View style={styles.stampPreview}>
          <View style={styles.stampSeal}>
            <Text style={styles.stampSealIcon}>◇</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.stampLabel}>SHIELD STAMP</Text>
            <Text style={styles.stampName}>Safety Guardian</Text>
            <Text style={styles.stampMeta}>STAMP #{String(result.passport.stamps.length).padStart(2, '0')}</Text>
          </View>
        </View>
      ) : null}
      <Pressable accessibilityRole="button" onPress={onPassport} style={styles.startButton}>
        <Text style={styles.startButtonText}>Stamp Passportを見る</Text>
        <Text style={styles.startArrow}>→</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={onAgain} style={styles.secondaryAction}>
        <Text style={styles.secondaryActionText}>もう一度挑戦</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={onHome} style={styles.textAction}>
        <Text style={styles.textActionText}>Homeへ戻る</Text>
      </Pressable>
    </ScrollView>
  )
}

function AnswerButton({
  accessibilityLabel,
  color,
  label,
  onPress,
  subtitle,
  symbol,
}: {
  accessibilityLabel: string
  color: string
  label: string
  onPress: () => void
  subtitle: string
  symbol: string
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.answerButton,
        { borderColor: color, backgroundColor: `${color}16` },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.answerSymbol, { borderColor: color }]}>
        <Text style={[styles.answerSymbolText, { color }]}>{symbol}</Text>
      </View>
      <Text style={[styles.answerLabel, { color }]}>{label}</Text>
      <Text style={styles.answerSubtitle}>{subtitle}</Text>
    </Pressable>
  )
}

function ScoreStat({ accent, label, value }: { accent: string; label: string; value: string }) {
  return (
    <View style={styles.scoreStat}>
      <Text style={[styles.scoreValue, { color: accent }]}>{value}</Text>
      <Text style={styles.scoreLabel}>{label}</Text>
    </View>
  )
}

function Rule({ label, number }: { label: string; number: string }) {
  return (
    <View style={styles.rule}>
      <Text style={styles.ruleNumber}>{number}</Text>
      <Text style={styles.ruleLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#040B17',
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
    flexGrow: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  readyBack: {
    left: spacing.md,
    position: 'absolute',
    top: spacing.md,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(12, 26, 46, 0.88)',
    borderColor: 'rgba(167, 139, 250, 0.28)',
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 34,
    marginTop: -3,
  },
  heroShield: {
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.06)',
    borderColor: 'rgba(52, 211, 153, 0.3)',
    borderRadius: 62,
    borderWidth: 1,
    height: 124,
    justifyContent: 'center',
    shadowColor: colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 28,
    width: 124,
  },
  heroShieldInner: {
    alignItems: 'center',
    backgroundColor: 'rgba(76, 141, 255, 0.1)',
    borderColor: colors.emerald,
    borderRadius: 45,
    borderWidth: 2,
    height: 90,
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
    width: 90,
  },
  heroShieldIcon: {
    color: colors.emerald,
    fontSize: 50,
    fontWeight: '300',
    transform: [{ rotate: '-45deg' }],
  },
  readyTextWrap: {
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: 520,
  },
  eyebrow: {
    color: colors.emerald,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2.2,
    textAlign: 'center',
  },
  readyTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  readySubtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  rulesCard: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(12, 26, 46, 0.76)',
    borderColor: 'rgba(76, 141, 255, 0.25)',
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    maxWidth: 560,
    paddingVertical: spacing.md,
  },
  rule: {
    alignItems: 'center',
    flex: 1,
    gap: 3,
  },
  ruleNumber: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  ruleLabel: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
  ruleDivider: {
    backgroundColor: 'rgba(169, 184, 204, 0.18)',
    height: 34,
    width: 1,
  },
  startButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.emerald,
    borderRadius: radii.md,
    flexDirection: 'row',
    justifyContent: 'center',
    maxWidth: 560,
    minHeight: 58,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
  },
  startButtonText: {
    color: '#04120E',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  startArrow: {
    color: '#04120E',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  safetyNote: {
    color: 'rgba(169, 184, 204, 0.7)',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
  playContent: {
    flexGrow: 1,
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitleWrap: {
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  timerPill: {
    alignItems: 'baseline',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderColor: 'rgba(52, 211, 153, 0.55)',
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minWidth: 64,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  timerPillDanger: {
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    borderColor: colors.danger,
  },
  timerText: {
    color: colors.emerald,
    fontSize: 21,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  timerTextDanger: {
    color: colors.danger,
  },
  timerUnit: {
    color: colors.textMuted,
    fontSize: 10,
    marginLeft: 2,
  },
  progressTrack: {
    backgroundColor: 'rgba(169, 184, 204, 0.14)',
    borderRadius: radii.pill,
    height: 5,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.emerald,
    borderRadius: radii.pill,
    height: 5,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  scoreStat: {
    alignItems: 'center',
    backgroundColor: 'rgba(12, 26, 46, 0.72)',
    borderColor: 'rgba(167, 139, 250, 0.18)',
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
  },
  scoreValue: {
    fontSize: 23,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  scoreLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  questionCard: {
    backgroundColor: 'rgba(10, 24, 44, 0.94)',
    borderColor: 'rgba(76, 141, 255, 0.36)',
    borderRadius: 28,
    borderWidth: 1,
    flex: 1,
    minHeight: 335,
    padding: spacing.lg,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(167, 139, 250, 0.12)',
    borderColor: 'rgba(167, 139, 250, 0.4)',
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  categoryText: {
    color: colors.purple,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  questionCount: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.7,
    marginTop: spacing.lg,
  },
  questionTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: spacing.xs,
  },
  scenario: {
    color: '#D7E1EF',
    fontSize: 17,
    lineHeight: 28,
    marginTop: spacing.md,
  },
  feedbackSlot: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    minHeight: 94,
  },
  chooseText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  feedbackBox: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.sm,
  },
  correctBox: {
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    borderColor: 'rgba(52, 211, 153, 0.35)',
  },
  wrongBox: {
    backgroundColor: 'rgba(248, 113, 113, 0.08)',
    borderColor: 'rgba(248, 113, 113, 0.35)',
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 3,
  },
  correctText: {
    color: colors.emerald,
  },
  wrongText: {
    color: colors.danger,
  },
  feedbackClue: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  answerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  answerButton: {
    alignItems: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 126,
    padding: spacing.sm,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  answerSymbol: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    marginBottom: 5,
    width: 34,
  },
  answerSymbolText: {
    fontSize: 18,
    fontWeight: '900',
  },
  answerLabel: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  answerSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  resultContent: {
    alignItems: 'center',
    flexGrow: 1,
    gap: spacing.md,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  resultOrb: {
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.11)',
    borderColor: colors.emerald,
    borderRadius: 52,
    borderWidth: 2,
    height: 104,
    justifyContent: 'center',
    shadowColor: colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    width: 104,
  },
  resultOrbFailed: {
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    borderColor: colors.purple,
    shadowColor: colors.purple,
  },
  resultOrbIcon: {
    color: colors.text,
    fontSize: 54,
    fontWeight: '200',
  },
  resultTitle: {
    color: colors.text,
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  resultSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 520,
    textAlign: 'center',
  },
  resultStats: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: spacing.xs,
    maxWidth: 560,
  },
  stampPreview: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(12, 26, 46, 0.85)',
    borderColor: 'rgba(52, 211, 153, 0.4)',
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    maxWidth: 560,
    padding: spacing.md,
  },
  stampSeal: {
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderColor: colors.emerald,
    borderRadius: 30,
    borderWidth: 1,
    height: 60,
    justifyContent: 'center',
    shadowColor: colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    width: 60,
  },
  stampSealIcon: {
    color: colors.emerald,
    fontSize: 34,
  },
  stampLabel: {
    color: colors.emerald,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  stampName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  stampMeta: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  secondaryAction: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(76, 141, 255, 0.1)',
    borderColor: colors.blue,
    borderRadius: radii.md,
    borderWidth: 1,
    justifyContent: 'center',
    maxWidth: 560,
    minHeight: 54,
  },
  secondaryActionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  textAction: {
    padding: spacing.sm,
  },
  textActionText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
})
