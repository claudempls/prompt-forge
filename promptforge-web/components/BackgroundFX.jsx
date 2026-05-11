'use client'

import { useEffect, useRef } from 'react'

export default function BackgroundFX() {
  const rootRef = useRef(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let ticking = false
    let lastY = window.scrollY

    const update = () => {
      ticking = false
      const y = lastY
      el.style.setProperty('--bgfx-slow', `${-y * 0.12}px`)
      el.style.setProperty('--bgfx-mid',  `${-y * 0.28}px`)
      el.style.setProperty('--bgfx-fast', `${-y * 0.55}px`)
      el.style.setProperty('--bgfx-rot',  `${y * 0.04}deg`)
    }

    const onScroll = () => {
      lastY = window.scrollY
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="bgfx" aria-hidden="true" ref={rootRef}>
      <div className="bgfx-pl bgfx-pl-rot"><div className="bgfx-aurora" /></div>

      <div className="bgfx-pl bgfx-pl-slow"><div className="bgfx-orb bgfx-orb-1" /></div>
      <div className="bgfx-pl bgfx-pl-mid"><div className="bgfx-orb bgfx-orb-2" /></div>
      <div className="bgfx-pl bgfx-pl-slow"><div className="bgfx-orb bgfx-orb-3" /></div>
      <div className="bgfx-pl bgfx-pl-fast"><div className="bgfx-orb bgfx-orb-4" /></div>

      <div className="bgfx-pl bgfx-pl-fast"><div className="bgfx-beam bgfx-beam-1" /></div>
      <div className="bgfx-pl bgfx-pl-mid"><div className="bgfx-beam bgfx-beam-2" /></div>
      <div className="bgfx-pl bgfx-pl-fast"><div className="bgfx-beam bgfx-beam-3" /></div>

      <div className="bgfx-pl bgfx-pl-mid"><div className="bgfx-grid" /></div>
    </div>
  )
}
