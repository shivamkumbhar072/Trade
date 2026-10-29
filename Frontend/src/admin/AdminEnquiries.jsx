import { useCallback, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  MessageCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const STATUSES = [
  "New",
  "Contacted",
  "Quoted",
  "Negotiating",
  "Converted",
  "Closed",
];

const STATUS_STYLES = {
  new: "bg-[#38bdd0]/15 text-[#0b5f6e] border-[#38bdd0]/40",
  contacted: "bg-sky-100 text-sky-800 border-sky-200",
  quoted: "bg-amber-100 text-amber-800 border-amber-200",
  negotiating: "bg-orange-100 text-orange-800 border-orange-200",
  converted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  closed: "bg-slate-200 text-slate-700 border-slate-300",
};

const pillButton =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-[0.08em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40";

const peachButton = `${pillButton} bg-[#ffc58f] text-[#10222e] hover:-translate-y-px hover:bg-[#ffd7b0] focus-visible:outline-[#0a1628] disabled:hover:translate-y-0`;

const outlineButton = `${pillButton} border border-[#0a1628]/25 text-[#0a1628] hover:border-[#0a1628] hover:bg-[#0a1628]/5 focus-visible:outline-[#38bdd0] disabled:hover:bg-transparent`;

const iconButton =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#0a1628]/20 text-[#0a1628] transition hover:border-[#0a1628] hover:bg-[#0a1628]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdd0]";

function formatDate(date, withTime = false) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

function getWhatsAppUrl(enquiry) {
  const countryCode = String(enquiry.whatsappCountryCode || "").replace(/\D/g, "");
  const number = String(enquiry.whatsappNumber || "").replace(/\D/g, "");
  const fullNumber = `${countryCode}${number}`;

  if (!fullNumber) return null;

  const message = `Hello ${enquiry.name}, thank you for your enquiry to ExportYard regarding bottled mineral water. We would be happy to discuss your requirements.`;

  return `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
}

export default function AdminEnquiries() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState("");

  const loadEnquiries = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });

      if (search.trim()) params.set("search", search.trim());
      if (statusFilter) params.set("status", statusFilter);

      const response = await fetch(
        `${API_URL}/api/enquiries?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load enquiries");
      }

      setItems(data.enquiries || []);
      setPagination(
        data.pagination || {
          total: 0,
          totalPages: 0,
          limit: 10,
        }
      );
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }, [token, page, search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(loadEnquiries, 300);
    return () => clearTimeout(timer);
  }, [loadEnquiries]);

  // detail dialog: Escape closes it and page scroll is locked
  useEffect(() => {
    if (!selected) return;

    const onKey = (e) => {
      if (e.key === "Escape") setSelected(null);
    };

    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  async function updateStatus(enquiryId, status) {
    setUpdatingId(enquiryId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/enquiries/${enquiryId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update status");
      }

      setItems((current) =>
        current.map((item) =>
          item._id === enquiryId ? data.enquiry : item
        )
      );

      setSelected((current) =>
        current?._id === enquiryId ? data.enquiry : current
      );
    } catch (err) {
      setError(err.message || "Unable to update enquiry.");
    } finally {
      setUpdatingId("");
    }
  }

  function openWhatsApp(enquiry) {
    const url = getWhatsAppUrl(enquiry);

    if (!url) {
      setError("This enquiry has no valid WhatsApp number.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  const totalPages = pagination.totalPages || 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0e7f91]">
            Sales workspace
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#0a1628]">
            Product enquiries
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage bottled mineral water enquiries from international buyers.
          </p>
        </div>

        <button
          type="button"
          onClick={loadEnquiries}
          disabled={loading}
          className={`${peachButton} self-start sm:self-auto`}
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          REFRESH
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search buyer, company, email or country..."
            aria-label="Search enquiries"
            className="w-full rounded-full border border-[#0a1628]/20 bg-white py-2.5 pl-11 pr-4 text-sm text-[#0a1628] outline-none transition placeholder:text-slate-400 focus:border-[#38bdd0] focus:ring-2 focus:ring-[#38bdd0]/25"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
          className="rounded-full border border-[#0a1628]/20 bg-white px-5 py-2.5 text-sm text-[#0a1628] outline-none transition focus:border-[#38bdd0] focus:ring-2 focus:ring-[#38bdd0]/25 sm:w-48"
        >
          <option value="">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Table panel */}
      <section className="overflow-hidden rounded-2xl border border-[#0a1628]/10 bg-white shadow-sm">
        <div className="border-b border-[#38bdd0]/20 px-6 py-5">
          <h2 className="font-semibold text-[#0a1628]">All enquiries</h2>
          <p className="mt-1 text-sm text-slate-600">
            {loading ? "Loading enquiries..." : `${pagination.total} enquiries found`}
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-slate-500">
            Loading enquiries...
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-1 px-6 py-14 text-center">
            <MessageCircle size={28} className="mb-2 text-[#38bdd0]/60" />
            <strong className="font-medium text-[#0a1628]">
              No matching enquiries
            </strong>
            <span className="text-sm text-slate-500">
              Try another search or status filter.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a1628] text-xs uppercase tracking-wide text-white/80">
                <tr>
                  <th className="px-6 py-4 font-semibold">Buyer</th>
                  <th className="px-6 py-4 font-semibold">Destination</th>
                  <th className="px-6 py-4 font-semibold">Product / quantity</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Received</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-[#38bdd0]/5"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <strong className="block font-medium text-[#0a1628]">
                        {item.name}
                      </strong>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {item.companyName || item.email}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {item.destinationCountry}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <strong className="block font-medium text-[#0a1628]">
                        {item.bottleSize}
                      </strong>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {Number(item.quantity).toLocaleString()}{" "}
                        {item.quantityUnit}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={item.status}
                        disabled={updatingId === item._id}
                        onChange={(event) =>
                          updateStatus(item._id, event.target.value)
                        }
                        aria-label={`Update status for ${item.name}`}
                        className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-[#38bdd0]/40 disabled:cursor-wait disabled:opacity-60 ${
                          STATUS_STYLES[item.status?.toLowerCase()] ||
                          STATUS_STYLES.closed
                        }`}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className={iconButton}
                          onClick={() => setSelected(item)}
                          aria-label={`View enquiry from ${item.name}`}
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300 text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                          onClick={() => openWhatsApp(item)}
                          aria-label={`Contact ${item.name} on WhatsApp`}
                          title="WhatsApp buyer"
                        >
                          <MessageCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-[#38bdd0]/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-600">
            Page {page} of {Math.max(1, totalPages)}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={outlineButton}
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft size={15} />
              PREVIOUS
            </button>
            <button
              type="button"
              className={outlineButton}
              disabled={loading || page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              NEXT
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Detail dialog */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050c18]/70 p-4 backdrop-blur-sm"
          onMouseDown={() => setSelected(null)}
        >
          <section
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#38bdd0]/25 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-detail-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-4 bg-[#0a1628] px-6 py-5 text-white">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#38bdd0]">
                  Enquiry details
                </p>
                <h2 id="enquiry-detail-title" className="text-xl font-bold">
                  {selected.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close details"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-white/70 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd9a0]"
              >
                <X size={18} />
              </button>
            </header>

            <div className="space-y-6 p-6">
              <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                {[
                  ["Email", selected.email],
                  ["Company", selected.companyName || "Not provided"],
                  [
                    "WhatsApp",
                    `${selected.whatsappCountryCode || ""} ${selected.whatsappNumber || ""}`.trim() ||
                      "Not provided",
                  ],
                  ["Destination", selected.destinationCountry],
                  ["Bottle size", selected.bottleSize],
                  [
                    "Quantity",
                    `${Number(selected.quantity).toLocaleString()} ${selected.quantityUnit}`,
                  ],
                  ["Packaging", selected.packagingPreference],
                  ["Destination port", selected.destinationPort || "Not provided"],
                  ["Received", formatDate(selected.createdAt, true)],
                  ["Status", selected.status],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-xs font-medium text-slate-500">
                      {label}
                    </dt>
                    <dd className="mt-1 break-words text-sm font-semibold text-[#0a1628]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="rounded-xl border border-[#0a1628]/10 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Additional requirements
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {selected.additionalRequirements ||
                    "No additional requirements provided."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className={outlineButton}
                  onClick={() => setSelected(null)}
                >
                  CLOSE
                </button>
                <button
                  type="button"
                  className={peachButton}
                  onClick={() => openWhatsApp(selected)}
                >
                  <MessageCircle size={16} />
                  CONTACT ON WHATSAPP
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}