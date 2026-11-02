import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EMAILS, PHONES } from '../data'
import Reveal from './Reveal'
import Rich from './Rich'
import Eyebrow from './Eyebrow'

// The form posts to our own backend (server/contact.mjs), which forwards it to Telegram.
// Override with VITE_FORM_ENDPOINT only if the API is hosted elsewhere.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || '/api/contact'

export default function Contact() {
  const { t, i18n } = useTranslation()
  const [status, setStatus] = useState('idle')

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), lang: i18n.language }),
      })
      if (!res.ok) throw new Error(res.status)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const message = {
    sending: t('form_sending'),
    sent: t('form_sent'),
    error: t('form_error'),
  }[status]

  return (
    <section className="section contact" id="contact">
      <div className="container contact-grid">
        <Reveal variant="left" className="contact-info">
          <Eyebrow>{t('contact_kicker')}</Eyebrow>
          <h2><Rich k="contact_title" /></h2>
          <p>{t('contact_text')}</p>
          <div className="contact-item">
            <small>{t('phone_label')}</small>
            {PHONES.map((p) => <a key={p.href} href={p.href}>{p.label}</a>)}
          </div>
          <div className="contact-item">
            <small>{t('address_label')}</small>
            <span>{t('address')}</span>
          </div>
          <div className="contact-item">
            <small>{t('email_label')}</small>
            <ul className="email-list">
              {EMAILS.map((m) => (
                <li key={m.address}>
                  <a href={`mailto:${m.address}`}>{m.address}</a>
                  <span>{t(m.role)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal variant="right" delay={150} className="contact-form-wrap">
          <div className="form-head">
            <span className="form-symbol">✳</span>
            <h3>{t('form_title')}</h3>
          </div>
          <form onSubmit={onSubmit}>
            {/* honeypot: hidden from people, bots fill it and get silently dropped */}
            <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label>
              <span>{t('form_name')}</span>
              <input required name="name" autoComplete="name" />
            </label>
            <label>
              <span>{t('form_phone')}</span>
              <input required name="contact" placeholder={t('ph_contact')} autoComplete="tel" />
            </label>
            <label>
              <span>{t('form_message')}</span>
              <textarea required name="message" rows="4" />
            </label>
            <button className="btn btn-gold" type="submit" disabled={status === 'sending'}>
              {t('form_submit')} <span>↗</span>
            </button>
            <div className="form-result" role="status">{message}</div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
