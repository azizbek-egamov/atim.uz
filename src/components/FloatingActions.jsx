import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PHONES } from '../data'

export default function FloatingActions() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="floating">
      {open && (
        <div className="float-phones">
          {PHONES.map((p) => <a key={p.href} href={p.href}>{p.label}</a>)}
        </div>
      )}
      <button className="float-call" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        ☎ <span>{t('float_call')}</span>
      </button>
      {showTop && <a className="float-top" href="#home" aria-label={t('top')}>↑</a>}
    </div>
  )
}
