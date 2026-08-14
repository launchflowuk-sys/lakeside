/**
 * Drawn icon set — replaces every emoji previously used as UI iconography.
 *
 * One consistent grammar: 24×24 viewBox, 1.5 stroke, round caps and joins,
 * no fills, currentColor throughout. Sized by the `size` prop, coloured by
 * the parent's text colour. Nothing here is decorative-only; each icon names
 * a real service or guarantee the business actually offers.
 */

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

function Svg({
  size = 24,
  className,
  strokeWidth = 1.5,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/* ── Place & coverage ── */

export function IconPin(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 10c0 5.4-6.5 11-8 11s-8-5.6-8-11a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.75" />
    </Svg>
  );
}

export function IconMap(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m9 4-5.4 2.2a1 1 0 0 0-.6.93v12.14a1 1 0 0 0 1.37.93L9 18l6 2 5.4-2.2a1 1 0 0 0 .6-.93V4.73a1 1 0 0 0-1.37-.93L15 6 9 4Z" />
      <path d="M9 4v14M15 6v14" />
    </Svg>
  );
}

/* ── Vehicles & travel ── */

export function IconCar(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.5 17h13M3 13.5h18M4.8 13.5l1.6-4.8A2 2 0 0 1 8.3 7.3h7.4a2 2 0 0 1 1.9 1.4l1.6 4.8" />
      <path d="M3 13.5v3.9a.6.6 0 0 0 .6.6h1.3a.6.6 0 0 0 .6-.6V17M21 13.5v3.9a.6.6 0 0 1-.6.6h-1.3a.6.6 0 0 1-.6-.6V17" />
      <path d="M6.75 15.4h.6M16.65 15.4h.6" />
    </Svg>
  );
}

export function IconPlane(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10.2 4.3a1.7 1.7 0 0 1 3.4 0v4.4l7.3 4.1a.8.8 0 0 1 .4.7v1.3a.6.6 0 0 1-.78.57l-6.92-2.1v3.9l2.1 1.7a.7.7 0 0 1 .26.55v1.1a.5.5 0 0 1-.64.48l-3.42-1-3.42 1a.5.5 0 0 1-.64-.48v-1.1a.7.7 0 0 1 .26-.55l2.1-1.7v-3.9l-6.92 2.1a.6.6 0 0 1-.78-.57v-1.3a.8.8 0 0 1 .4-.7l7.3-4.1V4.3Z" />
    </Svg>
  );
}

export function IconPlaneLanding(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 20h18" />
      <path d="M4.2 8.1 6 7.6l3.3 2.9 4.6-1.3-3.4-5.5 1.8-.5 5.5 5.1 3 -.8a1.9 1.9 0 0 1 1 3.67l-12 3.3a1.6 1.6 0 0 1-1.5-.35L4.2 8.1Z" />
    </Svg>
  );
}

export function IconShip(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 18.2c1.4 0 1.4 1.3 2.8 1.3s1.4-1.3 2.8-1.3 1.4 1.3 2.8 1.3 1.4-1.3 2.8-1.3 1.4 1.3 2.8 1.3 1.4-1.3 2.8-1.3" />
      <path d="M4.5 15.5 6 10.8a1 1 0 0 1 .95-.7h10.1a1 1 0 0 1 .95.7l1.5 4.7" />
      <path d="M12 10.1V6.4M9 6.4h6M12 6.4V4" />
    </Svg>
  );
}

/* ── Money & guarantees ── */

export function IconPound(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14.8 6.6a3.4 3.4 0 0 0-5.9 2.3v4.3c0 1.5-.7 2.9-1.9 3.8h9.9" />
      <path d="M7 12.2h6" />
    </Svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.2 4.8 6v5.6c0 4.2 3 7.3 7.2 9.2 4.2-1.9 7.2-5 7.2-9.2V6L12 3.2Z" />
      <path d="m9.2 11.9 2 2 3.6-3.9" />
    </Svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m4.8 12.4 4.6 4.6L19.2 7.2" />
    </Svg>
  );
}

/* ── Time & contact ── */

export function IconClock(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.2V12l3.2 1.9" />
    </Svg>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7.7 4.2h-2A2 2 0 0 0 3.7 6.4c.5 8.1 6.4 13.4 13.9 13.9a2 2 0 0 0 2.1-2v-2a1.4 1.4 0 0 0-1.2-1.4l-2.7-.4a1.4 1.4 0 0 0-1.35.6l-.85 1.2A12.8 12.8 0 0 1 8.4 10l1.2-.85a1.4 1.4 0 0 0 .55-1.35l-.4-2.4a1.4 1.4 0 0 0-1.35-1.2Z" />
    </Svg>
  );
}

export function IconWhatsApp(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.6 20.4l1.3-4.4a8.1 8.1 0 1 1 3.2 3.1l-4.5 1.3Z" />
      <path d="M9 8.6c-.3 0-.6.1-.8.4-.3.4-.9 1-.9 2s.8 2.1 1 2.3c.9 1.3 2 2.2 3.4 2.7 1.1.4 1.6.3 2.1.2.5-.1 1.2-.5 1.4-1.1.2-.5.2-1 .1-1.1l-1.6-.8c-.2-.1-.4 0-.5.1l-.5.7c-.1.1-.3.2-.5.1a5.4 5.4 0 0 1-2.6-2.3c-.1-.2 0-.4.1-.5l.5-.6c.1-.2.1-.3 0-.5l-.6-1.4c-.1-.2-.3-.3-.5-.3H9Z" />
    </Svg>
  );
}

export function IconMessage(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20.4 12.4a7.9 7.9 0 0 1-11.4 7.1L4.2 20.8l1.3-4.8A7.9 7.9 0 1 1 20.4 12.4Z" />
    </Svg>
  );
}

/* ── People & services ── */

export function IconBriefcase(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.2" y="7.6" width="17.6" height="12.2" rx="2" />
      <path d="M8.8 7.6V6a1.8 1.8 0 0 1 1.8-1.8h2.8A1.8 1.8 0 0 1 15.2 6v1.6" />
      <path d="M3.2 12.6h17.6M11 12.2h2v1.9h-2z" />
    </Svg>
  );
}

export function IconBackpack(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.2 10.6a4.8 4.8 0 0 1 4.8-4.8h4a4.8 4.8 0 0 1 4.8 4.8v7.4a2 2 0 0 1-2 2H7.2a2 2 0 0 1-2-2v-7.4Z" />
      <path d="M9.2 5.8V4.6a1.6 1.6 0 0 1 1.6-1.6h2.4a1.6 1.6 0 0 1 1.6 1.6v1.2" />
      <path d="M9 13.4h6v3.4H9z" />
    </Svg>
  );
}

export function IconLuggage(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5.2" y="7.4" width="13.6" height="12.4" rx="2" />
      <path d="M9.4 7.4V5.6a1.6 1.6 0 0 1 1.6-1.6h2a1.6 1.6 0 0 1 1.6 1.6v1.8" />
      <path d="M10 11.4v4.4M14 11.4v4.4" />
    </Svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9.4" cy="8.4" r="3.2" />
      <path d="M3.6 19.4a5.8 5.8 0 0 1 11.6 0" />
      <path d="M16.2 5.6a3.2 3.2 0 0 1 0 5.9M17.4 14.2a5.8 5.8 0 0 1 3 5.2" />
    </Svg>
  );
}

/* ── System & status ── */

export function IconSignal(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.1 15.6a5.6 5.6 0 0 1 0-7.2M18.9 8.4a5.6 5.6 0 0 1 0 7.2" />
      <path d="M7.9 13.4a2.4 2.4 0 0 1 0-2.8M16.1 10.6a2.4 2.4 0 0 1 0 2.8" />
      <circle cx="12" cy="12" r="1.4" />
      <path d="M12 13.4V20" />
    </Svg>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20.2 14.2A8.4 8.4 0 0 1 9.8 3.8a8.4 8.4 0 1 0 10.4 10.4Z" />
    </Svg>
  );
}

export function IconDoor(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.8 20.4h14.4" />
      <path d="M6.6 20.4V5a1.4 1.4 0 0 1 1.1-1.37l7.2-1.5A1.4 1.4 0 0 1 16.6 3.5v16.9" />
      <path d="M13.6 12.2v1.6" />
    </Svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.8 12h14.4M13.6 6.4 19.2 12l-5.6 5.6" />
    </Svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m9.6 5.6 6.4 6.4-6.4 6.4" />
    </Svg>
  );
}

/** Registry for icons chosen by string key in page data. */
export const ICONS = {
  pin: IconPin,
  map: IconMap,
  car: IconCar,
  plane: IconPlane,
  planeLanding: IconPlaneLanding,
  ship: IconShip,
  pound: IconPound,
  shield: IconShield,
  check: IconCheck,
  clock: IconClock,
  phone: IconPhone,
  whatsapp: IconWhatsApp,
  message: IconMessage,
  briefcase: IconBriefcase,
  backpack: IconBackpack,
  luggage: IconLuggage,
  users: IconUsers,
  signal: IconSignal,
  moon: IconMoon,
  door: IconDoor,
  arrowRight: IconArrowRight,
  chevronRight: IconChevronRight,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, ...props }: { name: IconName } & IconProps) {
  const Cmp = ICONS[name];
  return <Cmp {...props} />;
}
