import { useTranslation } from 'react-i18next'
import Reveal from './Reveal'
import Rich from './Rich'
import Eyebrow from './Eyebrow'
import office from '../assets/img/IMG_20261102_213401_617.jpg'

export default function About() {
  const { t } = useTranslation()
  return (
    <section className="section about" id="about">
      <div className="container two-col">
        <div className="section-intro">
          <Reveal><Eyebrow dark>{t('about_kicker')}</Eyebrow></Reveal>
          <Reveal delay={100}><h2><Rich k="about_title" /></h2></Reveal>
          <Reveal variant="zoom" delay={200}><img className="about-photo" src={office} alt="" loading="lazy" /></Reveal>
        </div>
        <Reveal variant="right" delay={150} className="about-copy">
          <p className="lead">{t('about_lead')}</p>
          <p>{t('about_text')}</p>
          <a className="under-link" href="#contact">{t('about_link')} <span>↗</span></a>
        </Reveal>
      </div>
      <div className="container metrics">
        {[1, 2, 3].map((n) => (
          <Reveal className="metric" key={n} delay={(n - 1) * 130}>
            <span>0{n}</span>
            <b>{t(`metric${n}`)}</b>
            <small>{t(`metric${n}s`)}</small>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
