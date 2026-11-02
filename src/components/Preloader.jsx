import { useEffect, useState } from 'react'
import seal from '../assets/img/logo-seal.jpg'

const MIN_MS = 1300 // keep the loader visible long enough to read as intentional
const MAX_MS = 6000 // never block the site if something hangs
const FADE_MS = 500

export default function Preloader() {
  const [phase, setPhase] = useState('show') // show -> hide -> gone

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    let fadeTimer
    const hide = () => {
      document.documentElement.classList.add('loaded')
      setPhase('hide')
      fadeTimer = setTimeout(() => setPhase('gone'), FADE_MS)
    }
    const minWait = new Promise((r) => setTimeout(r, MIN_MS))
    const pageLoaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((r) => window.addEventListener('load', r, { once: true }))
    const fonts = document.fonts?.ready ?? Promise.resolve()
    const maxTimer = setTimeout(hide, MAX_MS)
    Promise.all([minWait, pageLoaded, fonts]).then(() => {
      clearTimeout(maxTimer)
      hide()
    })
    return () => {
      clearTimeout(maxTimer)
      clearTimeout(fadeTimer)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (phase === 'gone') document.body.style.overflow = ''
  }, [phase])

  if (phase === 'gone') return null
  return (
    <div className={`preloader${phase === 'hide' ? ' hide' : ''}`} role="status" aria-label="Loading">
      <div className="preloader-inner">
        <img src={seal} alt="" />
        <b>ATIM</b>
        <small>INVESTMENT &amp; TECHNOLOGY</small>
        <div className="preloader-bar" />
      </div>
    </div>
  )
}
