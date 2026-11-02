import { useEffect, useRef } from 'react'

// One shared observer: adds "in" the first time an element scrolls into view.
let observer
const getObserver = () => {
  observer ??= new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          observer.unobserve(e.target)
        }
      }),
    { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
  )
  return observer
}

// variant: up | left | right | zoom | fade — delay in ms (use it to stagger siblings).
export default function Reveal({ as: Tag = 'div', variant = 'up', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const io = getObserver()
    io.observe(el)
    return () => io.unobserve(el)
  }, [])
  return (
    <Tag
      ref={ref}
      className={`reveal rv-${variant} ${className}`.trim()}
      style={{ '--d': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
