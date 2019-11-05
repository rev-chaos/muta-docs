import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './en.json'
import zh from './zh.json'

export const languages = ['en', 'zh']

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      zh,
    },
    fallbackLng: 'en',
    // debug: true,
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    whitelist: languages,
    // react i18next special options (optional)
    react: {
      wait: false,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default',
    },
  })

for (let i = 0; i < languages.length; i++) {
  const language = languages[i]
  if (
    window.location.pathname.startsWith(
      `${process.env.PUBLIC_URL}/${language}/`
    )
  ) {
    i18n.changeLanguage(language)
    break
  }
}

export default i18n
