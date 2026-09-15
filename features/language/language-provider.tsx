import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { isAppLanguage, translate, type AppLanguage } from './translations'

export const languageStorageKey = 'moimoi-language-v1'

type LanguageContextValue = {
  language: AppLanguage
  ready: boolean
  setLanguage: (language: AppLanguage) => Promise<void>
  t: (source: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, updateLanguage] = useState<AppLanguage>('ja')
  const [ready, setReady] = useState(false)
  const writes = useRef<Promise<void>>(Promise.resolve())

  useEffect(() => {
    let active = true
    void AsyncStorage.getItem(languageStorageKey)
      .then((stored) => {
        if (active && isAppLanguage(stored)) updateLanguage(stored)
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setReady(true)
      })
    return () => {
      active = false
    }
  }, [])

  function setLanguage(next: AppLanguage): Promise<void> {
    if (!ready || !isAppLanguage(next)) return Promise.reject(new Error('Language is not ready'))
    const write = writes.current
      .catch(() => undefined)
      .then(async () => {
        await AsyncStorage.setItem(languageStorageKey, next)
        updateLanguage(next)
      })
    writes.current = write
    return write
  }

  return (
    <LanguageContext.Provider value={{ language, ready, setLanguage, t: (source) => translate(language, source) }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be inside LanguageProvider')
  return context
}
