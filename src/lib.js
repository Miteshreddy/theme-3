import { useEffect, useRef, useState } from 'react'
import { COUPLE, VENUE, WEDDING_DATE } from './data.js'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/** Adds `is-in` to the element the first time it scrolls into view. */
export function useReveal(options = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-in')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: options.rootMargin || '0px 0px -12% 0px', threshold: options.threshold ?? 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

/** Reveals every `[data-reveal]` descendant of the returned ref as it enters the viewport. */
export function useRevealAll() {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = root.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      items.forEach((i) => i.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    )
    items.forEach((i) => io.observe(i))
    return () => io.disconnect()
  }, [])
  return ref
}

export function useCountdown(target) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now())
    return {
      done: diff === 0,
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 30000)
    return () => clearInterval(id)
  }, [])
  return t
}

/** Calls fn on every animation frame while scrolling/resizing (throttled to rAF). */
export function useScrollFrame(fn, deps = []) {
  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = 0
      fn()
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, deps)
}

const pad = (n) => String(n).padStart(2, '0')
const icsStamp = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`

export function downloadCalendar() {
  const start = new Date(WEDDING_DATE.getTime() - 60 * 60000) // 3:30 PM arrival
  const end = new Date(WEDDING_DATE.getTime() + 7.5 * 3600000) // midnight
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hollow Oak//Wedding//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:blake-ryan-20270605@hollowoak`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${COUPLE.a} & ${COUPLE.b}'s Wedding`,
    `LOCATION:${VENUE.name}\\, ${VENUE.line1}\\, ${VENUE.line2.replace(',', '\\,')}`,
    'DESCRIPTION:Shuttles leave The Mill House Inn at 2:45 and 3:15 PM. Ceremony at 4:30 PM in the Walled Garden.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'blake-and-ryan-wedding.ics'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

export const storage = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key)
      return v ? JSON.parse(v) : fallback
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage may be unavailable (private mode) — the page still works */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  },
}
