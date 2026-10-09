import React, { useState } from 'react'
import { NOTES, PALETTE, REGISTRY } from '../data.js'
import { Sprig } from '../Drawings.jsx'
import { useRevealAll } from '../lib.js'
import { sound } from '../sound.js'

export function FieldNotes() {
  const root = useRevealAll()
  const [active, setActive] = useState(NOTES[0].id)
  const note = NOTES.find((n) => n.id === active)
  const idx = NOTES.indexOf(note)

  return (
    <section className="notes section" id="details" ref={root} aria-labelledby="notes-title">
      <header className="section__head" data-reveal>
        <p className="kicker">Chapter four · The practical bits</p>
        <h2 id="notes-title" className="display">
          Field <em>notes</em>
        </h2>
        <p className="lede">Everything you need to know, jotted down for you.</p>
      </header>

      <div className="notes__tabs" role="tablist" aria-label="Guest information" data-reveal>
        {NOTES.map((n) => (
          <button
            key={n.id}
            type="button"
            role="tab"
            id={`tab-${n.id}`}
            aria-selected={active === n.id}
            aria-controls="note-panel"
            className={`chip ${active === n.id ? 'is-on' : ''}`}
            onClick={() => {
              sound.tick()
              setActive(n.id)
            }}
          >
            {n.label}
          </button>
        ))}
      </div>

      <div className="notes__stage" data-reveal>
        <article key={note.id} className="notecard" role="tabpanel" id="note-panel" aria-labelledby={`tab-${note.id}`}>
          <span className="notecard__pin" aria-hidden="true" />
          <p className="notecard__no">
            No. {String(idx + 1).padStart(2, '0')} / {String(NOTES.length).padStart(2, '0')}
          </p>
          <h3 className="notecard__title">{note.title}</h3>
          {note.body.map((p, i) => (
            <p key={i} className="notecard__p">
              {p}
            </p>
          ))}
        </article>
      </div>
    </section>
  )
}

export function DressCode() {
  const root = useRevealAll()
  const [sw, setSw] = useState(0)
  const c = PALETTE[sw]
  return (
    <section className="dress section" id="attire" ref={root} aria-labelledby="dress-title">
      <header className="section__head" data-reveal>
        <p className="kicker">What to wear</p>
        <h2 id="dress-title" className="display">
          Garden <em>formal</em>
        </h2>
        <p className="lede">Linen, light suits and flowing dresses in the colors of the field. Tap a swatch to dye the washing.</p>
      </header>

      <div className="line" data-reveal style={{ '--fab': c.hex }}>
        <svg className="line__twine" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-10 8 Q 200 58 410 8" />
        </svg>

        <figure className="hang hang--suit" style={{ '--sw': '-1.5deg', '--dl': '-1.2s' }}>
          <span className="peg" aria-hidden="true" />
          <svg viewBox="0 0 140 190" aria-label={`A linen suit jacket in ${c.name.toLowerCase()}`} role="img">
            <path className="cloth" d="M44 14 L62 8 L70 44 L78 8 L96 14 L126 34 L134 146 L114 148 L110 84 L108 182 L32 182 L30 84 L26 148 L6 146 L14 34 Z" />
            <path className="cloth-line" d="M62 8 L56 60 L70 96 L84 60 L78 8 M70 96 V 182 M30 84 L26 148 M110 84 L114 148" />
            <circle cx="74" cy="118" r="2.4" className="btn-dot" />
            <circle cx="74" cy="140" r="2.4" className="btn-dot" />
            <path className="cloth-line" d="M90 104 h 14" />
          </svg>
          <figcaption>for him</figcaption>
        </figure>

        <figure className="hang hang--photo" style={{ '--sw': '2deg', '--dl': '-0.4s' }}>
          <span className="peg" aria-hidden="true" />
          <div className="hang__polaroid">
            <img src="./photos/dress.jpg" alt="Blake in a pale mint gown and Ryan in a light grey check suit" loading="lazy" />
            <span>like this ✓</span>
          </div>
        </figure>

        <figure className="hang hang--dress" style={{ '--sw': '1.8deg', '--dl': '-2s' }}>
          <span className="peg" aria-hidden="true" />
          <svg viewBox="0 0 120 200" aria-label={`A flowing dress in ${c.name.toLowerCase()}`} role="img">
            <path className="cloth" d="M42 6 L46 6 L50 40 L70 40 L74 6 L78 6 L80 50 Q 82 62 76 70 L108 192 Q 60 202 12 192 L44 70 Q 38 62 40 50 Z" />
            <path className="cloth-line" d="M44 70 Q 60 76 76 70 M52 80 L 40 190 M68 80 L 80 190 M60 78 V 196" />
          </svg>
          <figcaption>for her</figcaption>
        </figure>
      </div>

      <p className="line__name" aria-live="polite">
        dyed in <em key={c.name}>{c.name}</em>
      </p>

      <div className="swatches" role="radiogroup" aria-label="Suggested colors" data-reveal>
        {PALETTE.map((p, i) => (
          <button
            key={p.name}
            type="button"
            role="radio"
            aria-checked={sw === i}
            aria-label={p.name}
            className={`swatch ${sw === i ? 'is-on' : ''}`}
            style={{ '--c': p.hex }}
            onClick={() => {
              sound.pluck(i)
              setSw(i)
            }}
          />
        ))}
      </div>

      <ul className="dress__tips">
        <li data-reveal>
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <path d="M8 28 h 18 l 6 -4 v -4 l -10 -6 l -4 6 h -10 z M26 28 v 4 h 4 v -6" />
          </svg>
          <div>
            <strong>Block heels or flats</strong>
            <span>Most of the evening is on grass.</span>
          </div>
        </li>
        <li data-reveal>
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <path d="M12 8 l 8 4 l 8 -4 l 6 8 l -5 3 v 14 h -18 v -14 l -5 -3 z" />
          </svg>
          <div>
            <strong>Bring a layer</strong>
            <span>It cools quickly once the sun drops behind the hill.</span>
          </div>
        </li>
        <li data-reveal>
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="12" />
            <path d="M11.5 11.5 L 28.5 28.5" />
          </svg>
          <div>
            <strong>Skip white &amp; ivory</strong>
            <span>We'll leave that one to the bride.</span>
          </div>
        </li>
      </ul>
    </section>
  )
}

export function Registry() {
  const root = useRevealAll()
  const [flipped, setFlipped] = useState({})
  const toggle = (id) => {
    sound.flip()
    setFlipped((f) => ({ ...f, [id]: !f[id] }))
  }

  return (
    <section className="registry section" id="registry" ref={root} aria-labelledby="registry-title">
      <header className="section__head" data-reveal>
        <p className="kicker">Gifts</p>
        <h2 id="registry-title" className="display">
          Seeds <em>for later</em>
        </h2>
        <p className="lede">
          Your company is truly the gift. If you would like to give something more, we have planted a few ideas.
        </p>
      </header>

      <p className="packets__hint" data-reveal>
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path d="M16 22 V 8 a 3 3 0 0 1 6 0 v 10 l 7 2 a 4 4 0 0 1 3 5 l -2 9 H 18 l -7 -9 a 3 3 0 0 1 5 -4 z" />
        </svg>
        Tap a packet to flip it over ↻
      </p>

      <div className="packets" data-reveal>
        {REGISTRY.map((r, i) => (
          <div key={r.id} className={`packet ${flipped[r.id] ? 'is-flipped' : ''}`} style={{ '--tint': r.tint }}>
            <div className="packet__inner">
              <button type="button" className="packet__face packet__front" onClick={() => toggle(r.id)} aria-label={`${r.title}: turn over`} tabIndex={flipped[r.id] ? -1 : 0}>
                <span className="packet__brand">Hollow Oak Seed Co.</span>
                <span className="packet__art">
                  <Sprig flip={i % 2 === 1} />
                </span>
                <span className="packet__seed">{r.seed}</span>
                <span className="packet__meta">
                  Lot No. 0{i + 1} · Sow summer 2027
                </span>
                <span className="packet__flip" aria-hidden="true">
                  tap to flip ↻
                </span>
              </button>
              <div className="packet__face packet__back" aria-hidden={!flipped[r.id]}>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
                <a className="btn btn--ink btn--sm" href={r.href} target="_blank" rel="noopener noreferrer" tabIndex={flipped[r.id] ? 0 : -1}>
                  {r.cta}
                </a>
                <button type="button" className="packet__turn" onClick={() => toggle(r.id)} tabIndex={flipped[r.id] ? 0 : -1}>
                  turn back ↺
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
