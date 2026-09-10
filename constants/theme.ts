import { StyleSheet } from 'react-native'

export const colors = {
  background: '#07111F',
  backgroundElevated: '#0C1A2E',
  card: 'rgba(18, 36, 64, 0.82)',
  cardBorder: 'rgba(167, 139, 250, 0.35)',
  text: '#F4F7FB',
  textMuted: '#A9B8CC',
  purple: '#A78BFA',
  blue: '#4C8DFF',
  emerald: '#34D399',
  danger: '#F87171',
  success: '#34D399',
  overlay: 'rgba(76, 141, 255, 0.12)',
} as const

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const

export const radii = {
  md: 16,
  lg: 24,
  pill: 999,
} as const

export const minTapSize = 48

export const theme = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  screenPad: {
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  stack: {
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMuted: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  textDanger: {
    color: colors.danger,
  },
  textSuccess: {
    color: colors.success,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.purple,
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: minTapSize,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '700',
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
    fontSize: 17,
    fontWeight: '700',
  },
  disabledButton: {
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderColor: 'rgba(169, 184, 204, 0.25)',
    borderRadius: radii.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: minTapSize,
    opacity: 0.7,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  disabledButtonText: {
    color: colors.textMuted,
    fontSize: 17,
    fontWeight: '700',
  },
})
