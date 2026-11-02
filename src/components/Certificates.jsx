import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CERTS } from '../data'
import Reveal from './Reveal'
import Rich from './Rich'
import Eyebrow from './Eyebrow'
import Lightbox from './Lightbox'

export default function Certificates() {
  const { t } = useTranslation()
  const [zoom, setZoom] = useState(null)
  const items = CERTS.map((c) => ({ img: c.img, caption: t(c.title) }))

  return (
    <section className="section certificates" id="certificates">
      <div className="container docs-wrap">
        <Reveal variant="left" className="docs-copy">
          <Eyebrow>{t('cert_kicker')}</Eyebrow>
          <h2><Rich k="cert_title" /></h2>
          <p>{t('cert_text')}</p>
          <p className="doc-disclaimer">{t('cert_disclaimer')}</p>
        </Reveal>
        <div className="cert-grid">
          {CERTS.map((c, i) => (
            <Reveal variant="zoom" delay={150 + i * 150} className="cert-card" key={c.title}>
              <button className="cert-thumb" onClick={() => setZoom(i)}>
                <img src={c.img} alt={t(c.title)} loading="lazy" />
              </button>
              <div className="cert-info">
                <span className="doc-icon">0{i + 1}</span>
                <div>
                  <b>{t(c.title)}</b>
                  <small>{t(c.meta)}</small>
                </div>
              </div>
              <button className="cert-view" onClick={() => setZoom(i)}>
                {t('cert_view')} ↗
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      {zoom !== null && <Lightbox items={items} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} />}
    </section>
  )
}
