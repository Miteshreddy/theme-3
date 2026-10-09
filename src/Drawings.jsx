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
