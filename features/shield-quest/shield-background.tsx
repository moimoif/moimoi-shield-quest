import { colors } from '@/constants/theme'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export function ShieldBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.glow, styles.purpleGlow]} />
      <View style={[styles.glow, styles.blueGlow]} />
      <View style={[styles.glow, styles.emeraldGlow]} />
      <View style={styles.topLine} />
    </View>
  )
}

const styles = StyleSheet.create({
  glow: {
    borderRadius: 999,
    position: 'absolute',
  },
  purpleGlow: {
    backgroundColor: 'rgba(139, 92, 246, 0.16)',
    height: 320,
    right: -160,
    top: -90,
    width: 320,
  },
  blueGlow: {
    backgroundColor: 'rgba(76, 141, 255, 0.11)',
    height: 260,
    left: -150,
    top: 260,
    width: 260,
  },
  emeraldGlow: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    bottom: -140,
    height: 280,
    right: -100,
    width: 280,
  },
  topLine: {
    backgroundColor: colors.emerald,
    height: 2,
    left: '22%',
    opacity: 0.65,
    position: 'absolute',
    right: '22%',
    top: 0,
  },
})
