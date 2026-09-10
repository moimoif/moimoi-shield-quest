import { ellipsify } from '@/utils/ellipsify'
import { useNetwork } from '@/features/network/use-network'
import {
  emptyPassport,
  getPlayStreak,
  hasStampToday,
  loadPassport,
  type StampPassport,
} from '@/features/shield-quest/passport-storage'
import { colors, radii, spacing, theme } from '@/constants/theme'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function HomeScreen() {
  const router = useRouter()
  const { account } = useMobileWallet()
  const { selectedNetwork } = useNetwork()
  const [passport, setPassport] = useState<StampPassport>(emptyPassport)
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

      return () => {
        active = false
      }
    }, []),
  )

  return (
    <SafeAreaView style={theme.screen} edges={['top']}>
      <ScrollView contentContainerStyle={theme.screenPad} accessibilityRole="none">
        <View style={{ alignItems: 'center', gap: spacing.sm, paddingTop: spacing.md }}>
          <View
            accessibilityLabel="Moimoi shield"
            style={{
              alignItems: 'center',
              backgroundColor: colors.overlay,
              borderColor: colors.emerald,
              borderRadius: radii.pill,
              borderWidth: 2,
              height: 88,
              justifyContent: 'center',
              width: 88,
            }}
          >
            <Text style={{ color: colors.emerald, fontSize: 36, fontWeight: '800' }}>MQ</Text>
          </View>
          <Text style={theme.title}>Moimoi Shield Quest</Text>
          <Text style={[theme.subtitle, { textAlign: 'center' }]}>Solana の安全確認を、毎日のミッションとして。</Text>
        </View>

        <View style={theme.card} accessibilityLabel="Play streak">
          <Text style={theme.label}>連続プレイ</Text>
          <Text style={[theme.title, { marginTop: spacing.xs }]}>{getPlayStreak(passport)} 日</Text>
          <Text style={theme.bodyMuted}>
            Shield Stamp {passport.stamps.length}個 · ベストスコア {passport.bestScore}
          </Text>
        </View>

        <View style={theme.stack}>
          <Text style={theme.label}>今日のミッション</Text>
          <MissionRow title="ウォレットを接続する" status={connected ? '完了' : '未完了'} done={connected} />
          <MissionRow
            title="Shield Game をクリアする"
            status={completedToday ? '完了' : '挑戦可能'}
            done={completedToday}
          />
          <MissionRow title="QR を確認する" status="準備中" done={false} />
        </View>

        <View style={theme.card} accessibilityLabel="Wallet status">
          <Text style={theme.label}>Wallet</Text>
          <Text style={[theme.body, { marginTop: spacing.xs }]}>
            {connected ? `${account.label ?? 'Wallet'} · ${ellipsify(account.address.toString(), 4)}` : '未接続'}
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
            <Text style={theme.primaryButtonText}>Wallet Lab を開く</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start Shield Quest"
            onPress={() => router.push('/shield')}
            style={theme.secondaryButton}
          >
            <Text style={theme.secondaryButtonText}>今日の Shield に挑戦</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open Stamp Passport"
            onPress={() => router.push('/passport')}
            style={theme.secondaryButton}
          >
            <Text style={theme.secondaryButtonText}>Stamp Passport を見る</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            disabled
            style={theme.disabledButton}
          >
            <Text style={theme.disabledButtonText}>QR を確認（準備中）</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function MissionRow({ title, status, done }: { title: string; status: string; done: boolean }) {
  return (
    <View
      style={[
        theme.card,
        {
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
      ]}
    >
      <Text style={[theme.body, { flex: 1, paddingRight: spacing.sm }]}>{title}</Text>
      <Text style={done ? theme.textSuccess : theme.bodyMuted}>{status}</Text>
    </View>
  )
}
