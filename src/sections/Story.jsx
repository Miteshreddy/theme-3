import React, { useRef, useState } from 'react'
import { STORY } from '../data.js'
import { Sprig } from '../Drawings.jsx'
import { useRevealAll } from '../lib.js'

/*
 * A ring-bound field journal. Each leaf flips up over the binding like a
 * notepad page. Tap or swipe to turn; the last page waits for June 5.
 */
const TAPE = [-4, 3, -2, 5, -3, 2]

export default function Story() {
  const root = useRevealAll()
  const [turned, setTurned] = useState(0)
  const start = useRef(null)
  const N = STORY.length

  const next = () => setTurned((t) => Math.min(N, t + 1))
  const prev = () => setTurned((t) => Math.max(0, t - 1))

  const onDown = (e) => {
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
  }
  const onUp = (e) => {
    const s = start.current
    start.current = null
    if (!s || s.id !== e.pointerId) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
      if (e.target.closest('button')) return
      next()
    } else if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : prev()
    }
  }

  return (
    <section className="story section" id="story" ref={root} aria-labelledby="story-title">
      <header className="section__head" data-reveal>
        <p className="kicker">Chapter one</p>
        <h2 id="story-title" className="display">
          Our field <em>journal</em>
        </h2>
        <p className="lede">Sixteen years, kept in one little book. Tap the page to turn it.</p>
      </header>

      <div className="journal-wrap" data-reveal>
        <div
          className="journal"
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => (start.current = null)}
          role="group"
          aria-roledescription="journal"
          aria-label={`Page ${Math.min(turned + 1, N + 1)} of ${N + 1}`}
        >
          <div className="journal__rings" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} />
            ))}
          </div>

          {/* the inside back cover, revealed after the last memory */}
          <div className="leaf leaf--end">
            <div className="leaf__end">
              <Sprig className="is-drawn" />
              <p className="leaf__end-kicker">Chapter seven</p>
              <p className="leaf__end-title">
                is still <em>unwritten</em>
              </p>
              <p className="leaf__end-text">We'd love for you to be in it — June 5, 2027.</p>
              <button type="button" className="btn btn--text" onClick={() => setTurned(0)}>
                ↺ Read it again
              </button>
            </div>
          </div>

          {STORY.map((s, i) => {
            const isTurned = i < turned
            const isTop = i === turned
            return (
              <article
                key={s.year}
                className={`leaf ${isTurned ? 'is-turned' : ''} ${isTop ? 'is-top' : ''}`}
                style={{ zIndex: N - i + 1, '--tilt': `${TAPE[i]}deg` }}
                aria-hidden={!isTop}
              >
                <div className="leaf__front">
                  <p className="leaf__no">
                    Page {String(i + 1).padStart(2, '0')}
                    <span>{s.year}</span>
                  </p>
                  <figure className="leaf__photo">
                    <span className="leaf__tape" aria-hidden="true" />
                    <img src={s.img} alt={isTop ? s.title : ''} draggable="false" loading={i < 2 ? 'eager' : 'lazy'} />
                  </figure>
                  <h3 className="leaf__title">{s.title}</h3>
                  <p className="leaf__note">{s.note}</p>
                  {i === 0 && <span className="leaf__corner" aria-hidden="true">tap to turn ↗</span>}
                </div>
                <div className="leaf__back" aria-hidden="true" />
              </article>
            )
          })}
        </div>

        <div className="deck__controls">
          <button type="button" className="round-btn" onClick={prev} disabled={turned === 0} aria-label="Previous page">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5 L 8 12 L 15 19" />
            </svg>
          </button>
          <div className="deck__dots" aria-hidden="true">
            {[...STORY, null].map((_, i) => (
              <span key={i} className={i === turned ? 'on' : ''} />
            ))}
          </div>
          <button type="button" className="round-btn" onClick={next} disabled={turned === N} aria-label="Next page">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5 L 16 12 L 9 19" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
