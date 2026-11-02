import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GALLERY, PROJECTS, VIDEO } from '../data'
import Reveal from './Reveal'
import Rich from './Rich'
import Eyebrow from './Eyebrow'
import Lightbox from './Lightbox'

export default function Projects() {
  const { t } = useTranslation()
  const [zoom, setZoom] = useState(null)

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <Eyebrow>{t('projects_kicker')}</Eyebrow>
            <h2><Rich k="projects_title" /></h2>
          </div>
          <p>{t('projects_note')}</p>
        </Reveal>

        <div className="project-grid">
          {PROJECTS.map((p, i) => (
            <Reveal as="article" className="project-card" key={p.no} delay={i * 130}>
              <img src={p.img} alt="" loading="lazy" />
              <div className="project-content">
                <span className="project-no">{p.no}</span>
                <h3>{p.title}</h3>
                <p>{t(p.text)}</p>
                <span className="status">{t(p.status)}</span>
              </div>
            </Reveal>
          ))}
          <Reveal as="article" variant="zoom" className="project-card project-wide">
            <div className="digital-visual">
              <div className="digital-ring" />
              <div className="digital-core">ATIM<span> DIGITAL</span></div>
              <div className="digital-line" />
            </div>
            <div className="project-content">
              <span className="project-no">04 / PLATFORM</span>
              <h3>ATIM Digital &amp; Investment</h3>
              <p>{t('p4')}</p>
              <span className="status">{t('status_direction')}</span>
            </div>
          </Reveal>
        </div>

        <div className="video-block">
          <Reveal variant="left" className="video-copy">
            <Eyebrow>{t('video_kicker')}</Eyebrow>
            <h3><Rich k="video_title" /></h3>
            <p>{t('video_text')}</p>
          </Reveal>
          <Reveal variant="right" delay={150}>
            <video controls preload="none" poster={VIDEO.poster} playsInline>
              <source src={VIDEO.src} type="video/mp4" />
            </video>
          </Reveal>
        </div>

        <div className="gallery-wrap">
          <Reveal as="h3" className="gallery-title">{t('gallery_title')}</Reveal>
          <div className="gallery">
            {GALLERY.map((g, i) => (
              <Reveal
                as="button"
                variant="zoom"
                delay={i * 110}
                key={g.img}
                className="gallery-item"
                onClick={() => setZoom(i)}
              >
                <img src={g.img} alt={t(g.caption)} loading="lazy" />
                <span>{t(g.caption)}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      {zoom !== null && (
        <Lightbox
          items={GALLERY.map((g) => ({ img: g.img, caption: t(g.caption) }))}
          index={zoom}
          onIndex={setZoom}
          onClose={() => setZoom(null)}
        />
      )}
    </section>
  )
}
