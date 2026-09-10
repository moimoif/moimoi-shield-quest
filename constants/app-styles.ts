import { StyleSheet } from 'react-native'
import { colors, spacing } from '@/constants/theme'

export const appStyles = StyleSheet.create({
  card: {
    backgroundColor: '#F4F7FB',
    borderColor: colors.cardBorder,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    padding: spacing.sm,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  stack: {
    gap: spacing.sm,
  },
  textDanger: {
    color: '#b3261e',
  },
  textSuccess: {
    color: '#1b6b30',
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
})
