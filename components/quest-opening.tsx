import { colors, theme } from '@/constants/theme'
import { useLanguage } from '@/features/language/language-provider'
import React from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function QuestOpening({ onContinue }: { onContinue: () => void }) {
  const { language } = useLanguage()
  const ja = language === 'ja'
  return (
    <SafeAreaView style={theme.screen}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 28, gap: 24 }}>
        <View style={{ alignItems: 'center', gap: 16 }}>
          <Image
            source={require('@/assets/images/moimoi-shield.png')}
            accessibilityLabel="Moimoi Shield Quest"
            style={{ width: 220, height: 220, borderRadius: 32 }}
            resizeMode="contain"
          />
          <Text style={{ color: colors.emerald, letterSpacing: 4, fontSize: 12, fontWeight: '800' }}>
            LEARN · CHECK · PROTECT
          </Text>
          <Text style={[theme.title, { textAlign: 'center', fontSize: 34 }]}>Moimoi{'\n'}Shield Quest</Text>
          <Text style={[theme.subtitle, { textAlign: 'center' }]}>
            {ja
              ? '毎日の小さな挑戦で、Solanaの安全知識を身につけよう。'
              : 'Build safer Solana habits. One daily quest at a time.'}
          </Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onContinue} style={theme.primaryButton}>
          <Text style={theme.primaryButtonText}>{ja ? 'クエストをはじめる' : 'Enter Shield Quest'}</Text>
        </Pressable>
        <Text style={[theme.bodyMuted, { textAlign: 'center', fontSize: 12 }]}>
          {ja
            ? '安全について学ぶためのアプリです。安全性を保証するものではありません。'
            : 'Educational tools, not a guarantee of safety.'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
