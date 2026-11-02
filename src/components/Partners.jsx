import { useTranslation } from 'react-i18next'
import Reveal from './Reveal'
import Rich from './Rich'
import Eyebrow from './Eyebrow'

export default function Partners() {
  const { t } = useTranslation()
  return (
    <section className="section partners" id="partners">
      <Reveal className="container partners-inner">
        <div>
          <Eyebrow dark>{t('partners_kicker')}</Eyebrow>
          <h2><Rich k="partners_title" /></h2>
        </div>
        <p>{t('partners_text')}</p>
        <a className="btn btn-outline" href="#contact">{t('partners_cta')} <span>↗</span></a>
      </Reveal>
    </section>
  )
}
