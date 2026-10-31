import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ---------- ExportYard auth theme ----------
   Same world as the hero: night-blue sky fading to a peach sunset,
   a low sun, drifting clouds and two layers of moving waves.
   The form sits on a dark glass card; the peach (#ffc58f) is the one accent. */

const WAVE = "M0 40 Q150 26 300 40 T600 40 T900 40 T1200 40";

const Wave = ({ fill, stroke }) => (
  <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="au-seg" aria-hidden="true">
    <path d={`${WAVE} V200 H0 Z`} fill={fill} />
    <path d={WAVE} fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
  </svg>
);

/* Google button needs a pixel width; measure the card so it never overflows on small phones */
export function useFitWidth(max = 340) {
  const ref = useRef(null);
  const [width, setWidth] = useState(280);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(Math.max(200, Math.min(max, Math.floor(el.clientWidth))));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [max]);

  return [ref, String(width)];
}

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="au-page">
      <style>{css}</style>

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="au-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(40,120,150,.85)" />
            <stop offset="1" stopColor="rgba(8,52,74,.97)" />
          </linearGradient>
          <linearGradient id="au-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d4864" />
            <stop offset="1" stopColor="#04202e" />
          </linearGradient>
        </defs>
      </svg>

      <div className="au-scene" aria-hidden="true">
        <div className="au-sky" />
        <div className="au-sun" />
        <div className="au-cloud c1" />
        <div className="au-cloud c2" />
        <div className="au-sea" />
        <div className="au-mid">
          <div className="au-track" style={{ "--t": "16s" }}>
            <Wave fill="url(#au-mid)" stroke="rgba(255,255,255,.28)" />
            <Wave fill="url(#au-mid)" stroke="rgba(255,255,255,.28)" />
          </div>
        </div>
        <div className="au-front">
          <div className="au-track" style={{ "--t": "9s" }}>
            <Wave fill="url(#au-front)" stroke="rgba(255,255,255,.35)" />
            <Wave fill="url(#au-front)" stroke="rgba(255,255,255,.35)" />
          </div>
        </div>
      </div>



      <main className="au-card">
        <h1>{title}</h1>
        <p className="au-sub">{subtitle}</p>
        {children}
        <p className="au-foot">{footer}</p>
      </main>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap');

.au-page {
  --sun: clamp(70px, 11vw, 160px);
  position: relative; min-height: 100vh; min-height: 100svh; width: 100%;
  display: flex; align-items: center; justify-content: center;
  padding: 84px 16px 150px; box-sizing: border-box; overflow: hidden; isolation: isolate;
  background: #0f2a4a; color: #fff;
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
}
.au-scene { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.au-scene > * { position: absolute; }

.au-sky { inset: 0; background: linear-gradient(to bottom, #0f2a4a 0%, #2d5f84 34%, #8bb8c8 56%, #f6c79b 74%, #ffd9ac 100%); }
.au-sun { right: 10%; bottom: 24%; width: var(--sun); aspect-ratio: 1; border-radius: 50%;
  background: radial-gradient(circle, #fff7e2 0 22%, #ffd9a0 30%, rgba(255,184,110,.35) 45%, rgba(255,184,110,0) 70%); }

.au-cloud { left: 0; height: 10%; border-radius: 50%; opacity: .7; will-change: transform;
  background: radial-gradient(closest-side, rgba(255,255,255,.7), rgba(255,255,255,0));
  animation: au-cloud linear infinite; }
.au-cloud.c1 { top: 8%; width: 52vw; animation-duration: 120s; }
.au-cloud.c2 { top: 22%; width: 38vw; animation-duration: 95s; animation-delay: -45s; }

.au-sea { left: 0; right: 0; bottom: 0; height: 26%;
  background: linear-gradient(to bottom, #86b6c2 0%, #3b8aa2 14%, #0e4a64 55%, #072a3b 100%); }
.au-mid, .au-front { left: 0; width: 100%; overflow: hidden; }
.au-mid { bottom: 0; height: 22%; }
.au-front { bottom: 0; height: 13%; }
.au-track { display: flex; width: 200%; height: 100%; will-change: transform; animation: au-drift var(--t) linear infinite; }
.au-seg { flex: 0 0 50%; height: 100%; display: block; }

.au-brand { position: absolute; z-index: 5; top: 20px; left: max(5vw, 18px);
  color: #fff; font-weight: 700; font-size: 1.15rem; letter-spacing: -.02em; text-decoration: none;
  text-shadow: 0 2px 16px rgba(8,26,48,.5); }
.au-brand:focus-visible { outline: 2px solid #ffd9a0; outline-offset: 4px; border-radius: 4px; }

/* card */
.au-card { position: relative; z-index: 5; width: 100%; max-width: 420px; box-sizing: border-box;
  padding: clamp(22px, 5vw, 36px); border-radius: 18px;
  background: rgba(8,26,48,.68); border: 1px solid rgba(255,255,255,.14);
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  box-shadow: 0 24px 60px rgba(4,16,30,.45); }
.au-card h1 { margin: 0; font-size: clamp(1.8rem, 6vw, 2.3rem); font-weight: 700; letter-spacing: -.035em; line-height: 1.05; text-wrap: balance; }
.au-sub { margin: .6rem 0 1.4rem; color: rgba(255,255,255,.82); line-height: 1.5; font-size: 1rem; }

.au-google { display: flex; justify-content: center; width: 100%; min-height: 44px; color-scheme: light; }
.au-or { display: flex; align-items: center; gap: .9rem; margin: 1.2rem 0; color: rgba(255,255,255,.6); font-size: .9rem; }
.au-or::before, .au-or::after { content: ""; flex: 1; height: 1px; background: rgba(255,255,255,.18); }

/* form */
.au-form { display: grid; gap: 1rem; }
.au-field { display: grid; gap: .4rem; }
.au-field label { font-size: .92rem; font-weight: 500; color: rgba(255,255,255,.9); }
.au-input { position: relative; }
.au-input input { width: 100%; box-sizing: border-box; padding: .8rem .95rem; border-radius: 10px;
  border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.07); color: #fff;
  font: inherit; font-size: 1rem; /* 16px stops iOS zoom on focus */
  transition: border-color .2s, background .2s; }
.au-input input::placeholder { color: rgba(255,255,255,.45); }
.au-input input:hover { border-color: rgba(255,255,255,.35); }
.au-input input:focus-visible { outline: 2px solid #ffc58f; outline-offset: 2px; border-color: #ffc58f; background: rgba(255,255,255,.1); }
.au-input.has-btn input { padding-right: 4.2rem; }
.au-toggle { position: absolute; right: .4rem; top: 50%; transform: translateY(-50%);
  padding: .4rem .6rem; border: 0; border-radius: 8px; background: transparent; color: #ffc58f;
  font: inherit; font-size: .88rem; font-weight: 600; cursor: pointer; }
.au-toggle:hover { background: rgba(255,197,143,.12); }
.au-toggle:focus-visible { outline: 2px solid #ffd9a0; outline-offset: 1px; }

.au-error { margin: 0; padding: .7rem .9rem; border-radius: 10px; font-size: .92rem; line-height: 1.4;
  background: rgba(200,65,47,.2); border: 1px solid rgba(255,140,120,.5); color: #ffd4cc; }

.au-btn { width: 100%; padding: .9rem 1.5rem; border: 0; border-radius: 10px; background: #ffc58f; color: #10222e;
  font: inherit; font-weight: 600; font-size: 1rem; cursor: pointer; transition: background .2s, transform .2s; }
.au-btn:hover:not(:disabled) { background: #ffd7b0; transform: translateY(-2px); }
.au-btn:focus-visible { outline: 2px solid #ffd9a0; outline-offset: 3px; }
.au-btn:disabled { opacity: .6; cursor: not-allowed; }
.au-btn.ghost { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,.3); }
.au-btn.ghost:hover:not(:disabled) { background: rgba(255,255,255,.08); }

.au-foot { margin: 1.3rem 0 0; text-align: center; font-size: .95rem; color: rgba(255,255,255,.75); }
.au-foot a { color: #ffc58f; font-weight: 600; text-decoration: none; }
.au-foot a:hover { text-decoration: underline; }
.au-foot a:focus-visible { outline: 2px solid #ffd9a0; outline-offset: 3px; border-radius: 3px; }

@keyframes au-drift { to { transform: translate3d(-50%, 0, 0); } }
@keyframes au-cloud { from { transform: translate3d(-60vw,0,0); } to { transform: translate3d(110vw,0,0); } }

/* tablet + desktop: roomier card */
@media (min-width: 700px) {
  .au-page { padding-top: 96px; }
  .au-sun { right: 14%; }
}
/* small phones */
@media (max-width: 380px) {
  .au-page { padding-left: 12px; padding-right: 12px; }
}
/* short landscape screens: let the page scroll naturally, align to top */
@media (max-height: 640px) {
  .au-page { align-items: flex-start; padding-top: 72px; }
}

@media (prefers-reduced-motion: reduce) {
  .au-page *, .au-page *::before { animation: none !important; }
}
`;