import { useEffect, useRef, useState } from "react";
import {
  Droplets, Anchor, Boxes, ShieldCheck, Package, FileCheck2, Truck, PhoneCall, Mail,
  MessageCircle, ArrowRight, ArrowUpRight, Menu, X, FlaskConical, BadgeCheck, Plus, Minus,
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
        if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); }
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? "reveal-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function useCountUp(target, active, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf, start = null;
    function step(ts) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.round(p * target));
      if (p < 1) raf = requestAnimationFrame(step);
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
      <div className="font-mono-label stat-number">{count}<span className="text-brass">{suffix}</span></div>
      <div className="font-mono-label stat-label">{label}</div>
    </div>
  );
}

/* ---------------- bottle illustration ---------------- */

function Bottle({ tint, cap, label, size, large = false }) {
  const h = large ? 190 : 150;
  return (
    <svg viewBox="0 0 80 150" height={h} className="bottle" role="img" aria-label={`${label} water bottle, ${size}`}>
      <defs>
        <clipPath id={`clip-${label}`}>
          <path d="M30 22 L50 22 L52 34 C60 42 62 52 62 62 L62 132 Q62 142 52 142 L28 142 Q18 142 18 132 L18 62 C18 52 20 42 28 34 Z" />
        </clipPath>
      </defs>
      <rect x="31" y="6" width="18" height="14" rx="3" fill={cap} />
      <path d="M30 22 L50 22 L52 34 C60 42 62 52 62 62 L62 132 Q62 142 52 142 L28 142 Q18 142 18 132 L18 62 C18 52 20 42 28 34 Z"
        fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
      <g clipPath={`url(#clip-${label})`}>
        <rect x="10" y="44" width="60" height="100" fill={tint} opacity="0.85" />
        <path className="wave" d="M-20 46 Q-10 40 0 46 T20 46 T40 46 T60 46 T80 46 T100 46 V60 H-20 Z" fill={tint} opacity="0.95" />
        <rect x="18" y="74" width="44" height="34" fill="rgba(10,27,46,0.88)" />
        <text x="40" y="88" textAnchor="middle" fontSize="7" fill="#f3efe4" fontFamily="Fraunces, serif" fontWeight="700">ExportYard</text>
        <text x="40" y="99" textAnchor="middle" fontSize="5" fill="#8fe0ec" fontFamily="IBM Plex Mono, monospace">{label}</text>
        <rect x="24" y="40" width="5" height="96" rx="2.5" fill="rgba(255,255,255,0.35)" />
      </g>
    </svg>
  );
}

/* ---------------- trade route ---------------- */

function TradeRoute() {
  return (
    <svg viewBox="0 0 560 360" className="route-svg" role="img" aria-label="Animated shipping route from Mumbai to three destination ports">
      <g opacity="0.35">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1="0" y1={i * 45} x2="560" y2={i * 45} stroke="var(--navy-600)" strokeWidth="1" />
        ))}
      </g>
      <path id="routeA" d="M 60 260 C 150 180, 210 320, 300 220 S 430 100, 500 90" fill="none" stroke="var(--brass)" strokeWidth="2" strokeDasharray="6 8" className="route-path" />
      <path d="M 60 260 C 130 240, 190 300, 260 260 S 380 260, 480 210" fill="none" stroke="var(--rust)" strokeWidth="2" strokeDasharray="4 7" className="route-path route-path-delay" />
      <g>
        <circle cx="60" cy="260" r="6" fill="var(--brass)" />
        <circle cx="60" cy="260" r="6" fill="var(--brass)" className="port-pulse" />
        <text x="60" y="284" textAnchor="middle" className="font-mono-label route-label">MUMBAI</text>
      </g>
      {[{ x: 500, y: 90, label: "ROTTERDAM" }, { x: 480, y: 210, label: "DUBAI" }, { x: 300, y: 220, label: "COLOMBO" }].map((p, i) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="5" fill="var(--paper)" stroke="var(--brass)" strokeWidth="1.5" />
          <circle cx={p.x} cy={p.y} r="5" fill="none" stroke="var(--brass)" strokeWidth="1" className="port-pulse" style={{ animationDelay: `${i * 0.6}s` }} />
          <text x={p.x} y={p.y - 12} textAnchor="middle" className="font-mono-label route-label">{p.label}</text>
        </g>
      ))}
      <g className="vessel">
        <circle r="4.5" fill="var(--paper)" />
        <animateMotion dur="7s" repeatCount="indefinite" rotate="auto"><mpath href="#routeA" /></animateMotion>
      </g>
    </svg>
  );
}

/* ---------------- data ---------------- */

const IMG = {
  heroShip: "https://images.unsplash.com/photo-1724597500306-a4cbb7d1324e?q=85&w=2400&auto=format&fit=crop",
  containersPort: "https://images.unsplash.com/photo-1773126378915-793b5c48fb38?q=80&w=1200&auto=format&fit=crop",
  warehouseBoxes: "https://images.unsplash.com/photo-1769355104335-acef3aa4c9b6?q=80&w=1200&auto=format&fit=crop",
  containerStackWide: "https://images.unsplash.com/photo-1672870153405-24cba574cef9?q=80&w=1800&auto=format&fit=crop",
};

const PRODUCTS = [
  { name: "Still Natural", tint: "#38bdd0", cap: "#1f8a9c", sizes: "250 ml · 500 ml · 1 L", pack: "24 / 12 / 12 per case", note: "Light mineral profile, TDS 80–120 mg/L. Our volume seller." },
  { name: "Sparkling", tint: "#7fd8e6", cap: "#c1502e", sizes: "330 ml · 750 ml", pack: "24 / 12 per case", note: "Naturally carbonated feel, thick-wall PET rated for pressure." },
  { name: "Alkaline pH 8+", tint: "#5aa9e6", cap: "#294a63", sizes: "500 ml · 1 L", pack: "12 per case", note: "Added electrolytes, aimed at retail and gym channels." },
  { name: "Bulk Jar 5–20 L", tint: "#2e8fa3", cap: "#e0a43a", sizes: "5 L · 10 L · 20 L", pack: "4 / 2 / 1 per case", note: "For offices, hotels and refill distributors." },
];

const SERVICES = [
  { code: "SRC", title: "Source Plant Vetting", body: "We audit bottling plants for water source, filtration, and hygiene before a single pallet is quoted.", icon: Boxes },
  { code: "LAB", title: "Lab Testing & QC", body: "Batch testing for TDS, pH and microbiology, with a certificate of analysis attached to every lot.", icon: FlaskConical, image: IMG.warehouseBoxes },
  { code: "PKG", title: "Export Packing", body: "Shrink-wrapped cases, heat-sealed pallets and private labelling to your destination’s language rules.", icon: Package },
  { code: "DOC", title: "Documents & Customs", body: "FSSAI export NOC, certificate of origin, bill of lading and HS code 2201 filings, handled end to end.", icon: FileCheck2 },
  { code: "FRT", title: "Freight & Shipping", body: "20 ft and 40 ft dry containers from Nhava Sheva, with live tracking and cargo insurance.", icon: Anchor, image: IMG.containersPort },
  { code: "DLV", title: "Door Delivery", body: "Customs-cleared containers handed to your trucker or delivered to your warehouse.", icon: Truck },
];

const SPECS = [
  { k: "20 ft container", v: "≈ 18,000 × 500 ml bottles" },
  { k: "40 ft container", v: "≈ 38,000 × 500 ml bottles" },
  { k: "Minimum order", v: "1 × 20 ft container" },
  { k: "Shelf life", v: "12 months from bottling" },
  { k: "Private label", v: "From 1 container, 3-week artwork lead" },
  { k: "Lead time", v: "21–28 days to port of loading" },
];

const CERTS = ["BIS IS 14543", "FSSAI LICENSED", "ISO 22000", "HACCP", "GMP", "IEC EXPORT CODE", "APEDA REGISTERED", "ISO 9001"];

const PROCESS = [
  { n: "01", title: "Inquiry", body: "Send your product, quantity and destination. We reply within one business day." },
  { n: "02", title: "Sampling", body: "We courier sample bottles and lab reports for your approval." },
  { n: "03", title: "Bottling & QC", body: "Production runs on a fixed timeline with inline and pre-shipment testing." },
  { n: "04", title: "Packing & paperwork", body: "Labelled cases, palletised and documented for your customs office." },
  { n: "05", title: "Freight & clearance", body: "Booking, insurance and clearance on both the origin and destination side." },
  { n: "06", title: "Delivery & reorders", body: "Containers reach your door. We stay reachable for reorders and claims." },
];

const TESTIMONIALS = [
  { quote: "Three containers, three on-time clearances. That consistency is why we keep reordering.", name: "R. Halvorsen", role: "Buyer, Rotterdam" },
  { quote: "Their lab report caught a pH drift before the lot was loaded. That report paid for itself.", name: "A. Osei", role: "Procurement Lead, Accra" },
  { quote: "Documents were right on first submission. Our clearing agent has never said that about another exporter.", name: "M. Al-Farsi", role: "Import Manager, Dubai" },
];

const FAQ = [
  { q: "What is the minimum order?", a: "One 20 ft container, mixed sizes allowed. Private-label orders start at the same quantity." },
  { q: "Can you print our own label?", a: "Yes. Send artwork and we return a print proof within 3 working days." },
  { q: "Which Incoterms do you quote?", a: "FOB Nhava Sheva, CIF and DDP, depending on how much of the chain you want us to carry." },
  { q: "How do you keep bottles safe in transit?", a: "Heat-sealed shrink wrap, corner boards and container-rated pallets, with humidity checks at loading." },
];

const DESTS = ["UAE", "NETHERLANDS", "GHANA", "SRI LANKA", "OMAN", "KENYA", "MALDIVES", "QATAR", "SINGAPORE", "TANZANIA", "BAHRAIN", "MAURITIUS"];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="font-display text-lg">{q}</span>
        {open ? <Minus size={18} className="text-brass" /> : <Plus size={18} className="text-brass" />}
      </button>
      {open && <p className="faq-a">{a}</p>}
    </div>
  );
}

/* ---------------- app ---------------- */

export default function App() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="site">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        :root {
          --navy-950: #06223a; --navy-800: #0b3453; --navy-600: #1d5a7c;
          --brass: #38bdd0; --brass-light: #8fe0ec; --rust: #e0a43a;
          --paper: #eef7f9; --paper-dim: #d9ecf0; --ink: #0c2230; --ink-soft: #3f5a69; --teal: #1f8a9c;
        }
        html { scroll-behavior: smooth; }
        .site { font-family: 'Inter', sans-serif; background: var(--paper); color: var(--ink); }
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono-label { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.08em; }
        .bg-navy-950 { background-color: var(--navy-950); } .bg-navy-800 { background-color: var(--navy-800); }
        .bg-paper { background-color: var(--paper); } .bg-paper-dim { background-color: var(--paper-dim); }
        .text-brass { color: var(--brass); } .text-rust { color: var(--rust); } .text-paper { color: var(--paper); } .text-ink-soft { color: var(--ink-soft); }
        .border-navy-600 { border-color: var(--navy-600); }

        .hero-texture {
          background-image:
            radial-gradient(circle at 15% 20%, rgba(56,189,208,0.18), transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(31,138,156,0.22), transparent 50%),
            repeating-linear-gradient(115deg, rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 64px);
        }
        .hero-photo { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
        .hero-photo-inner { position: absolute; inset: -6% -4%; }
        .hero-photo img { width: 100%; height: 100%; object-fit: cover; opacity: 0.55; animation: kenburns 26s ease-in-out infinite; }
        @keyframes kenburns { 0%,100% { transform: scale(1) translate(0,0); } 50% { transform: scale(1.09) translate(-1.5%,-1%); } }
        .hero-photo::after { content: ""; position: absolute; inset: 0;
          background: linear-gradient(100deg, rgba(6,34,58,0.95) 0%, rgba(6,34,58,0.74) 30%, rgba(6,34,58,0.34) 58%, rgba(6,34,58,0.55) 100%),
                      linear-gradient(180deg, rgba(6,34,58,0.15) 0%, rgba(6,34,58,0.35) 60%, var(--navy-950) 100%); }
        .hero-content { position: relative; z-index: 1; }

        .droplets { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .droplets i { position: absolute; bottom: -20px; width: 8px; height: 8px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
          background: rgba(143,224,236,0.55); animation: rise 9s linear infinite; }
        @keyframes rise { to { transform: translateY(-110vh) rotate(-45deg); opacity: 0; } }

        .bottle { filter: drop-shadow(0 14px 18px rgba(6,34,58,0.35)); transition: transform 0.4s ease; }
        .wave { animation: wavemove 3s linear infinite; }
        @keyframes wavemove { to { transform: translateX(-20px); } }
        .hero-bottles { display: flex; align-items: flex-end; justify-content: center; gap: 6px; }
        .hero-bottles .bottle:nth-child(1) { animation: float 5s ease-in-out infinite; }
        .hero-bottles .bottle:nth-child(2) { animation: float 5s ease-in-out -1.6s infinite; }
        .hero-bottles .bottle:nth-child(3) { animation: float 5s ease-in-out -3.2s infinite; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .product-card { background: linear-gradient(180deg, var(--navy-800), var(--navy-950)); border: 1px solid rgba(56,189,208,0.2); border-radius: 1rem; padding: 1.5rem; height: 100%;
          transition: transform 0.3s ease, border-color 0.3s ease; }
        .product-card:hover { transform: translateY(-6px); border-color: var(--brass); }
        .product-card:hover .bottle { transform: rotate(-4deg) scale(1.05); }
        .product-stage { display: flex; justify-content: center; padding: 1.25rem 0 1rem; background: radial-gradient(circle at 50% 60%, rgba(56,189,208,0.25), transparent 65%); border-radius: 0.75rem; margin-bottom: 1.25rem; }

        .card-img { width: 100%; height: 168px; object-fit: cover; }
        .banner-photo { position: relative; height: 22rem; overflow: hidden; }
        .banner-photo img { width: 100%; height: 100%; object-fit: cover; }
        .banner-photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(6,34,58,0.88) 0%, rgba(6,34,58,0.4) 55%, rgba(6,34,58,0.1) 100%); }
        .banner-content { position: absolute; inset: 0; z-index: 1; display: flex; align-items: center; }

        .btn-primary { background-color: var(--brass); color: var(--navy-950); font-weight: 600; transition: transform 0.25s, background-color 0.25s, box-shadow 0.25s; }
        .btn-primary:hover { background-color: var(--brass-light); transform: translateY(-2px); box-shadow: 0 10px 24px -8px rgba(56,189,208,0.6); }
        .btn-outline { border: 1px solid rgba(238,247,249,0.35); color: var(--paper); transition: border-color 0.25s, background-color 0.25s, transform 0.25s; }
        .btn-outline:hover { border-color: var(--brass); background-color: rgba(56,189,208,0.1); transform: translateY(-2px); }

        .card { background: #fff; border: 1px solid rgba(12,34,48,0.08); transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -20px rgba(6,34,58,0.3); border-color: var(--brass); }

        .reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal-visible { opacity: 1; transform: none; }

        .route-svg { width: 100%; height: auto; }
        .route-path { animation: dashmove 26s linear infinite; }
        .route-path-delay { animation-duration: 32s; animation-direction: reverse; }
        @keyframes dashmove { to { stroke-dashoffset: -400; } }
        .route-label { fill: var(--paper); font-size: 9px; opacity: 0.75; }
        .port-pulse { animation: pulse 2.4s ease-out infinite; transform-origin: center; transform-box: fill-box; }
        @keyframes pulse { 0% { opacity: 0.9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.6); } }
        .vessel circle { filter: drop-shadow(0 0 4px rgba(238,247,249,0.9)); }

        .stat-number { font-size: 2.25rem; font-weight: 600; color: var(--paper); }
        .stat-label { font-size: 0.68rem; color: rgba(238,247,249,0.6); margin-top: 0.35rem; }
        .process-line { background: linear-gradient(180deg, var(--brass), rgba(56,189,208,0.05)); }

        .marquee { overflow: hidden; border-block: 1px solid rgba(56,189,208,0.2); }
        .marquee-track { display: flex; width: max-content; gap: 3rem; padding: 1rem 0; animation: scroll 30s linear infinite; }
        .marquee-track span { white-space: nowrap; }
        @keyframes scroll { to { transform: translateX(-50%); } }

        .spec-row { display: flex; justify-content: space-between; gap: 1rem; padding: 0.9rem 0; border-bottom: 1px dashed rgba(238,247,249,0.2); }
        .faq-item { border-bottom: 1px solid rgba(12,34,48,0.15); }
        .faq-btn { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 0; text-align: left; background: none; border: 0; cursor: pointer; color: var(--ink); }
        .faq-a { padding: 0 0 1.2rem; color: var(--ink-soft); max-width: 36rem; }

        .nav-link { position: relative; }
        .nav-link::after { content: ""; position: absolute; left: 0; bottom: -4px; width: 0; height: 1px; background: var(--brass); transition: width 0.25s; }
        .nav-link:hover::after { width: 100%; }
        .whatsapp-float { position: fixed; bottom: 22px; right: 22px; z-index: 40; box-shadow: 0 12px 30px -10px rgba(6,34,58,0.5); animation: floatpulse 3s ease-in-out infinite; }
        @keyframes floatpulse { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

        @media (prefers-reduced-motion: reduce) {
          .hero-photo img, .droplets i, .wave, .hero-bottles .bottle, .route-path, .port-pulse, .marquee-track, .whatsapp-float { animation: none !important; }
          .reveal { transition: none; opacity: 1; transform: none; }
        }
      `}</style>

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-navy-950" style={{ borderBottom: "1px solid rgba(56,189,208,0.2)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-paper">
            <Droplets size={22} className="text-brass" />
            <span className="font-display font-semibold tracking-wide text-lg">ExportYard</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-mono-label text-xs text-paper">
            <a href="#products" className="nav-link">PRODUCTS</a>
            <a href="#services" className="nav-link">SERVICES</a>
            <a href="#process" className="nav-link">PROCESS</a>
            <a href="#faq" className="nav-link">FAQ</a>
            <a href="#contact" className="nav-link">CONTACT</a>
          </nav>
          <a href="#contact" className="hidden md:inline-block btn-primary px-5 py-2.5 rounded-full text-xs font-mono-label">REQUEST A QUOTE</a>
          <button className="md:hidden text-paper" onClick={() => setNavOpen((v) => !v)} aria-label="Toggle menu">
            {navOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {navOpen && (
          <div className="md:hidden bg-navy-950 border-t border-navy-600 px-6 py-4 flex flex-col gap-4 font-mono-label text-xs text-paper">
            {[["products", "PRODUCTS"], ["services", "SERVICES"], ["process", "PROCESS"], ["faq", "FAQ"], ["contact", "CONTACT"]].map(([id, l]) => (
              <a key={id} href={`#${id}`} onClick={() => setNavOpen(false)}>{l}</a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="bg-navy-950 hero-texture pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="hero-photo"><div className="hero-photo-inner"><img src={IMG.heroShip} alt="Aerial view of a container ship at sea" /></div></div>
        <div className="droplets" aria-hidden="true">
          {[8, 22, 37, 52, 66, 79, 91].map((l, i) => (
            <i key={l} style={{ left: `${l}%`, animationDelay: `${i * 1.3}s`, animationDuration: `${8 + (i % 3) * 2}s` }} />
          ))}
        </div>
        <div className="hero-content max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="font-mono-label text-xs text-brass mb-6">EXPORT DECLARATION NO. EY-2026-0847 · ORIGIN: MUMBAI, IN</div>
            <h1 className="font-display text-5xl md:text-6xl leading-tight text-paper mb-6">
              Pure water, <em className="text-brass font-normal">shipped</em> by the container.
            </h1>
            <p className="text-lg mb-8 max-w-md" style={{ color: "rgba(238,247,249,0.78)" }}>
              ExportYard supplies BIS-certified mineral water bottles from Indian plants to distributors and retailers in 40+ countries. Lab-tested lots, private labelling and customs paperwork come on one invoice.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <a href="#contact" className="btn-primary px-7 py-3.5 rounded-full inline-flex items-center gap-2">Get an export quote <ArrowRight size={16} /></a>
              <a href="#products" className="btn-outline px-7 py-3.5 rounded-full inline-flex items-center gap-2">See the range</a>
            </div>
            <div className="hero-bottles">
              <Bottle tint="#38bdd0" cap="#1f8a9c" label="STILL" size="500 ml" />
              <Bottle tint="#7fd8e6" cap="#c1502e" label="SPARKLING" size="750 ml" large />
              <Bottle tint="#5aa9e6" cap="#294a63" label="ALKALINE" size="1 L" />
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

      {/* CERT MARQUEE */}
      <div className="marquee bg-navy-950" aria-label="Certifications">
        <div className="marquee-track font-mono-label text-xs text-paper">
          {[...CERTS, ...CERTS].map((c, i) => (
            <span key={i} className="inline-flex items-center gap-2"><BadgeCheck size={14} className="text-brass" />{c}</span>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section id="products" className="bg-paper py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl mb-4 max-w-xl">Four waters, one reliable supply line.</h2>
            <p className="text-ink-soft max-w-lg mb-14">Every lot ships with a certificate of analysis. Labels, caps and bottle shapes can be customised from a single container.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.name} delay={i * 90}>
                <div className="product-card">
                  <div className="product-stage"><Bottle tint={p.tint} cap={p.cap} label={p.name.split(" ")[0].toUpperCase()} size={p.sizes} large /></div>
                  <h3 className="font-display text-xl text-paper mb-1">{p.name}</h3>
                  <div className="font-mono-label text-[11px] text-brass mb-3">{p.sizes}</div>
                  <p className="text-sm mb-3" style={{ color: "rgba(238,247,249,0.7)" }}>{p.note}</p>
                  <div className="font-mono-label text-[11px]" style={{ color: "rgba(238,247,249,0.5)" }}>{p.pack}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-paper-dim py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl mb-16 max-w-xl">From bottling plant to your port.</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <Reveal key={s.code} delay={i * 80}>
                <div className="card rounded-2xl overflow-hidden h-full">
                  {s.image && <img src={s.image} alt={s.title} className="card-img" loading="lazy" />}
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
              <p className="font-display text-3xl md:text-4xl text-paper max-w-md leading-snug">Every pallet counted, sealed and tracked before it leaves the yard.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SPECS + DESTINATIONS */}
      <section className="bg-navy-800 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14">
          <Reveal>
            <h2 className="font-display text-4xl text-paper mb-8">Container specs at a glance.</h2>
            <div>
              {SPECS.map((s) => (
                <div key={s.k} className="spec-row">
                  <span className="font-mono-label text-xs" style={{ color: "rgba(238,247,249,0.6)" }}>{s.k.toUpperCase()}</span>
                  <span className="text-paper text-sm text-right">{s.v}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display text-4xl text-paper mb-8">Where our water goes.</h2>
            <div className="flex flex-wrap gap-3">
              {DESTS.map((d) => (
                <span key={d} className="font-mono-label text-xs text-paper px-4 py-2 rounded-full" style={{ border: "1px solid rgba(56,189,208,0.4)" }}>{d}</span>
              ))}
            </div>
            <p className="mt-8 max-w-sm" style={{ color: "rgba(238,247,249,0.65)" }}>Not on the list? We have shipped to new ports on request. Tell us your destination and we will quote the route.</p>
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="bg-navy-950 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl text-paper mb-16 max-w-xl">From inquiry to your warehouse door.</h2>
          </Reveal>
          <div className="relative pl-10">
            <div className="absolute left-[7px] top-2 bottom-2 w-px process-line" />
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 90} className="relative mb-12 last:mb-0">
                <div className="absolute -left-10 top-1 w-4 h-4 rounded-full" style={{ background: "var(--navy-950)", border: "2px solid var(--brass)" }} />
                <div className="font-mono-label text-xs text-brass mb-1">{p.n}</div>
                <h3 className="font-display text-2xl text-paper mb-2">{p.title}</h3>
                <p style={{ color: "rgba(238,247,249,0.68)" }} className="max-w-lg">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section id="faq" className="bg-paper py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl mb-10">Before you order.</h2>
            {FAQ.map((f) => <FaqItem key={f.q} {...f} />)}
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-navy-950 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl text-paper mb-6">Tell us what you want to ship.</h2>
            <p style={{ color: "rgba(238,247,249,0.68)" }} className="mb-10 max-w-sm">
              Send the bottle size, quantity and destination. A trade specialist replies within one business day with a landed-cost estimate.
            </p>
            <div className="flex flex-col gap-4 font-mono-label text-sm">
              <a href="#" className="flex items-center gap-3 text-paper hover:text-brass transition-colors"><MessageCircle size={18} className="text-brass" /> +91 98XXX XXXXX (WhatsApp)</a>
              <a href="#" className="flex items-center gap-3 text-paper hover:text-brass transition-colors"><Mail size={18} className="text-brass" /> trade@exportyard.com</a>
              <a href="#" className="flex items-center gap-3 text-paper hover:text-brass transition-colors"><PhoneCall size={18} className="text-brass" /> +91 20 XXXX XXXX</a>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <form className="bg-paper rounded-2xl p-8 flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono-label text-[11px] text-ink-soft">COMPANY</span>
                  <input className="border rounded-lg px-3 py-2.5 text-sm bg-transparent" style={{ borderColor: "rgba(12,34,48,0.25)" }} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono-label text-[11px] text-ink-soft">DESTINATION COUNTRY</span>
                  <input className="border rounded-lg px-3 py-2.5 text-sm bg-transparent" style={{ borderColor: "rgba(12,34,48,0.25)" }} />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono-label text-[11px] text-ink-soft">WATER TYPE</span>
                  <select className="border rounded-lg px-3 py-2.5 text-sm bg-transparent" style={{ borderColor: "rgba(12,34,48,0.25)" }}>
                    {PRODUCTS.map((p) => <option key={p.name}>{p.name}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono-label text-[11px] text-ink-soft">CONTAINERS NEEDED</span>
                  <input type="number" min="1" defaultValue="1" className="border rounded-lg px-3 py-2.5 text-sm bg-transparent" style={{ borderColor: "rgba(12,34,48,0.25)" }} />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono-label text-[11px] text-ink-soft">MESSAGE</span>
                <textarea rows={4} className="border rounded-lg px-3 py-2.5 text-sm bg-transparent resize-none" style={{ borderColor: "rgba(12,34,48,0.25)" }} />
              </label>
              <button type="submit" className="btn-primary rounded-full py-3 inline-flex items-center justify-center gap-2">Send inquiry <ArrowUpRight size={16} /></button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy-950 px-6 pt-10 pb-8" style={{ borderTop: "1px solid rgba(56,189,208,0.2)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-paper">
            <Droplets size={16} className="text-brass" />
            <span className="font-display text-sm">ExportYard</span>
          </div>
          <div className="font-mono-label text-[11px]" style={{ color: "rgba(238,247,249,0.5)" }}>
            © 2026 EXPORTYARD, MUMBAI, INDIA. DESIGNED & BUILT BY SHIVAM KUMBHAR
          </div>
        </div>
      </footer>
    </div>
  );
}