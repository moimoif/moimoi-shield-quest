import { ellipsify } from '@/utils/ellipsify'
import { useNetwork } from '@/features/network/use-network'
import { colors, radii, spacing, theme } from '@/constants/theme'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function HomeScreen() {
  const router = useRouter()
  const { account } = useMobileWallet()
  const { selectedNetwork } = useNetwork()
  const connected = !!account

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
          <Text style={[theme.subtitle, { textAlign: 'center' }]}>
            Solana の安全確認を、毎日のミッションとして。
          </Text>
        </View>

        <View style={theme.card} accessibilityLabel="Play streak">
          <Text style={theme.label}>連続プレイ</Text>
          <Text style={[theme.title, { marginTop: spacing.xs }]}>1 日目</Text>
          <Text style={theme.bodyMuted}>プレースホルダです。記録の保存は今後のフェーズで追加します。</Text>
        </View>

        <View style={theme.stack}>
          <Text style={theme.label}>今日のミッション</Text>
          <MissionRow title="ウォレットを接続する" status={connected ? '完了' : '未完了'} done={connected} />
          <MissionRow title="Shield Game をクリアする" status="準備中" done={false} />
          <MissionRow title="QR を確認する" status="準備中" done={false} />
        </View>

        <View style={theme.card} accessibilityLabel="Wallet status">
          <Text style={theme.label}>Wallet</Text>
          <Text style={[theme.body, { marginTop: spacing.xs }]}>
            {connected
              ? `${account.label ?? 'Wallet'} · ${ellipsify(account.address.toString(), 4)}`
              : '未接続'}
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
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: true }} disabled style={theme.disabledButton}>
            <Text style={theme.disabledButtonText}>今日の Shield（準備中）</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: true }} disabled style={theme.disabledButton}>
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
