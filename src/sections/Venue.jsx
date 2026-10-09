import React, { useState } from 'react'
import { VENUE } from '../data.js'
import { EstateMap } from '../Drawings.jsx'
import { useRevealAll } from '../lib.js'

const PINS = [
  { id: 'house', x: 50, y: 17, n: 1, title: 'The Farmhouse', text: 'Restrooms, a quiet room for little breaks, and the porch for Sunday brunch.' },
  { id: 'garden', x: 23.7, y: 18.7, n: 2, title: 'Walled Garden', text: 'Ceremony at 4:30 PM. Soft lawn: block heels or flats are your friends.' },
  { id: 'orchard', x: 68.7, y: 44, n: 3, title: 'The Orchard', text: 'Cocktails, cider and croquet from 5:15 PM.' },
  { id: 'table', x: 26, y: 58.6, n: 4, title: 'The Long Table', text: 'Dinner under string lights at 7:00 PM. Find your name on a pressed leaf.' },
  { id: 'barn', x: 75.7, y: 62.4, n: 5, title: 'The Old Barn', text: 'Dancing from 9:00 PM, and our rain plan for the ceremony.' },
  { id: 'gate', x: 50, y: 95.5, n: 6, title: 'The Gate', text: 'Shuttle drop-off and pick-up. Lemonade waiting from 3:30 PM.' },
]

export default function Venue() {
  const root = useRevealAll()
  const [open, setOpen] = useState(false)
  const [pin, setPin] = useState(null)
  const [copied, setCopied] = useState(false)
  const active = PINS.find((p) => p.id === pin)

  const copy = async () => {
    const text = `${VENUE.name}, ${VENUE.line1}, ${VENUE.line2}`
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        /* ignore */
      }
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const toggle = () => {
    setOpen((o) => !o)
    setPin(null)
  }

  return (
    <section className="venue section" id="venue" ref={root} aria-labelledby="venue-title">
      <header className="section__head" data-reveal>
        <p className="kicker">Chapter three · The place</p>
        <h2 id="venue-title" className="display">
          {VENUE.name.split(' ').slice(0, 2).join(' ')} <em>Farm</em>
        </h2>
        <address className="venue__addr">
          {VENUE.line1}
          <br />
          {VENUE.line2}
        </address>
      </header>

      <div data-reveal>
      <div className={`fold ${open ? 'is-open' : ''}`}>
        <div className="fold__sheet">
          <div className="fold__panel fold__panel--1">
            <div className="fold__slice" style={{ '--slice': 0 }}>
              <EstateMap />
            </div>
          </div>
          <div className="fold__panel fold__panel--2">
            <div className="fold__slice" style={{ '--slice': 1 }}>
              <EstateMap />
            </div>
            <div className="fold__back" />
          </div>
          <div className="fold__panel fold__panel--3">
            <div className="fold__slice" style={{ '--slice': 2 }}>
              <EstateMap />
            </div>
            <div className="fold__back" />
          </div>

          {open && (
            <div className="fold__pins">
              {PINS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`pin ${pin === p.id ? 'is-on' : ''}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%`, '--n': p.n }}
                  onClick={() => setPin(pin === p.id ? null : p.id)}
                  aria-label={p.title}
                  aria-expanded={pin === p.id}
                >
                  {p.n}
                </button>
              ))}
            </div>
          )}

          <button type="button" className="fold__cover" onClick={toggle} aria-expanded={open} aria-label="Unfold the estate map" tabIndex={open ? -1 : 0}>
            <span className="fold__cover-kicker">For our guests</span>
            <span className="fold__cover-title">
              A map of <em>the farm</em>
            </span>
            <svg viewBox="0 0 120 60" aria-hidden="true" className="fold__cover-art">
              <path d="M6 52 C 30 40, 50 46, 64 50 S 100 40, 114 44" />
              <path d="M70 48 V 28 L 84 18 L 98 28 V 46 M66 30 L 84 15 L 102 30" />
              <path d="M30 48 V 38 M22 38 c -6 -10 6 -18 10 -12 c 4 -8 16 -2 12 6 c 4 6 -6 12 -10 8 c -6 4 -14 0 -12 -2z" />
            </svg>
            <span className="fold__cover-cta">Tap to unfold</span>
          </button>
        </div>

        <div className={`pin-card ${active ? 'is-on' : ''} ${open ? '' : 'is-hidden'}`} aria-live="polite">
          {active ? (
            <>
              <span className="pin-card__n">{active.n}</span>
              <div>
                <strong>{active.title}</strong>
                <p>{active.text}</p>
              </div>
            </>
          ) : (
            open && <p className="pin-card__hint">Tap a number on the map to see what happens there.</p>
          )}
        </div>
      </div>
      </div>

      <div className="venue__actions" data-reveal>
        <a className="btn btn--ink" href={VENUE.maps} target="_blank" rel="noopener noreferrer">
          Get directions
        </a>
        <button type="button" className="btn btn--line" onClick={copy}>
          {copied ? 'Address copied ✓' : 'Copy address'}
        </button>
        {open && (
          <button type="button" className="btn btn--text" onClick={toggle}>
            Fold the map away
          </button>
        )}
      </div>
    </section>
  )
}
