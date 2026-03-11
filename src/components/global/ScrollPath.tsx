import { motion, useMotionValue, useTransform } from 'framer-motion';
import { BookOpenText, GraduationCap, Radar, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 620;
const PATH_D = "M 170 214 C 250 72, 430 54, 520 252 S 558 468, 610 406 S 852 108, 1028 174 C 1108 208, 1124 342, 1042 430";
const STAGE_THRESHOLDS = [0.04, 0.32, 0.56];

type Stage = {
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  posterLabel: string;
  point: { x: number; y: number };
  card: { x: number; y: number; width: number };
  poster: { x: number; y: number; width: number; height: number };
};

const stages: Stage[] = [
  {
    label: 'Deploy',
    title: 'Ship in high-stakes environments',
    description:
      'Build AI systems and digitization programs where policy, operations, and real adoption matter just as much as model quality.',
    icon: Radar,
    posterLabel: 'Field Operator',
    point: { x: 170, y: 214 },
    card: { x: 90, y: 306, width: 320 },
    poster: { x: 34, y: 128, width: 178, height: 214 },
  },
  {
    label: 'Distill',
    title: 'Turn delivery into usable frameworks',
    description:
      'Extract what survives contact with reality: orchestration patterns, governance lessons, evaluation habits, and operating principles.',
    icon: BookOpenText,
    posterLabel: 'Pattern Mapper',
    point: { x: 610, y: 406 },
    card: { x: 446, y: 404, width: 408 },
    poster: { x: 532, y: 270, width: 184, height: 214 },
  },
  {
    label: 'Teach',
    title: 'Publish what holds up under pressure',
    description:
      'Convert field-tested lessons into essays, workshops, and playbooks that make hard-won knowledge reusable for other teams.',
    icon: GraduationCap,
    posterLabel: 'Signal Teacher',
    point: { x: 1028, y: 174 },
    card: { x: 850, y: 248, width: 300 },
    poster: { x: 912, y: 120, width: 182, height: 214 },
  },
];

const dotMatrixHighlights = new Set([4, 9, 16, 21, 27, 34]);

function toPercent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

export default function ScrollPath() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathProgress = useMotionValue(0);
  const ballX = useMotionValue((stages[0].point.x / VIEWBOX_WIDTH) * 100);
  const ballY = useMotionValue((stages[0].point.y / VIEWBOX_HEIGHT) * 100);
  const ballLeft = useTransform(ballX, (value) => `${value}%`);
  const ballTop = useTransform(ballY, (value) => `${value}%`);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const updateBallPosition = () => {
      const container = containerRef.current;
      const path = pathRef.current;
      if (!container || !path) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const headerOffset = 92;
      const startLine = viewportHeight * 0.9;
      const endLine = Math.max(headerOffset + 120, viewportHeight * 0.36);
      const progressRange = rect.height + startLine - endLine;
      const rawProgress = (startLine - rect.top) / progressRange;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      pathProgress.set(clamped);
      const totalLength = path.getTotalLength();
      if (!Number.isFinite(totalLength) || totalLength <= 0) return;

      const point = path.getPointAtLength(totalLength * clamped);
      ballX.set((point.x / VIEWBOX_WIDTH) * 100);
      ballY.set((point.y / VIEWBOX_HEIGHT) * 100);

      const nextActiveStage = STAGE_THRESHOLDS.reduce(
        (currentStage, threshold, index) => (clamped >= threshold ? index : currentStage),
        0
      );
      setActiveStage(nextActiveStage);
    };

    let frameId = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateBallPosition);
    };

    updateBallPosition();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [ballX, ballY, pathProgress]);

  return (
    <div ref={containerRef} className="relative mt-14">
      <div className="relative hidden min-h-[820px] w-full overflow-hidden rounded-[2rem] border border-[var(--border-color)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-color)_78%,transparent),color-mix(in_srgb,var(--bg-color)_92%,transparent))] px-6 py-8 shadow-[0_32px_80px_rgba(15,23,42,0.12)] md:block lg:min-h-[900px] xl:min-h-[940px] xl:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(96,165,250,0.1),transparent_24%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-1/4 w-px bg-[linear-gradient(to_bottom,transparent,color-mix(in_srgb,var(--border-color)_85%,transparent),transparent)]" />
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-[linear-gradient(to_bottom,transparent,color-mix(in_srgb,var(--border-color)_85%,transparent),transparent)]" />
        <div className="pointer-events-none absolute inset-y-0 left-3/4 w-px bg-[linear-gradient(to_bottom,transparent,color-mix(in_srgb,var(--border-color)_85%,transparent),transparent)]" />

        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="signalPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59,130,246,0.95)" />
              <stop offset="55%" stopColor="rgba(96,165,250,0.95)" />
              <stop offset="100%" stopColor="rgba(191,219,254,0.95)" />
            </linearGradient>
          </defs>

          <path
            ref={pathRef}
            d={PATH_D}
            fill="none"
            stroke="color-mix(in srgb, var(--text-color) 72%, transparent)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <motion.path
            d={PATH_D}
            fill="none"
            stroke="url(#signalPathGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
            style={{ pathLength: pathProgress }}
          />
        </svg>

        <motion.div
          className="pointer-events-none absolute z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500 shadow-[0_0_0_6px_rgba(59,130,246,0.14),0_0_28px_rgba(59,130,246,0.7)]"
          style={{ left: ballLeft, top: ballTop }}
        />

        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index <= activeStage;
          const connectorHeight = stage.card.y - stage.point.y;

          return (
            <div key={stage.label}>
              <div
                className={`pointer-events-none absolute z-10 rounded-[2rem] border p-5 transition-all duration-500 ${
                  index === activeStage
                    ? 'border-primary-400/40 bg-primary-500/10 shadow-[0_28px_50px_rgba(59,130,246,0.14)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-color)]/45'
                }`}
                style={{
                  left: toPercent(stage.poster.x, VIEWBOX_WIDTH),
                  top: toPercent(stage.poster.y, VIEWBOX_HEIGHT),
                  width: toPercent(stage.poster.width, VIEWBOX_WIDTH),
                  minHeight: toPercent(stage.poster.height, VIEWBOX_HEIGHT),
                }}
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="mt-6 flex items-center justify-start">
                    <Icon className={`h-12 w-12 transition-colors duration-500 ${isActive ? 'text-primary-400' : 'text-[var(--text-muted)]/35'}`} />
                  </div>
                  <div className="mt-10">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]">{stage.posterLabel}</div>
                    <div className={`mt-3 text-5xl font-brand leading-none transition-colors duration-500 ${isActive ? 'text-primary-500/50' : 'text-primary-500/20'}`}>
                      {stage.label}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`pointer-events-none absolute z-20 w-px bg-gradient-to-b transition-opacity duration-500 ${
                  isActive
                    ? 'from-primary-500/90 via-primary-400/80 to-primary-500/10 opacity-100'
                    : 'from-[var(--border-color)] via-[var(--border-color)]/55 to-transparent opacity-60'
                }`}
                style={{
                  left: toPercent(stage.point.x, VIEWBOX_WIDTH),
                  top: toPercent(stage.point.y, VIEWBOX_HEIGHT),
                  height: toPercent(connectorHeight, VIEWBOX_HEIGHT),
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className={`absolute z-30 rounded-[1.9rem] border px-5 py-5 backdrop-blur-md transition-all duration-500 ${
                  index === activeStage
                    ? 'border-primary-500/55 bg-[var(--bg-color)]/92 shadow-[0_30px_70px_rgba(59,130,246,0.18)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-color)]/78'
                }`}
                style={{
                  left: toPercent(stage.card.x, VIEWBOX_WIDTH),
                  top: toPercent(stage.card.y, VIEWBOX_HEIGHT),
                  width: toPercent(stage.card.width, VIEWBOX_WIDTH),
                }}
              >
                <div className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${
                  index === activeStage
                    ? 'border-primary-500/60 bg-primary-500/12 text-primary-400'
                    : 'border-[var(--border-color)] text-[var(--text-color)]'
                }`}>
                  <span className={`h-3 w-3 rounded-full transition-all duration-500 ${
                    isActive
                      ? 'bg-primary-500 shadow-[0_0_0_5px_rgba(59,130,246,0.16)]'
                      : 'bg-[var(--border-color)]'
                  }`} />
                  {stage.label}
                </div>
                <h3 className="mt-5 text-2xl font-display font-medium tracking-tight text-[var(--text-color)]">
                  {stage.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
                  {stage.description}
                </p>
              </motion.div>

              <div
                className={`pointer-events-none absolute z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-500 ${
                  isActive
                    ? 'border-primary-500 bg-[var(--bg-color)] shadow-[0_0_0_5px_rgba(59,130,246,0.14)]'
                    : 'border-[var(--text-color)]/60 bg-[var(--bg-color)]'
                }`}
                style={{
                  left: toPercent(stage.point.x, VIEWBOX_WIDTH),
                  top: toPercent(stage.point.y, VIEWBOX_HEIGHT),
                }}
              >
                <div className={`absolute inset-[3px] rounded-full transition-colors duration-500 ${isActive ? 'bg-primary-500' : 'bg-[var(--bg-color)]'}`} />
              </div>
            </div>
          );
        })}

        <div className="pointer-events-none absolute bottom-10 right-10 grid grid-cols-6 gap-3">
          {Array.from({ length: 36 }).map((_, index) => (
            <span
              key={index}
              className={`h-2.5 w-2.5 rounded-full border ${
                dotMatrixHighlights.has(index)
                  ? 'border-primary-500/80 bg-primary-500/80 shadow-[0_0_18px_rgba(59,130,246,0.45)]'
                  : 'border-[var(--border-color)] bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-5 md:hidden">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index <= activeStage;

          return (
            <motion.article
              key={stage.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={`rounded-[1.8rem] border p-5 transition-colors duration-500 ${
                index === activeStage
                  ? 'border-primary-500/55 bg-primary-500/10'
                  : 'border-[var(--border-color)] bg-[var(--surface-color)]'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border-color)] bg-[var(--bg-color)]/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-color)]">
                  <span className={`h-3 w-3 rounded-full ${isActive ? 'bg-primary-500 shadow-[0_0_0_4px_rgba(59,130,246,0.16)]' : 'bg-[var(--border-color)]'}`} />
                  {stage.label}
                </div>
                <Icon className={`h-9 w-9 ${isActive ? 'text-primary-500' : 'text-[var(--text-muted)]'}`} />
              </div>
              <h3 className="mt-5 text-2xl font-display font-medium text-[var(--text-color)]">{stage.title}</h3>
              <p className="mt-3 text-[var(--text-muted)] leading-7">{stage.description}</p>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
