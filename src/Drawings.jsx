import React, { useMemo } from 'react'

/* Every drawing is a single-weight ink line in currentColor, so it can be tinted from CSS. */

const ink = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' }

export function Sprig({ className = '', flip = false }) {
  return (
    <svg className={`sprig ${className}`} viewBox="0 0 120 60" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <g {...ink} strokeWidth="1.2">
        <path pathLength="1" d="M4 52 C 30 44, 62 30, 116 8" />
        <path pathLength="1" d="M24 46 c -2 -10 4 -16 12 -18 c 0 9 -5 15 -12 18z" />
        <path pathLength="1" d="M30 44 c 8 4 16 4 22 -2 c -8 -5 -16 -4 -22 2z" />
        <path pathLength="1" d="M52 36 c -1 -10 5 -16 13 -18 c 0 9 -6 15 -13 18z" />
        <path pathLength="1" d="M58 33 c 8 4 16 3 22 -3 c -8 -5 -16 -3 -22 3z" />
        <path pathLength="1" d="M80 25 c -1 -9 5 -15 12 -16 c 0 8 -5 13 -12 16z" />
        <path pathLength="1" d="M86 22 c 7 3 14 2 19 -3 c -7 -4 -14 -3 -19 3z" />
      </g>
    </svg>
  )
}

/** Swaying field grass. Deterministic blade layout so it doesn't jump between renders. */
export function Grass({ className = '', blades = 64, height = 90 }) {
  const paths = useMemo(() => {
    let seed = 7
    const rnd = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }
    const out = []
    for (let i = 0; i < blades; i++) {
      const x = (i / blades) * 400 + rnd() * 6
      const h = height * (0.35 + rnd() * 0.65)
      const lean = (rnd() - 0.5) * 26
      const top = 100 - h
      const d = `M${x.toFixed(1)} 100 Q ${(x + lean * 0.3).toFixed(1)} ${(100 - h * 0.55).toFixed(1)} ${(x + lean).toFixed(1)} ${top.toFixed(1)}`
      const seedHead = rnd() > 0.82
      out.push({ d, seedHead, tip: [x + lean, top], dur: 3.6 + rnd() * 2.6, delay: -rnd() * 5 })
    }
    return out
  }, [blades, height])

  return (
    <svg className={`grass ${className}`} viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
      <g {...ink} strokeWidth="1">
        {paths.map((p, i) => (
          <g key={i} className="blade" style={{ animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}>
            <path d={p.d} vectorEffect="non-scaling-stroke" />
            {p.seedHead && <ellipse cx={p.tip[0]} cy={p.tip[1] + 2} rx="1.3" ry="3.4" vectorEffect="non-scaling-stroke" />}
          </g>
        ))}
      </g>
    </svg>
  )
}

/** Line drawing used in the opening — hills, an oak, the farmhouse. Draws itself in. */
export function FarmScene({ className = '' }) {
  return (
    <svg className={`farm-scene ${className}`} viewBox="0 0 320 170" aria-hidden="true">
      <g {...ink} strokeWidth="1.3">
        {/* hills */}
        <path pathLength="1" d="M2 140 C 60 112, 110 118, 160 132 S 260 118, 318 128" />
        <path pathLength="1" d="M2 156 C 80 140, 170 150, 318 146" />
        {/* farmhouse */}
        <path pathLength="1" d="M178 132 V 96 L 206 74 L 234 96 V 130" />
        <path pathLength="1" d="M172 100 L 206 70 L 240 100" />
        <path pathLength="1" d="M222 84 V 70 h 8 v 20" />
        <path pathLength="1" d="M200 132 V 112 h 12 v 18" />
        <path pathLength="1" d="M184 104 h 10 v 10 h -10 z M218 104 h 10 v 10 h -10 z" />
        {/* oak */}
        <path pathLength="1" d="M96 128 C 98 112, 96 104, 92 96 M96 116 C 100 108, 106 104, 112 102" />
        <path pathLength="1" d="M70 94 C 58 92, 56 74, 70 70 C 68 56, 86 48, 96 56 C 104 44, 126 48, 124 64 C 138 66, 138 86, 124 90 C 120 100, 100 102, 92 96 C 84 102, 70 100, 70 94 Z" />
        {/* fence */}
        <path pathLength="1" d="M248 134 V 120 M262 133 V 119 M276 132 V 118 M290 131 V 117 M244 124 H 296 M244 129 H 296" />
        {/* birds */}
        <path pathLength="1" d="M140 40 q 5 -5 10 0 q 5 -5 10 0 M168 28 q 4 -4 8 0 q 4 -4 8 0" />
      </g>
    </svg>
  )
}

export function StopIcon({ name }) {
  const common = { ...ink, strokeWidth: 1.4 }
  const icons = {
    gate: (
      <g {...common}>
        <path d="M6 30 V 10 M34 30 V 10 M6 12 Q 20 2 34 12" />
        <path d="M10 30 V 16 M15 30 V 13 M20 30 V 12 M25 30 V 13 M30 30 V 16 M8 22 H 32" />
      </g>
    ),
    arch: (
      <g {...common}>
        <path d="M8 32 V 16 a 12 12 0 0 1 24 0 V 32" />
        <circle cx="11" cy="12" r="2" />
        <circle cx="20" cy="5" r="2" />
        <circle cx="29" cy="12" r="2" />
        <path d="M15 32 v -6 M25 32 v -6" />
      </g>
    ),
    glass: (
      <g {...common}>
        <path d="M9 6 h 10 l -1 9 a 4 4 0 0 1 -8 0 z M14 19 v 10 M10 30 h 8" />
        <path d="M23 8 h 10 l -1 9 a 4 4 0 0 1 -8 0 z M28 21 v 9 M24 31 h 8" />
      </g>
    ),
    table: (
      <g {...common}>
        <path d="M3 20 H 37 M7 20 V 32 M33 20 V 32" />
        <path d="M12 20 V 13 M12 13 q -1 -3 0 -4 q 1 1 0 4 M20 20 V 11 M20 11 q -1 -3 0 -4 q 1 1 0 4 M28 20 V 13 M28 13 q -1 -3 0 -4 q 1 1 0 4" />
      </g>
    ),
    barn: (
      <g {...common}>
        <path d="M5 32 V 16 L 12 7 H 28 L 35 16 V 32 Z" />
        <path d="M14 32 V 20 H 26 V 32 M14 20 L 26 32 M26 20 L 14 32" />
        <path d="M17 12 h 6 v 4 h -6 z" />
      </g>
    ),
    spark: (
      <g {...common}>
        <path d="M20 4 V 14 M20 26 V 36 M4 20 H 14 M26 20 H 36 M9 9 L 15 15 M25 25 L 31 31 M31 9 L 25 15 M15 25 L 9 31" />
      </g>
    ),
  }
  return (
    <svg viewBox="0 0 40 36" className="stop-icon" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

/** Hand-drawn estate map. viewBox 300 × 450 — split into three folds of 150. */
export function EstateMap() {
  const trees = [
    [30, 40], [52, 28], [250, 50], [272, 70], [258, 112], [24, 212], [40, 236], [270, 300], [252, 330], [20, 380], [44, 404], [280, 410],
  ]
  const orchard = []
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) orchard.push([176 + c * 20, 186 + r * 18])
  return (
    <svg viewBox="0 0 300 450" className="estate-map" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <g {...ink} strokeWidth="1.1">
        {/* creek */}
        <path d="M0 140 C 40 150, 60 120, 100 128 S 150 160, 190 150" strokeDasharray="1 0" opacity=".55" />
        <path d="M0 146 C 40 156, 60 126, 100 134 S 150 166, 190 156" opacity=".35" />
        {/* lane from gate up to the house */}
        <path d="M150 450 C 150 410, 118 390, 124 350 S 170 300, 160 262 S 128 200, 140 150 S 150 110, 150 96" strokeWidth="9" stroke="#e7dcc6" />
        <path d="M150 450 C 150 410, 118 390, 124 350 S 170 300, 160 262 S 128 200, 140 150 S 150 110, 150 96" strokeDasharray="3 5" />
        {/* farmhouse */}
        <path d="M122 96 V 62 H 178 V 96 Z M122 62 L 150 44 L 178 62" />
        <path d="M144 96 v -12 h 12 v 12" />
        {/* walled garden */}
        <rect x="40" y="56" width="62" height="56" rx="2" />
        <rect x="46" y="62" width="50" height="44" rx="2" strokeDasharray="2 3" />
        <path d="M71 62 V 106 M46 84 H 96" opacity=".6" />
        <circle cx="71" cy="84" r="5" />
        {/* orchard */}
        {orchard.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" />
        ))}
        {/* long table in meadow */}
        <path d="M44 262 H 112 M44 268 H 112" />
        {[50, 60, 70, 80, 90, 100, 106].map((x) => (
          <circle key={x} cx={x} cy="258" r="1.4" />
        ))}
        {[50, 60, 70, 80, 90, 100, 106].map((x) => (
          <circle key={`b${x}`} cx={x} cy="273" r="1.4" />
        ))}
        {/* string lights */}
        <path d="M40 248 q 18 10 36 0 q 18 10 40 0" strokeDasharray="1 4" />
        {/* barn */}
        <path d="M196 300 V 270 L 214 256 H 240 L 258 270 V 300 Z M214 300 V 282 H 240 V 300" />
        {/* parking meadow */}
        <rect x="186" y="384" width="80" height="44" rx="6" strokeDasharray="4 4" />
        <path d="M200 398 h 12 M222 398 h 12 M244 398 h 12 M200 412 h 12 M222 412 h 12" opacity=".6" />
        {/* gate */}
        <path d="M134 444 V 430 M166 444 V 430 M134 432 Q 150 424 166 432" />
        {/* trees */}
        {trees.map(([x, y], i) => (
          <path key={i} d={`M${x} ${y + 9} v 6 M${x - 8} ${y + 4} c -4 -10 6 -16 8 -12 c 2 -6 12 -4 10 4 c 6 2 2 12 -4 10 c -4 4 -12 2 -14 -2 z`} />
        ))}
        {/* compass */}
        <g transform="translate(270 22)">
          <circle r="11" opacity=".5" />
          <path d="M0 -15 L 3 0 L 0 15 L -3 0 Z" />
        </g>
      </g>
      <g className="map-labels">
        <text x="150" y="36" textAnchor="middle">The Farmhouse</text>
        <text x="71" y="50" textAnchor="middle">Walled Garden</text>
        <text x="206" y="240" textAnchor="middle">Orchard</text>
        <text x="78" y="292" textAnchor="middle">Long Table</text>
        <text x="227" y="316" textAnchor="middle">The Old Barn</text>
        <text x="226" y="378" textAnchor="middle">Parking</text>
        <text x="150" y="424" textAnchor="middle">Gate</text>
        <text x="60" y="168" textAnchor="middle" className="italic">Hollow Creek</text>
        <text x="270" y="46" textAnchor="middle">N</text>
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------------------------
 * Hedgerows — painted strips of countryside that stitch the sections together,
 * so the farm never leaves the page. Each variant is a different field edge.
 * ------------------------------------------------------------------------- */

const tuft = (x, h, lean = 0) => `M${x} 60 q ${lean * 0.4} ${-h * 0.6} ${lean} ${-h}`

function Flowers({ xs, colors }) {
  return xs.map((x, i) => {
    const h = 14 + ((x * 7) % 12)
    const c = colors[i % colors.length]
    return (
      <g key={x} className="hedge__flower" style={{ animationDelay: `${-(i % 5) * 0.7}s`, transformOrigin: `${x}px 60px` }}>
        <path d={`M${x} 60 V ${60 - h}`} stroke="#6f7e55" strokeWidth="1.1" />
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx={x} cy={60 - h - 3} rx="1.6" ry="3" fill={c} transform={`rotate(${a} ${x} ${60 - h})`} />
        ))}
        <circle cx={x} cy={60 - h} r="1.5" fill="#e8b84a" />
      </g>
    )
  })
}

function Sheep({ x, flip = false }) {
  return (
    <g className="hedge__sheep" transform={`translate(${x} 38) scale(${flip ? -1 : 1} 1)`}>
      <ellipse cx="0" cy="20" rx="13" ry="2" fill="#4f5b3b" opacity=".25" />
      <path d="M-7 12 v 7 M-3 12 v 7 M4 12 v 7 M8 12 v 7" stroke="#2f2a22" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M-11 6 c -3 -6 3 -11 7 -8 c 2 -4 9 -4 11 0 c 5 -1 8 5 4 9 c 1 5 -5 8 -9 6 c -3 3 -10 2 -11 -2 c -4 0 -5 -4 -2 -5 z" fill="#f7f1e3" stroke="#2f2a22" strokeWidth="1" />
      <g className="hedge__sheep-head">
        <ellipse cx="13" cy="4" rx="4" ry="5" fill="#3a332a" />
        <path d="M10 1 l -3 -2" stroke="#3a332a" strokeWidth="2" strokeLinecap="round" />
      </g>
    </g>
  )
}

function Hen({ x }) {
  return (
    <g className="hedge__hen" transform={`translate(${x} 44)`}>
      <path d="M-8 4 c 0 -8 10 -10 14 -4 l 4 -6 c 3 0 4 3 2 5 l -2 5 c 0 6 -8 9 -14 6 c -3 -1 -5 -3 -4 -6 z" fill="#b0714f" stroke="#2f2a22" strokeWidth=".9" />
      <path d="M11 -7 l 2 -2 l 1 2 M14 -5 l 3 1 l -3 1" fill="#c25b44" stroke="#c25b44" strokeWidth="1" />
      <circle cx="11" cy="-4" r=".8" fill="#2f2a22" />
      <path d="M-2 10 v 6 M2 10 v 6" stroke="#c99a3c" strokeWidth="1.2" />
    </g>
  )
}

function Sunflower({ x, h }) {
  return (
    <g className="hedge__flower" style={{ transformOrigin: `${x}px 60px` }}>
      <path d={`M${x} 60 V ${60 - h} M${x} ${60 - h * 0.5} q 6 -2 8 -8 q -6 0 -8 8`} stroke="#5f6b4b" strokeWidth="1.4" fill="#6f7e55" />
      {Array.from({ length: 12 }, (_, k) => (
        <ellipse key={k} cx={x} cy={60 - h - 6} rx="1.8" ry="4.5" fill="#e8b84a" transform={`rotate(${k * 30} ${x} ${60 - h})`} />
      ))}
      <circle cx={x} cy={60 - h} r="3.6" fill="#6b4a2c" />
    </g>
  )
}

export function Hedgerow({ variant = 'fence', className = '' }) {
  const grass = useMemo(() => {
    const out = []
    let s = variant.length * 13
    const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
    for (let i = 0; i < 110; i++) out.push(tuft((i / 110) * 400 + rnd() * 4, 6 + rnd() * 14, (rnd() - 0.5) * 10))
    return out.join(' ')
  }, [variant])

  const art = (
    <>
        {variant === 'fence' && (
          <g stroke="#7a5f45" strokeWidth="2" strokeLinecap="round" fill="none">
            {[20, 70, 120, 170, 230, 280, 330, 380].map((x) => (
              <path key={x} d={`M${x} 60 V 30`} />
            ))}
            <path d="M10 36 C 120 34, 260 38, 392 35 M10 46 C 120 44, 260 48, 392 45" strokeWidth="1.6" />
          </g>
        )}
        {variant === 'wheat' &&
          Array.from({ length: 46 }, (_, i) => {
            const x = 4 + i * 8.6
            const h = 26 + ((i * 11) % 14)
            return (
              <g key={i} className="hedge__flower" style={{ transformOrigin: `${x}px 60px`, animationDelay: `${-(i % 6) * 0.5}s` }}>
                <path d={`M${x} 60 V ${60 - h}`} stroke="#c9a45c" strokeWidth="1" />
                {[0, 1, 2, 3].map((k) => (
                  <g key={k} fill="#d8b26a">
                    <ellipse cx={x - 2} cy={60 - h + 3 + k * 4} rx="1.4" ry="2.6" transform={`rotate(-25 ${x - 2} ${60 - h + 3 + k * 4})`} />
                    <ellipse cx={x + 2} cy={60 - h + 3 + k * 4} rx="1.4" ry="2.6" transform={`rotate(25 ${x + 2} ${60 - h + 3 + k * 4})`} />
                  </g>
                ))}
              </g>
            )
          })}
        {variant === 'sheep' && (
          <>
            <path d="M0 52 C 100 40, 300 44, 400 50 V 64 H 0 Z" fill="#9caa8b" opacity=".35" />
            <Sheep x={110} />
            <Sheep x={150} flip />
            <Sheep x={300} />
          </>
        )}
        {variant === 'hens' && (
          <>
            <path d="M330 60 V 34 L 346 24 L 362 34 V 60 Z" fill="#a8604a" stroke="#2f2a22" strokeWidth="1" />
            <path d="M342 60 v -10 h 8 v 10" fill="#3a2a22" />
            <Hen x={90} />
            <Hen x={250} />
          </>
        )}
        {variant === 'sunflowers' && [30, 64, 98, 300, 336, 372].map((x, i) => <Sunflower key={x} x={x} h={30 + (i % 3) * 7} />)}
        <path d={grass} stroke="#7d8b63" strokeWidth="1" fill="none" strokeLinecap="round" />
        <Flowers xs={[44, 150, 196, 262, 318, 360]} colors={['#d79a8a', '#f1e2c8', '#9db4c8', '#e8b84a']} />
          </>
  )

  return (
    <div className={`hedge hedge--${variant} ${className}`} aria-hidden="true">
      <svg className="hedge__narrow" viewBox="0 0 400 64" preserveAspectRatio="xMidYMax slice">
        {art}
      </svg>
      <svg className="hedge__wide" viewBox="0 0 1200 64" preserveAspectRatio="xMidYMax slice">
        {[0, 400, 800].map((x) => (
          <g key={x} transform={`translate(${x} 0)${x === 400 ? ' translate(400 0) scale(-1 1)' : ''}`}>
            {art}
          </g>
        ))}
      </svg>
    </div>
  )
}

/** Two cabbage-white butterflies that wander across the page now and then. */
export function Butterflies() {
  return (
    <div className="butterflies" aria-hidden="true">
      {[0, 1].map((i) => (
        <span key={i} className={`bfly bfly--${i}`}>
          <svg viewBox="0 0 24 20">
            <g className="bfly__l">
              <path d="M12 10 C 6 0, 0 2, 2 8 C 3 11, 8 11, 12 10 Z" />
              <path d="M12 10 C 6 12, 3 18, 7 18 C 10 18, 11 14, 12 10 Z" />
            </g>
            <g className="bfly__r">
              <path d="M12 10 C 18 0, 24 2, 22 8 C 21 11, 16 11, 12 10 Z" />
              <path d="M12 10 C 18 12, 21 18, 17 18 C 14 18, 13 14, 12 10 Z" />
            </g>
          </svg>
        </span>
      ))}
    </div>
  )
}
