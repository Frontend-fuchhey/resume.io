export function Brand({ size = 32, withText = true, textClass = '' }) {
  return (
    <span className="inline-flex select-none items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
        <rect width="64" height="64" rx="16" fill="#FF5E1A" />
        <rect x="1" y="1" width="62" height="62" rx="15" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <text x="32" y="44" fontFamily="'Poppins', sans-serif" fontSize="34" fontWeight="700" fill="#fff" textAnchor="middle">
          R
        </text>
      </svg>
      {withText && (
        <span className={`text-[16px] font-bold tracking-tight text-[#1A1A1A] ${textClass}`}>
          resume<span className="text-[#FF5E1A]">.io</span>
        </span>
      )}
    </span>
  )
}

export function Ambient() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#FBF9F5]">
      <div className="studio-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]" />
    </div>
  )
}
