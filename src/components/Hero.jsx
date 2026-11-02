import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SLIDES } from '../data'
import Reveal from './Reveal'
import Rich from './Rich'
import Eyebrow from './Eyebrow'

const INTERVAL = 6500

export default function Hero() {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const go = useCallback((i) => setIndex((i + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => go(index + 1), INTERVAL)
    return () => clearTimeout(id)
  }, [index, paused, go])

  return (
    <section
      className="hero"
      id="home"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-slides" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <img key={s.img} src={s.img} alt="" className={i === index ? 'active' : ''} />
        ))}
      </div>
      <div className="hero-shade" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <Reveal><Eyebrow>{t('hero_eyebrow')}</Eyebrow></Reveal>
          <Reveal as="h1" delay={120}><Rich k="hero_title" /></Reveal>
          <Reveal as="p" delay={240}>{t('hero_text')}</Reveal>
          <Reveal className="hero-actions" delay={360}>
            <a className="btn btn-gold" href="#projects">{t('hero_cta')} <span>↗</span></a>
            <a className="text-link" href="#about">{t('hero_more')} <span>→</span></a>
          </Reveal>
          <Reveal className="hero-facts" delay={480}>
            {[1, 2].map((n) => (
              <div key={n}>
                <strong>{t(`fact${n}_v`)}</strong>
                <span>{t(`fact${n}`)}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
      <Reveal variant="fade" delay={700} className="container hero-bar">
        <div className="hero-caption">
          <b>{t(SLIDES[index].caption)}</b>
          <small>{t('hero_visual_note')}</small>
        </div>
        <div className="hero-controls">
          <button aria-label="Previous" onClick={() => go(index - 1)}>←</button>
          <div className="dots">
            {SLIDES.map((s, i) => (
              <button
                key={s.img}
                aria-label={`Slide ${i + 1}`}
                className={i === index ? 'active' : ''}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button aria-label="Next" onClick={() => go(index + 1)}>→</button>
        </div>
      </Reveal>
    </section>
  )
}
