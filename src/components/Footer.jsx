import { useTranslation } from 'react-i18next'
import { NAV } from '../data'
import { Brand } from './Header'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Brand className="footer-brand" />
        <nav className="footer-nav">
          {NAV.map((n) => <a key={n.id} href={`#${n.id}`}>{t(n.key)}</a>)}
        </nav>
        <a href="#home" className="back-top">↑ {t('top')}</a>
      </div>
      <div className="container footer-legal">
        <span>© {YEAR} ATIM. {t('rights')}</span>
        <span>{t('footer_legal')}</span>
      </div>
    </footer>
  )
}
