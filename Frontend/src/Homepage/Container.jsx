import React, { useState } from 'react'

/* ---------- edit your business details here ---------- */
const MIN_ORDER = '1 full container (20 ft)'
const BOTTLE_SIZES = ['500 ml', '1 L', '5 L']
const ORDER_INFO = [
  ['Order type', 'Full container load (FCL)'],
  ['Minimum order', MIN_ORDER],
  ['Bottle sizes', BOTTLE_SIZES.join(', ')],
  ['Shipping from', 'Mumbai, India'],
  ['Destination', 'Ports worldwide'],
  ['Documents', 'Handled by us'],
]

/* typical ISO dry-container figures, approximate */
const SIZES = {
  20: {
    label: '20 ft',
    specs: [
      ['Inside length', '5.90 m'],
      ['Inside width', '2.35 m'],
      ['Inside height', '2.39 m'],
      ['Volume', '33.2 m³'],
      ['Max payload', '28,200 kg'],
      ['Pallets (1.2 × 1.0 m)', '10'],
    ],
    bottles: [['500 ml', '21,600'], ['1 L', '9,600'], ['5 L', '2,000']],
  },
  40: {
    label: '40 ft',
    specs: [
      ['Inside length', '12.03 m'],
      ['Inside width', '2.35 m'],
      ['Inside height', '2.39 m'],
      ['Volume', '67.7 m³'],
      ['Max payload', '26,700 kg'],
      ['Pallets (1.2 × 1.0 m)', '20'],
    ],
    bottles: [['500 ml', '43,200'], ['1 L', '19,200'], ['5 L', '4,000']],
  },
}

const Container = () => {
  const [size, setSize] = useState(20)
  const S = SIZES[size]

  return (
    <section id="container" className="ct-sec">
      <style>{css}</style>

      <div className="ct-wrap">
        <h2 className="ct-h">Container sizes</h2>
        <p className="ct-lead">We ship in standard 20 ft and 40 ft containers. Pick a size to see what fits.</p>

        {/* toggle */}
        <div className="ct-toggle" role="group" aria-label="Container size">
          {[20, 40].map((s) => (
            <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)}>
              {SIZES[s].label}
            </button>
          ))}
        </div>

        {/* container drawing */}
        <div className="ct-draw">
          <div className="ct-box" style={{ width: size === 20 ? '49%' : '100%' }}>
            <span className="ct-name">EXPORTYARD</span>
            <span className="ct-tag">{S.label}</span>
            <span className="ct-door" />
          </div>
          <div className="ct-dim">{S.specs[0][1]} inside length</div>
        </div>

        <div className="ct-grid">
          {/* specs */}
          <div className="ct-card">
            <h3>{S.label} specifications</h3>
            <ul>
              {S.specs.map(([k, v]) => (
                <li key={k}><span>{k}</span><b>{v}</b></li>
              ))}
            </ul>
          </div>

          {/* bottles */}
          <div className="ct-card">
            <h3>Approx. bottles per {S.label}</h3>
            <ul>
              {S.bottles.map(([k, v]) => (
                <li key={k}><span>{k} bottles</span><b>{v}</b></li>
              ))}
            </ul>
            <small>Estimates for typical pallets. Your final load plan may differ.</small>
          </div>

          {/* order info */}
          <div className="ct-card">
            <h3>Order information</h3>
            <ul>
              {ORDER_INFO.map(([k, v]) => (
                <li key={k}><span>{k}</span><b>{v}</b></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

const css = `
.ct-sec { background: linear-gradient(#0a1628, #08111d); color: #fff; padding: 72px 24px;
  font-family: 'Bricolage Grotesque', system-ui, sans-serif; }
.ct-wrap { max-width: 72rem; margin: 0 auto; }
.ct-h { margin: 0; font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.05; letter-spacing: -.03em; font-weight: 700; }
.ct-lead { margin: .9rem 0 0; max-width: 48ch; line-height: 1.55; color: rgba(255,255,255,.75); }

.ct-toggle { display: inline-flex; gap: 2px; margin: 1.8rem 0; padding: 4px; border-radius: 12px;
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); }
.ct-toggle button { padding: .6rem 1.3rem; border: 0; border-radius: 8px; background: transparent; color: rgba(255,255,255,.8);
  font: inherit; font-weight: 600; cursor: pointer; transition: background .2s, color .2s; }
.ct-toggle button:hover { background: rgba(255,255,255,.1); }
.ct-toggle button[aria-pressed="true"] { background: #ffc58f; color: #10222e; }
.ct-toggle button:focus-visible, .ct-btn:focus-visible { outline: 2px solid #ffd9a0; outline-offset: 3px; }

/* container drawing */
.ct-draw { width: 100%; max-width: 760px; }
.ct-box { position: relative; height: clamp(70px, 14vw, 120px); border-radius: 6px; overflow: hidden;
  display: flex; align-items: center; justify-content: center; transition: width .6s cubic-bezier(.65, 0, .2, 1);
  background: repeating-linear-gradient(90deg, rgba(0,0,0,.28) 0 2px, rgba(255,255,255,.07) 2px 4px, transparent 4px 8px), #a3342b;
  box-shadow: inset 0 0 0 4px #6a211b, 0 20px 40px -18px rgba(0,0,0,.8); }
.ct-name { font-weight: 800; letter-spacing: .14em; font-size: clamp(.8rem, 2.4vw, 1.4rem); color: #f6efe4; white-space: nowrap; }
.ct-tag { position: absolute; right: 14%; bottom: 8px; font-size: .75rem; color: rgba(246,239,228,.85); }
.ct-door { position: absolute; right: 0; top: 0; bottom: 0; width: 4%; background:
  linear-gradient(90deg, transparent 30%, rgba(20,8,6,.7) 30% 40%, transparent 40% 60%, rgba(20,8,6,.7) 60% 70%, transparent 70%), #7d2a23; }
.ct-dim { margin-top: .7rem; font-size: .85rem; color: rgba(255,255,255,.6); }

/* cards */
.ct-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.2rem; margin-top: 2rem; }
.ct-card { padding: 1.3rem; border-radius: 14px; background: rgba(255,255,255,.05); border: 1px solid rgba(56,189,208,.2); }
.ct-card h3 { margin: 0 0 .6rem; font-size: 1.05rem; font-weight: 700; }
.ct-card ul { list-style: none; margin: 0; padding: 0; }
.ct-card li { display: flex; justify-content: space-between; gap: 1rem; padding: .55rem 0; border-bottom: 1px solid rgba(255,255,255,.08); font-size: .92rem; }
.ct-card li:last-child { border-bottom: 0; }
.ct-card li span { color: rgba(255,255,255,.65); }
.ct-card li b { font-weight: 600; text-align: right; font-variant-numeric: tabular-nums; }
.ct-card small { display: block; margin-top: .6rem; color: rgba(255,255,255,.5); font-size: .78rem; line-height: 1.4; }

.ct-btn { display: inline-block; margin-top: 2rem; padding: .9rem 1.5rem; border-radius: 10px; background: #ffc58f; color: #10222e;
  font-weight: 600; text-decoration: none; transition: background .2s, transform .2s; }
.ct-btn:hover { background: #ffd7b0; transform: translateY(-2px); }

@media (max-width: 600px) { .ct-sec { padding: 56px 18px; } }
@media (prefers-reduced-motion: reduce) { .ct-box, .ct-btn { transition: none; } }
`

export default Container