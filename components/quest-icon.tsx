import React from 'react'
import { View, type ColorValue } from 'react-native'

export type QuestIconName = 'home' | 'wallet' | 'qr' | 'stamp'

// Native geometry avoids missing icon-font glyphs on Android release builds.
export function QuestIcon({ name, color, size = 24 }: { name: QuestIconName; color: ColorValue; size?: number }) {
  const line = { borderColor: color, borderWidth: 2 }
  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      {name === 'home' ? (
        <>
          <View
            style={{
              position: 'absolute',
              top: size * 0.13,
              width: size * 0.52,
              height: size * 0.52,
              borderTopWidth: 2,
              borderLeftWidth: 2,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
            }}
          />
          <View
            style={{ ...line, borderTopWidth: 0, width: size * 0.62, height: size * 0.48, marginTop: size * 0.3 }}
          />
        </>
      ) : name === 'wallet' ? (
        <>
          <View style={{ ...line, width: size * 0.9, height: size * 0.65, borderRadius: 4 }} />
          <View
            style={{
              ...line,
              position: 'absolute',
              right: 0,
              width: size * 0.35,
              height: size * 0.28,
              borderRadius: 3,
              backgroundColor: color,
            }}
          />
        </>
      ) : name === 'stamp' ? (
        <>
          <View style={{ ...line, width: size * 0.8, height: size * 0.8, borderRadius: size }} />
          <View
            style={{
              ...line,
              position: 'absolute',
              width: size * 0.32,
              height: size * 0.32,
              transform: [{ rotate: '45deg' }],
            }}
          />
        </>
      ) : (
        <>
          {[0, 1, 2, 3].map((corner) => (
            <View
              key={corner}
              style={{
                position: 'absolute',
                width: size * 0.35,
                height: size * 0.35,
                borderColor: color,
                borderTopWidth: corner < 2 ? 2 : 0,
                borderBottomWidth: corner >= 2 ? 2 : 0,
                borderLeftWidth: corner % 2 === 0 ? 2 : 0,
                borderRightWidth: corner % 2 === 1 ? 2 : 0,
                top: corner < 2 ? 1 : undefined,
                bottom: corner >= 2 ? 1 : undefined,
                left: corner % 2 === 0 ? 1 : undefined,
                right: corner % 2 === 1 ? 1 : undefined,
              }}
            />
          ))}
          <View style={{ backgroundColor: color, width: size * 0.2, height: size * 0.2 }} />
        </>
      )}
    </View>
  )
}
