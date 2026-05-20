import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ThemeToggle from "./ThemeToggle";

type MeResponse =
  | { ok: true; user: null }
  | {
    ok: true;
    user: { user_id: number; email: string; role: "admin" | "user" };
  };

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/auth/me");
  return res.json();
}

export default function Header() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const meQuery = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const me = meQuery.data?.user ?? null;

  async function logout() {
    const ok = confirm("Logout now?");
    if (!ok) return;

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        alert(data?.error ?? "Logout failed.");
        return;
      }

      // make UI update immediately everywhere
      await qc.invalidateQueries({ queryKey: ["me"] });
      await navigate({ to: "/login" });
    } catch {
      alert("Logout failed.");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        {/* Brand */}
        <h2 className="m-0 shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm text-(--sea-ink) no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
            PGAS Spendings
            <span className="hidden text-[11px] font-semibold text-(--sea-ink-soft) sm:inline">
              · TanStack
            </span>
          </Link>
        </h2>

        {/* Main nav */}
        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-0 sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: "nav-link is-active" }}
          >
            Home
          </Link>

          <Link
            to="/departments"
            className="nav-link"
            activeProps={{ className: "nav-link is-active" }}
          >
            Departments
          </Link>

          <Link
            to="/employees"
            className="nav-link"
            activeProps={{ className: "nav-link is-active" }}
          >
            Employees
          </Link>

          <Link
            to="/spendings"
            className="nav-link"
            activeProps={{ className: "nav-link is-active" }}
          >
            Spendings
          </Link>

          <details className="relative w-full sm:w-auto">
            <summary className="nav-link list-none cursor-pointer">
              Reports
            </summary>
            <div className="mt-2 min-w-64 rounded-xl border border-(--line) bg-(--header-bg) p-2 shadow-lg sm:absolute sm:right-0">
              <Link
                to="/reports/spendings"
                className="block rounded-lg px-3 py-2 text-sm text-(--sea-ink-soft) no-underline transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
              >
                Spendings (Joined + Sort)
              </Link>
              <Link
                to="/reports/spending-value-range"
                className="block rounded-lg px-3 py-2 text-sm text-(--sea-ink-soft) no-underline transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
              >
                Spending Report (2020–2025 + Filter + Export)
              </Link>
            </div>
          </details>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {me ? (
            <>
              <span className="hidden rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-xs font-semibold text-(--sea-ink-soft) sm:inline">
                {me.email} · {me.role}
              </span>
              <button
                className="rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-xs font-semibold text-(--sea-ink) transition hover:bg-(--link-bg-hover)"
                type="button"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-xs font-semibold text-(--sea-ink) no-underline transition hover:bg-(--link-bg-hover)"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
