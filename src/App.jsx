import React, { useEffect, useRef, useState } from 'react'
import { Hero, Intro, Note } from './sections/Opening.jsx'
import Story from './sections/Story.jsx'
import DayScene from './sections/DayScene.jsx'
import Venue from './sections/Venue.jsx'
import { DressCode, FieldNotes, Registry } from './sections/Details.jsx'
import Rsvp from './sections/Rsvp.jsx'
import Closing from './sections/Closing.jsx'
import { clamp, useScrollFrame } from './lib.js'
import { Butterflies, Hedgerow } from './Drawings.jsx'
import { sound } from './sound.js'

export default function App() {
  const [ready, setReady] = useState(false)
  const thread = useRef(null)
  const [pill, setPill] = useState(false)

  useScrollFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? clamp(window.scrollY / max) : 0
    if (thread.current) thread.current.style.transform = `scaleX(${p})`

    const rsvp = document.getElementById('rsvp')
    const vh = window.innerHeight
    const day = document.querySelector('.day__track')?.getBoundingClientRect()
    const pinned = day && day.top <= 0 && day.bottom >= vh
    const show = window.scrollY > vh * 0.9 && !pinned && !!rsvp && rsvp.getBoundingClientRect().top > vh * 0.9
    setPill((s) => (s === show ? s : show))
  })

  return (
    <>
      <Intro onDone={() => setReady(true)} />
      <div className="thread" aria-hidden="true">
        <span ref={thread} />
      </div>
      <main>
        <Hero ready={ready} />
        <Note />
        <Hedgerow variant="fence" />
        <Story />
        <Hedgerow variant="sheep" />
        <DayScene />
        <Hedgerow variant="wheat" />
        <Venue />
        <Hedgerow variant="hens" />
        <FieldNotes />
        <Hedgerow variant="sunflowers" />
        <DressCode />
        <Hedgerow variant="cows" />
        <Registry />
        <Hedgerow variant="wheat" />
        <Rsvp />
        <Closing />
      </main>
      <Butterflies />
      <PetalTrail />
      <SoundToggle visible={ready} />
      <a href="#rsvp" className={`pill ${pill ? 'is-on' : ''}`} aria-hidden={!pill} tabIndex={pill ? 0 : -1}>
        <span className="pill__dot" />
        RSVP by May 1
      </a>
    </>
  )
}

function SoundToggle({ visible }) {
  const [on, setOn] = useState(sound.on)
  useEffect(() => sound.subscribe(setOn), [])
  return (
    <button
      type="button"
      className={`sound ${on ? 'is-on' : ''} ${visible ? 'is-visible' : ''}`}
      onClick={sound.toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn countryside sounds off' : 'Turn countryside sounds on'}
    >
      <span className="sound__bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="sound__label">{on ? '♪ on' : '♪ sound'}</span>
    </button>
  )
}

/** Wherever a finger or cursor wanders, a few meadow petals drift down behind it. */
function PetalTrail() {
  const layer = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const colors = ['#f1e2c8', '#d79a8a', '#e8b84a', '#f7f1e3', '#9db4c8']
    let last = 0
    let lx = 0
    let ly = 0
    let live = 0
    const drop = (x, y) => {
      if (!layer.current || live > 28) return
      const p = document.createElement('i')
      const c = colors[Math.floor(Math.random() * colors.length)]
      p.style.cssText = `left:${x}px;top:${y}px;background:${c};--dx:${(Math.random() - 0.5) * 60}px;--r:${Math.random() * 540 - 270}deg;animation-duration:${1.6 + Math.random()}s`
      layer.current.appendChild(p)
      live++
      p.addEventListener('animationend', () => {
        p.remove()
        live--
      })
    }
    const move = (e) => {
      const now = performance.now()
      if (now - last < 45) return
      if (Math.hypot(e.clientX - lx, e.clientY - ly) < 18) return
      last = now
      lx = e.clientX
      ly = e.clientY
      drop(e.clientX, e.clientY)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return <div className="petals" ref={layer} aria-hidden="true" />
}
