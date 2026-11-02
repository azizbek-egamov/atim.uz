import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGS } from '../i18n'
import { NAV, PHONES } from '../data'
import seal from '../assets/img/logo-seal.jpg'

export function Brand({ className = '' }) {
  return (
    <a className={`brand ${className}`.trim()} href="#home" aria-label="ATIM">
      <img src={seal} alt="" />
      <span>
        <b>ATIM</b>
        <small>INVESTMENT &amp; TECHNOLOGY</small>
      </span>
    </a>
  )
}

export default function Header() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onDown = (e) => !headerRef.current?.contains(e.target) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  return (
    <>
      <div className="topline">
        <div className="container topline-inner">
          <span>{t('topline')}</span>
          <div className="top-contact">
            {PHONES.map((p) => (
              <a key={p.href} href={p.href}>{p.label}</a>
            ))}
          </div>
        </div>
      </div>
      <header className="header" ref={headerRef}>
        <div className="container nav-wrap">
          <Brand />
          <button
            className={`menu-toggle${open ? ' open' : ''}`}
            aria-label={t('aria_menu')}
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="burger" aria-hidden="true"><i /><i /><i /></span>
          </button>
          <nav id="main-nav" className={open ? 'open' : ''}>
            {NAV.map((n, i) => (
              <a key={n.id} href={`#${n.id}`} style={{ '--i': i }} onClick={() => setOpen(false)}>{t(n.key)}</a>
            ))}
          </nav>
          <div className="lang-switch" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <button
                key={l}
                className={i18n.resolvedLanguage === l ? 'active' : ''}
                onClick={() => i18n.changeLanguage(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>
    </>
  )
}
