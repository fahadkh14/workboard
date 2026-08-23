export default function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" fill="url(#wb-logo-grad)" />
      <rect x="6" y="6" width="8" height="8" rx="2.5" fill="white" fillOpacity="0.95" />
      <rect x="18" y="6" width="8" height="8" rx="2.5" fill="white" fillOpacity="0.55" />
      <rect x="6" y="18" width="8" height="8" rx="2.5" fill="white" fillOpacity="0.55" />
      <path d="M18 22.5L20.3 25L26 18.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="wb-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B5CE2" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
}
