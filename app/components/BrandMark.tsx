export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      data-brand-mark="gesp-evidence"
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <path
        d="M25 7H12L5 14v7l7 6h13v-8h-8"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path d="M15 15h10" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square" />
      <circle cx="25" cy="25" r="3" fill="#d4ad66" />
    </svg>
  );
}
