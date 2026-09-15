import AsyncStorage from '@react-native-async-storage/async-storage'
import { act, cleanup, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LanguageProvider, languageStorageKey, useLanguage } from './language-provider'

async function mount() {
  let value!: ReturnType<typeof useLanguage>
  function Probe() {
    value = useLanguage()
    return null
  }
  const rendered = await render(
    <LanguageProvider>
      <Probe />
    </LanguageProvider>,
  )
  await waitFor(() => expect(value.ready).toBe(true))
  return {
    rendered,
    get value() {
      return value
    },
  }
}

beforeEach(async () => {
  await AsyncStorage.clear()
})
afterEach(async () => {
  await cleanup()
  vi.restoreAllMocks()
})

describe('language persistence', () => {
  it('restores English from this device', async () => {
    await AsyncStorage.setItem(languageStorageKey, 'en')
    expect((await mount()).value.language).toBe('en')
  })
  it('falls back to Japanese for invalid saved data', async () => {
    await AsyncStorage.setItem(languageStorageKey, 'invalid')
    expect((await mount()).value.language).toBe('ja')
  })
  it('saves and restores the selection after remount', async () => {
    const provider = await mount()
    await act(async () => provider.value.setLanguage('en'))
    expect(provider.value.t('QRを読み取る')).toBe('Scan a QR code')
    expect(await AsyncStorage.getItem(languageStorageKey)).toBe('en')
    await provider.rendered.unmount()
    expect((await mount()).value.language).toBe('en')
  })
  it('retains the prior language when saving fails', async () => {
    const provider = await mount()
    vi.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage unavailable'))
    await act(async () => {
      await expect(provider.value.setLanguage('en')).rejects.toThrow('Storage unavailable')
    })
    expect(provider.value.language).toBe('ja')
  })
})
