/** `compact` hides the tagline on small screens so the header never crowds out the menu button. */
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 -rotate-3 items-center justify-center rounded-2xl bg-deep text-[17px] font-black tracking-tighter text-white"
      >
        YPS
      </span>
      <span>
        <span className="block text-[15px] leading-tight font-black tracking-tight">Young Problem Solvers</span>
        <span className={`mt-1 text-[11px] font-bold tracking-wide text-muted uppercase ${compact ? "hidden sm:block" : "block"}`}>
          Think. Build. Explain.
        </span>
      </span>
    </span>
  );
}
