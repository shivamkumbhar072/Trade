import { useCallback, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
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

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        search: search.trim(),
      });

      const response = await fetch(
        `${API_URL}/api/admin/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to fetch users");
      }

      setUsers(result.data.users || []);
      setPagination(result.data.pagination);
    } catch (err) {
      setUsers([]);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  const totalPages = pagination.totalPages || 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0e7f91]">
          Administration
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[#0a1628]">
          Users
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          View and search registered ExportYard accounts.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#0a1628]/10 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#38bdd0]/20 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-semibold text-[#0a1628]">
              All registered users
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {loading
                ? "Loading accounts..."
                : `${pagination.totalUsers} total accounts`}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search name or email"
                aria-label="Search users by name or email"
                className="w-full rounded-full border border-[#0a1628]/20 bg-white py-2.5 pl-11 pr-4 text-sm text-[#0a1628] outline-none transition placeholder:text-slate-400 focus:border-[#38bdd0] focus:ring-2 focus:ring-[#38bdd0]/25 sm:w-64"
              />
            </div>

            <button
              onClick={loadUsers}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffc58f] px-5 py-2.5 text-xs font-semibold tracking-[0.08em] text-[#10222e] transition hover:-translate-y-px hover:bg-[#ffd7b0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a1628] disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              REFRESH
            </button>
          </div>
        </div>

        {error && (
          <div className="m-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Unable to load users</p>
              <p className="mt-1">{error}</p>
              <button
                onClick={loadUsers}
                className="mt-2 font-semibold underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0a1628] text-xs uppercase tracking-wide text-white/80">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Email address</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-14 text-center text-slate-500"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-14 text-center text-slate-500"
                  >
                    Check the error above and try again.
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-14 text-center">
                    <UsersIcon
                      size={28}
                      className="mx-auto mb-3 text-[#38bdd0]/60"
                    />
                    <p className="font-medium text-[#0a1628]">
                      No users found
                    </p>
                    <p className="mt-1 text-slate-500">
                      Try a different search term.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="transition hover:bg-[#38bdd0]/5"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0a1628] font-semibold text-[#ffc58f]">
                          {(user.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#0a1628]">
                          {user.name || "Unnamed user"}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#38bdd0]/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-600">
            Page {page} of {totalPages}
            {" · "}
            {pagination.totalUsers} users
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || page <= 1}
              className="inline-flex items-center gap-1 rounded-full border border-[#0a1628]/25 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-[#0a1628] transition hover:border-[#0a1628] hover:bg-[#0a1628]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdd0] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={15} />
              PREVIOUS
            </button>

            <button
              onClick={() =>
                setPage((current) =>
                  Math.min(totalPages, current + 1)
                )
              }
              disabled={loading || page >= totalPages || totalPages === 0}
              className="inline-flex items-center gap-1 rounded-full border border-[#0a1628]/25 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-[#0a1628] transition hover:border-[#0a1628] hover:bg-[#0a1628]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdd0] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              NEXT
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}