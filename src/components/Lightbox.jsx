import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const MAX_SCALE = 5
const DOUBLE_TAP_SCALE = 2.5
const CLOSE_MS = 240
const SWIPE_PX = 60

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

// Full-screen image viewer. Touch: pinch to zoom, drag to pan, double-tap to zoom,
// swipe sideways to change image. Desktop: wheel / double-click zoom, arrow keys.
export default function Lightbox({ items, index, onIndex, onClose }) {
  const { t } = useTranslation()
  const [closing, setClosing] = useState(false)
  const stageRef = useRef(null)
  const imgRef = useRef(null)
  const view = useRef({ s: 1, x: 0, y: 0 })
  const pointers = useRef(new Map())
  const gesture = useRef(null)
  const lastTap = useRef({ t: 0, x: 0, y: 0 })
  const closeTimer = useRef(null)
  const item = items[index]
  const count = items.length

  const apply = useCallback((animated = false) => {
    const img = imgRef.current
    if (!img) return
    const { s, x, y } = view.current
    img.style.transition = animated ? 'transform .25s ease' : 'none'
    img.style.transform = `translate(${x}px, ${y}px) scale(${s})`
  }, [])

  const rel = useCallback((clientX, clientY) => {
    const r = stageRef.current.getBoundingClientRect()
    return { x: clientX - r.left - r.width / 2, y: clientY - r.top - r.height / 2 }
  }, [])

  // keep the zoomed image from being dragged out of view
  const settle = useCallback(() => {
    const v = view.current
    const img = imgRef.current
    const stage = stageRef.current
    if (v.s <= 1.001) {
      v.s = 1
      v.x = 0
      v.y = 0
      return
    }
    const maxX = Math.max(0, (img.offsetWidth * v.s - stage.clientWidth) / 2)
    const maxY = Math.max(0, (img.offsetHeight * v.s - stage.clientHeight) / 2)
    v.x = clamp(v.x, -maxX, maxX)
    v.y = clamp(v.y, -maxY, maxY)
  }, [])

  // zoom to newScale keeping the point (cx, cy) — relative to the stage centre — fixed
  const zoomAt = useCallback(
    (newScale, cx, cy, animated) => {
      const v = view.current
      const s = clamp(newScale, 1, MAX_SCALE)
      const px = (cx - v.x) / v.s
      const py = (cy - v.y) / v.s
      v.x = cx - px * s
      v.y = cy - py * s
      v.s = s
      settle()
      apply(animated)
    },
    [apply, settle],
  )

  const requestClose = useCallback(() => {
    if (closeTimer.current) return
    setClosing(true)
    closeTimer.current = setTimeout(onClose, CLOSE_MS)
  }, [onClose])

  const go = useCallback(
    (delta) => {
      if (count > 1) onIndex((index + delta + count) % count)
    },
    [count, index, onIndex],
  )

  // reset zoom whenever the image changes
  useEffect(() => {
    view.current = { s: 1, x: 0, y: 0 }
    apply()
  }, [index, apply])

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  // keyboard + scroll lock
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') requestClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [requestClose, go])

  // wheel / trackpad pinch zoom (needs a non-passive listener to preventDefault)
  useEffect(() => {
    const stage = stageRef.current
    const onWheel = (e) => {
      e.preventDefault()
      const c = rel(e.clientX, e.clientY)
      zoomAt(view.current.s * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0025)), c.x, c.y, false)
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [rel, zoomAt])

  const startPan = (x, y, onImage) => {
    const v = view.current
    gesture.current = { type: 'pan', x0: v.x, y0: v.y, px: x, py: y, t: Date.now(), moved: false, onImage }
  }

  const onPointerDown = (e) => {
    try {
      stageRef.current.setPointerCapture(e.pointerId)
    } catch {
      // pointer already gone — nothing to capture
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const pts = [...pointers.current.values()]
    const v = view.current
    if (pts.length === 2) {
      const mid = rel((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2)
      gesture.current = { type: 'pinch', d0: dist(pts[0], pts[1]), s0: v.s, x0: v.x, y0: v.y, m0: mid, moved: true }
    } else if (pts.length === 1) {
      startPan(e.clientX, e.clientY, e.target === imgRef.current)
    }
  }

  const onPointerMove = (e) => {
    const p = pointers.current.get(e.pointerId)
    const g = gesture.current
    if (!p || !g) return
    p.x = e.clientX
    p.y = e.clientY
    const v = view.current
    if (g.type === 'pinch' && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()]
      const s = clamp((g.s0 * dist(a, b)) / g.d0, 0.8, MAX_SCALE)
      const m = rel((a.x + b.x) / 2, (a.y + b.y) / 2)
      const px = (g.m0.x - g.x0) / g.s0
      const py = (g.m0.y - g.y0) / g.s0
      v.s = s
      v.x = m.x - px * s
      v.y = m.y - py * s
      apply()
    } else if (g.type === 'pan') {
      const dx = e.clientX - g.px
      const dy = e.clientY - g.py
      if (Math.hypot(dx, dy) > 6) g.moved = true
      if (!g.moved) return
      if (v.s > 1.001) {
        v.x = g.x0 + dx
        v.y = g.y0 + dy
      } else if (count > 1) {
        v.x = dx * 0.8 // follow the finger while swiping between images
        v.y = 0
      }
      apply()
    }
  }

  const onPointerUp = (e) => {
    const g = gesture.current
    pointers.current.delete(e.pointerId)
    const v = view.current

    // one finger left after a pinch: carry on as a pan from the current position
    if (pointers.current.size >= 1) {
      const rest = [...pointers.current.values()][0]
      startPan(rest.x, rest.y, true)
      gesture.current.moved = true
      return
    }
    gesture.current = null
    if (!g) return

    if (g.type === 'pinch') {
      settle()
      apply(true)
      return
    }

    const dx = e.clientX - g.px
    const dy = e.clientY - g.py

    if (v.s > 1.001) {
      // zoomed: a tap toggles back out, a drag just settles inside bounds
      if (!g.moved && Date.now() - g.t < 400) {
        const now = Date.now()
        if (now - lastTap.current.t < 300) {
          v.s = 1
          v.x = 0
          v.y = 0
          lastTap.current.t = 0
        } else {
          lastTap.current = { t: now, x: e.clientX, y: e.clientY }
        }
      }
      settle()
      apply(true)
      return
    }

    // not zoomed (also snaps a slightly "under-pinched" image back to scale 1)
    settle()
    if (g.moved) {
      if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) {
        go(dx < 0 ? 1 : -1)
        return
      }
      v.x = 0
      v.y = 0
      apply(true)
      return
    }
    // a tap
    if (!g.onImage) return requestClose()
    const now = Date.now()
    if (now - lastTap.current.t < 300 && Math.hypot(e.clientX - lastTap.current.x, e.clientY - lastTap.current.y) < 30) {
      const c = rel(e.clientX, e.clientY)
      zoomAt(DOUBLE_TAP_SCALE, c.x, c.y, true)
      lastTap.current.t = 0
    } else {
      lastTap.current = { t: now, x: e.clientX, y: e.clientY }
    }
  }

  return (
    <div className={`lightbox${closing ? ' closing' : ''}`} role="dialog" aria-modal="true" aria-label={item.caption}>
      <div
        className="lb-stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="lb-frame" key={index}>
          <img ref={imgRef} className="lb-img" src={item.img} alt={item.caption} draggable={false} />
        </div>
      </div>
      <button className="lb-close" aria-label={t('close')} onClick={requestClose}>×</button>
      {count > 1 && (
        <>
          <button className="lb-nav lb-prev" aria-label="Previous" onClick={() => go(-1)}>←</button>
          <button className="lb-nav lb-next" aria-label="Next" onClick={() => go(1)}>→</button>
          <div className="lb-count">{index + 1} / {count}</div>
        </>
      )}
      <div className="lb-caption">{item.caption}</div>
    </div>
  )
}
