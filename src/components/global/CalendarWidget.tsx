const fallbackEmail = 'mahdi20312.khan@gmail.com';
const fallbackMailto = `mailto:${fallbackEmail}?subject=${encodeURIComponent('Booking inquiry')}`;

const rawCalendlyUrl = typeof import.meta !== 'undefined'
  ? import.meta.env.PUBLIC_CALENDLY_URL?.trim()
  : '';

const calendlyUrl = rawCalendlyUrl && rawCalendlyUrl.startsWith('https://calendly.com/')
  ? rawCalendlyUrl
  : '';

const calendlyEmbedUrl = calendlyUrl
  ? `${calendlyUrl}${calendlyUrl.includes('?') ? '&' : '?'}embed_domain=mahdikhan.com&hide_event_type_details=1&hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=3b82f6`
  : '';

const sessionFormats = [
  { label: '30 min', title: 'Strategy sync', detail: 'Quick review of a delivery challenge or system direction.' },
  { label: '45 min', title: 'Architecture review', detail: 'Deep dive on agent workflows, tooling, and evaluation gaps.' },
  { label: '60 min', title: 'Working session', detail: 'Live problem-solving for teams shipping under real constraints.' },
];

export default function CalendarWidget() {
  if (calendlyEmbedUrl) {
    return (
      <div
        className="overflow-hidden rounded-[1.75rem] border border-[var(--border-color)] bg-[color-mix(in_srgb,var(--surface-color)_92%,transparent)] shadow-[0_24px_70px_rgba(15,23,42,0.16)] dark:shadow-[0_24px_70px_rgba(2,6,23,0.45)]"
        data-calendar-shell
      >
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-color)] px-6 py-5">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-500">Book a session</div>
            <h3 className="mt-2 text-2xl font-display font-medium text-[var(--text-color)]">Choose a time that works</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">
              Live availability is powered by Calendly so the footer scheduler reflects actual open time.
            </p>
          </div>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden shrink-0 rounded-full border border-primary-500/35 bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-500/18 dark:text-primary-300 md:inline-flex"
          >
            Open full scheduler
          </a>
        </div>

        <iframe
          src={calendlyEmbedUrl}
          title="Schedule a session with Mahdi Khan"
          loading="lazy"
          className="h-[620px] w-full bg-transparent"
        />
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-[1.75rem] border border-[var(--border-color)] bg-[color-mix(in_srgb,var(--surface-color)_92%,transparent)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.14)] dark:shadow-[0_24px_70px_rgba(2,6,23,0.45)]"
      data-calendar-shell
    >
      <div className="rounded-[1.35rem] border border-primary-500/18 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-color)_92%,transparent),color-mix(in_srgb,var(--bg-color)_94%,transparent))] p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-500">Book a session</div>
        <h3 className="mt-3 text-2xl font-display font-medium text-[var(--text-color)]">Choose the best way to start</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          This footer supports a live Calendly scheduler when available and falls back to direct outreach until the booking link is active.
        </p>

        <div className="mt-6 space-y-3">
          {sessionFormats.map((session) => (
            <div
              key={session.title}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-color)]/72 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-base font-semibold text-[var(--text-color)]">{session.title}</div>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{session.detail}</p>
                </div>
                <div className="shrink-0 rounded-full border border-[var(--border-color)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {session.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={fallbackMailto}
            className="inline-flex items-center justify-center rounded-full bg-[var(--text-color)] px-5 py-3 text-sm font-medium text-[var(--bg-color)] transition-transform hover:scale-[1.01]"
          >
            Email to book
          </a>
          <a
            href="https://www.linkedin.com/in/m-mahdi-khan/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border-color)] px-5 py-3 text-sm font-medium text-[var(--text-color)] transition-colors hover:border-primary-500/40 hover:bg-primary-500/8"
          >
            Message on LinkedIn
          </a>
        </div>

        <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
          I usually confirm by email first if the live scheduler is not active yet.
        </p>
      </div>
    </div>
  );
}
