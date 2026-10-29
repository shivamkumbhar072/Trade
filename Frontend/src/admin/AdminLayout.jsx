import { NavLink, Outlet, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users as UsersIcon,
  MessageSquare,
} from "lucide-react";
import Footer from "../Homepage/Footer";
import Navbar from "../Homepage/Navbar";


const navigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: UsersIcon,
  },
    {
    label: "Enquiries",
    path: "/admin/enquiries",
    icon: MessageSquare,
  },
];

export default function AdminLayout() {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      {/* Same Navbar as the public site (logout dialog + toast included) */}

      {/* Navy band: sits behind the transparent navbar so its white text stays readable */}
      <section className="border-b border-[rgba(56,189,208,0.2)] bg-[#0a1628] pt-24">
        <div className="mx-auto max-w-6xl px-6 pb-5">
          <p className="text-sm font-semibold text-white">Admin workspace</p>
          <p className="mt-1 text-xs text-white/60">
            Manage your ExportYard platform
          </p>

          <nav
            aria-label="Admin"
            className="mt-5 flex gap-2 overflow-x-auto pb-1"
          >
            {navigation.map(({ label, path, icon: Icon, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                className={({ isActive }) =>
                  `inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-[0.08em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd9a0] ${
                    isActive
                      ? "bg-[#ffc58f] text-[#10222e]"
                      : "border border-white/40 text-white hover:border-white/75 hover:bg-white/10"
                  }`
                }
              >
                <Icon size={16} />
                {label.toUpperCase()}
              </NavLink>
            ))}
          </nav>
        </div>
      </section>

      <main className="flex-1 p-4 sm:p-8">
        <Outlet />
      </main>

    </div>
  );
}