import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />

        <p className="island-kicker mb-3">PGAS Technical Test</p>
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-(--sea-ink) sm:text-6xl">
          Departments, Employees, Spendings — with Reports & Export
        </h1>
        <p className="mb-8 max-w-2xl text-base text-(--sea-ink-soft) sm:text-lg">
          A small CRUD + reporting app using the TanStack ecosystem: Router for
          file-based routes, Query for server state, and Start-style server
          handlers.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/departments"
            className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-(--lagoon-deep) no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
          >
            Go to CRUD
          </Link>

          <Link
            to="/reports/spending-value-range"
            className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-(--sea-ink) no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.28)] hover:bg-white/70"
          >
            Open Spending Report (2020–2025)
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["CRUD", "Departments, Employees, Spendings with role restrictions."],
          ["Reports", "Joined report + value-range report (2020–2025)."],
          ["Exports", "Export the report view to Excel and PDF."],
          ["TanStack", "Router + Query + Start-style server handlers."],
        ].map(([title, desc], index) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl p-5"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h2 className="mb-2 text-base font-semibold text-(--sea-ink)">
              {title}
            </h2>
            <p className="m-0 text-sm text-(--sea-ink-soft)">{desc}</p>
          </article>
        ))}
      </section>

      <section className="island-shell mt-8 rounded-2xl p-6">
        <p className="island-kicker mb-2">Quick Links</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/departments" className="nav-link">
            Departments
          </Link>
          <Link to="/employees" className="nav-link">
            Employees
          </Link>
          <Link to="/spendings" className="nav-link">
            Spendings
          </Link>
          <Link to="/reports/spendings" className="nav-link">
            Report: Joined Spendings
          </Link>
          <Link to="/reports/spending-value-range" className="nav-link">
            Report: Spending Value Range
          </Link>
        </div>

        <div className="mt-5 text-sm text-(--sea-ink-soft)">
          Project links:{" "}
          <a
            href="https://github.com/Xrayya"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            GitHub profile
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/Xrayya/pgas-test"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            Repository
          </a>
        </div>

        <div className="mt-5 text-sm text-(--sea-ink-soft)">
          TanStack references:{" "}
          <a
            href="https://tanstack.com/router"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            Router
          </a>{" "}
          ·{" "}
          <a
            href="https://tanstack.com/query/latest"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            Query
          </a>{" "}
          ·{" "}
          <a
            href="https://tanstack.com/"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            Start
          </a>
        </div>
      </section>
    </main>
  );
}
