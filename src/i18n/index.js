import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from './locales/ru.json'
import uz from './locales/uz.json'
import en from './locales/en.json'

export const LANGS = ['uz', 'ru', 'en']
const STORAGE_KEY = 'atim-lang'

const pickInitial = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (LANGS.includes(saved)) return saved
  const browser = navigator.language?.slice(0, 2)
  return LANGS.includes(browser) ? browser : 'uz'
}

i18n.use(initReactI18next).init({
  resources: { uz: { translation: uz }, ru: { translation: ru }, en: { translation: en } },
  lng: pickInitial(),
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
})

const syncDocument = (lng) => {
  document.documentElement.lang = lng
  document.title = i18n.t('meta_title')
  document.querySelector('meta[name="description"]')?.setAttribute('content', i18n.t('meta_desc'))
}
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
  syncDocument(lng)
})
syncDocument(i18n.language)

export default i18n
