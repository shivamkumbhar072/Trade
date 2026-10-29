import { useCallback, useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load dashboard");
      }

      setData(result.data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = [
    {
      label: "Total users",
      value: data?.totalUsers ?? "—",
      icon: Users,
      description: "All registered accounts",
    },
    {
      label: "New users",
      value: data?.recentUsersCount ?? "—",
      icon: UserPlus,
      description: "Registered in the last 7 days",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0e7f91]">
            Overview
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#0a1628]">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Monitor registered users on ExportYard.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#ffc58f] px-5 py-2.5 text-xs font-semibold tracking-[0.08em] text-[#10222e] transition hover:-translate-y-px hover:bg-[#ffd7b0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a1628] disabled:opacity-60 disabled:hover:translate-y-0 sm:self-auto"
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin" : ""}
          />
          REFRESH
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Couldn't load dashboard</p>
            <p className="mt-1">{error}</p>
            <button
              onClick={loadDashboard}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {stats.map(({ label, value, icon: Icon, description }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#0a1628]/10 border-l-4 border-l-[#38bdd0] bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  {label}
                </p>
                <p className="mt-3 text-4xl font-bold tracking-tight text-[#0a1628]">
                  {loading ? "..." : value}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0a1628] text-[#ffc58f]">
                <Icon size={22} />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">{description}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#0a1628]/10 bg-white shadow-sm">
        <div className="border-b border-[#38bdd0]/20 px-6 py-5">
          <h2 className="text-lg font-semibold text-[#0a1628]">
            Recent registrations
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            The five newest user accounts.
          </p>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-slate-500">
            Loading registrations...
          </p>
        ) : !data?.recentUsers?.length ? (
          <p className="p-6 text-sm text-slate-500">
            No registrations found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a1628] text-xs uppercase tracking-wide text-white/80">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="transition hover:bg-[#38bdd0]/5"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a1628] text-sm font-semibold text-[#ffc58f]">
                          {(user.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#0a1628]">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          user.role === "admin"
                            ? "bg-[#ffc58f]/40 text-[#10222e]"
                            : "bg-[#38bdd0]/15 text-[#0b5f6e]"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}