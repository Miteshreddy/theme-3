import React, { useEffect, useRef, useState } from 'react'
import { COUPLE, VENUE } from '../data.js'
import { FarmScene, Grass, Sprig } from '../Drawings.jsx'
import { clamp, prefersReducedMotion, useCountdown, useReveal, useScrollFrame } from '../lib.js'
import { WEDDING_DATE } from '../data.js'

/** Ink drawing of the farm sketches itself, then the paper lifts away like a turned page. */
export function Intro({ onDone }) {
  const [phase, setPhase] = useState('draw') // draw → lift → gone
  const done = useRef(false)

  const finish = () => {
    if (done.current) return
    done.current = true
    setPhase('lift')
    onDone()
    setTimeout(() => setPhase('gone'), 1100)
  }

  useEffect(() => {
    const html = document.documentElement
    html.classList.add('is-locked')
    const t = setTimeout(finish, prefersReducedMotion() ? 300 : 3000)
    return () => {
      clearTimeout(t)
      html.classList.remove('is-locked')
    }
  }, [])

  useEffect(() => {
    if (phase !== 'draw') document.documentElement.classList.remove('is-locked')
  }, [phase])

  if (phase === 'gone') return null
  return (
    <div className={`intro intro--${phase}`} onClick={finish} role="presentation">
      <div className="intro__inner">
        <FarmScene />
        <p className="intro__names">
          {COUPLE.a} <em>&amp;</em> {COUPLE.b}
        </p>
        <p className="intro__sub">are getting married in the country</p>
      </div>
      <button type="button" className="intro__skip" onClick={finish}>
        Open the invitation
      </button>
    </div>
  )
}

export function Hero({ ready }) {
  const photo = useRef(null)
  const hero = useRef(null)

  useScrollFrame(() => {
    const el = hero.current
    const img = photo.current
    if (!el || !img) return
    const p = clamp(-el.getBoundingClientRect().top / el.offsetHeight, 0, 1)
    img.style.transform = `translate3d(0, ${(p * 14).toFixed(2)}%, 0) scale(${(1.08 - p * 0.04).toFixed(4)})`
  })

  return (
    <header className={`hero ${ready ? 'is-ready' : ''}`} ref={hero} id="top">
      <p className="hero__eyebrow">
        <span>Together with their families</span>
      </p>

      <h1 className="hero__names" aria-label={`${COUPLE.a} and ${COUPLE.b}`}>
        <span className="hero__name">
          {COUPLE.a.split('').map((c, i) => (
            <span key={i} style={{ '--i': i }} aria-hidden="true">
              {c}
            </span>
          ))}
        </span>
        <span className="hero__amp" aria-hidden="true">&amp;</span>
        <span className="hero__name">
          {COUPLE.b.split('').map((c, i) => (
            <span key={i} style={{ '--i': i + 6 }} aria-hidden="true">
              {c}
            </span>
          ))}
        </span>
      </h1>

      <p className="hero__line">request the pleasure of your company as they marry</p>

      <figure className="hero__arch">
        <div className="hero__arch-clip">
          <img ref={photo} src="./photos/hero.jpg" alt={`${COUPLE.a} and ${COUPLE.b}, laughing together`} fetchpriority="high" />
        </div>
        <svg className="hero__arch-rule" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true">
          <path d="M2 138 V 50 A 48 48 0 0 1 98 50 V 138 Z" pathLength="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <Sprig className="hero__sprig" />
      </figure>

      <div className="hero__date">
        <span>Saturday</span>
        <strong>
          June <b>5</b> 2027
        </strong>
        <span>half past four</span>
      </div>
      <p className="hero__place">
        {VENUE.name} · Bedford, New York
      </p>

      <a href="#note" className="hero__follow">
        <span>Follow the lane</span>
        <svg viewBox="0 0 20 60" aria-hidden="true">
          <path d="M10 2 C 2 18, 18 30, 10 46 M4 40 L 10 48 L 16 40" />
        </svg>
      </a>
      <Grass className="hero__grass" blades={90} />
      <Dandelion />
    </header>
  )
}

export function Note() {
  const ref = useReveal()
  const t = useCountdown(WEDDING_DATE)
  return (
    <section className="note section" id="note" ref={ref} aria-labelledby="note-title">
      <div className="note__paper">
        <span className="tape tape--l" aria-hidden="true" />
        <h2 id="note-title" className="visually-hidden">
          A note from us
        </h2>
        <p className="note__hand">
          <span style={{ '--d': 0 }}>Dear friends,</span>
          <span style={{ '--d': 1 }}>we found the quietest corner of the</span>
          <span style={{ '--d': 2 }}>world we know — an old farm at the</span>
          <span style={{ '--d': 3 }}>end of a long lane — and we would</span>
          <span style={{ '--d': 4 }}>love nothing more than to see you</span>
          <span style={{ '--d': 5 }}>walk up it. Bring comfortable shoes</span>
          <span style={{ '--d': 6 }}>and an appetite. We'll do the rest.</span>
        </p>
        <p className="note__sign" style={{ '--d': 7 }}>
          with love, B &amp; R
        </p>
        <Sprig className="note__sprig" flip />
      </div>

      <div className="tag" aria-live="polite">
        <span className="tag__string" aria-hidden="true" />
        <span className="tag__body">
          {t.done ? (
            <span className="tag__big">Today's the day</span>
          ) : (
            <>
              <span className="tag__big">{t.days}</span>
              <span className="tag__small">
                days, {t.hours} hrs &amp; {t.minutes} min
                <br />
                until we say “I do”
              </span>
            </>
          )}
        </span>
      </div>
    </section>
  )
}

/** Tap the dandelion to make a wish: its seeds lift off and drift across the whole screen, then it regrows. */
function Dandelion() {
  const [blown, setBlown] = useState(false)
  const [seeds, setSeeds] = useState([])
  const head = useRef(null)
  const [wished, setWished] = useState(false)

  const blow = () => {
    if (blown) return
    const r = head.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const reduce = prefersReducedMotion()
    const list = Array.from({ length: reduce ? 0 : 34 }, (_, i) => {
      const a = -Math.PI / 2 + (Math.random() - 0.35) * 1.9
      const dist = 220 + Math.random() * 520
      return {
        id: `${Date.now()}-${i}`,
        x: cx + (Math.random() - 0.5) * 30,
        y: cy + (Math.random() - 0.5) * 30,
        dx: Math.cos(a) * dist + 120,
        dy: Math.sin(a) * dist - 80,
        r: (Math.random() - 0.5) * 300,
        dur: 3.8 + Math.random() * 3,
        delay: Math.random() * 0.5,
        s: 0.7 + Math.random() * 0.6,
      }
    })
    setSeeds(list)
    setBlown(true)
    setWished(true)
    if (navigator.vibrate) navigator.vibrate(12)
    setTimeout(() => setSeeds([]), 8000)
    setTimeout(() => setBlown(false), 6500)
  }

  const rays = Array.from({ length: 28 }, (_, i) => (i / 28) * Math.PI * 2)
  return (
    <>
      <button type="button" className={`dandelion ${blown ? 'is-blown' : ''}`} onClick={blow} aria-label="Make a wish: blow the dandelion">
        <svg viewBox="0 0 80 160" aria-hidden="true">
          <path d="M40 158 C 42 120, 34 90, 40 46" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M40 130 c -12 -4 -18 -14 -18 -24 c 10 4 16 12 18 24 z" fill="currentColor" opacity=".55" />
          <g ref={head} className="dandelion__head" transform="translate(40 38)">
            {rays.map((a, i) => (
              <g key={i} style={{ transitionDelay: `${(i % 7) * 30}ms` }}>
                <line x1="0" y1="0" x2={Math.cos(a) * 20} y2={Math.sin(a) * 20} />
                <circle cx={Math.cos(a) * 22} cy={Math.sin(a) * 22} r="2.2" />
              </g>
            ))}
            <circle r="3.2" className="dandelion__core" />
          </g>
        </svg>
      </button>
      <p className={`dandelion__hint ${wished ? 'is-wished' : ''}`} aria-live="polite">
        {wished ? 'your wish is on its way ✦' : 'make a wish — tap the dandelion'}
      </p>
      <div className="seeds" aria-hidden="true">
        {seeds.map((s) => (
          <span
            key={s.id}
            className="seed"
            style={{ left: s.x, top: s.y, '--dx': `${s.dx}px`, '--dy': `${s.dy}px`, '--r': `${s.r}deg`, '--s': s.s, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
          >
            <svg viewBox="0 0 20 30">
              <path d="M10 30 V 10 M10 10 L 2 2 M10 10 L 6 0 M10 10 L 10 0 M10 10 L 14 0 M10 10 L 18 2 M10 10 L 0 7 M10 10 L 20 7" />
            </svg>
          </span>
        ))}
      </div>
    </>
  )
}
