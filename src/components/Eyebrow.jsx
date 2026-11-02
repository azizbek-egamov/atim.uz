export default function Eyebrow({ children, dark = false }) {
  return (
    <div className={`eyebrow${dark ? ' dark' : ''}`}>
      <i />
      <span>{children}</span>
    </div>
  )
}
