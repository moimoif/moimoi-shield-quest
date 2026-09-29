import { colors } from '@/constants/theme'
import { Tabs } from 'expo-router'
import React from 'react'
import { QuestIcon } from '@/components/quest-icon'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.emerald,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated,
          borderTopColor: colors.cardBorder,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <QuestIcon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => <QuestIcon name="wallet" color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="shield" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="passport" options={{ href: null, tabBarStyle: { display: 'none' } }} />
    </Tabs>
  )
}
