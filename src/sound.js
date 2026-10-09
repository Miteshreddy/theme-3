/*
 * Countryside soundscape, synthesized with Web Audio — no audio files.
 * A slow music-box tune over a warm drone, a breath of wind, birdsong in the
 * day and crickets at night, plus small sounds for taps (paper, plucks, chimes).
 * Nothing plays until the guest opts in with a tap (browsers require a gesture).
 */

const KEY = 'hollow-oak-sound'
const listeners = new Set()

let ctx = null
let master = null
let music = null // gain for the ambient bed
let sfx = null
let echo = null
let on = false
let timers = []
let night = false

const PENTA = [0, 2, 4, 7, 9] // major pentatonic
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12)

function init() {
  if (ctx) return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  // simple feedback delay for a soft "barn reverb"
  echo = ctx.createDelay(1)
  echo.delayTime.value = 0.32
  const fb = ctx.createGain()
  fb.gain.value = 0.32
  const tone = ctx.createBiquadFilter()
  tone.type = 'lowpass'
  tone.frequency.value = 2200
  echo.connect(tone).connect(fb).connect(echo)
  tone.connect(master)

  music = ctx.createGain()
  music.gain.value = 0.55
  music.connect(master)
  music.connect(echo)
  sfx = ctx.createGain()
  sfx.gain.value = 0.8
  sfx.connect(master)
  sfx.connect(echo)
}

function noiseBuffer(sec = 2) {
  const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate)
  const d = b.getChannelData(0)
  let last = 0
  for (let i = 0; i < d.length; i++) {
    // brown-ish noise: softer, more like wind than hiss
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    d[i] = last * 3.5
  }
  return b
}

function note(freq, t, { dur = 1.6, vol = 0.12, type = 'sine', out = music } = {}) {
  const o = ctx.createOscillator()
  const o2 = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.value = freq
  o2.type = 'sine'
  o2.frequency.value = freq * 2.01 // bell-like partial
  const g2 = ctx.createGain()
  g2.gain.value = 0.18
  o2.connect(g2).connect(g)
  o.connect(g).connect(out)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(vol, t + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.start(t)
  o2.start(t)
  o.stop(t + dur + 0.05)
  o2.stop(t + dur + 0.05)
}

/* --- the ambient bed --------------------------------------------------- */

function startDrone() {
  const g = ctx.createGain()
  g.gain.value = 0.035
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 700
  ;[48, 55, 60].forEach((m, i) => {
    const o = ctx.createOscillator()
    o.type = 'triangle'
    o.frequency.value = midi(m)
    o.detune.value = i * 4 - 4
    o.connect(lp)
    o.start()
    timers.push({ stop: () => o.stop() })
  })
  lp.connect(g).connect(music)

  // wind: filtered noise with a slowly wandering filter
  const n = ctx.createBufferSource()
  n.buffer = noiseBuffer(4)
  n.loop = true
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 500
  bp.Q.value = 0.6
  const wg = ctx.createGain()
  wg.gain.value = 0.05
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.07
  const lfoG = ctx.createGain()
  lfoG.gain.value = 260
  lfo.connect(lfoG).connect(bp.frequency)
  n.connect(bp).connect(wg).connect(music)
  n.start()
  lfo.start()
  timers.push({ stop: () => (n.stop(), lfo.stop()) })
}

// a lilting folk phrase in C pentatonic, gently varied each pass
const TUNE = [72, 76, 79, 81, 79, 76, 74, 72, 74, 76, 79, 76, 72, 69, 72, null]
function loopTune() {
  let step = 0
  const tick = () => {
    if (!on) return
    const t = ctx.currentTime + 0.05
    let m = TUNE[step % TUNE.length]
    if (m && Math.random() < 0.18) m += Math.random() < 0.5 ? 2 : -3
    if (m) note(midi(night ? m - 12 : m), t, { dur: 2.2, vol: 0.05 })
    if (step % 8 === 0) note(midi((step % 16 ? 57 : 53) - (night ? 12 : 0)), t, { dur: 3.6, vol: 0.04, type: 'triangle' })
    step++
    timers.push(setTimeout(tick, 620))
  }
  tick()
}

function bird() {
  if (!on) return
  if (!night) {
    const t = ctx.currentTime + 0.02
    const base = 2600 + Math.random() * 1400
    const chirps = 2 + Math.floor(Math.random() * 4)
    for (let i = 0; i < chirps; i++) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      const s = t + i * (0.11 + Math.random() * 0.05)
      o.frequency.setValueAtTime(base, s)
      o.frequency.exponentialRampToValueAtTime(base * (1.3 + Math.random() * 0.4), s + 0.05)
      o.frequency.exponentialRampToValueAtTime(base * 0.9, s + 0.09)
      g.gain.setValueAtTime(0, s)
      g.gain.linearRampToValueAtTime(0.02, s + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, s + 0.1)
      o.connect(g).connect(music)
      o.start(s)
      o.stop(s + 0.12)
    }
  } else {
    // crickets
    const t = ctx.currentTime + 0.02
    for (let i = 0; i < 6; i++) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      const s = t + i * 0.06
      o.frequency.value = 4400
      g.gain.setValueAtTime(0, s)
      g.gain.linearRampToValueAtTime(0.008, s + 0.01)
      g.gain.linearRampToValueAtTime(0, s + 0.04)
      o.connect(g).connect(music)
      o.start(s)
      o.stop(s + 0.05)
    }
  }
  timers.push(setTimeout(bird, (night ? 1200 : 3000) + Math.random() * 5000))
}

/* --- public api ------------------------------------------------------- */

function emit() {
  listeners.forEach((fn) => fn(on))
}

export const sound = {
  get on() {
    return on
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  /** Must be called from a user gesture. */
  enable() {
    init()
    if (!ctx || on) return
    ctx.resume?.()
    on = true
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 2.5)
    startDrone()
    loopTune()
    timers.push(setTimeout(bird, 1500))
    emit()
  },
  disable() {
    if (!ctx || !on) return
    on = false
    try {
      localStorage.setItem(KEY, '0')
    } catch {
      /* ignore */
    }
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
    const old = timers
    timers = []
    setTimeout(() => old.forEach((t) => (typeof t === 'number' ? clearTimeout(t) : t.stop?.())), 700)
    emit()
  },
  toggle() {
    on ? sound.disable() : sound.enable()
  },
  /** Whether the guest turned sound off last visit. */
  get declined() {
    try {
      return localStorage.getItem(KEY) === '0'
    } catch {
      return false
    }
  },
  setNight(v) {
    night = v
  },

  /* interaction moments — silent unless sound is on */
  pluck(i = 0) {
    if (!on) return
    note(midi(67 + PENTA[i % 5] + (i > 4 ? 12 : 0)), ctx.currentTime, { dur: 1.2, vol: 0.12, type: 'triangle', out: sfx })
  },
  tick() {
    if (!on) return
    note(midi(84), ctx.currentTime, { dur: 0.25, vol: 0.05, out: sfx })
  },
  chime() {
    if (!on) return
    const t = ctx.currentTime
    ;[79, 84, 88].forEach((m, k) => note(midi(m + Math.floor(Math.random() * 2) * 2), t + k * 0.09, { dur: 2.6, vol: 0.07, out: sfx }))
  },
  /** paper rustle: page turns and seed packets */
  flip() {
    if (!on) return
    const t = ctx.currentTime
    const n = ctx.createBufferSource()
    n.buffer = noiseBuffer(0.4)
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 1800
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.5, t + 0.03)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32)
    n.connect(hp).connect(g).connect(sfx)
    n.start(t)
  },
  /** dandelion seeds: a soft breath and a rising sparkle */
  whoosh() {
    if (!on) return
    const t = ctx.currentTime
    const n = ctx.createBufferSource()
    n.buffer = noiseBuffer(1.5)
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.setValueAtTime(400, t)
    bp.frequency.exponentialRampToValueAtTime(2400, t + 1.2)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.6, t + 0.15)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)
    n.connect(bp).connect(g).connect(sfx)
    n.start(t)
    ;[72, 76, 79, 84, 88].forEach((m, k) => note(midi(m), t + 0.2 + k * 0.12, { dur: 1.4, vol: 0.05, out: sfx }))
  },
}
