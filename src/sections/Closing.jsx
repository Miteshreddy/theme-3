import React, { useMemo, useRef, useState } from 'react'
import { COUPLE, VENUE } from '../data.js'
import { downloadCalendar, prefersReducedMotion, storage, useRevealAll } from '../lib.js'
import { sound } from '../sound.js'

/*
 * Night falls at the end of the page. Fireflies drift over the meadow and
 * every tap on the sky sends up a paper lantern carrying the guest's wish.
 */
const KEY = 'hollow-oak-lanterns'
const MAX_LIVE = 24

export default function Closing() {
  const root = useRevealAll()
  const sky = useRef(null)
  const [lanterns, setLanterns] = useState([])
  const [count, setCount] = useState(() => storage.get(KEY, 0))

  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => {
        const a = Math.sin(i * 12.9898) * 43758.5453
        const b = Math.sin(i * 78.233) * 12345.678
        return { x: (a - Math.floor(a)) * 100, y: (b - Math.floor(b)) * 60, s: 1 + (i % 3), d: (i % 9) * 0.5 }
      }),
    []
  )
  const flies = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        x: (i * 37) % 100,
        y: 55 + ((i * 23) % 40),
        d: 6 + (i % 5) * 2,
        delay: -(i * 1.3),
      })),
    []
  )

  const release = (e) => {
    if (e.target.closest('a, button')) return
    const el = sky.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = e.clientY - r.top
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const lan = { id, x, y, dur: prefersReducedMotion() ? 0.01 : 9 + Math.random() * 4, sway: 10 + Math.random() * 24, hue: Math.random() }
    sound.chime()
    setLanterns((l) => [...l, lan].slice(-MAX_LIVE))
    setCount((n) => {
      storage.set(KEY, n + 1)
      return n + 1
    })
    setTimeout(() => setLanterns((l) => l.filter((x) => x.id !== id)), lan.dur * 1000 + 200)
  }

  return (
    <section className="closing" id="closing" ref={root} aria-labelledby="closing-title">
      <div className="night" ref={sky} onPointerUp={release}>
        <div className="night__stars" aria-hidden="true">
          {stars.map((s, i) => (
            <span key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }} />
          ))}
        </div>
        <div className="night__moon" aria-hidden="true" />

        <div className="night__content">
          <div className="closing__string" data-reveal>
            <svg className="closing__twine" viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true">
              <path d="M-10 6 Q 200 70 410 6" />
            </svg>
            <span className="closing__bulbs" aria-hidden="true">
              {[6, 18, 30, 70, 82, 94].map((x, i) => (
                <i key={x} style={{ left: `${x}%`, top: `${(6 + 64 * 4 * (x / 100) * (1 - x / 100)) * 0.9}px`, animationDelay: `${i * 0.4}s` }} />
              ))}
            </span>
            <figure className="closing__photo">
              <span className="peg" aria-hidden="true" />
              <img src="./photos/closing.jpg" alt={`${COUPLE.a} and ${COUPLE.b} arriving together`} loading="lazy" />
              <figcaption>see you at the farm ♡</figcaption>
            </figure>
          </div>

          <p className="kicker kicker--center" data-reveal>
            Save the date
          </p>
          <h2 id="closing-title" className="closing__title" data-reveal>
            We can’t wait to <em>celebrate</em> with you.
          </h2>
          <p className="closing__date" data-reveal>
            <span>06</span>
            <i />
            <span>05</span>
            <i />
            <span>27</span>
          </p>
          <p className="closing__place" data-reveal>
            {VENUE.name} · Bedford, New York
          </p>
          <div className="closing__actions" data-reveal>
            <button type="button" className="btn btn--cream" onClick={downloadCalendar}>
              Add to calendar
            </button>
            <a href="#rsvp" className="btn btn--ghost">
              RSVP
            </a>
          </div>

          <p className="night__hint" data-reveal>
            {count > 0 ? (
              <>
                {count} lantern{count === 1 ? '' : 's'} sent up for us. <em>Thank you.</em>
              </>
            ) : (
              <>Tap the night sky to send up a lantern with your wish.</>
            )}
          </p>
        </div>

        <div className="night__land" aria-hidden="true">
          <svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice">
            <path d="M0 60 C 70 34, 140 40, 210 56 S 330 30, 400 46 V 120 H 0 Z" fill="#1a2140" />
            <g transform="translate(250 22)">
              <path d="M0 40 V 16 L 20 2 L 40 16 V 40 Z" fill="#141a33" />
              <rect x="7" y="20" width="7" height="7" fill="#ffd27a" className="night__win" />
              <rect x="26" y="20" width="7" height="7" fill="#ffd27a" className="night__win" style={{ animationDelay: '1.4s' }} />
            </g>
            <path d="M0 86 C 90 70, 200 92, 400 74 V 120 H 0 Z" fill="#11162b" />
            <path d="M40 120 V 96 q 5 -18 8 0 q 4 -24 8 0 q 4 -16 8 0 V 120 Z M300 120 V 98 q 6 -22 9 0 q 4 -16 8 0 q 5 -26 9 0 V 120 Z" fill="#0b0f20" />
          </svg>
        </div>

        <div className="fireflies" aria-hidden="true">
          {flies.map((f, i) => (
            <span key={i} style={{ left: `${f.x}%`, top: `${f.y}%`, animationDuration: `${f.d}s, 2.4s`, animationDelay: `${f.delay}s, ${f.delay / 2}s` }} />
          ))}
        </div>

        <div className="lanterns" aria-hidden="true">
          {lanterns.map((l) => (
            <span
              key={l.id}
              className="lantern"
              style={{ left: `${l.x}%`, top: l.y, '--sway': `${l.sway}px`, '--rise': `${l.y + 120}px`, animationDuration: `${l.dur}s`, filter: `hue-rotate(${(l.hue * 30 - 15).toFixed(0)}deg)` }}
            >
              <i />
            </span>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p className="footer__mono">{COUPLE.monogram}</p>
        <p>Made with love at the end of a long lane.</p>
        <a href="#top" className="footer__top">
          Back to the beginning ↑
        </a>
      </footer>
    </section>
  )
}
