import { useTranslation } from 'react-i18next'
import { ROADMAP } from '../data'
import Reveal from './Reveal'
import Rich from './Rich'
import Eyebrow from './Eyebrow'

export default function Roadmap() {
  const { t } = useTranslation()
  return (
    <section className="section roadmap" id="roadmap">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <Eyebrow>{t('roadmap_kicker')}</Eyebrow>
            <h2><Rich k="roadmap_title" /></h2>
          </div>
          <p>{t('roadmap_note')}</p>
        </Reveal>
        <div className="timeline">
          {ROADMAP.map((r, i) => (
            <Reveal className={`timeline-item${r.highlight ? ' highlight' : ''}`} key={r.title} delay={(i % 2) * 80}>
              <span>0{i + 1}</span>
              <div>
                <h3>{r.title}</h3>
                <p>{t(r.text)}</p>
              </div>
              <b>{r.tag}</b>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
