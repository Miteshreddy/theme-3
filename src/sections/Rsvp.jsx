import React, { useEffect, useRef, useState } from 'react'
import { downloadCalendar, storage, useRevealAll } from '../lib.js'
import { sound } from '../sound.js'

const KEY = 'hollow-oak-rsvp'
const EMPTY = { name: '', email: '', attending: '', guests: 1, friday: false, sunday: false, dietary: '', song: '', message: '' }
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

export default function Rsvp() {
  const root = useRevealAll()
  const saved = storage.get(KEY, null)
  const [form, setForm] = useState(saved?.form || EMPTY)
  const [step, setStep] = useState(saved ? 'done' : 0)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const stage = useRef(null)
  const first = useRef(true)

  const set = (k) => (e) => {
    const v = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const steps = form.attending === 'no' ? ['you', 'reply', 'note'] : ['you', 'reply', 'party', 'note']
  const total = steps.length
  const current = typeof step === 'number' ? steps[step] : null

  // Bring the card back into view on step change (keeps mobile users oriented when the keyboard closes).
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const el = stage.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < 0 || r.top > window.innerHeight * 0.4) {
      window.scrollTo({ top: window.scrollY + r.top - 80, behavior: 'smooth' })
    }
    const focusable = el.querySelector('input, textarea, [data-autofocus]')
    if (focusable && current !== 'reply') focusable.focus({ preventScroll: true })
  }, [step])

  const validate = () => {
    const er = {}
    if (current === 'you') {
      if (form.name.trim().length < 2) er.name = 'Please tell us your name.'
      if (!emailOk(form.email)) er.email = 'A valid email, so we can send updates.'
    }
    if (current === 'reply' && !form.attending) er.attending = 'Please choose one.'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const next = () => {
    if (!validate()) return
    if (step < total - 1) setStep(step + 1)
    else submit()
  }
  const prev = () => step > 0 && setStep(step - 1)

  const submit = () => {
    setSending(true)
    setTimeout(() => {
      storage.set(KEY, { form, at: Date.now() })
      setSending(false)
      setStep('done')
      sound.chime()
    }, 900)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    next()
  }

  const choose = (v) => {
    setForm((f) => ({ ...f, attending: v }))
    setErrors({})
    setTimeout(() => setStep(2), 260)
  }

  const edit = () => {
    storage.remove(KEY)
    setStep(0)
  }

  const firstName = form.name.trim().split(/\s+/)[0] || 'friend'

  return (
    <section className="rsvp section" id="rsvp" ref={root} aria-labelledby="rsvp-title">
      <header className="section__head" data-reveal>
        <p className="kicker">Kindly reply by May 1, 2027</p>
        <h2 id="rsvp-title" className="display">
          Will you <em>join us?</em>
        </h2>
      </header>

      <div className="rsvp__card" ref={stage} data-reveal>
        {step === 'done' ? (
          <div className="rsvp__done">
            <div className={`stamp ${form.attending === 'no' ? 'stamp--soft' : ''}`} aria-hidden="true">
              <svg viewBox="0 0 120 120">
                <defs>
                  <path id="stamp-circle" d="M60 60 m -42 0 a 42 42 0 1 1 84 0 a 42 42 0 1 1 -84 0" />
                </defs>
                <circle cx="60" cy="60" r="54" />
                <circle cx="60" cy="60" r="32" />
                <text>
                  <textPath href="#stamp-circle" startOffset="0">
                    HOLLOW OAK FARM · JUNE 5 2027 · BEDFORD NY ·
                  </textPath>
                </text>
                <path d="M60 78 V 50 M60 62 c -7 -2 -11 -8 -11 -14 c 7 1 11 7 11 14 z M60 58 c 7 -2 11 -8 11 -14 c -7 1 -11 7 -11 14 z" />
              </svg>
            </div>
            {form.attending === 'no' ? (
              <>
                <h3 className="rsvp__done-title">We'll miss you, {firstName}.</h3>
                <p>Thank you for letting us know. We'll raise a glass in your direction at the long table.</p>
              </>
            ) : (
              <>
                <h3 className="rsvp__done-title">See you on the lane, {firstName}!</h3>
                <div className="planted" aria-label={`A sunflower planted for ${firstName} in our garden`}>
                  <svg viewBox="0 0 160 150" aria-hidden="true">
                    <path className="planted__soil" d="M10 140 C 50 128, 110 128, 150 140 V 150 H 10 Z" />
                    <path className="planted__stem" pathLength="1" d="M80 140 C 78 110, 84 80, 80 46" />
                    <path className="planted__leaf" d="M80 108 c -16 -2 -24 -12 -24 -20 c 12 0 22 8 24 20 z" />
                    <path className="planted__leaf planted__leaf--r" d="M81 92 c 14 -4 22 -14 20 -22 c -12 2 -20 10 -20 22 z" />
                    <g transform="translate(80 40)">
                    <g className="planted__head">
                      {Array.from({ length: 16 }, (_, k) => (
                        <ellipse key={k} cx="0" cy="-17" rx="4" ry="10" transform={`rotate(${k * 22.5})`} />
                      ))}
                      <circle r="10" className="planted__seed" />
                    </g>
                    </g>
                    <g className="planted__stake" transform="translate(112 112)">
                      <path d="M6 28 V 10" />
                      <rect x="-14" y="-3" width="42" height="15" rx="2" />
                      <text x="7" y="8" textAnchor="middle" className="planted__name">
                        {firstName.length > 9 ? firstName.slice(0, 8) + '…' : firstName}
                      </text>
                    </g>
                  </svg>
                  <p className="planted__note">We planted a sunflower for you. By June 5 it'll be taller than the fence.</p>
                </div>
                <p>
                  Your reply for {form.guests} {Number(form.guests) === 1 ? 'guest' : 'guests'} is pressed &amp; posted. A confirmation is on its way to{' '}
                  <span className="nowrap">{form.email}</span>.
                </p>
                <button type="button" className="btn btn--ink" onClick={downloadCalendar}>
                  Add to calendar
                </button>
              </>
            )}
            <button type="button" className="btn btn--text" onClick={edit}>
              Change my reply
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <div className="progress" aria-hidden="true">
              {steps.map((s, i) => (
                <span key={s} className={i <= step ? 'on' : ''} />
              ))}
            </div>
            <p className="rsvp__count">
              Step {step + 1} of {total}
            </p>

            <div className="rsvp__step" key={current}>
              {current === 'you' && (
                <>
                  <h3 className="rsvp__q">First, who are you?</h3>
                  <Field label="Full name" error={errors.name}>
                    <input type="text" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Jane Appleseed" enterKeyHint="next" />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="jane@example.com" enterKeyHint="next" />
                  </Field>
                </>
              )}

              {current === 'reply' && (
                <>
                  <h3 className="rsvp__q">Can you make it, {firstName}?</h3>
                  <div className="choices" role="radiogroup" aria-label="Attendance">
                    <button type="button" role="radio" aria-checked={form.attending === 'yes'} data-autofocus className={`choice ${form.attending === 'yes' ? 'is-on' : ''}`} onClick={() => choose('yes')}>
                      <span className="choice__mark">✓</span>
                      <span className="choice__title">Joyfully accepts</span>
                      <span className="choice__sub">I'll be on the lane</span>
                    </button>
                    <button type="button" role="radio" aria-checked={form.attending === 'no'} className={`choice ${form.attending === 'no' ? 'is-on' : ''}`} onClick={() => choose('no')}>
                      <span className="choice__mark">✕</span>
                      <span className="choice__title">Regretfully declines</span>
                      <span className="choice__sub">I'll be there in spirit</span>
                    </button>
                  </div>
                  {errors.attending && <p className="field__err">{errors.attending}</p>}
                </>
              )}

              {current === 'party' && (
                <>
                  <h3 className="rsvp__q">Wonderful. A few details.</h3>
                  <div className="field">
                    <span className="field__label">Guests in your party</span>
                    <div className="stepper">
                      <button type="button" aria-label="Fewer guests" onClick={() => set('guests')(Math.max(1, form.guests - 1))} disabled={form.guests <= 1}>
                        −
                      </button>
                      <output aria-live="polite">{form.guests}</output>
                      <button type="button" aria-label="More guests" onClick={() => set('guests')(Math.min(4, form.guests + 1))} disabled={form.guests >= 4}>
                        +
                      </button>
                    </div>
                  </div>
                  <div className="field">
                    <span className="field__label">Also joining us for</span>
                    <label className="check">
                      <input type="checkbox" checked={form.friday} onChange={set('friday')} />
                      <span>Friday welcome supper</span>
                    </label>
                    <label className="check">
                      <input type="checkbox" checked={form.sunday} onChange={set('sunday')} />
                      <span>Sunday farewell brunch</span>
                    </label>
                  </div>
                  <Field label="Allergies or dietary needs">
                    <input type="text" value={form.dietary} onChange={set('dietary')} placeholder="e.g. vegetarian, no nuts" />
                  </Field>
                  <Field label="A song that gets you dancing">
                    <input type="text" value={form.song} onChange={set('song')} placeholder="We'll pass it to the band" />
                  </Field>
                </>
              )}

              {current === 'note' && (
                <>
                  <h3 className="rsvp__q">Anything you'd like to tell us?</h3>
                  <Field label="A note for Blake & Ryan (optional)">
                    <textarea rows="4" value={form.message} onChange={set('message')} placeholder="Words of wisdom, a memory, a terrible joke…" />
                  </Field>
                </>
              )}
            </div>

            <div className="rsvp__nav">
              {step > 0 ? (
                <button type="button" className="btn btn--text" onClick={prev}>
                  ← Back
                </button>
              ) : (
                <span />
              )}
              {current !== 'reply' && (
                <button type="submit" className="btn btn--ink" disabled={sending}>
                  {sending ? 'Sending…' : step === total - 1 ? 'Send my reply' : 'Continue'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

function Field({ label, error, children }) {
  return (
    <label className={`field ${error ? 'has-err' : ''}`}>
      <span className="field__label">{label}</span>
      {children}
      {error && <span className="field__err">{error}</span>}
    </label>
  )
}
