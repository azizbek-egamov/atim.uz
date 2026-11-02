import { Trans } from 'react-i18next'

// Renders a translation that may contain <em> and <br/> markup.
export default function Rich({ k }) {
  return <Trans i18nKey={k} components={{ em: <em />, br: <br /> }} />
}
