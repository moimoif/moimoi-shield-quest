import { colors, minTapSize, radii, spacing, theme } from '@/constants/theme'
import { analyseQrContent } from '@/features/qr-check/qr-analysis'
import { ShieldBackground } from '@/features/shield-quest/shield-background'
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function QrCheckScreen() {
  const router = useRouter()
  const [permission, requestPermission] = useCameraPermissions()
  const [scanning, setScanning] = useState(false)
  const [rawContent, setRawContent] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const scanLockedRef = useRef(true)
  const analysis = rawContent === null ? null : analyseQrContent(rawContent)

  function beginScanning() {
    scanLockedRef.current = false
    setCameraError(null)
    setRawContent(null)
    setScanning(true)
  }

  function stopScanning() {
    scanLockedRef.current = true
    setScanning(false)
  }

  function handleBarcodeScanned(result: BarcodeScanningResult) {
    if (scanLockedRef.current) {
      return
    }

    scanLockedRef.current = true
    setScanning(false)
    setRawContent(result.data)
  }

  async function handleRequestPermission() {
    setCameraError(null)
    try {
      const result = await requestPermission()
      if (!result.granted) {
        setCameraError('カメラが許可されていません。必要な場合のみ、端末の設定から変更してください。')
      }
    } catch {
      setCameraError('カメラ権限を確認できませんでした。')
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ShieldBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="ホームに戻る"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>QR SAFETY CHECK</Text>
            <Text style={styles.title}>QR内容の確認</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>確認できるのは、QRに含まれる文字列です</Text>
          <Text style={styles.noticeText}>
            教育目的の説明であり、安全性を保証するものではありません。リンクを開く・署名する・送金する処理は行いません。
          </Text>
        </View>

        {!permission ? (
          <View style={theme.card}>
            <Text style={theme.bodyMuted}>カメラ権限を確認しています…</Text>
          </View>
        ) : !permission.granted ? (
          <View style={theme.card}>
            <Text style={styles.sectionTitle}>カメラの許可</Text>
            <Text style={theme.bodyMuted}>QRコードを端末内で読み取る場合のみ、カメラを使用します。</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => void handleRequestPermission()}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>カメラの使用を許可する</Text>
            </Pressable>
          </View>
        ) : scanning ? (
          <View style={styles.scannerCard}>
            <View style={styles.cameraFrame}>
              <CameraView
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                facing="back"
                onBarcodeScanned={handleBarcodeScanned}
                onMountError={() => {
                  stopScanning()
                  setCameraError('カメラを開始できませんでした。アプリを閉じてから、もう一度お試しください。')
                }}
                style={styles.camera}
              />
              <View pointerEvents="none" style={styles.scanGuide} />
            </View>
            <Text style={styles.cameraHelp}>枠内にQRコードを合わせてください</Text>
            <Pressable accessibilityRole="button" onPress={stopScanning} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>読取りを中止</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable accessibilityRole="button" onPress={beginScanning} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{rawContent === null ? 'QRを読み取る' : '別のQRを読み取る'}</Text>
          </Pressable>
        )}

        {cameraError ? (
          <View accessibilityRole="alert" style={styles.errorCard}>
            <Text style={styles.errorText}>{cameraError}</Text>
          </View>
        ) : null}

        {rawContent !== null && analysis ? (
          <>
            <View style={theme.card}>
              <Text style={styles.sectionLabel}>DECODED CONTENT</Text>
              <Text style={styles.sectionTitle}>読み取った原文</Text>
              <Text selectable style={styles.rawText}>
                {rawContent || '（空の文字列）'}
              </Text>
            </View>

            <View style={theme.card}>
              <Text style={styles.sectionLabel}>FORMAT</Text>
              <Text style={styles.sectionTitle}>{analysis.label}</Text>
              <View style={styles.fieldList}>
                {analysis.fields.map((field) => (
                  <View key={field.label} style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <Text selectable style={styles.fieldValue}>
                      {field.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.educationCard}>
              <Text style={styles.sectionLabel}>CHECK POINTS</Text>
              <Text style={styles.sectionTitle}>確認するポイント</Text>
              {analysis.notes.map((note, index) => (
                <View key={`${index}-${note}`} style={styles.noteRow}>
                  <Text style={styles.noteNumber}>{index + 1}</Text>
                  <Text style={styles.noteText}>{note}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.footerNote}>
              読取り結果は履歴保存せず、この画面から外部へ送信しません。QR内の表示名や説明文も未検証です。
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setRawContent(null)
                setCameraError(null)
              }}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>結果を消す</Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 62,
  },
  headerText: {
    alignItems: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: minTapSize,
  },
  backButton: {
    alignItems: 'center',
    borderRadius: radii.pill,
    height: minTapSize,
    justifyContent: 'center',
    width: minTapSize,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 38,
    lineHeight: 40,
  },
  eyebrow: {
    color: colors.emerald,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 3,
  },
  noticeCard: {
    backgroundColor: 'rgba(76, 141, 255, 0.12)',
    borderColor: 'rgba(76, 141, 255, 0.5)',
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  noticeTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  noticeText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  scannerCard: {
    backgroundColor: colors.backgroundElevated,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    overflow: 'hidden',
    padding: spacing.md,
  },
  cameraFrame: {
    aspectRatio: 1,
    borderRadius: radii.md,
    overflow: 'hidden',
    width: '100%',
  },
  camera: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scanGuide: {
    bottom: '16%',
    borderColor: colors.emerald,
    borderRadius: radii.md,
    borderWidth: 3,
    left: '16%',
    position: 'absolute',
    right: '16%',
    top: '16%',
  },
  cameraHelp: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.emerald,
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: minTapSize,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.overlay,
    borderColor: colors.blue,
    borderRadius: radii.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: minTapSize,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  errorCard: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderColor: 'rgba(248, 113, 113, 0.45)',
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 22,
  },
  sectionLabel: {
    color: colors.emerald,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  rawText: {
    backgroundColor: 'rgba(7, 17, 31, 0.72)',
    borderRadius: radii.md,
    color: colors.text,
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 21,
    padding: spacing.sm,
  },
  fieldList: {
    gap: spacing.xs,
  },
  fieldRow: {
    borderBottomColor: 'rgba(169, 184, 204, 0.16)',
    borderBottomWidth: 1,
    gap: 4,
    paddingBottom: spacing.xs,
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  fieldValue: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  educationCard: {
    backgroundColor: colors.card,
    borderColor: 'rgba(52, 211, 153, 0.42)',
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  noteRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  noteNumber: {
    backgroundColor: colors.overlay,
    borderRadius: radii.pill,
    color: colors.emerald,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  noteText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  footerNote: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },
})
