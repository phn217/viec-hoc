type Props = { size?: number; onDark?: boolean };

export default function Logo({ size = 34, onDark = true }: Props) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true">
        <rect width="36" height="36" rx="11" fill="#D3FB52" />
        <path
          d="M24 12.2c-.9-2-3-3.2-5.6-3.2-3.3 0-5.6 1.8-5.6 4.4 0 6.2 10.6 3.2 10.6 9.3 0 2.7-2.4 4.5-5.8 4.5-2.9 0-5.2-1.3-6.2-3.6"
          fill="none"
          stroke="#052326"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
      <span className={`text-[21px] font-extrabold tracking-tight ${onDark ? "text-white" : "text-ink"}`}>
        studia
      </span>
    </div>
  );
}