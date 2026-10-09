import React, { useRef, useState } from 'react'
import { STOPS, WEEKEND } from '../data.js'
import { StopIcon } from '../Drawings.jsx'
import { clamp, useRevealAll, useScrollFrame } from '../lib.js'
import { sound } from '../sound.js'

/*
 * "The day, hour by hour" — a pinned landscape. Scrolling moves the sun across
 * the sky: afternoon → golden hour → sunset → dusk → night. Windows light up,
 * string lights glow over the long table, stars come out, sparklers end it.
 */

// [progress, zenith, mid-sky, horizon] — three stops so the sky is one continuous wash
const SKY = [
  [0.0, '#8fb4cc', '#bcd3dc', '#f3ead6'],
  [0.28, '#9fb3c4', '#e2c49c', '#f9dca8'],
  [0.48, '#7d6f95', '#d48d86', '#f6b071'],
  [0.64, '#343f69', '#7a6688', '#c98576'],
  [0.8, '#151c3a', '#2a3158', '#4a4569'],
  [1.0, '#0a0f22', '#151b38', '#262c4c'],
]

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => {
  const A = hex(a)
  const B = hex(b)
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`
}
const skyAt = (p) => {
  for (let i = 1; i < SKY.length; i++) {
    if (p <= SKY[i][0]) {
      const [p0, ...a] = SKY[i - 1]
      const [p1, ...b] = SKY[i]
      const t = (p - p0) / (p1 - p0)
      return a.map((c, k) => mix(c, b[k], t))
    }
  }
  return SKY[SKY.length - 1].slice(1).map((c) => mix(c, c, 0))
}
const ramp = (p, a, b) => clamp((p - a) / (b - a))

// Where each stop happens in the landscape (viewBox 400 × 800)
const SPOTS = [
  { x: 52, y: 742 }, // gate
  { x: 92, y: 610 }, // walled garden arch
  { x: 316, y: 640 }, // orchard
  { x: 200, y: 700 }, // long table
  { x: 318, y: 566 }, // barn
  { x: 150, y: 760 }, // the lane
]

const STARS = Array.from({ length: 70 }, (_, i) => {
  const r = Math.sin(i * 91.7) * 10000
  const r2 = Math.sin(i * 47.3) * 10000
  return { x: (r - Math.floor(r)) * 400, y: (r2 - Math.floor(r2)) * 470, s: 0.5 + ((i * 7) % 5) * 0.25, d: (i % 7) * 0.6 }
})

export default function DayScene() {
  const root = useRevealAll()
  const sec = useRef(null)
  const refs = useRef({})
  const [idx, setIdx] = useState(0)
  const r = (k) => (n) => (refs.current[k] = n)

  useScrollFrame(() => {
    const el = sec.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const p = clamp(-rect.top / Math.max(1, rect.height - vh))
    const R = refs.current
    const [top, mid, bottom] = skyAt(p)
    R.skyTop?.setAttribute('stop-color', top)
    R.skyMid?.setAttribute('stop-color', mid)
    R.skyBot?.setAttribute('stop-color', bottom)
    // the frame behind the svg carries the same sky, so wide screens never show a seam
    if (R.frame) R.frame.style.setProperty('--sky', `linear-gradient(${top}, ${mid} 45%, ${bottom})`)
    if (R.clouds) R.clouds.style.opacity = String(0.9 - ramp(p, 0.55, 0.85) * 0.75)
    if (R.flies) R.flies.style.opacity = String(ramp(p, 0.62, 0.8))

    // sun: arcs down and sets behind the hills around p ≈ 0.56
    const t = clamp(p / 0.58)
    const sx = 80 + t * 250
    const sy = 150 + t * t * 430
    if (R.sun) {
      R.sun.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)})`)
      R.sun.style.opacity = String(1 - ramp(p, 0.55, 0.62))
    }
    const night = ramp(p, 0.5, 0.86)
    const lamps = ramp(p, 0.46, 0.6)
    if (R.night) R.night.style.opacity = String(night * 0.62)
    if (R.stars) R.stars.style.opacity = String(ramp(p, 0.62, 0.9))
    if (R.moon) {
      R.moon.style.opacity = String(ramp(p, 0.66, 0.85))
      R.moon.setAttribute('transform', `translate(${336 - night * 12} ${470 - night * 50})`)
    }
    if (R.lamps) R.lamps.style.opacity = String(lamps)
    if (R.glow) R.glow.style.opacity = String(ramp(p, 0.18, 0.5) * (1 - ramp(p, 0.55, 0.7)))
    if (R.spark) R.spark.classList.toggle('is-on', p > 0.86)
    if (R.frame) {
      R.frame.style.setProperty('--p', p.toFixed(4))
      R.frame.style.setProperty('--lit', lamps.toFixed(3))
    }
    R.frame?.classList.toggle('is-night', p > 0.62)
    if (rect.top < vh && rect.bottom > 0) sound.setNight(p > 0.62)

    const i = Math.min(STOPS.length - 1, Math.floor(p * STOPS.length * 0.999))
    setIdx((prev) => (prev === i ? prev : i))
  })

  const stop = STOPS[idx]
  const spot = SPOTS[idx]

  return (
    <section className="day" id="road" ref={root} aria-labelledby="day-title" style={{ '--n': STOPS.length }}>
      <div className="day__track" ref={sec}>
      <div className="day__frame" ref={r('frame')}>
        <div className="day__scene">
          <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
            <defs>
              <linearGradient id="daySky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" ref={r('skyTop')} stopColor="#8fb4cc" />
                <stop offset="0.42" ref={r('skyMid')} stopColor="#bcd3dc" />
                <stop offset="0.74" ref={r('skyBot')} stopColor="#f3ead6" />
              </linearGradient>
              <radialGradient id="sunGlow">
                <stop offset="0" stopColor="#fff3cf" stopOpacity="0.95" />
                <stop offset="0.25" stopColor="#ffd59a" stopOpacity="0.55" />
                <stop offset="1" stopColor="#ffb070" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="nightFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0d1430" stopOpacity="0" />
                <stop offset="0.6" stopColor="#0d1430" stopOpacity="0.55" />
                <stop offset="1" stopColor="#0d1430" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="hazeFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f4b46c" stopOpacity="0" />
                <stop offset="0.55" stopColor="#f4b46c" stopOpacity="1" />
                <stop offset="1" stopColor="#f4b46c" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#b8c0a2" />
                <stop offset="0.3" stopColor="#a3ad8c" />
              </linearGradient>
              <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#97a47f" />
                <stop offset="0.3" stopColor="#84926c" />
              </linearGradient>
              <linearGradient id="meadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#869569" />
                <stop offset="0.5" stopColor="#6f7e55" />
                <stop offset="1" stopColor="#56643f" />
              </linearGradient>
              <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <radialGradient id="lampGlow">
                <stop offset="0" stopColor="#ffe3a3" stopOpacity="1" />
                <stop offset="1" stopColor="#ffb85c" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="400" height="800" fill="url(#daySky)" />
            <g ref={r('stars')} className="day__stars" style={{ opacity: 0 }}>
              {STARS.map((s, i) => (
                <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#fff8e6" style={{ animationDelay: `${s.d}s` }} />
              ))}
            </g>
            <g ref={r('moon')} style={{ opacity: 0 }}>
              <circle r="16" fill="#f6efd9" />
              <circle r="16" cx="7" cy="-4" fill="url(#daySky)" opacity="0.9" />
            </g>
            <g ref={r('sun')} transform="translate(80 150)">
              <circle r="90" fill="url(#sunGlow)" />
              <circle r="20" fill="#fff4d6" />
            </g>
            {/* golden haze */}
            <rect ref={r('glow')} y="220" width="400" height="480" fill="url(#hazeFade)" opacity="0" style={{ mixBlendMode: 'soft-light' }} />

            {/* drifting clouds */}
            <g ref={r('clouds')} className="day__clouds" filter="url(#soft)" fill="#fffaf0">
              <g className="cloud cloud--a">
                <ellipse cx="60" cy="260" rx="58" ry="12" />
                <ellipse cx="86" cy="252" rx="30" ry="12" />
              </g>
              <g className="cloud cloud--b">
                <ellipse cx="300" cy="330" rx="70" ry="10" />
                <ellipse cx="276" cy="322" rx="28" ry="10" />
              </g>
              <g className="cloud cloud--c">
                <ellipse cx="190" cy="420" rx="90" ry="8" opacity=".7" />
              </g>
            </g>

            {/* birds */}
            <g className="day__birds" fill="none" stroke="#2f2a22" strokeWidth="1.2" strokeLinecap="round">
              <path d="M0 0 q 5 -5 10 0 q 5 -5 10 0" />
              <path d="M26 -12 q 4 -4 8 0 q 4 -4 8 0" />
              <path d="M14 -22 q 3 -3 6 0 q 3 -3 6 0" />
            </g>

            {/* far hills */}
            <path d="M0 545 C 50 528, 110 520, 170 534 S 300 512, 400 524 V 800 H 0 Z" fill="#c3c8ad" opacity=".7" />
            <path d="M0 560 C 60 520, 120 515, 190 540 S 320 505, 400 530 V 800 H 0 Z" fill="url(#hillFar)" />
            {/* tree line on the ridge */}
            <g fill="#7f8d68" opacity=".8">
              {[12, 24, 140, 152, 162, 250, 262, 380, 392].map((x, i) => (
                <ellipse key={x} cx={x} cy={538 - (i % 3) * 4 - (x > 200 && x < 300 ? 14 : 0)} rx="7" ry="10" />
              ))}
            </g>
            <ellipse cx="200" cy="572" rx="260" ry="12" fill="#f4ecdc" opacity=".35" filter="url(#soft)" />
            <path d="M0 585 C 80 560, 150 575, 230 565 S 350 560, 400 575 V 800 H 0 Z" fill="url(#hillMid)" />
            {/* ploughed field rows */}
            <g stroke="#7a8862" strokeWidth="1" opacity=".55" fill="none">
              <path d="M236 574 C 280 570, 340 568, 400 580" />
              <path d="M236 582 C 280 578, 340 577, 400 588" />
              <path d="M236 590 C 280 587, 340 586, 400 596" />
            </g>

            {/* farmhouse */}
            <g transform="translate(170 506)">
              <path d="M0 64 V 26 L 30 4 L 60 26 V 64 Z" fill="#efe4cf" stroke="#2f2a22" strokeWidth="1.3" />
              <path d="M-6 30 L 30 0 L 66 30" fill="none" stroke="#2f2a22" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M44 14 V 2 h 8 v 18" fill="#efe4cf" stroke="#2f2a22" strokeWidth="1.2" />
              <g ref={r('lamps')} style={{ opacity: 0 }}>
                <circle cx="30" cy="40" r="34" fill="url(#lampGlow)" opacity="0.5" />
              </g>
              <rect x="10" y="34" width="10" height="10" className="win" />
              <rect x="40" y="34" width="10" height="10" className="win" />
              <rect x="25" y="48" width="10" height="16" className="win" />
            </g>

            {/* barn */}
            <g transform="translate(292 532)">
              <path d="M0 50 V 22 L 14 8 H 38 L 52 22 V 50 Z" fill="#a8604a" stroke="#2f2a22" strokeWidth="1.3" />
              <path d="M18 50 V 30 H 34 V 50" fill="#3a2a22" className="barn-door" />
              <path d="M18 30 L 34 50 M 34 30 L 18 50" stroke="#efe4cf" strokeWidth="1" />
            </g>

            {/* oak */}
            <g transform="translate(36 520)">
              <path d="M22 80 C 24 60, 22 50, 18 40" stroke="#2f2a22" strokeWidth="3" fill="none" />
              <path d="M0 34 C -10 30, -8 8, 8 8 C 8 -8, 30 -12, 36 2 C 52 -6, 66 12, 56 24 C 66 34, 50 50, 38 44 C 30 54, 6 52, 0 34 Z" fill="#5f6b4b" />
            </g>

            {/* walled garden arch */}
            <g transform="translate(76 590)">
              <path d="M0 36 V 14 a 16 16 0 0 1 32 0 V 36" fill="none" stroke="#2f2a22" strokeWidth="1.6" />
              <circle cx="4" cy="8" r="3" fill="#d79a8a" />
              <circle cx="16" cy="-2" r="3" fill="#f1e2c8" />
              <circle cx="28" cy="8" r="3" fill="#d79a8a" />
              <path d="M-14 36 H 46" stroke="#5f6b4b" strokeWidth="5" strokeLinecap="round" />
            </g>

            {/* meadow */}
            <path d="M0 620 C 90 600, 200 625, 400 605 V 800 H 0 Z" fill="url(#meadow)" />
            {/* split-rail fence along the meadow */}
            <g stroke="#6b5440" strokeWidth="1.4" strokeLinecap="round" fill="none">
              {[230, 248, 266, 284].map((x) => (
                <path key={x} d={`M${x} 616 V 600`} />
              ))}
              <path d="M226 604 L 288 601 M226 611 L 288 608" />
            </g>
            {/* hay bales */}
            {[[60, 672, 11], [84, 676, 9], [356, 712, 12]].map(([x, y, rr]) => (
              <g key={x} transform={`translate(${x} ${y})`}>
                <ellipse cx="2" cy={rr - 1} rx={rr + 2} ry="2.5" fill="#3f4a2e" opacity=".35" />
                <circle r={rr} fill="#d8b26a" />
                <path d={`M0 0 m -${rr * 0.6} 0 a ${rr * 0.6} ${rr * 0.6} 0 1 1 ${rr * 0.6} ${rr * 0.6} M0 0 m -${rr * 0.3} 0 a ${rr * 0.3} ${rr * 0.3} 0 1 1 ${rr * 0.3} ${rr * 0.3}`} fill="none" stroke="#a9853f" strokeWidth=".9" />
              </g>
            ))}

            {/* orchard */}
            {[[296, 628], [326, 620], [356, 632], [312, 650], [344, 654]].map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <path d="M0 14 V 4" stroke="#2f2a22" strokeWidth="1.6" />
                <circle cy="0" r="10" fill="#56643f" />
                <circle cx="-3" cy="-2" r="1.6" fill="#c25b44" />
                <circle cx="4" cy="2" r="1.6" fill="#c25b44" />
              </g>
            ))}

            {/* the lane */}
            <path d="M120 800 C 150 760, 210 740, 196 704 S 205 640, 200 572" fill="none" stroke="#e7d9bd" strokeWidth="14" strokeLinecap="round" opacity="0.9" />

            {/* long table + string lights */}
            <g transform="translate(140 676)">
              <path d="M0 18 H 120" stroke="#2f2a22" strokeWidth="3" strokeLinecap="round" />
              <path d="M8 18 V 34 M 112 18 V 34" stroke="#2f2a22" strokeWidth="2" />
              <path d="M0 16 H 120" stroke="#fbf8f1" strokeWidth="3" />
              <path d="M-6 -20 V 34 M126 -20 V 34" stroke="#2f2a22" strokeWidth="1.4" />
              <path d="M-6 -18 Q 30 0 60 -12 Q 90 0 126 -18" fill="none" stroke="#2f2a22" strokeWidth="0.8" />
              <g className="day__bulbs">
                {[4, 16, 28, 40, 52, 66, 80, 94, 108, 120].map((x, i) => {
                  const y = x < 60 ? -18 + (Math.sin((x + 6) / 66 * Math.PI) * 14) : -12 + (Math.sin((x - 60) / 66 * Math.PI) * 14) - 4
                  return <circle key={i} cx={x} cy={y + 2} r="2.4" style={{ animationDelay: `${i * 0.23}s` }} />
                })}
              </g>
            </g>

            {/* gate */}
            <g transform="translate(30 720)" stroke="#2f2a22" fill="none" strokeWidth="1.6" strokeLinecap="round">
              <path d="M0 40 V 4 M44 40 V 4 M0 6 Q 22 -8 44 6" />
              <path d="M8 40 V 12 M16 40 V 8 M22 40 V 6 M28 40 V 8 M36 40 V 12 M2 24 H 42" strokeWidth="1.1" />
            </g>

            {/* foreground grass silhouettes */}
            <path d="M0 800 V 770 q 6 -24 10 0 q 4 -30 9 0 q 5 -20 9 0 q 6 -34 10 0 q 4 -22 8 0 V 800 Z M340 800 V 772 q 6 -28 10 0 q 4 -20 9 0 q 5 -34 10 0 q 5 -22 9 0 q 6 -26 12 0 V 800 Z" fill="#4f5b3b" />

            {/* night tint over the land */}
            <rect ref={r('night')} y="0" width="400" height="800" fill="url(#nightFade)" style={{ opacity: 0, mixBlendMode: 'multiply' }} />

            {/* fireflies over the meadow after dark */}
            <g ref={r('flies')} className="day__flies" style={{ opacity: 0 }}>
              {Array.from({ length: 18 }, (_, i) => (
                <circle key={i} cx={(i * 53) % 400} cy={640 + ((i * 37) % 140)} r="1.6" style={{ animationDelay: `${-(i * 0.7)}s`, animationDuration: `${3 + (i % 4)}s` }} />
              ))}
            </g>

            {/* lights that must glow above the night tint */}
            <g className="day__lit" style={{ opacity: 'var(--lit, 0)' }}>
              <rect x="180" y="540" width="10" height="10" />
              <rect x="210" y="540" width="10" height="10" />
              <rect x="195" y="554" width="10" height="16" />
              <path d="M310 582 V 562 H 326 V 582 Z" />
            </g>
            <g className="day__bulbs day__bulbs--glow" transform="translate(140 676)" style={{ opacity: 'var(--lit, 0)' }}>
              {[4, 16, 28, 40, 52, 66, 80, 94, 108, 120].map((x, i) => {
                const y = x < 60 ? -18 + (Math.sin((x + 6) / 66 * Math.PI) * 14) : -12 + (Math.sin((x - 60) / 66 * Math.PI) * 14) - 4
                return <circle key={i} cx={x} cy={y + 2} r="2.6" style={{ animationDelay: `${i * 0.23}s` }} />
              })}
            </g>

            {/* sparklers along the lane */}
            <g ref={r('spark')} className="day__spark">
              {[[130, 772], [160, 756], [186, 736], [104, 786]].map(([x, y], i) => (
                <g key={i} transform={`translate(${x} ${y})`}>
                  {Array.from({ length: 10 }, (_, k) => (
                    <line key={k} x1="0" y1="0" x2={Math.cos((k / 10) * Math.PI * 2) * 9} y2={Math.sin((k / 10) * Math.PI * 2) * 9} style={{ animationDelay: `${(k % 4) * 0.12 + i * 0.2}s` }} />
                  ))}
                </g>
              ))}
            </g>

            {/* where we are now */}
            <g transform={`translate(${spot.x} ${spot.y})`} className="day__here" key={idx}>
              <circle r="16" />
              <circle r="5" className="dot" />
            </g>
          </svg>
        </div>

        <header className="day__head">
          <p className="kicker">Chapter two · Saturday, June 5</p>
          <h2 id="day-title" className="day__title">
            The day, <em>hour by hour</em>
          </h2>
        </header>

        <div className="day__clock" aria-hidden="true">
          <span key={stop.time}>{stop.time}</span>
        </div>

        <ol className="day__ticks" aria-hidden="true">
          {STOPS.map((s, i) => (
            <li key={s.title} className={i === idx ? 'on' : i < idx ? 'past' : ''} />
          ))}
        </ol>

        <article className="day__card" key={idx} aria-live="polite">
          <span className="day__icon">
            <StopIcon name={stop.icon} />
          </span>
          <div>
            <p className="stop__meta">
              <time>{stop.time}</time>
              <span>{stop.place}</span>
            </p>
            <h3 className="stop__title">{stop.title}</h3>
            <p className="stop__text">{stop.text}</p>
          </div>
        </article>

        <p className="day__hint" aria-hidden="true">
          keep scrolling — the sun is setting
        </p>
      </div>
      </div>

      {/* Accessible / no-JS version of the schedule */}
      <ol className="visually-hidden">
        {STOPS.map((s) => (
          <li key={s.title}>
            {s.time}, {s.place}: {s.title}. {s.text}
          </li>
        ))}
      </ol>

      <div className="weekend section" data-reveal>
        <p className="kicker kicker--center">The whole weekend</p>
        <div className="weekend__row" tabIndex={0} aria-label="Weekend events">
          {WEEKEND.map((w) => (
            <article key={w.day} className="weekend__card">
              <p className="weekend__day">{w.day}</p>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
