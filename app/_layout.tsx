import { AppProviders } from '@/components/app-providers'
import { LanguageProvider } from '@/features/language/language-provider'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AppProviders>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="qr-check" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </AppProviders>
    </LanguageProvider>
  )
}
