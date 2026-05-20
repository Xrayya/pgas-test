export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-(--line) px-4 pb-14 pt-10 text-(--sea-ink-soft)">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          &copy; {year} Azhary Munir Abdillah a.k.a Xrayya — PGAS Technical Test
        </p>

        <p className="m-0 text-sm">
          Built with <span className="font-semibold">TanStack Router</span> ·{" "}
          <span className="font-semibold">TanStack Query</span> ·{" "}
          <span className="font-semibold">TanStack Start</span>
        </p>
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <a
          href="https://tanstack.com"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl p-2 text-(--sea-ink-soft) transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
        >
          <span className="sr-only">TanStack Website</span>
          <span className="text-sm font-semibold">tanstack.com</span>
        </a>

        <a
          href="https://github.com/TanStack"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl p-2 text-(--sea-ink-soft) transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
        >
          <span className="sr-only">TanStack GitHub</span>
          <span className="text-sm font-semibold">GitHub</span>
        </a>

        <a
          href="https://x.com/tan_stack"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl p-2 text-(--sea-ink-soft) transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
        >
          <span className="sr-only">TanStack on X</span>
          <span className="text-sm font-semibold">X</span>
        </a>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <a
          href="https://github.com/Xrayya"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
        >
          GitHub: @Xrayya
        </a>
        <a
          href="https://github.com/Xrayya/pgas-test"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
        >
          Repo: pgas-test
        </a>
      </div>
    </footer>
  );
}
