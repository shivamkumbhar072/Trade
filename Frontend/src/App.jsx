import { useEffect, useRef, useState } from "react";
import {
  Ship,
  Anchor,
  Boxes,
  ShieldCheck,
  Package,
  FileCheck2,
  Truck,
  PhoneCall,
  Mail,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

/* ---------------- helpers ---------------- */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function useCountUp(target, active, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    let start = null;
    function step(ts) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

function StatBlock({ value, suffix, label }) {
  const [ref, visible] = useReveal();
  const count = useCountUp(value, visible);
  return (
    <div ref={ref} className="stat-block">
      <div className="font-mono-label stat-number">
        {count}
        <span className="text-brass">{suffix}</span>
      </div>
      <div className="font-mono-label stat-label">{label}</div>
    </div>
  );
}

/* ---------------- signature trade-route visual ---------------- */

function TradeRoute() {
  return (
    <svg
      viewBox="0 0 560 360"
      className="route-svg"
      role="img"
      aria-label="Animated trade route from origin port to three destination ports"
    >
      <g opacity="0.35">
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={i * 45}
            x2="560"
            y2={i * 45}
            stroke="var(--navy-600)"
            strokeWidth="1"
          />
        ))}
      </g>

      <path
        id="routeA"
        d="M 60 260 C 150 180, 210 320, 300 220 S 430 100, 500 90"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="2"
        strokeDasharray="6 8"
        className="route-path"
      />
      <path
        d="M 60 260 C 130 240, 190 300, 260 260 S 380 260, 480 210"
        fill="none"
        stroke="var(--rust)"
        strokeWidth="2"
        strokeDasharray="4 7"
        className="route-path route-path-delay"
      />

      {/* origin */}
      <g>
        <circle cx="60" cy="260" r="6" fill="var(--brass)" />
        <circle cx="60" cy="260" r="6" fill="var(--brass)" className="port-pulse" />
        <text x="60" y="284" textAnchor="middle" className="font-mono-label route-label">
          MUMBAI
        </text>
      </g>

      {/* destinations */}
      {[
        { x: 500, y: 90, label: "ROTTERDAM" },
        { x: 480, y: 210, label: "DUBAI" },
        { x: 300, y: 220, label: "COLOMBO" },
      ].map((p, i) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="5" fill="var(--paper)" stroke="var(--brass)" strokeWidth="1.5" />
          <circle
            cx={p.x}
            cy={p.y}
            r="5"
            fill="none"
            stroke="var(--brass)"
            strokeWidth="1"
            className="port-pulse"
            style={{ animationDelay: `${i * 0.6}s` }}
          />
          <text x={p.x} y={p.y - 12} textAnchor="middle" className="font-mono-label route-label">
            {p.label}
          </text>
        </g>
      ))}

      {/* moving vessel */}
      <g className="vessel">
        <circle r="4.5" fill="var(--paper)" />
        <animateMotion dur="7s" repeatCount="indefinite" rotate="auto">
          <mpath href="#routeA" />
        </animateMotion>
      </g>
    </svg>
  );
}

/* ---------------- data ---------------- */

const IMG = {
  heroShip: "https://images.unsplash.com/photo-1724597500306-a4cbb7d1324e?q=85&w=2400&auto=format&fit=crop",
  containersPort: "https://images.unsplash.com/photo-1773126378915-793b5c48fb38?q=80&w=1200&auto=format&fit=crop",
  textileWorkers: "https://images.unsplash.com/photo-1741176506261-73218298e4d8?q=80&w=1200&auto=format&fit=crop",
  warehouseBoxes: "https://images.unsplash.com/photo-1769355104335-acef3aa4c9b6?q=80&w=1200&auto=format&fit=crop",
  containerStackWide: "https://images.unsplash.com/photo-1672870153405-24cba574cef9?q=80&w=1800&auto=format&fit=crop",
};

const SERVICES = [
  {
    code: "SRC",
    title: "Sourcing & Supplier Vetting",
    body: "We identify and audit manufacturers across our textile, agro-commodity and industrial-hardware networks before a single sample ships.",
    icon: Boxes,
    image: IMG.textileWorkers,
  },
  {
    code: "QC",
    title: "Quality Control",
    body: "Pre-shipment inspection against your spec sheet, with photo and video reports before goods leave the factory floor.",
    icon: ShieldCheck,
  },
  {
    code: "PKG",
    title: "Export Packing",
    body: "Container-grade packing built for ocean transit and climate variance, labelled to destination-market requirements.",
    icon: Package,
    image: IMG.warehouseBoxes,
  },
  {
    code: "DOC",
    title: "Documentation & Customs",
    body: "Bills of lading, certificates of origin, HS classification and customs filing handled end to end, on both sides of the border.",
    icon: FileCheck2,
  },
  {
    code: "FRT",
    title: "Freight & Shipping",
    body: "Ocean and air freight booked across our carrier partnerships, with live tracking from port of loading to port of discharge.",
    icon: Ship,
    image: IMG.containersPort,
  },
  {
    code: "DLV",
    title: "Last-Mile Delivery",
    body: "Customs-cleared cargo handed off to your local logistics partner, or delivered direct to your warehouse door.",
    icon: Truck,
  },
];

const PROCESS = [
  { n: "01", title: "Inquiry", body: "You send us a product, quantity and target market. We reply within one business day." },
  { n: "02", title: "Sourcing & sampling", body: "We shortlist vetted suppliers and courier physical samples for your approval." },
  { n: "03", title: "Production & QC", body: "Manufacturing begins under a fixed timeline, with inline and pre-shipment inspection." },
  { n: "04", title: "Packing & documentation", body: "Export-grade packing, and every certificate your destination customs office will ask for." },
  { n: "05", title: "Freight & customs", body: "Booking, insurance, and clearance handled on both the origin and destination side." },
  { n: "06", title: "Delivery & support", body: "Cargo reaches your door. We stay reachable for reorders, claims, or spec changes." },
];

const TESTIMONIALS = [
  {
    quote: "Three consecutive shipments, three on-time customs clearances. That consistency is what kept us reordering.",
    name: "R. Halvorsen",
    role: "Buyer, Rotterdam",
  },
  {
    quote: "They caught a weave defect in QC before it ever reached our port. That single report paid for the inspection contract twice over.",
    name: "A. Osei",
    role: "Procurement Lead, Accra",
  },
  {
    quote: "Every document was correct on the first submission. Our clearing agent has never said that about another exporter.",
    name: "M. Al-Farsi",
    role: "Import Manager, Dubai",
  },
];

/* ---------------- app ---------------- */

export default function App() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="site">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        :root {
          --navy-950: #0a1b2e;
          --navy-800: #12293f;
          --navy-600: #294a63;
          --brass: #c89b3c;
          --brass-light: #e4c581;
          --rust: #c1502e;
          --paper: #f3efe4;
          --paper-dim: #e7e0cf;
          --ink: #16232f;
          --ink-soft: #46586a;
          --teal: #3c6e71;
        }

        .site { font-family: 'Inter', sans-serif; background: var(--paper); color: var(--ink); }
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono-label { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.08em; }

        .bg-navy-950 { background-color: var(--navy-950); }
        .bg-navy-800 { background-color: var(--navy-800); }
        .bg-paper { background-color: var(--paper); }
        .bg-paper-dim { background-color: var(--paper-dim); }
        .text-brass { color: var(--brass); }
        .text-rust { color: var(--rust); }
        .text-paper { color: var(--paper); }
        .text-ink-soft { color: var(--ink-soft); }
        .border-brass { border-color: var(--brass); }
        .border-navy-600 { border-color: var(--navy-600); }

        .hero-texture {
          background-image:
            radial-gradient(circle at 15% 20%, rgba(200,155,60,0.10), transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(60,110,113,0.14), transparent 50%),
            repeating-linear-gradient(115deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 64px);
        }

        .hero-photo { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
        .hero-photo-inner { position: absolute; inset: -6% -4%; }
        .hero-photo img {
          width: 100%; height: 100%; object-fit: cover; opacity: 0.62;
          animation: kenburns 26s ease-in-out infinite;
        }
        @keyframes kenburns {
          0%   { transform: scale(1)     translate(0, 0); }
          50%  { transform: scale(1.09)  translate(-1.5%, -1%); }
          100% { transform: scale(1)     translate(0, 0); }
        }
        .hero-photo::after {
          content: "";
          position: absolute; inset: 0;
          background:
            linear-gradient(100deg, rgba(10,27,46,0.94) 0%, rgba(10,27,46,0.72) 30%, rgba(10,27,46,0.32) 58%, rgba(10,27,46,0.5) 100%),
            linear-gradient(180deg, rgba(10,27,46,0.15) 0%, rgba(10,27,46,0.35) 60%, var(--navy-950) 100%);
        }
        .hero-mist {
          position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
        }
        .hero-mist span {
          position: absolute; top: 0; bottom: 0; width: 60%;
          background: linear-gradient(90deg, transparent, rgba(243,239,228,0.06), transparent);
          animation: drift 16s linear infinite;
        }
        .hero-mist span:nth-child(2) { animation-duration: 24s; animation-delay: -8s; opacity: 0.6; }
        @keyframes drift { from { transform: translateX(-70%); } to { transform: translateX(160%); } }

        .hero-vessel {
          position: absolute; left: 0; bottom: 30%; z-index: 0; pointer-events: none;
          animation: sail 22s linear infinite, bob 3.4s ease-in-out infinite;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.45));
          opacity: 0.9;
        }
        @keyframes sail { from { transform: translateX(-12vw); } to { transform: translateX(72vw); } }
        @keyframes bob { 0%,100% { margin-top: 0; } 50% { margin-top: -6px; } }
        .hero-content { position: relative; z-index: 1; }

        @media (prefers-reduced-motion: reduce) {
          .hero-photo img, .hero-mist span, .hero-vessel { animation: none !important; }
        }

        .card-img { width: 100%; height: 168px; object-fit: cover; }

        .banner-photo { position: relative; height: 22rem; overflow: hidden; }
        .banner-photo img { width: 100%; height: 100%; object-fit: cover; }
        .banner-photo::after {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(10,27,46,0.85) 0%, rgba(10,27,46,0.35) 55%, rgba(10,27,46,0.1) 100%);
        }
        .banner-content { position: absolute; inset: 0; z-index: 1; display: flex; align-items: center; }

        .btn-primary {
          background-color: var(--brass);
          color: var(--navy-950);
          font-weight: 600;
          transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
        }
        .btn-primary:hover { background-color: var(--brass-light); transform: translateY(-2px); box-shadow: 0 10px 24px -8px rgba(200,155,60,0.55); }

        .btn-outline {
          border: 1px solid rgba(243,239,228,0.35);
          color: var(--paper);
          transition: border-color 0.25s ease, background-color 0.25s ease, transform 0.25s ease;
        }
        .btn-outline:hover { border-color: var(--brass); background-color: rgba(200,155,60,0.08); transform: translateY(-2px); }

        .card {
          background: var(--paper);
          border: 1px solid rgba(22,35,47,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -20px rgba(10,27,46,0.25); border-color: var(--brass); }

        .reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal-visible { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { transition: none; opacity: 1; transform: none; }
          .route-path, .vessel, .port-pulse { animation: none !important; }
        }

        .route-svg { width: 100%; height: auto; }
        .route-path { animation: dashmove 26s linear infinite; }
        .route-path-delay { animation-duration: 32s; animation-direction: reverse; }
        @keyframes dashmove { to { stroke-dashoffset: -400; } }
        .route-label { fill: var(--paper); font-size: 9px; opacity: 0.75; }
        .port-pulse { animation: pulse 2.4s ease-out infinite; transform-origin: center; transform-box: fill-box; }
        @keyframes pulse { 0% { opacity: 0.9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.6); } }
        .vessel circle { filter: drop-shadow(0 0 4px rgba(243,239,228,0.9)); }

        .stat-number { font-size: 2.25rem; font-weight: 600; color: var(--paper); }
        .stat-label { font-size: 0.68rem; color: rgba(243,239,228,0.6); margin-top: 0.35rem; }

        .process-line { background: linear-gradient(180deg, var(--brass), rgba(200,155,60,0.05)); }

        .marquee-track { animation: scroll 28s linear infinite; }
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .nav-link { position: relative; }
        .nav-link::after { content: ""; position: absolute; left: 0; bottom: -4px; width: 0; height: 1px; background: var(--brass); transition: width 0.25s ease; }
        .nav-link:hover::after { width: 100%; }

        .whatsapp-float {
          position: fixed; bottom: 22px; right: 22px; z-index: 40;
          box-shadow: 0 12px 30px -10px rgba(10,27,46,0.5);
          animation: floatpulse 3s ease-in-out infinite;
        }
        @keyframes floatpulse { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-navy-950" style={{ borderBottom: "1px solid rgba(200,155,60,0.18)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-paper">
            <Anchor size={20} className="text-brass" />
            <span className="font-display font-semibold tracking-wide text-lg">MERIDIAN EXPORTS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-mono-label text-xs text-paper">
            <a href="#services" className="nav-link">SERVICES</a>
            <a href="#process" className="nav-link">PROCESS</a>
            <a href="#testimonials" className="nav-link">CLIENTS</a>
            <a href="#contact" className="nav-link">CONTACT</a>
          </nav>
          <a href="#contact" className="hidden md:inline-block btn-primary px-5 py-2.5 rounded-full text-xs font-mono-label">
            REQUEST A QUOTE
          </a>
          <button className="md:hidden text-paper" onClick={() => setNavOpen((v) => !v)} aria-label="Toggle menu">
            {navOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {navOpen && (
          <div className="md:hidden bg-navy-950 border-t border-navy-600 px-6 py-4 flex flex-col gap-4 font-mono-label text-xs text-paper">
            <a href="#services" onClick={() => setNavOpen(false)}>SERVICES</a>
            <a href="#process" onClick={() => setNavOpen(false)}>PROCESS</a>
            <a href="#testimonials" onClick={() => setNavOpen(false)}>CLIENTS</a>
            <a href="#contact" onClick={() => setNavOpen(false)}>CONTACT</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="bg-navy-950 hero-texture pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="hero-photo">
          <div className="hero-photo-inner">
            <img src={IMG.heroShip} alt="Aerial view of a container ship crossing the ocean" />
          </div>
        </div>
        <div className="hero-mist" aria-hidden="true">
          <span></span>
          <span></span>
        </div>
        <svg
          className="hero-vessel"
          width="120"
          height="46"
          viewBox="0 0 120 46"
          aria-hidden="true"
        >
          <ellipse cx="60" cy="40" rx="52" ry="3.5" fill="rgba(243,239,228,0.18)" />
          <path d="M14 30 L106 30 L96 40 L24 40 Z" fill="var(--navy-950)" stroke="var(--brass)" strokeWidth="1" />
          <rect x="30" y="14" width="10" height="16" fill="var(--navy-800)" stroke="var(--brass)" strokeWidth="0.75" />
          <rect x="44" y="8" width="10" height="22" fill="var(--navy-800)" stroke="var(--brass)" strokeWidth="0.75" />
          <rect x="58" y="16" width="10" height="14" fill="var(--navy-800)" stroke="var(--brass)" strokeWidth="0.75" />
          <rect x="80" y="10" width="8" height="20" fill="var(--rust)" stroke="var(--brass)" strokeWidth="0.75" />
          <line x1="94" y1="30" x2="94" y2="6" stroke="var(--brass)" strokeWidth="1" />
        </svg>
        <div className="hero-content max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="font-mono-label text-xs text-brass mb-6">
              EXPORT DECLARATION NO. ME-2026-0847 · ORIGIN: MUMBAI, IN
            </div>
            <h1 className="font-display text-5xl md:text-6xl leading-tight text-paper mb-6">
              Your cargo,
              <br />
              <em className="text-brass font-normal">delivered</em> to the world.
            </h1>
            <p className="text-paper text-opacity-70 text-lg mb-8 max-w-md" style={{ color: "rgba(243,239,228,0.72)" }}>
              Meridian Exports moves textiles, agro-commodities and industrial goods from Indian
              manufacturers to buyers across 40+ countries — sourcing to customs, on one manifest.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#contact" className="btn-primary px-7 py-3.5 rounded-full inline-flex items-center gap-2">
                Get an export quote <ArrowRight size={16} />
              </a>
              <a href="#process" className="btn-outline px-7 py-3.5 rounded-full inline-flex items-center gap-2">
                See how it works
              </a>
            </div>
          </div>
          <TradeRoute />
        </div>
      </section>

      {/* STATS */}
      <section className="bg-navy-800 py-14 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBlock value={42} suffix="+" label="COUNTRIES SERVED" />
          <StatBlock value={1200} suffix="+" label="CONTAINERS SHIPPED" />
          <StatBlock value={98} suffix="%" label="ON-TIME CLEARANCE" />
          <StatBlock value={12} suffix=" YRS" label="TRADING SINCE 2014" />
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-paper py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="font-mono-label text-xs text-rust mb-3">WHAT WE HANDLE</div>
            <h2 className="font-display text-4xl md:text-5xl mb-16 max-w-xl">
              End-to-end trade, on one manifest.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <Reveal key={s.code} delay={i * 80}>
                <div className="card rounded-2xl overflow-hidden h-full">
                  {s.image && (
                    <img src={s.image} alt={s.title} className="card-img" loading="lazy" />
                  )}
                  <div className="p-7">
                    <div className="flex items-center justify-between mb-6">
                      <s.icon size={26} style={{ color: "var(--teal)" }} />
                      <span className="font-mono-label text-xs text-ink-soft">{s.code}</span>
                    </div>
                    <h3 className="font-display text-xl mb-2">{s.title}</h3>
                    <p className="text-sm text-ink-soft leading-relaxed">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO BANNER */}
      <section className="banner-photo">
        <img src={IMG.containerStackWide} alt="Stacked shipping containers at a busy port" loading="lazy" />
        <div className="banner-content px-6">
          <div className="max-w-6xl mx-auto w-full">
            <Reveal>
              <div className="font-mono-label text-xs text-brass mb-3">ON THE GROUND</div>
              <p className="font-display text-3xl md:text-4xl text-paper max-w-md leading-snug">
                Every container counted, sealed and tracked before it leaves the yard.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="bg-navy-950 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="font-mono-label text-xs text-brass mb-3">THE JOURNEY</div>
            <h2 className="font-display text-4xl md:text-5xl text-paper mb-16 max-w-xl">
              From inquiry to your warehouse door.
            </h2>
          </Reveal>
          <div className="relative pl-10">
            <div className="absolute left-[7px] top-2 bottom-2 w-px process-line" />
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 90} className="relative mb-12 last:mb-0">
                <div
                  className="absolute -left-10 top-1 w-4 h-4 rounded-full"
                  style={{ background: "var(--navy-950)", border: "2px solid var(--brass)" }}
                />
                <div className="font-mono-label text-xs text-brass mb-1">{p.n}</div>
                <h3 className="font-display text-2xl text-paper mb-2">{p.title}</h3>
                <p style={{ color: "rgba(243,239,228,0.65)" }} className="max-w-lg">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="bg-paper-dim py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="font-mono-label text-xs text-rust mb-3">FROM THE BUYERS</div>
            <h2 className="font-display text-4xl md:text-5xl mb-16 max-w-xl">Stamped, approved, reordered.</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="card rounded-2xl p-7 h-full flex flex-col justify-between">
                  <p className="font-display text-lg italic mb-6 leading-snug">&ldquo;{t.quote}&rdquo;</p>
                  <div className="font-mono-label text-xs text-ink-soft">
                    {t.name.toUpperCase()} · {t.role.toUpperCase()}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-navy-950 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14">
          <Reveal>
            <div className="font-mono-label text-xs text-brass mb-3">LET'S TALK CARGO</div>
            <h2 className="font-display text-4xl md:text-5xl text-paper mb-6">
              Tell us what you're shipping.
            </h2>
            <p style={{ color: "rgba(243,239,228,0.65)" }} className="mb-10 max-w-sm">
              Send a product, quantity and destination — a trade specialist replies within one
              business day with a landed-cost estimate.
            </p>
            <div className="flex flex-col gap-4 font-mono-label text-sm">
              <a href="#" className="flex items-center gap-3 text-paper hover:text-brass transition-colors">
                <MessageCircle size={18} className="text-brass" /> +91 98XXX XXXXX (WhatsApp)
              </a>
              <a href="#" className="flex items-center gap-3 text-paper hover:text-brass transition-colors">
                <Mail size={18} className="text-brass" /> trade@meridianexports.com
              </a>
              <a href="#" className="flex items-center gap-3 text-paper hover:text-brass transition-colors">
                <PhoneCall size={18} className="text-brass" /> +91 20 XXXX XXXX
              </a>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <form className="bg-paper rounded-2xl p-8 flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono-label text-[11px] text-ink-soft">COMPANY</span>
                  <input className="border border-navy-600 rounded-lg px-3 py-2.5 text-sm bg-transparent" style={{ borderColor: "rgba(22,35,47,0.2)" }} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono-label text-[11px] text-ink-soft">DESTINATION COUNTRY</span>
                  <input className="border rounded-lg px-3 py-2.5 text-sm bg-transparent" style={{ borderColor: "rgba(22,35,47,0.2)" }} />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono-label text-[11px] text-ink-soft">PRODUCT / CARGO</span>
                <input className="border rounded-lg px-3 py-2.5 text-sm bg-transparent" style={{ borderColor: "rgba(22,35,47,0.2)" }} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono-label text-[11px] text-ink-soft">MESSAGE</span>
                <textarea rows={4} className="border rounded-lg px-3 py-2.5 text-sm bg-transparent resize-none" style={{ borderColor: "rgba(22,35,47,0.2)" }} />
              </label>
              <button type="submit" className="btn-primary rounded-full py-3 inline-flex items-center justify-center gap-2">
                Send inquiry <ArrowUpRight size={16} />
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy-950 px-6 pt-10 pb-8" style={{ borderTop: "1px solid rgba(200,155,60,0.18)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-paper">
            <Anchor size={16} className="text-brass" />
            <span className="font-display text-sm">MERIDIAN EXPORTS</span>
          </div>
          <div className="font-mono-label text-[11px]" style={{ color: "rgba(243,239,228,0.45)" }}>
            © 2026 MERIDIAN EXPORTS · MUMBAI, INDIA — DESIGNED & BUILT BY SHIVAM KUMBHAR
          </div>
        </div>
      </footer>

      <a href="#" className="whatsapp-float w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "var(--brass)" }} aria-label="Chat on WhatsApp">
        <MessageCircle size={26} color="var(--navy-950)" />
      </a>
    </div>
  );
}