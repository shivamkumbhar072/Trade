import React from 'react'

/* ---------- data ---------- */
const stacks = [4, 5, 5, 5, 5, 4, 4, 3, 3, 2]
const palette = ['#c8412f', '#2f6f8f', '#e0a23a', '#3c8c6e', '#d9d4c7', '#5b6fa8', '#a8452f']
const boxes = stacks.flatMap((h, c) =>
  Array.from({ length: h }, (_, r) => ({ c, r, color: palette[(c * 3 + r * 5 + (c % 2)) % palette.length] }))
)
const WAVE = 'M0 40 Q150 26 300 40 T600 40 T900 40 T1200 40'

/* ---------- pieces ---------- */
const Ship = () => (
  <svg viewBox="0 0 520 190" className="ey-svg" xmlns="http://www.w3.org/2000/svg">
    {boxes.map(({ c, r, color }) => {
      const x = 150 + c * 34
      const y = 104 - r * 15
      return (
        <g key={`${c}-${r}`}>
          <rect x={x} y={y} width="32" height="14" fill={color} />
          <rect x={x} y={y} width="32" height="14" fill="url(#ey-corr)" />
          <rect x={x} y={y} width="32" height="2" fill="#fff" opacity=".2" />
        </g>
      )
    })}

    {/* bridge tower */}
    <rect x="36" y="60" width="80" height="6" fill="#cfd6db" />
    <rect x="40" y="64" width="72" height="42" fill="#e8ecef" />
    <rect x="46" y="38" width="56" height="22" fill="#eef1f3" />
    <rect x="50" y="44" width="48" height="8" fill="url(#ey-glass)" />
    <rect x="44" y="70" width="60" height="5" fill="url(#ey-glass)" />
    <rect x="44" y="84" width="60" height="5" fill="url(#ey-glass)" />
    <rect x="72" y="14" width="2.5" height="24" fill="#4a5a66" />
    <rect x="66" y="12" width="14" height="3" fill="#4a5a66" />
    {/* funnel */}
    <rect x="118" y="52" width="22" height="54" fill="#c8412f" />
    <rect x="118" y="52" width="22" height="8" fill="#14202a" />

    {/* forecastle */}
    <rect x="490" y="92" width="22" height="14" fill="#dfe5e8" />
    <rect x="494" y="96" width="14" height="3" fill="url(#ey-glass)" />
    <rect x="499" y="70" width="2" height="22" fill="#4a5a66" />

    {/* warm window lights */}
    <g className="ey-lit">
      <rect x="50" y="44" width="48" height="8" fill="#ffd98a" />
      <rect x="44" y="70" width="60" height="5" fill="#ffd98a" />
      <rect x="44" y="84" width="60" height="5" fill="#ffd98a" />
      <rect x="494" y="96" width="14" height="3" fill="#ffd98a" />
      <circle cx="73" cy="11" r="3" fill="#fff4c4" />
      <circle cx="500" cy="68" r="2.5" fill="#fff4c4" />
    </g>

    {/* hull */}
    <path d="M6 106 H514 L470 172 H46 Z" fill="url(#ey-hull)" />
    <rect x="6" y="104" width="508" height="4" fill="#2a4256" />
    <path d="M32 150 H485 L470 172 H46 Z" fill="#b83a2a" />
    <text x="215" y="134" fill="#f4f1ea" fontSize="15" fontWeight="700" letterSpacing="3" fontFamily="inherit">
      EXPORTYARD
    </text>
    {Array.from({ length: 14 }).map((_, i) => (
      <circle key={i} className="ey-pl" cx={70 + i * 30} cy="117" r="1.6" fill="#ffd98a" />
    ))}
  </svg>
)

const Wave = ({ fill, stroke }) => (
  <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="ey-seg">
    <path d={`${WAVE} V200 H0 Z`} fill={fill} />
    {stroke && <path d={WAVE} fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />}
  </svg>
)

const Defs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="ey-hull" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1f3a4e" />
        <stop offset="1" stopColor="#0b1a25" />
      </linearGradient>
      <linearGradient id="ey-glass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9bd6ea" />
        <stop offset="1" stopColor="#2a5d78" />
      </linearGradient>
      <linearGradient id="ey-mid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(40,120,150,.85)" />
        <stop offset="1" stopColor="rgba(8,52,74,.97)" />
      </linearGradient>
      <linearGradient id="ey-front" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0d4864" />
        <stop offset="1" stopColor="#04202e" />
      </linearGradient>
      <pattern id="ey-corr" width="3" height="14" patternUnits="userSpaceOnUse">
        <rect width="1" height="14" fill="#000" opacity=".16" />
      </pattern>
    </defs>
  </svg>
)

/* ---------- hero: sailing ship (pure CSS animation, no scroll or pointer JS) ---------- */
const Intro = () => (
  <section className="ey-hero" aria-label="ExportYard">
    <Defs />

    <div className="ey-scene" aria-hidden="true">
      <div className="ey-sky" />
      <div className="ey-sun" />
      <div className="ey-scrim" />
      <div className="ey-cloud c1" />
      <div className="ey-cloud c2" />
      <div className="ey-cloud c3" />

      <div className="ey-gull g1"><svg viewBox="0 0 28 10"><path d="M1 8 Q7 0 14 7 Q21 0 27 8" /></svg></div>
      <div className="ey-gull g2"><svg viewBox="0 0 28 10"><path d="M1 8 Q7 0 14 7 Q21 0 27 8" /></svg></div>

      <svg className="ey-port" viewBox="0 0 300 60">
        <g fill="#27495f" opacity=".6">
          <rect x="150" y="46" width="22" height="14" /><rect x="174" y="46" width="22" height="14" />
          <rect x="162" y="32" width="22" height="14" /><rect x="198" y="50" width="30" height="10" />
          <rect x="232" y="44" width="22" height="16" /><rect x="256" y="50" width="30" height="10" />
        </g>
        <g stroke="#27495f" strokeWidth="2" fill="none" opacity=".7">
          <path d="M40 60 L46 14 H120 M120 14 L124 22 M96 60 L102 14" />
          <path d="M205 60 L210 24 H270 M270 24 L273 31 M246 60 L250 24" />
        </g>
      </svg>

      <div className="ey-sea" />
      <div className="ey-glitter" />

      {/* ship */}
      <div className="ey-lane ey-lane-ship">
        <div className="ey-enter">
          <div className="ey-hullbox">
            <div className="ey-bob">
              <Ship />
              <span className="ey-smoke" />
              <span className="ey-smoke s2" />
              <span className="ey-smoke s3" />
            </div>
          </div>
        </div>
      </div>

      <div className="ey-mid">
        <div className="ey-track" style={{ '--t': '16s' }}>
          <Wave fill="url(#ey-mid)" stroke="rgba(255,255,255,.28)" />
          <Wave fill="url(#ey-mid)" stroke="rgba(255,255,255,.28)" />
        </div>
      </div>

      {/* wake / foam, sits in front of the mid wave */}
      <div className="ey-lane ey-lane-wake">
        <div className="ey-enter">
          <div className="ey-hullbox">
            <span className="ey-stern" />
            <span className="ey-stern s2" />
            <span className="ey-bow" />
          </div>
        </div>
      </div>

      <div className="ey-front">
        <div className="ey-track" style={{ '--t': '9s' }}>
          <Wave fill="url(#ey-front)" stroke="rgba(255,255,255,.35)" />
          <Wave fill="url(#ey-front)" stroke="rgba(255,255,255,.35)" />
        </div>
      </div>
    </div>

    <div className="ey-copy">
      <h1>We export water bottles.</h1>
      <p>
        ExportYard ships bottled mineral water from Mumbai to ports around the world,
        in full-container loads with documents handled.
      </p>
      <div className="ey-actions">
        <a href="#contact" className="ey-btn">Request a quote</a>
      </div>
    </div>
  </section>
)

/* ---------- footer ---------- */
const Foot = () => (
  <footer className="ey-ft">
    <b>ExportYard</b>
    <span>Bottled mineral water, exported from Mumbai.</span>
    <nav>
      <a href="#products">Products</a>
      <a href="#contact">Contact</a>
    </nav>
    <small>© {new Date().getFullYear()} ExportYard</small>
  </footer>
)

/* ---------- styles ---------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap');

.ey-hero {
  --sun: clamp(70px, 11vw, 170px);
  --sunR: 16%;
  --W: min(88vw, 460px);
  --shipBottom: 24%;
  position: relative; width: 100%; height: 100vh; height: 100svh; min-height: 520px; overflow: hidden;
  background: #0f2a4a; color: #fff; isolation: isolate;
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
}
.ey-scene { position: absolute; inset: 0; }
.ey-scene > * { position: absolute; }

/* sky */
.ey-sky { inset: 0; background: linear-gradient(to bottom, #0f2a4a 0%, #2d5f84 30%, #8bb8c8 48%, #f6c79b 60%, #ffd9ac 100%); }
.ey-scrim { left: 0; right: 0; top: 0; height: 60%; z-index: 1; pointer-events: none;
  background: linear-gradient(to bottom, rgba(8,26,48,.55), rgba(8,26,48,0)); }
.ey-sun { z-index: 1; right: var(--sunR); top: 44%; width: var(--sun); aspect-ratio: 1; border-radius: 50%;
  background: radial-gradient(circle, #fff7e2 0 22%, #ffd9a0 30%, rgba(255,184,110,.35) 45%, rgba(255,184,110,0) 70%); }

/* clouds: transform-only animation, no blur filter */
.ey-cloud { z-index: 1; left: 0; height: 12%; border-radius: 50%; opacity: .75; will-change: transform;
  background: radial-gradient(closest-side, rgba(255,255,255,.75), rgba(255,255,255,0));
  animation: ey-cloud linear infinite; }
.ey-cloud.c1 { top: 10%; width: 52vw; animation-duration: 120s; }
.ey-cloud.c2 { top: 26%; width: 40vw; animation-duration: 90s; animation-delay: -40s; }
.ey-cloud.c3 { top: 18%; width: 34vw; animation-duration: 150s; animation-delay: -90s; }

.ey-gull { z-index: 2; left: 0; width: 26px; will-change: transform; animation: ey-fly linear infinite; }
.ey-gull.g1 { top: 22%; animation-duration: 34s; }
.ey-gull.g2 { top: 30%; animation-duration: 46s; animation-delay: -18s; }
.ey-gull svg { display: block; width: 100%; fill: none; stroke: #1d3f58; stroke-width: 1.6; stroke-linecap: round;
  transform-origin: 50% 100%; animation: ey-flap .8s ease-in-out infinite; }

.ey-port { z-index: 2; right: 2%; bottom: 40%; width: 24vw; }

/* sea */
.ey-sea { z-index: 2; left: 0; right: 0; bottom: 0; height: 40%;
  background: linear-gradient(to bottom, #86b6c2 0%, #3b8aa2 14%, #0e4a64 55%, #072a3b 100%); }
.ey-glitter { z-index: 2; right: calc(var(--sunR) - 2vw); bottom: 0; width: calc(var(--sun) + 4vw); height: 40%;
  background: repeating-linear-gradient(to bottom, rgba(255,226,170,.6) 0 2px, transparent 2px 9px);
  -webkit-mask-image: radial-gradient(ellipse at 50% 0, #000 15%, transparent 70%);
  mask-image: radial-gradient(ellipse at 50% 0, #000 15%, transparent 70%);
  will-change: opacity; animation: ey-glit 3s ease-in-out infinite; }

/* ship + wake lanes share identical sizing so the foam lines up with the hull */
.ey-lane { left: 0; right: 0; bottom: var(--shipBottom); display: flex; justify-content: center; pointer-events: none; }
.ey-lane-ship { z-index: 3; }
.ey-lane-wake { z-index: 5; }
.ey-enter { will-change: transform; animation: ey-enter 2.6s cubic-bezier(.2,.7,.2,1) both; }
.ey-hullbox { position: relative; width: var(--W); aspect-ratio: 520 / 190; }
.ey-bob { position: absolute; inset: 0; transform-origin: 50% 90%; will-change: transform; animation: ey-bob 5s ease-in-out infinite; }
.ey-svg { display: block; width: 100%; height: auto; }

/* funnel smoke */
.ey-smoke { position: absolute; left: 24.2%; top: 20%; width: 5%; aspect-ratio: 1; border-radius: 50%;
  background: radial-gradient(circle, rgba(70,80,90,.55), rgba(70,80,90,0) 70%); opacity: 0;
  will-change: transform, opacity; animation: ey-smoke 6s ease-out infinite; }
.ey-smoke.s2 { animation-delay: -2s; }
.ey-smoke.s3 { animation-delay: -4s; }

/* waves */
.ey-mid, .ey-front { left: 0; width: 100%; overflow: hidden; }
.ey-mid { z-index: 4; bottom: 0; height: 33%; }
.ey-front { z-index: 6; bottom: 0; height: 20%; }
.ey-track { display: flex; width: 200%; height: 100%; will-change: transform; animation: ey-drift var(--t) linear infinite; }
.ey-seg { flex: 0 0 50%; height: 100%; display: block; }

/* wake + foam (positions are % of the hull box, so they scale with the ship) */
.ey-stern { position: absolute; left: -6%; bottom: 6%; width: 34%; height: 7%; border-radius: 50%; transform-origin: right center;
  background: linear-gradient(to left, rgba(255,255,255,.75), rgba(255,255,255,0));
  will-change: transform, opacity; animation: ey-foam 2.4s ease-in-out infinite; }
.ey-stern.s2 { left: -14%; bottom: 0; width: 26%; height: 5%; opacity: .7; animation-delay: -1.2s; }
.ey-bow { position: absolute; left: 88%; bottom: 3%; width: 14%; height: 10%; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(255,255,255,.95), rgba(255,255,255,0) 70%);
  will-change: transform, opacity; animation: ey-bow 1.8s ease-in-out infinite; }

/* lights */
.ey-lit { animation: ey-lit 4s ease-in-out infinite; }
.ey-pl { opacity: .85; }

/* copy */
.ey-copy { position: absolute; z-index: 9; left: max(6vw, 22px); top: 11%; width: min(640px, calc(100% - 44px)); }
.ey-copy h1 { margin: 0; font-weight: 700; letter-spacing: -.035em; line-height: 1; text-wrap: balance;
  font-size: clamp(2.3rem, 6.4vw, 5rem); text-shadow: 0 2px 24px rgba(8,26,48,.45); }
.ey-copy p { margin: 1.1rem 0 0; max-width: 46ch; font-size: clamp(1rem, 1.35vw, 1.15rem); line-height: 1.55;
  color: rgba(255,255,255,.92); text-shadow: 0 1px 12px rgba(8,26,48,.5); }
.ey-actions { display: flex; flex-wrap: wrap; gap: .8rem; margin-top: 1.6rem; }
.ey-btn { display: inline-block; padding: .9rem 1.5rem; border-radius: 10px; background: #ffc58f; color: #10222e;
  font-weight: 600; text-decoration: none; transition: background .2s, transform .2s; }
.ey-btn:hover { background: #ffd7b0; transform: translateY(-2px); }
.ey-btn:focus-visible { outline: 2px solid #ffd9a0; outline-offset: 3px; }

/* keyframes (transform + opacity only, so they stay on the GPU) */
@keyframes ey-drift { to { transform: translate3d(-50%, 0, 0); } }
@keyframes ey-bob { 0%,100% { transform: translate3d(0,0,0) rotate(-.5deg); } 50% { transform: translate3d(0,.8%,0) rotate(.7deg); } }
@keyframes ey-cloud { from { transform: translate3d(-60vw,0,0); } to { transform: translate3d(110vw,0,0); } }
@keyframes ey-glit { 0%,100% { opacity: .9; } 50% { opacity: .5; } }
@keyframes ey-enter { from { transform: translate3d(-80vw,0,0); } to { transform: translate3d(0,0,0); } }
@keyframes ey-foam { 0%,100% { transform: scaleX(.85); opacity: .85; } 50% { transform: scaleX(1.15); opacity: .5; } }
@keyframes ey-bow { 0%,100% { transform: scale(.9); opacity: .9; } 50% { transform: scale(1.15); opacity: .6; } }
@keyframes ey-fly { from { transform: translate3d(-10vw,0,0); } to { transform: translate3d(112vw,0,0); } }
@keyframes ey-flap { 50% { transform: scaleY(.45); } }
@keyframes ey-lit { 0%,100% { opacity: 1; } 50% { opacity: .75; } }
@keyframes ey-smoke {
  0% { transform: translate3d(0,0,0) scale(.6); opacity: 0; }
  15% { opacity: .7; }
  100% { transform: translate3d(-380%,-260%,0) scale(3.2); opacity: 0; }
}

/* ---------- responsive ---------- */
/* tablets and up: a bigger ship */
@media (min-width: 700px) {
  .ey-hero { --W: min(52vw, 120vh); --shipBottom: 21%; }
}
/* desktop: ship sits to the right, text on the left */
@media (min-width: 900px) {
  .ey-lane { justify-content: flex-end; padding-right: 5vw; box-sizing: border-box; }
}
/* phones */
@media (max-width: 699px) {
  .ey-hero { --sunR: 8%; --sun: 76px; }
  .ey-sun { top: 47%; }
  .ey-glitter, .ey-port { display: none; }
  .ey-cloud.c1 { width: 90vw; } .ey-cloud.c2 { width: 70vw; } .ey-cloud.c3 { width: 60vw; }
  .ey-copy p { font-size: 1rem; }
}
/* short landscape screens (phones turned sideways) */
@media (max-height: 520px) and (min-width: 600px) {
  .ey-hero { --W: min(40vw, 90vh); min-height: 400px; }
  .ey-copy { top: 8%; }
  .ey-copy h1 { font-size: clamp(1.8rem, 5vw, 3rem); }
  .ey-copy p { display: none; }
  .ey-actions { margin-top: 1rem; }
}

@media (prefers-reduced-motion: reduce) {
  .ey-hero *, .ey-hero *::before { animation: none !important; }
}

/* ---------- footer ---------- */
.ey-ft { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem 1.8rem; padding: 1.6rem 6vw; background: #060d16; color: rgba(255,255,255,.7);
  font-family: 'Bricolage Grotesque', system-ui, sans-serif; font-size: .9rem; border-top: 1px solid rgba(255,255,255,.08); }
.ey-ft b { color: #fff; font-size: 1.05rem; }
.ey-ft nav { display: flex; gap: 1.2rem; margin-left: auto; }
.ey-ft a { color: inherit; text-decoration: none; }
.ey-ft a:hover { color: #ffc58f; }
.ey-ft a:focus-visible { outline: 2px solid #ffd9a0; outline-offset: 3px; }
@media (max-width: 600px) { .ey-ft nav { margin-left: 0; width: 100%; } }
`

/* ---------- full experience ---------- */
const Hero = () => (
  <>
    <style>{css}</style>
    <Intro />
  </>
)

export default Hero