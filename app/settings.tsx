import { spacing, theme } from '@/constants/theme'
import { useLanguage } from '@/features/language/language-provider'
import { type AppLanguage } from '@/features/language/translations'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, ScrollView, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SettingsScreen() {
  const router = useRouter()
  const { language, ready, setLanguage } = useLanguage()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)
  const en = language === 'en'

  async function select(next: AppLanguage) {
    setSaving(true)
    setError(false)
    try {
      await setLanguage(next)
    } catch {
      setError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView style={theme.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={theme.screenPad}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={theme.secondaryButton}>
          <Text style={theme.secondaryButtonText}>{en ? '‹ Back' : '‹ 戻る'}</Text>
        </Pressable>
        <Text style={theme.title}>{en ? 'Language settings' : '言語設定'}</Text>
        <Text style={theme.bodyMuted}>
          {en ? 'Your choice is saved on this device.' : '選択した言語はこの端末に保存されます。'}
        </Text>
        {(['ja', 'en'] as const).map((value) => (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityState={{ checked: language === value, disabled: !ready || saving }}
            disabled={!ready || saving}
            onPress={() => void select(value)}
            style={language === value ? theme.primaryButton : theme.secondaryButton}
          >
            <Text style={language === value ? theme.primaryButtonText : theme.secondaryButtonText}>
              {language === value ? '✓ ' : ''}
              {value === 'ja' ? '日本語' : 'English'}
            </Text>
          </Pressable>
        ))}
        {!ready || saving ? <Text style={theme.bodyMuted}>{en ? 'Loading / saving…' : '読込み・保存中…'}</Text> : null}
        {error ? (
          <Text accessibilityRole="alert" style={theme.body}>
            {en ? 'Could not save. Please try again.' : '保存できませんでした。もう一度お試しください。'}
          </Text>
        ) : null}
        <Text style={[theme.bodyMuted, { marginTop: spacing.md }]}>
          {en
            ? 'Home, QR checks, Shield Quest and Stamp Passport support both languages. Wallet apps and system permission dialogs use their own language settings.'
            : 'ホーム・QR確認・Shield Quest・Stamp Passportは2言語対応です。ウォレットアプリや端末の許可画面は、それぞれの言語設定に従います。'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
