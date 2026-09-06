import { useId } from "react";
import type { CoverVariant } from "./posts";

/**
 * The blog's one cover graphic.
 *
 * Every post gets the same drawing — an ink ground, the site's yellow
 * atmosphere, a faint street grid, and a route running from a pickup dot to a
 * destination badge. Only three things change per post: the shape of the route,
 * where the glow sits, and the glyph in the badge.
 *
 * This is deliberate. Stock photography of drivers and airports would drift in
 * tone the moment a fourth post is added; a drawn system holds. It also keeps
 * the covers in the same grammar as the icon set (24×24, 1.5 stroke, round
 * caps) and reuses the exact glyphs from components/icons/Icons.tsx rather than
 * inventing lookalikes.
 *
 * Colours are hard-coded rather than taken from CSS variables because these
 * are drawn marks on a fixed ink ground, not themed surfaces — the ground is
 * part of the artwork.
 */

const INK = "#1d1d1f";
const INK_DEEP = "#0c0c0e";
const YELLOW = "#ffd100";

/**
 * Safe band for a new variant.
 *
 * The post hero crops this 1200×630 artwork to a 1200×430 band, which shows
 * roughly y 100–530. Keep every mark that must survive — the pickup dot plus
 * its 26px radius, and the badge plus its 78px outer halo — inside y 120–510,
 * or it clips on the post page while still looking fine on the index card.
 */
interface CoverSpec {
  /** The route line. Starts at the pickup dot, ends under the badge. */
  route: string;
  /** Pickup dot. */
  from: [number, number];
  /** Destination badge centre. */
  to: [number, number];
  /** Centre of the warm field behind the composition. */
  glow: [number, number];
  /** Glyph paths, in the icon set's own 24×24 space. */
  glyph: string[];
  label: string;
}

const SPECS: Record<CoverVariant, CoverSpec> = {
  airport: {
    // One long ascent — a departure, read left to right.
    route: "M150 470 C 380 470, 470 404, 596 331 S 830 220, 986 205",
    from: [150, 470],
    to: [986, 205],
    glow: [880, 150],
    glyph: [
      "M10.2 4.3a1.7 1.7 0 0 1 3.4 0v4.4l7.3 4.1a.8.8 0 0 1 .4.7v1.3a.6.6 0 0 1-.78.57l-6.92-2.1v3.9l2.1 1.7a.7.7 0 0 1 .26.55v1.1a.5.5 0 0 1-.64.48l-3.42-1-3.42 1a.5.5 0 0 1-.64-.48v-1.1a.7.7 0 0 1 .26-.55l2.1-1.7v-3.9l-6.92 2.1a.6.6 0 0 1-.78-.57v-1.3a.8.8 0 0 1 .4-.7l7.3-4.1V4.3Z",
    ],
    label: "Airport transfer route illustration",
  },
  cruise: {
    // A gentle swell rather than a climb — the river, not the sky.
    route: "M148 268 C 300 190, 404 350, 560 336 S 826 452, 984 418",
    from: [148, 268],
    to: [984, 418],
    glow: [820, 470],
    glyph: [
      "M3 18.2c1.4 0 1.4 1.3 2.8 1.3s1.4-1.3 2.8-1.3 1.4 1.3 2.8 1.3 1.4-1.3 2.8-1.3 1.4 1.3 2.8 1.3 1.4-1.3 2.8-1.3",
      "M4.5 15.5 6 10.8a1 1 0 0 1 .95-.7h10.1a1 1 0 0 1 .95.7l1.5 4.7",
      "M12 10.1V6.4M9 6.4h6M12 6.4V4",
    ],
    label: "Cruise terminal transfer route illustration",
  },
  school: {
    // Squared-off with waypoints — a route with stops, run the same way daily.
    route: "M160 470 L 372 470 Q 412 470 412 434 L 412 342 Q 412 306 452 306 L 700 306 Q 740 306 740 269 L 740 236 Q 740 200 780 200 L 978 200",
    from: [160, 470],
    to: [978, 200],
    glow: [300, 520],
    glyph: [
      "M5.2 10.6a4.8 4.8 0 0 1 4.8-4.8h4a4.8 4.8 0 0 1 4.8 4.8v7.4a2 2 0 0 1-2 2H7.2a2 2 0 0 1-2-2v-7.4Z",
      "M9.2 5.8V4.6a1.6 1.6 0 0 1 1.6-1.6h2.4a1.6 1.6 0 0 1 1.6 1.6v1.2",
      "M9 13.4h6v3.4H9z",
    ],
    label: "School run route illustration",
  },
};

/** Faint street grid. Spacing is wide enough to read as a map, not as graph paper. */
const GRID_X = [0, 120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200];
const GRID_Y = [0, 105, 210, 315, 420, 525, 630];

const BADGE = 132;
const GLYPH_BOX = 66;

interface BlogCoverProps {
  variant: CoverVariant;
  className?: string;
}

export default function BlogCover({ variant, className }: BlogCoverProps) {
  const uid = useId().replace(/:/g, "");
  const spec = SPECS[variant];

  const glowId = `bc-glow-${uid}`;
  const routeFadeId = `bc-route-${uid}`;

  const [fx, fy] = spec.from;
  const [tx, ty] = spec.to;
  const [gx, gy] = spec.glow;

  const badgeX = tx - BADGE / 2;
  const badgeY = ty - BADGE / 2;
  const glyphOffset = (BADGE - GLYPH_BOX) / 2;
  const glyphScale = GLYPH_BOX / 24;

  return (
    <svg
      viewBox="0 0 1200 630"
      className={className}
      role="img"
      aria-label={spec.label}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={YELLOW} stopOpacity="0.24" />
          <stop offset="42%" stopColor={YELLOW} stopOpacity="0.08" />
          <stop offset="100%" stopColor={YELLOW} stopOpacity="0" />
        </radialGradient>

        {/* The route emerges from the ground rather than starting hard at the
            pickup dot — the fade is what stops it reading as a border. */}
        <linearGradient id={routeFadeId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={YELLOW} stopOpacity="0.35" />
          <stop offset="38%" stopColor={YELLOW} stopOpacity="1" />
          <stop offset="100%" stopColor={YELLOW} stopOpacity="1" />
        </linearGradient>
      </defs>

      <rect width="1200" height="630" fill={INK} />
      <rect width="1200" height="630" fill={INK_DEEP} opacity="0.45" />

      {/* Warm field — the same atmospheric move as .sp-hero::before. */}
      <ellipse cx={gx} cy={gy} rx="620" ry="520" fill={`url(#${glowId})`} />

      {/* Street grid */}
      <g stroke="#ffffff" strokeOpacity="0.055" strokeWidth="1.5">
        {GRID_X.map((x) => (
          <line key={`vx${x}`} x1={x} y1="0" x2={x} y2="630" />
        ))}
        {GRID_Y.map((y) => (
          <line key={`hy${y}`} x1="0" y1={y} x2="1200" y2={y} />
        ))}
      </g>

      {/* Route — a soft under-stroke gives the line depth on the dark ground,
          the dashed top-stroke reads as a journey rather than a border. */}
      <path
        d={spec.route}
        fill="none"
        stroke={YELLOW}
        strokeOpacity="0.16"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={spec.route}
        fill="none"
        stroke={`url(#${routeFadeId})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="26 18"
      />

      {/* Pickup */}
      <circle cx={fx} cy={fy} r="26" fill={YELLOW} fillOpacity="0.14" />
      <circle cx={fx} cy={fy} r="13" fill={YELLOW} />
      <circle cx={fx} cy={fy} r="5" fill={INK} />

      {/* Destination badge */}
      <g>
        <rect
          x={badgeX - 12}
          y={badgeY - 12}
          width={BADGE + 24}
          height={BADGE + 24}
          rx="42"
          fill={YELLOW}
          fillOpacity="0.13"
        />
        <rect x={badgeX} y={badgeY} width={BADGE} height={BADGE} rx="34" fill={YELLOW} />
        <g
          transform={`translate(${badgeX + glyphOffset} ${badgeY + glyphOffset}) scale(${glyphScale})`}
          fill="none"
          stroke={INK}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {spec.glyph.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}
