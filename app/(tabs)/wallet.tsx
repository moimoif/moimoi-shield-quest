import { AccountFeatureIndex } from '@/features/account/account-feature-index'
import { NetworkFeatureIndex } from '@/features/network/network-feature-index'
import { AppConfig } from '@/constants/app-config'
import { appStyles } from '@/constants/app-styles'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function WalletLabScreen() {
  return (
    <SafeAreaView style={appStyles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={appStyles.stack}>
        <Text style={appStyles.title}>Wallet Lab</Text>
        <View style={appStyles.card}>
          <Text>
            Name <Text style={{ fontWeight: 'bold' }}>{AppConfig.identity.name}</Text>
          </Text>
          <Text>
            URL <Text style={{ fontWeight: 'bold' }}>{AppConfig.identity.uri}</Text>
          </Text>
        </View>
        <AccountFeatureIndex />
        <NetworkFeatureIndex />
      </ScrollView>
    </SafeAreaView>
  )
}
