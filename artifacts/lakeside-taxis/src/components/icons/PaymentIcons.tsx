/* Card-scheme and wallet marks for the checkout trust row, drawn inline so the
   payment block has no external image requests and no layout shift while it
   loads. Simplified brand marks, shown only to state which payment methods the
   Square checkout accepts — the standard merchant use.

   Each renders at a fixed 34x22 chip so the row stays on one optical baseline. */

const CHIP_W = 34;
const CHIP_H = 22;

function Chip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg
      width={CHIP_W}
      height={CHIP_H}
      viewBox="0 0 34 22"
      role="img"
      aria-label={label}
      focusable="false"
      className="qp-card-mark"
    >
      <rect x="0.5" y="0.5" width="33" height="21" rx="3.5" fill="#fff" stroke="rgba(0,0,0,0.14)" />
      {children}
    </svg>
  );
}

export function IconVisa() {
  return (
    <Chip label="Visa">
      <text
        x="17"
        y="15.2"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="9"
        fontStyle="italic"
        fontWeight="700"
        letterSpacing="0.3"
        fill="#1434CB"
      >
        VISA
      </text>
    </Chip>
  );
}

export function IconMastercard() {
  return (
    <Chip label="Mastercard">
      <circle cx="14" cy="11" r="6.2" fill="#EB001B" />
      <circle cx="20" cy="11" r="6.2" fill="#F79E1B" />
      {/* The overlap colour is part of the mark, not a blend artefact. */}
      <path
        d="M17 6.2a6.2 6.2 0 0 0 0 9.6 6.2 6.2 0 0 0 0-9.6Z"
        fill="#FF5F00"
      />
    </Chip>
  );
}

export function IconAmex() {
  return (
    <Chip label="American Express">
      <rect x="2" y="2" width="30" height="18" rx="2" fill="#1F72CD" />
      <text
        x="17"
        y="14.4"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="6.4"
        fontWeight="700"
        letterSpacing="0.2"
        fill="#fff"
      >
        AMEX
      </text>
    </Chip>
  );
}

export function IconMaestro() {
  return (
    <Chip label="Maestro">
      <circle cx="14" cy="11" r="6.2" fill="#0099DF" />
      <circle cx="20" cy="11" r="6.2" fill="#ED0006" />
      <path d="M17 6.2a6.2 6.2 0 0 0 0 9.6 6.2 6.2 0 0 0 0-9.6Z" fill="#6C6BBD" />
    </Chip>
  );
}

export function IconApplePay() {
  return (
    <Chip label="Apple Pay">
      <text
        x="17"
        y="14.6"
        textAnchor="middle"
        fontFamily="-apple-system, Helvetica, Arial, sans-serif"
        fontSize="7.4"
        fontWeight="600"
        letterSpacing="-0.2"
        fill="#111"
      >
        &#63743; Pay
      </text>
    </Chip>
  );
}

export function IconGooglePay() {
  return (
    <Chip label="Google Pay">
      <text
        x="17"
        y="14.4"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="6.6"
        fontWeight="700"
        letterSpacing="-0.1"
        fill="#5F6368"
      >
        <tspan fill="#4285F4">G</tspan>
        <tspan fill="#EA4335">o</tspan>
        <tspan fill="#FBBC04">o</tspan>
        <tspan fill="#4285F4">g</tspan>
        <tspan fill="#34A853">l</tspan>
        <tspan fill="#EA4335">e</tspan>
        <tspan fill="#5F6368"> Pay</tspan>
      </text>
    </Chip>
  );
}

/* Closed padlock — used beside the encryption line and inside the pay button. */
export function IconLock({ size = 16, strokeWidth = 2 }: { size?: number; strokeWidth?: number }) {
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
    >
      <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" />
      <path d="M8 10.5V7.4a4 4 0 0 1 8 0v3.1" />
      <circle cx="12" cy="15.6" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}
