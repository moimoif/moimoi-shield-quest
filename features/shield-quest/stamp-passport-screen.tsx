import { colors, radii, spacing } from '@/constants/theme'
import { questModes, stampRankDetails } from '@/features/shield-quest/game-config'
import {
  emptyPassport,
  getPlayStreak,
  loadPassport,
  type ShieldStamp,
  type StampPassport,
} from '@/features/shield-quest/passport-storage'
import { ShieldBackground } from '@/features/shield-quest/shield-background'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

export function StampPassportScreen() {
  const router = useRouter()
  const [passport, setPassport] = useState<StampPassport>(emptyPassport)
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      let active = true
      setLoading(true)
      void loadPassport().then((storedPassport) => {
        if (active) {
          setPassport(storedPassport)
          setLoading(false)
        }
      })

      return () => {
        active = false
      }
    }, []),
  )

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ShieldBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.eyebrow}>MOIMOI ID</Text>
            <Text style={styles.title}>Stamp Passport</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <Animated.View entering={FadeInDown.duration(450)} style={styles.passportCard}>
          <View style={styles.passportTopLine} />
          <View style={styles.passportIdentity}>
            <View style={styles.identityMark}>
              <Text style={styles.identityMarkText}>MQ</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.passportLabel}>SHIELD PASSPORT</Text>
              <Text style={styles.passportName}>Safety Explorer</Text>
              <Text style={styles.passportId}>LOCAL DEVICE · PHASE 3</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <PassportStat label="STAMPS" value={`${passport.stamps.length}`} color={colors.emerald} />
            <PassportStat label="BEST POINTS" value={`${passport.bestPoints}`} color={colors.blue} />
            <PassportStat label="DAY STREAK" value={`${getPlayStreak(passport)}`} color={colors.purple} />
          </View>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shield Stamp Collection</Text>
          <Text style={styles.sectionCount}>{passport.stamps.length} STAMPS</Text>
        </View>

        {loading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Passportを読み込み中…</Text>
          </View>
        ) : passport.stamps.length > 0 ? (
          <View style={styles.stampGrid}>
            {passport.stamps.map((stamp, index) => (
              <StampCard index={passport.stamps.length - index} key={stamp.id} stamp={stamp} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptySeal}>
              <Text style={styles.emptySealText}>◇</Text>
            </View>
            <Text style={styles.emptyTitle}>最初のStampを獲得しよう</Text>
            <Text style={styles.emptyText}>
              難易度を選び、目標数を正解すると、ここにランク付きの安全学習記録が残ります。
            </Text>
          </View>
        )}

        <Pressable accessibilityRole="button" onPress={() => router.push('/shield')} style={styles.questButton}>
          <Text style={styles.questButtonText}>Shield Questに挑戦</Text>
          <Text style={styles.questButtonArrow}>→</Text>
        </Pressable>
        <Text style={styles.storageNote}>記録はAsyncStorageを使い、この端末内だけに保存されます。</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

function StampCard({ index, stamp }: { index: number; stamp: ShieldStamp }) {
  const rank = stampRankDetails[stamp.rank]
  const mode = questModes[stamp.mode]

  return (
    <View style={[styles.stampCard, { borderColor: `${rank.color}66` }]}>
      <View style={[styles.stampSeal, { borderColor: `${rank.color}70` }]}>
        <View style={[styles.stampSealInner, { borderColor: rank.color }]}>
          <Text style={[styles.stampIcon, { color: rank.color }]}>◇</Text>
        </View>
      </View>
      <Text style={[styles.stampRank, { color: rank.color }]}>{rank.label}</Text>
      <Text style={styles.stampNumber}>STAMP #{String(index).padStart(2, '0')}</Text>
      <Text style={styles.stampName}>{rank.title}</Text>
      <Text style={styles.stampDate}>{formatStampDate(stamp.earnedAt)}</Text>
      <View style={styles.stampResultRow}>
        <Text style={styles.stampResult}>{mode.label}</Text>
        <Text style={styles.stampResult}>{stamp.points} PT</Text>
        <Text style={styles.stampResult}>×{stamp.bestStreak}</Text>
      </View>
    </View>
  )
}

function PassportStat({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <View style={styles.passportStat}>
      <Text style={[styles.passportStatValue, { color }]}>{value}</Text>
      <Text style={styles.passportStatLabel}>{label}</Text>
    </View>
  )
}

function formatStampDate(value: string): string {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}.${month}.${day}  ${hour}:${minute}`
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#040B17',
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: spacing.lg,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  headerSpacer: {
    height: 44,
    width: 44,
  },
  eyebrow: {
    color: colors.emerald,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  passportCard: {
    backgroundColor: 'rgba(9, 23, 42, 0.94)',
    borderColor: 'rgba(76, 141, 255, 0.42)',
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
    padding: spacing.lg,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.26,
    shadowRadius: 20,
  },
  passportTopLine: {
    backgroundColor: colors.emerald,
    height: 3,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  passportIdentity: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  identityMark: {
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.09)',
    borderColor: colors.emerald,
    borderRadius: radii.lg,
    borderWidth: 1,
    height: 70,
    justifyContent: 'center',
    shadowColor: colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    width: 70,
  },
  identityMarkText: {
    color: colors.emerald,
    fontSize: 24,
    fontWeight: '900',
  },
  passportLabel: {
    color: colors.emerald,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
  passportName: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '800',
    marginTop: 3,
  },
  passportId: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.8,
    marginTop: 4,
  },
  statsRow: {
    borderTopColor: 'rgba(169, 184, 204, 0.14)',
    borderTopWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },
  passportStat: {
    alignItems: 'center',
    flex: 1,
  },
  passportStatValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  passportStatLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginTop: 2,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionCount: {
    color: colors.emerald,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  stampGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stampCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(12, 26, 46, 0.83)',
    borderColor: 'rgba(52, 211, 153, 0.3)',
    borderRadius: radii.lg,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    gap: 3,
    minWidth: 150,
    padding: spacing.md,
  },
  stampSeal: {
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    borderColor: 'rgba(52, 211, 153, 0.32)',
    borderRadius: 44,
    borderWidth: 1,
    height: 88,
    justifyContent: 'center',
    marginBottom: spacing.xs,
    width: 88,
  },
  stampSealInner: {
    alignItems: 'center',
    borderColor: colors.emerald,
    borderRadius: 33,
    borderWidth: 1,
    height: 66,
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
    width: 66,
  },
  stampIcon: {
    color: colors.emerald,
    fontSize: 36,
    transform: [{ rotate: '-45deg' }],
  },
  stampNumber: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  stampRank: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  stampName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  stampDate: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
  stampResultRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  stampResult: {
    backgroundColor: 'rgba(76, 141, 255, 0.1)',
    borderRadius: radii.pill,
    color: '#BFD3F3',
    fontSize: 9,
    overflow: 'hidden',
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(12, 26, 46, 0.72)',
    borderColor: 'rgba(167, 139, 250, 0.25)',
    borderRadius: radii.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.xl,
  },
  emptySeal: {
    alignItems: 'center',
    borderColor: 'rgba(167, 139, 250, 0.42)',
    borderRadius: 38,
    borderWidth: 1,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  emptySealText: {
    color: colors.purple,
    fontSize: 42,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  questButton: {
    alignItems: 'center',
    backgroundColor: colors.emerald,
    borderRadius: radii.md,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
  },
  questButtonText: {
    color: '#04120E',
    fontSize: 16,
    fontWeight: '900',
  },
  questButtonArrow: {
    color: '#04120E',
    fontSize: 20,
    fontWeight: '800',
    marginLeft: spacing.sm,
  },
  storageNote: {
    color: 'rgba(169, 184, 204, 0.7)',
    fontSize: 11,
    textAlign: 'center',
  },
})
