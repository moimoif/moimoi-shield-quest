import { useLanguage } from '@/features/language/language-provider'
import { ellipsify } from '@/utils/ellipsify'
import { useNetwork } from '@/features/network/use-network'
import { hasCheckedQrToday } from '@/features/qr-check/qr-check-storage'
import {
  emptyPassport,
  getPlayStreak,
  hasStampToday,
  loadPassport,
  type StampPassport,
} from '@/features/shield-quest/passport-storage'
import { colors, spacing, theme } from '@/constants/theme'
import { QuestOpening } from '@/components/quest-opening'
import { QuestIcon } from '@/components/quest-icon'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

let openingDismissed = false

export function HomeScreen() {
  const [showOpening, setShowOpening] = useState(!openingDismissed)
  const { language, t } = useLanguage()
  const router = useRouter()
  const { account } = useMobileWallet()
  const { selectedNetwork } = useNetwork()
  const [passport, setPassport] = useState<StampPassport>(emptyPassport)
  const [qrCheckedToday, setQrCheckedToday] = useState(false)
  const connected = !!account
  const completedToday = hasStampToday(passport)

  useFocusEffect(
    useCallback(() => {
      let active = true
      void loadPassport().then((storedPassport) => {
        if (active) {
          setPassport(storedPassport)
        }
      })
      void hasCheckedQrToday().then((checked) => {
        if (active) {
          setQrCheckedToday(checked)
        }
      })

      return () => {
        active = false
      }
    }, []),
  )

  if (showOpening) {
    return (
      <QuestOpening
        onContinue={() => {
          openingDismissed = true
          setShowOpening(false)
        }}
      />
    )
  }

  return (
    <SafeAreaView style={theme.screen} edges={['top']}>
      <ScrollView contentContainerStyle={theme.screenPad} accessibilityRole="none">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={language === 'en' ? 'Language settings' : '言語設定'}
          onPress={() => router.push('/settings')}
          style={theme.secondaryButton}
        >
          <Text style={theme.secondaryButtonText}>日本語 / English</Text>
        </Pressable>
        <View style={{ alignItems: 'center', gap: spacing.sm, paddingTop: spacing.md }}>
          <Image
            source={require('@/assets/images/moimoi-shield.png')}
            accessibilityLabel="Moimoi shield"
            style={{ width: 100, height: 100, borderRadius: 24 }}
          />
          <Text style={theme.title}>Moimoi Shield Quest</Text>
          <Text style={[theme.subtitle, { textAlign: 'center' }]}>
            {t('Solana の安全確認を、毎日のミッションとして。')}
          </Text>
        </View>

        <View style={theme.card} accessibilityLabel="Play streak">
          <Text style={theme.label}>{t('連続プレイ')}</Text>
          <Text style={[theme.title, { marginTop: spacing.xs }]}>
            {getPlayStreak(passport)} {language === 'en' ? 'days' : '日'}
          </Text>
          <Text style={theme.bodyMuted}>
            {language === 'en' ? 'Shield Stamps' : 'Shield Stamp'} {passport.stamps.length}
            {language === 'en' ? '' : '個'} · {language === 'en' ? 'Best' : 'ベスト'} {passport.bestPoints} PT
          </Text>
        </View>

        <View style={theme.stack}>
          <Text style={theme.label}>{t('今日のミッション')}</Text>
          <MissionRow title={t('ウォレットを接続する')} status={t(connected ? '完了' : '未完了')} done={connected} />
          <MissionRow
            title={t('Shield Game をクリアする')}
            status={t(completedToday ? '完了' : '挑戦可能')}
            done={completedToday}
          />
          <MissionRow
            title={t('QR を確認する')}
            status={t(qrCheckedToday ? '完了' : '確認可能')}
            done={qrCheckedToday}
            onPress={() => router.push('/qr-check')}
          />
        </View>

        <View style={theme.card} accessibilityLabel="Wallet status">
          <Text style={theme.label}>Wallet</Text>
          <Text style={[theme.body, { marginTop: spacing.xs }]}>
            {connected ? `${account.label ?? 'Wallet'} · ${ellipsify(account.address.toString(), 4)}` : t('未接続')}
          </Text>
          <Text style={theme.bodyMuted}>{selectedNetwork.label}</Text>
        </View>

        <View style={theme.stack}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open Wallet Lab"
            onPress={() => router.navigate('/wallet')}
            style={theme.primaryButton}
          >
            <QuestIcon name="wallet" color={colors.background} />
            <Text style={theme.primaryButtonText}>{t('Wallet Lab を開く')}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start Shield Quest"
            onPress={() => router.push('/shield')}
            style={theme.secondaryButton}
          >
            <QuestIcon name="stamp" color={colors.emerald} />
            <Text style={theme.secondaryButtonText}>{t('今日の Shield に挑戦')}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open Stamp Passport"
            onPress={() => router.push('/passport')}
            style={theme.secondaryButton}
          >
            <QuestIcon name="stamp" color={colors.purple} />
            <Text style={theme.secondaryButtonText}>{t('Stamp Passport を見る')}</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Open QR safety check"
            accessibilityRole="button"
            onPress={() => router.push('/qr-check')}
            style={theme.secondaryButton}
          >
            <QuestIcon name="qr" color={colors.emerald} />
            <Text style={theme.secondaryButtonText}>{t('QR の内容を確認')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function MissionRow({
  title,
  status,
  done,
  onPress,
}: {
  title: string
  status: string
  done: boolean
  onPress?: () => void
}) {
  const { t } = useLanguage()
  const content = (
    <>
      <Text style={[theme.body, { flex: 1, paddingRight: spacing.sm }]}>{title}</Text>
      <Text style={done ? theme.textSuccess : theme.bodyMuted}>{status}</Text>
    </>
  )

  const rowStyle = [
    theme.card,
    {
      alignItems: 'center' as const,
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
    },
  ]

  if (onPress) {
    return (
      <Pressable
        accessibilityHint={t('QR安全確認画面を開きます')}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [rowStyle, pressed && { opacity: 0.72 }]}
      >
        {content}
      </Pressable>
    )
  }

  return <View style={rowStyle}>{content}</View>
}
