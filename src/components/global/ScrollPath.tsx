import { motion, useReducedMotion } from 'framer-motion';
import { BookOpenText, GraduationCap, Radar, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const VIEWBOX_WIDTH = 1280;
const VIEWBOX_HEIGHT = 840;

const DEPTH_PATH_D =
  'M 122 252 C 230 174, 368 128, 520 196 S 734 344, 882 320 S 1058 210, 1184 286';
const MAIN_PATH_D =
  'M 172 240 C 286 88, 460 112, 556 300 S 642 678, 718 560 S 936 142, 1046 238 C 1118 306, 1178 404, 1204 506';
const ACCENT_PATH_D =
  'M 188 278 C 290 152, 452 174, 556 364 S 632 724, 724 612 S 932 188, 1038 274 C 1104 332, 1152 408, 1180 470';

const STAGE_PROGRESS = [0.1, 0.48, 0.79];
const ACTIVE_THRESHOLDS = [0.07, 0.36, 0.64];

type StagePoint = {
  x: number;
  y: number;
};

type Stage = {
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  posterLabel: string;
  posterWord: string;
  card: { x: number; y: number; width: number };
  poster: { x: number; y: number; width: number; height: number };
};

const stages: Stage[] = [
  {
    label: 'Deploy',
    title: 'Ship in high-stakes environments',
    description:
      'Build AI systems and digitization programs where adoption, policy, and operating reality matter as much as model quality.',
    icon: Radar,
    posterLabel: 'Delivery systems',
    posterWord: 'Deploy',
    card: { x: 64, y: 420, width: 332 },
    poster: { x: 86, y: 152, width: 214, height: 210 },
  },
  {
    label: 'Distill',
    title: 'Turn delivery into reusable frameworks',
    description:
      'Extract the patterns that survive contact with reality: governance, orchestration, evaluation, and operating principles.',
    icon: BookOpenText,
    posterLabel: 'Operating patterns',
    posterWord: 'Distill',
    card: { x: 470, y: 500, width: 348 },
    poster: { x: 534, y: 282, width: 204, height: 206 },
  },
  {
    label: 'Teach',
    title: 'Publish what holds up under pressure',
    description:
      'Convert field-tested lessons into essays, workshops, and playbooks other teams can actually reuse.',
    icon: GraduationCap,
    posterLabel: 'Teaching loops',
    posterWord: 'Teach',
    card: { x: 874, y: 334, width: 294 },
    poster: { x: 922, y: 154, width: 208, height: 206 },
  },
];

const dotMatrixHighlights = new Set([5, 10, 16, 22, 29, 35]);

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function mix(start: number, end: number, amount: number) {
  return start + (end - start) * clamp01(amount);
}

function stageIntensity(progress: number, center: number, spread = 0.24) {
  return clamp01(1 - Math.abs(progress - center) / spread);
}

function formatPercent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

function samplePathPoint(path: SVGPathElement, progress: number): StagePoint {
  const totalLength = path.getTotalLength();
  const point = path.getPointAtLength(totalLength * progress);

  return { x: point.x, y: point.y };
}

export default function ScrollPath() {
  const chapterRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [ballPoint, setBallPoint] = useState<StagePoint>({
    x: 172,
    y: 240,
  });
  const [stagePoints, setStagePoints] = useState<StagePoint[]>([
    { x: 220, y: 250 },
    { x: 660, y: 560 },
    { x: 1034, y: 238 },
  ]);

  useEffect(() => {
    const updateScene = () => {
      const chapter = chapterRef.current;
      const path = pathRef.current;
      if (!chapter || !path) return;

      const rect = chapter.getBoundingClientRect();
      const totalScrollable = Math.max(chapter.offsetHeight - window.innerHeight, 1);
      const nextProgress = clamp01(-rect.top / totalScrollable);

      setProgress(nextProgress);
      setActiveStage(
        ACTIVE_THRESHOLDS.reduce(
          (currentStage, threshold, index) => (nextProgress >= threshold ? index : currentStage),
          0
        )
      );

      setBallPoint(samplePathPoint(path, nextProgress));
      setStagePoints(STAGE_PROGRESS.map((value) => samplePathPoint(path, value)));
    };

    let frameId = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateScene);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  const sceneIntro = prefersReducedMotion ? 1 : clamp01(progress / 0.22);
  const bgTranslateY = prefersReducedMotion ? 0 : mix(42, -24, progress);
  const bgScale = prefersReducedMotion ? 1 : mix(1.08, 1, progress);
  const midTranslateY = prefersReducedMotion ? 0 : mix(20, -12, progress);
  const midScale = prefersReducedMotion ? 1 : mix(0.985, 1.02, progress);
  const foregroundTranslateY = prefersReducedMotion ? 0 : mix(34, -24, progress);
  const foregroundScale = prefersReducedMotion ? 1 : mix(0.965, 1.02, progress);
  const sceneRotateX = prefersReducedMotion ? 0 : mix(8, 0.8, sceneIntro);
  const sceneOpacity = mix(0.78, 1, sceneIntro);
  const signalGlow = mix(0.18, 0.34, clamp01(progress * 1.25));

  return (
    <div className="relative mt-16 xl:mt-18" data-scrollpath-root>
      <div
        ref={chapterRef}
        className="relative hidden xl:block xl:h-[118vh] 2xl:h-[124vh]"
      >
        <div className="sticky top-24 h-[calc(100vh-8rem)] min-h-[620px] max-h-[46rem] 2xl:top-28 2xl:h-[calc(100vh-9rem)] 2xl:min-h-[660px]">
          <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(6,15,32,0.96),rgba(8,20,44,0.98))] shadow-[0_44px_120px_rgba(2,6,23,0.42)]">
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: sceneOpacity,
                transform: `translateY(${bgTranslateY}px) scale(${bgScale})`,
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(148,163,184,0.03))]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(59,130,246,0.18),transparent_24%),radial-gradient(circle_at_52%_68%,rgba(96,165,250,0.14),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(125,211,252,0.12),transparent_24%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:88px_88px] opacity-60 [mask-image:linear-gradient(180deg,rgba(255,255,255,0.8),rgba(255,255,255,0.25))]" />
              <div className="absolute inset-y-0 left-[16%] w-px bg-[linear-gradient(to_bottom,transparent,rgba(148,163,184,0.22),transparent)]" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-[linear-gradient(to_bottom,transparent,rgba(148,163,184,0.22),transparent)]" />
              <div className="absolute inset-y-0 left-[82%] w-px bg-[linear-gradient(to_bottom,transparent,rgba(148,163,184,0.22),transparent)]" />
            </motion.div>

            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: mix(0.74, 1, sceneIntro),
                transform: `translateY(${midTranslateY}px) scale(${midScale})`,
              }}
            >
              <svg
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="foregroundSignalPath" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.95)" />
                    <stop offset="52%" stopColor="rgba(96,165,250,0.98)" />
                    <stop offset="100%" stopColor="rgba(191,219,254,0.92)" />
                  </linearGradient>
                  <linearGradient id="depthSignalPath" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.18)" />
                    <stop offset="100%" stopColor="rgba(191,219,254,0.26)" />
                  </linearGradient>
                </defs>

                <path
                  d={DEPTH_PATH_D}
                  fill="none"
                  stroke="url(#depthSignalPath)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d={ACCENT_PATH_D}
                  fill="none"
                  stroke="color-mix(in srgb, var(--text-color) 26%, transparent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 10"
                />
              </svg>
            </motion.div>

            <motion.div
              className="absolute inset-0"
              style={{
                opacity: sceneOpacity,
                transform: `translateY(${foregroundTranslateY}px) scale(${foregroundScale}) perspective(1800px) rotateX(${sceneRotateX}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <svg
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="pointer-events-none absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  ref={pathRef}
                  d={MAIN_PATH_D}
                  fill="none"
                  stroke="color-mix(in srgb, var(--text-color) 48%, transparent)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <motion.path
                  d={MAIN_PATH_D}
                  fill="none"
                  stroke="url(#foregroundSignalPath)"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                  style={{
                    pathLength: progress,
                    opacity: mix(0.55, 1, progress),
                  }}
                />
              </svg>

              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const point = stagePoints[index];
                const intensity = prefersReducedMotion
                  ? index <= activeStage
                    ? 1
                    : 0.45
                  : stageIntensity(progress, STAGE_PROGRESS[index]);
                const stageReveal = prefersReducedMotion
                  ? index <= activeStage
                    ? 1
                    : 0.6
                  : clamp01((progress - (STAGE_PROGRESS[index] - 0.22)) / 0.34);
                const isActive = index <= activeStage;
                const posterLift = prefersReducedMotion ? 0 : mix(20, -10, intensity);
                const cardLift = prefersReducedMotion ? 0 : mix(28, -8, intensity);
                const posterScale = mix(0.97, 1.02, stageReveal);
                const cardScale = mix(0.985, 1.03, stageReveal);
                const posterBlur = prefersReducedMotion ? 0 : mix(2.2, 0, stageReveal);
                const cardBlur = prefersReducedMotion ? 0 : mix(3.2, 0, stageReveal);
                const connectorHeight = Math.max(stage.card.y - point.y - 18, 64);

                return (
                  <div key={stage.label}>
                    <div
                      className={`pointer-events-none absolute z-20 w-px bg-gradient-to-b transition-opacity duration-300 ${
                        isActive
                          ? 'from-primary-500/90 via-primary-400/82 to-primary-500/5'
                          : 'from-[var(--border-color)]/80 via-[var(--border-color)]/40 to-transparent'
                      }`}
                      style={{
                        left: formatPercent(point.x, VIEWBOX_WIDTH),
                        top: formatPercent(point.y, VIEWBOX_HEIGHT),
                        height: formatPercent(connectorHeight, VIEWBOX_HEIGHT),
                        opacity: mix(0.45, 1, stageReveal),
                      }}
                    />

                    <div
                      className={`pointer-events-none absolute rounded-[2rem] border px-6 py-5 transition-all duration-300 ${
                        isActive
                          ? 'border-primary-400/45 bg-primary-500/10 shadow-[0_32px_80px_rgba(59,130,246,0.16)]'
                          : 'border-[var(--border-color)] bg-[var(--bg-color)]/62'
                      }`}
                      style={{
                        left: formatPercent(stage.poster.x, VIEWBOX_WIDTH),
                        top: formatPercent(stage.poster.y, VIEWBOX_HEIGHT),
                        width: formatPercent(stage.poster.width, VIEWBOX_WIDTH),
                        minHeight: formatPercent(stage.poster.height, VIEWBOX_HEIGHT),
                        filter: `blur(${posterBlur}px)`,
                        opacity: mix(0.56, 1, stageReveal),
                        transform: `translate3d(0, ${posterLift}px, ${Math.round(intensity * 32)}px) scale(${posterScale}) rotateX(${mix(8, 0, intensity)}deg)`,
                        transformStyle: 'preserve-3d',
                        zIndex: 15 + Math.round(intensity * 14),
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--text-muted)]">
                          {stage.posterLabel}
                        </span>
                        <Icon
                          className={`h-11 w-11 transition-colors duration-300 ${
                            isActive ? 'text-primary-400' : 'text-[var(--text-muted)]/45'
                          }`}
                        />
                      </div>
                      <div
                        className={`mt-10 text-6xl font-brand leading-none transition-colors duration-300 ${
                          isActive ? 'text-primary-500/74' : 'text-primary-500/34'
                        }`}
                      >
                        {stage.posterWord}
                      </div>
                    </div>

                    <div
                      className={`absolute rounded-[2rem] border px-6 py-6 backdrop-blur-md transition-all duration-300 ${
                        index === activeStage
                          ? 'border-primary-500/58 bg-[var(--bg-color)]/92 shadow-[0_36px_90px_rgba(59,130,246,0.18)]'
                          : 'border-[var(--border-color)] bg-[var(--bg-color)]/88'
                      }`}
                      style={{
                        left: formatPercent(stage.card.x, VIEWBOX_WIDTH),
                        top: formatPercent(stage.card.y, VIEWBOX_HEIGHT),
                        width: formatPercent(stage.card.width, VIEWBOX_WIDTH),
                        filter: `blur(${cardBlur}px)`,
                        opacity: mix(0.74, 1, stageReveal),
                        transform: `translate3d(0, ${cardLift}px, ${Math.round(intensity * 44)}px) scale(${cardScale}) rotateX(${mix(11, 0, intensity)}deg)`,
                        transformStyle: 'preserve-3d',
                        zIndex: 20 + Math.round(intensity * 20),
                      }}
                    >
                      <div
                        className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                          isActive
                            ? 'border-primary-500/65 bg-primary-500/12 text-primary-400'
                            : 'border-[var(--border-color)] text-[var(--text-color)]'
                        }`}
                      >
                        <span
                          className={`h-3 w-3 rounded-full transition-all duration-300 ${
                            isActive
                              ? 'bg-primary-500 shadow-[0_0_0_5px_rgba(59,130,246,0.16)]'
                              : 'bg-[var(--border-color)]'
                          }`}
                        />
                        {stage.label}
                      </div>
                      <h3 className="mt-5 text-2xl font-display font-medium tracking-tight text-[var(--text-color)]">
                        {stage.title}
                      </h3>
                      <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
                        {stage.description}
                      </p>
                    </div>

                    <div
                      className={`pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? 'border-primary-500 bg-[var(--bg-color)] shadow-[0_0_0_6px_rgba(59,130,246,0.16)]'
                          : 'border-[var(--text-color)]/55 bg-[var(--bg-color)]'
                      }`}
                      style={{
                        left: formatPercent(point.x, VIEWBOX_WIDTH),
                        top: formatPercent(point.y, VIEWBOX_HEIGHT),
                        zIndex: 40,
                      }}
                    >
                      <div
                        className={`absolute inset-[3px] rounded-full transition-colors duration-300 ${
                          isActive ? 'bg-primary-500' : 'bg-[var(--bg-color)]'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}

              <div
                className="pointer-events-none absolute z-50 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500"
                style={{
                  left: formatPercent(ballPoint.x, VIEWBOX_WIDTH),
                  top: formatPercent(ballPoint.y, VIEWBOX_HEIGHT),
                  boxShadow: `0 0 0 8px rgba(59, 130, 246, ${signalGlow}), 0 0 34px rgba(59, 130, 246, ${mix(
                    0.42,
                    0.85,
                    progress
                  )})`,
                }}
              />
            </motion.div>

            <div className="pointer-events-none absolute bottom-10 right-10 z-10 grid grid-cols-6 gap-3">
              {Array.from({ length: 36 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-2.5 w-2.5 rounded-full border ${
                    dotMatrixHighlights.has(index)
                      ? 'border-primary-500/80 bg-primary-500/80 shadow-[0_0_18px_rgba(59,130,246,0.42)]'
                      : 'border-[var(--border-color)] bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 lg:hidden">
        <div className="rounded-[1.8rem] border border-[var(--border-color)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-color)_90%,transparent),color-mix(in_srgb,var(--bg-color)_96%,transparent))] p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
            <span className="h-2.5 w-2.5 rounded-full bg-primary-500 shadow-[0_0_0_5px_rgba(59,130,246,0.16)]" />
            Scroll flywheel
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 overflow-x-auto pb-1">
            {stages.map((stage, index) => (
              <div key={stage.label} className="flex min-w-[102px] flex-col items-center gap-3">
                <div
                  className={`h-px w-full ${index === stages.length - 1 ? 'opacity-0' : 'bg-[var(--border-color)]'}`}
                />
                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    index <= activeStage
                      ? 'border-primary-500 bg-primary-500 shadow-[0_0_0_5px_rgba(59,130,246,0.16)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-color)]'
                  }`}
                />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-color)]">
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>

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
              className={`rounded-[1.8rem] border p-5 transition-colors duration-300 ${
                index === activeStage
                  ? 'border-primary-500/55 bg-primary-500/10'
                  : 'border-[var(--border-color)] bg-[var(--surface-color)]'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div
                  className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] ${
                    isActive
                      ? 'border-primary-500/50 bg-primary-500/10 text-primary-500'
                      : 'border-[var(--border-color)] bg-[var(--bg-color)]/70 text-[var(--text-color)]'
                  }`}
                >
                  <span
                    className={`h-3 w-3 rounded-full ${
                      isActive
                        ? 'bg-primary-500 shadow-[0_0_0_4px_rgba(59,130,246,0.16)]'
                        : 'bg-[var(--border-color)]'
                    }`}
                  />
                  {stage.label}
                </div>
                <Icon className={`h-9 w-9 ${isActive ? 'text-primary-500' : 'text-[var(--text-muted)]'}`} />
              </div>
              <h3 className="mt-5 text-2xl font-display font-medium text-[var(--text-color)]">
                {stage.title}
              </h3>
              <p className="mt-3 leading-7 text-[var(--text-muted)]">{stage.description}</p>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
