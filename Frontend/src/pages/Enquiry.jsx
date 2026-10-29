import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  CheckCircle2,
  ArrowLeft,
  LoaderCircle,
  ChevronDown,
  Search,
  Check,
  X,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const initialForm = {
  name: "",
  companyName: "",
  email: "",
  whatsappCountryCode: "+91",
  whatsappNumber: "",
  destinationCountry: "",
  bottleSize: "1 L",
  quantity: "",
  quantityUnit: "bottles",
  packagingPreference: "PET bottles",
  destinationPort: "",
  additionalRequirements: "",
  whatsappConsent: false,
};

/* [name, ISO code, dial code] */
const RAW_COUNTRIES = [
  ["Afghanistan", "AF", "+93"],
  ["Algeria", "DZ", "+213"],
  ["Angola", "AO", "+244"],
  ["Argentina", "AR", "+54"],
  ["Armenia", "AM", "+374"],
  ["Australia", "AU", "+61"],
  ["Austria", "AT", "+43"],
  ["Azerbaijan", "AZ", "+994"],
  ["Bahrain", "BH", "+973"],
  ["Bangladesh", "BD", "+880"],
  ["Belgium", "BE", "+32"],
  ["Bhutan", "BT", "+975"],
  ["Brazil", "BR", "+55"],
  ["Cambodia", "KH", "+855"],
  ["Cameroon", "CM", "+237"],
  ["Canada", "CA", "+1"],
  ["Chile", "CL", "+56"],
  ["China", "CN", "+86"],
  ["Colombia", "CO", "+57"],
  ["Côte d'Ivoire", "CI", "+225"],
  ["Czech Republic", "CZ", "+420"],
  ["Denmark", "DK", "+45"],
  ["Egypt", "EG", "+20"],
  ["Ethiopia", "ET", "+251"],
  ["Fiji", "FJ", "+679"],
  ["Finland", "FI", "+358"],
  ["France", "FR", "+33"],
  ["Georgia", "GE", "+995"],
  ["Germany", "DE", "+49"],
  ["Ghana", "GH", "+233"],
  ["Greece", "GR", "+30"],
  ["Hong Kong", "HK", "+852"],
  ["Hungary", "HU", "+36"],
  ["India", "IN", "+91"],
  ["Indonesia", "ID", "+62"],
  ["Iran", "IR", "+98"],
  ["Iraq", "IQ", "+964"],
  ["Ireland", "IE", "+353"],
  ["Israel", "IL", "+972"],
  ["Italy", "IT", "+39"],
  ["Japan", "JP", "+81"],
  ["Jordan", "JO", "+962"],
  ["Kazakhstan", "KZ", "+7"],
  ["Kenya", "KE", "+254"],
  ["Kuwait", "KW", "+965"],
  ["Laos", "LA", "+856"],
  ["Lebanon", "LB", "+961"],
  ["Libya", "LY", "+218"],
  ["Madagascar", "MG", "+261"],
  ["Malaysia", "MY", "+60"],
  ["Maldives", "MV", "+960"],
  ["Mauritius", "MU", "+230"],
  ["Mexico", "MX", "+52"],
  ["Mongolia", "MN", "+976"],
  ["Morocco", "MA", "+212"],
  ["Mozambique", "MZ", "+258"],
  ["Myanmar", "MM", "+95"],
  ["Nepal", "NP", "+977"],
  ["Netherlands", "NL", "+31"],
  ["New Zealand", "NZ", "+64"],
  ["Nigeria", "NG", "+234"],
  ["Norway", "NO", "+47"],
  ["Oman", "OM", "+968"],
  ["Pakistan", "PK", "+92"],
  ["Papua New Guinea", "PG", "+675"],
  ["Peru", "PE", "+51"],
  ["Philippines", "PH", "+63"],
  ["Poland", "PL", "+48"],
  ["Portugal", "PT", "+351"],
  ["Qatar", "QA", "+974"],
  ["Romania", "RO", "+40"],
  ["Russia", "RU", "+7"],
  ["Saudi Arabia", "SA", "+966"],
  ["Senegal", "SN", "+221"],
  ["Seychelles", "SC", "+248"],
  ["Singapore", "SG", "+65"],
  ["South Africa", "ZA", "+27"],
  ["South Korea", "KR", "+82"],
  ["Spain", "ES", "+34"],
  ["Sri Lanka", "LK", "+94"],
  ["Sudan", "SD", "+249"],
  ["Sweden", "SE", "+46"],
  ["Switzerland", "CH", "+41"],
  ["Syria", "SY", "+963"],
  ["Taiwan", "TW", "+886"],
  ["Tanzania", "TZ", "+255"],
  ["Thailand", "TH", "+66"],
  ["Tunisia", "TN", "+216"],
  ["Turkey", "TR", "+90"],
  ["Uganda", "UG", "+256"],
  ["Ukraine", "UA", "+380"],
  ["United Arab Emirates", "AE", "+971"],
  ["United Kingdom", "GB", "+44"],
  ["United States", "US", "+1"],
  ["Uzbekistan", "UZ", "+998"],
  ["Vietnam", "VN", "+84"],
  ["Yemen", "YE", "+967"],
  ["Zambia", "ZM", "+260"],
  ["Zimbabwe", "ZW", "+263"],
];

// India first (default), everything else alphabetical
const COUNTRIES = RAW_COUNTRIES.map(([name, iso, dial]) => ({
  name,
  iso,
  dial,
})).sort((a, b) => {
  if (a.iso === "IN") return -1;
  if (b.iso === "IN") return 1;
  return a.name.localeCompare(b.name);
});

/* shared Tailwind class strings */
const labelCls =
  "flex flex-col gap-2 text-xs font-semibold tracking-wide text-white/80";

const fieldBase =
  "rounded-xl border border-white/20 bg-white/5 text-sm font-normal text-white outline-none transition [color-scheme:dark] placeholder:text-white/35 focus:border-[#38bdd0] focus:bg-white/10 focus:ring-2 focus:ring-[#38bdd0]/25";

const fieldCls = `w-full px-4 py-3 ${fieldBase}`;

const selectCls = `${fieldCls} [&>option]:bg-[#0a1628] [&>option]:text-white`;

const peachButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#ffc58f] px-7 py-3.5 text-xs font-semibold tracking-[0.08em] text-[#10222e] transition hover:-translate-y-px hover:bg-[#ffd7b0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ffd9a0] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

function SectionHeading({ step, title, subtitle }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#ffc58f]/40 bg-[#ffc58f]/10 text-xs font-bold text-[#ffc58f]">
        {step}
      </span>
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <p className="text-sm text-white/60">{subtitle}</p>
      </div>
    </div>
  );
}

/* Searchable country-code dropdown */
function CountryCodeSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [pickedIso, setPickedIso] = useState("IN");

  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  // several countries share a dial code (e.g. +1), so remember which one was picked
  const selected =
    COUNTRIES.find((c) => c.iso === pickedIso && c.dial === value) ||
    COUNTRIES.find((c) => c.dial === value);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return COUNTRIES;

    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.replace("+", "").startsWith(q) ||
        c.iso.toLowerCase() === q
    );
  }, [query]);

  function openList() {
    setActive(Math.max(0, COUNTRIES.indexOf(selected)));
    setOpen(true);
  }

  function closeList() {
    setOpen(false);
    setQuery("");
  }

  function choose(country) {
    setPickedIso(country.iso);
    onChange(country.dial);
    closeList();
    buttonRef.current?.focus();
  }

  // close when clicking outside
  useEffect(() => {
    if (!open) return;

    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) closeList();
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // focus the search box when the list opens
  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  // keep the highlighted row in view
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open, results]);

  function onSearchKey(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) choose(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeList();
      buttonRef.current?.focus();
    } else if (e.key === "Tab") {
      closeList();
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? closeList() : openList())}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country calling code, ${selected?.name || ""} ${value}`}
        className={`flex w-full cursor-pointer items-center justify-between gap-1 px-3 py-3 ${fieldBase}`}
      >
        <span className="tabular-nums">{value}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-white/60 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-[min(19rem,calc(100vw_-_4.5rem))] overflow-hidden rounded-xl border border-[#38bdd0]/30 bg-[#0a1628] shadow-2xl shadow-black/60">
          <div className="relative border-b border-white/10 p-2">
            <Search
              size={15}
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onSearchKey}
              placeholder="Search country or code"
              aria-label="Search country or calling code"
              className="w-full rounded-lg border border-white/15 bg-white/5 py-2 pl-9 pr-3 text-sm text-white outline-none [color-scheme:dark] placeholder:text-white/35 focus:border-[#38bdd0]"
            />
          </div>

          <ul
            ref={listRef}
            role="listbox"
            aria-label="Country calling codes"
            className="max-h-60 overflow-y-auto py-1"
          >
            {results.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-white/50">
                No country found
              </li>
            ) : (
              results.map((c, i) => {
                const isSelected = selected === c;

                return (
                  <li
                    key={c.iso}
                    role="option"
                    aria-selected={isSelected}
                    data-active={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(c)}
                    className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2 text-sm ${
                      i === active ? "bg-[#38bdd0]/15" : ""
                    } ${isSelected ? "text-[#ffc58f]" : "text-white"}`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {isSelected && <Check size={14} className="shrink-0" />}
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className="shrink-0 tabular-nums text-white/60">
                      {c.dial}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Enquiry() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(false);

  // success notification hides itself after 5 seconds
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
        }),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "The server returned an invalid response. Please check the backend API URL."
        );
      }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to submit your enquiry.");
      }

      setSubmitted(true);
      setForm(initialForm);
      setToast(true);
      // the success message is at the top, so bring the user back up to it
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a1628] px-4 pb-16 pt-24 text-white sm:px-6">
      {/* success notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-4 top-20 z-50 flex items-center gap-3 rounded-xl border border-[#38bdd0]/30 border-l-[3px] border-l-[#38bdd0] bg-[#0a1628] px-4 py-3 text-sm font-semibold shadow-2xl shadow-black/60 sm:left-auto sm:right-6 sm:w-auto sm:max-w-sm"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#38bdd0] text-[#10222e]">
            <Check size={15} />
          </span>
          <span className="flex-1">Enquiry sent successfully</span>
          <button
            type="button"
            onClick={() => setToast(false)}
            aria-label="Dismiss notification"
            className="inline-flex rounded-md p-1 text-white/60 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd9a0]"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {/* soft teal glow, like the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,rgba(56,189,208,0.2),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Compact heading */}
        <header className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full py-1 text-sm text-white/70 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd9a0]"
          >
            <ArrowLeft size={16} /> Back to home
          </Link>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#38bdd0]">
            ExportYard · International trade
          </p>

          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            Let's discuss your{" "}
            <span className="text-[#ffc58f]">water supply requirements.</span>
          </h1>

          <p className="mt-3 text-sm text-white/70 sm:text-base">
            Tell us what you need and where. Our team will review it and get
            back to you.
          </p>
        </header>

        {submitted ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-[#38bdd0]/25 bg-[#0d1d33]/80 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur sm:p-12">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#38bdd0]/40 bg-[#38bdd0]/10 text-[#38bdd0]">
              <CheckCircle2 size={34} />
            </span>

            <h2 className="mt-6 text-2xl font-bold">
              Enquiry submitted successfully
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70">
              Thank you for contacting ExportYard. Your requirements have been
              submitted. Our team will review your enquiry.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className={peachButton}
              >
                SUBMIT ANOTHER ENQUIRY
              </button>

              <Link
                to="/"
                className="text-sm text-white/70 underline-offset-4 transition hover:text-white hover:underline"
              >
                Return to homepage
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-7 rounded-3xl border border-[#38bdd0]/25 bg-[#0d1d33]/80 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-8"
          >
            {/* Step 1 */}
            <SectionHeading
              step="01"
              title="Your details"
              subtitle="How can we contact you?"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelCls}>
                Full name *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  className={fieldCls}
                />
              </label>

              <label className={labelCls}>
                Company name
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Your company"
                  autoComplete="organization"
                  maxLength={150}
                  className={fieldCls}
                />
              </label>

              <label className={labelCls}>
                Business email *
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                  maxLength={254}
                  className={fieldCls}
                />
              </label>

              <div className={labelCls}>
                <label htmlFor="whatsappNumber">WhatsApp number *</label>
                <div className="grid grid-cols-[6.25rem_1fr] gap-2">
                  <CountryCodeSelect
                    value={form.whatsappCountryCode}
                    onChange={(dial) =>
                      setForm((prev) => ({
                        ...prev,
                        whatsappCountryCode: dial,
                      }))
                    }
                  />
                  <input
                    id="whatsappNumber"
                    type="tel"
                    name="whatsappNumber"
                    value={form.whatsappNumber}
                    onChange={handleChange}
                    placeholder="Phone number"
                    autoComplete="tel-national"
                    required
                    maxLength={20}
                    className={fieldCls}
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border-t border-white/10 pt-7">
              <SectionHeading
                step="02"
                title="Product requirements"
                subtitle="Tell us about your order."
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <label className={labelCls}>
                Destination country *
                <input
                  name="destinationCountry"
                  value={form.destinationCountry}
                  onChange={handleChange}
                  placeholder="e.g. UAE, Maldives"
                  required
                  maxLength={100}
                  className={fieldCls}
                />
              </label>

              <label className={labelCls}>
                Bottle size *
                <select
                  name="bottleSize"
                  value={form.bottleSize}
                  onChange={handleChange}
                  required
                  className={selectCls}
                >
                  {[
                    "250 ml",
                    "330 ml",
                    "500 ml",
                    "1 L",
                    "1.5 L",
                    "5 L",
                    "Other",
                  ].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>

              <label className={labelCls}>
                Required quantity *
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  min="1"
                  step="1"
                  required
                  className={fieldCls}
                />
              </label>

              <label className={labelCls}>
                Quantity unit *
                <select
                  name="quantityUnit"
                  value={form.quantityUnit}
                  onChange={handleChange}
                  required
                  className={selectCls}
                >
                  <option value="bottles">Bottles</option>
                  <option value="cartons">Cartons</option>
                  <option value="20ft container">20 ft container</option>
                  <option value="40ft container">40 ft container</option>
                </select>
              </label>

              <label className={labelCls}>
                Packaging preference *
                <select
                  name="packagingPreference"
                  value={form.packagingPreference}
                  onChange={handleChange}
                  required
                  className={selectCls}
                >
                  <option value="PET bottles">Standard PET bottles</option>
                  <option value="Private label">Private label</option>
                  <option value="Custom packaging">Custom packaging</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className={labelCls}>
                Destination port
                <input
                  name="destinationPort"
                  value={form.destinationPort}
                  onChange={handleChange}
                  placeholder="e.g. Port of Jebel Ali"
                  maxLength={150}
                  className={fieldCls}
                />
              </label>
            </div>

            <label className={labelCls}>
              Additional requirements
              <textarea
                name="additionalRequirements"
                value={form.additionalRequirements}
                onChange={handleChange}
                placeholder="Share your target price, delivery timeline, specifications or other requirements..."
                rows={3}
                maxLength={3000}
                className={`${fieldCls} resize-y`}
              />
            </label>

            <label className="flex cursor-pointer items-start gap-3 text-sm text-white/75">
              <input
                type="checkbox"
                name="whatsappConsent"
                checked={form.whatsappConsent}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#ffc58f]"
              />
              <span>
                I agree to be contacted on WhatsApp regarding this enquiry.
              </span>
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="order-2 text-xs text-white/50 sm:order-1">
                Submitting this form sends your requirements to ExportYard for
                follow-up.
              </p>

              <button
                type="submit"
                disabled={loading}
                className={`${peachButton} order-1 w-full sm:order-2 sm:w-auto`}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" size={17} />
                    SUBMITTING...
                  </>
                ) : (
                  <>
                    SUBMIT ENQUIRY <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}