import React from 'react';

/**
 * IPMS Brand Logo Component
 * Flexible logo component supporting full hero, horizontal lockup, and icon-only variants.
 */
export const IpmsLogo = ({
  variant = 'horizontal', // 'full' | 'horizontal' | 'icon'
  size = 'md',            // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showTagline = false,
  glow = false,
  className = '',
}) => {
  // Dimension Mappings for Icons
  const iconSizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textClasses = {
    xs: 'text-base font-extrabold',
    sm: 'text-lg font-black',
    md: 'text-xl font-black',
    lg: 'text-2xl font-black',
    xl: 'text-4xl font-black',
  };

  const iconClass = iconSizeMap[size] || iconSizeMap.md;
  const wordmarkClass = textClasses[size] || textClasses.md;

  // Standalone Icon SVG
  const IconMark = ({ customClass = iconClass }) => (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${customClass}`}>
      {/* Ambient Gradient Glow Backdrop */}
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] rounded-2xl blur-xl opacity-60 animate-pulse pointer-events-none" />
      )}

      {/* Main Vector Icon */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md relative z-10"
      >
        <defs>
          <linearGradient id="ipms-brand-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#feda75" />
            <stop offset="25%" stopColor="#fa7e1e" />
            <stop offset="50%" stopColor="#d62976" />
            <stop offset="75%" stopColor="#962fbf" />
            <stop offset="100%" stopColor="#4f5bd5" />
          </linearGradient>
        </defs>

        {/* Squircle App Silhouette */}
        <rect x="4" y="4" width="92" height="92" rx="26" fill="url(#ipms-brand-gradient)" />
        <rect x="7" y="7" width="86" height="86" rx="23" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />

        {/* 2x2 Post Grid Tile Elements */}
        {/* Top Left Tile */}
        <rect x="21" y="21" width="25" height="25" rx="7" fill="#ffffff" fillOpacity="0.95" />
        {/* Top Right Tile */}
        <rect x="54" y="21" width="25" height="25" rx="7" fill="#ffffff" fillOpacity="0.95" />
        {/* Bottom Left Tile */}
        <rect x="21" y="54" width="25" height="25" rx="7" fill="#ffffff" fillOpacity="0.95" />
        {/* Bottom Right Tile */}
        <rect x="54" y="54" width="25" height="25" rx="7" fill="#ffffff" fillOpacity="0.95" />

        {/* Camera Aperture Lens Dot in Top Left Tile */}
        <circle cx="33.5" cy="33.5" r="5" fill="url(#ipms-brand-gradient)" />

        {/* Analytics Spark Line in Top Right Tile */}
        <path
          d="M60 38.5L65.5 32.5L72 38"
          stroke="url(#ipms-brand-gradient)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Scheduled Checkmark in Bottom Right Tile */}
        <path
          d="M60 66.5L64.5 71L72 61"
          stroke="url(#ipms-brand-gradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center Focal Aperture Ring */}
        <circle cx="50" cy="50" r="8" fill="#ffffff" />
        <circle cx="50" cy="50" r="4" fill="url(#ipms-brand-gradient)" />
      </svg>
    </div>
  );

  // Variant A: Icon Only
  if (variant === 'icon') {
    return <IconMark />;
  }

  // Variant B: Full Hero Logo (Stacked for Login / Hero)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <IconMark customClass={iconClass} />
        <div className="mt-4 flex flex-col items-center">
          <span className={`tracking-tight text-white ${wordmarkClass}`}>
            IPMS
          </span>
          {(showTagline || true) && (
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 mt-1 uppercase">
              Influencer & Post Management Suite
            </span>
          )}
        </div>
      </div>
    );
  }

  // Variant C: Horizontal Lockup (Default for Navbar / Sidebar)
  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      <IconMark />
      <div className="flex flex-col text-left">
        <div className="flex items-center space-x-1.5 leading-none">
          <span className={`tracking-tight text-white ${wordmarkClass}`}>
            IPMS
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-gradient-to-r from-[#fa7e1e] to-[#d62976] text-white shadow-sm">
            PRO
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 mt-1 uppercase">
            Post Management System
          </span>
        )}
      </div>
    </div>
  );
};

// Export Raw SVG Strings for technical export / favicon / documentation
export const IPMS_ICON_ONLY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><defs><linearGradient id="ipms-insta-grad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#feda75"/><stop offset="25%" stop-color="#fa7e1e"/><stop offset="50%" stop-color="#d62976"/><stop offset="75%" stop-color="#962fbf"/><stop offset="100%" stop-color="#4f5bd5"/></linearGradient></defs><rect x="4" y="4" width="92" height="92" rx="26" fill="url(#ipms-insta-grad)"/><rect x="7" y="7" width="86" height="86" rx="23" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/><rect x="21" y="21" width="25" height="25" rx="7" fill="#ffffff" fill-opacity="0.95"/><rect x="54" y="21" width="25" height="25" rx="7" fill="#ffffff" fill-opacity="0.95"/><rect x="21" y="54" width="25" height="25" rx="7" fill="#ffffff" fill-opacity="0.95"/><rect x="54" y="54" width="25" height="25" rx="7" fill="#ffffff" fill-opacity="0.95"/><circle cx="33.5" cy="33.5" r="5" fill="url(#ipms-insta-grad)"/><path d="M60 38.5L65.5 32.5L72 38" stroke="url(#ipms-insta-grad)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 66.5L64.5 71L72 61" stroke="url(#ipms-insta-grad)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="50" r="8" fill="#ffffff"/><circle cx="50" cy="50" r="4" fill="url(#ipms-insta-grad)"/></svg>`;

export const IPMS_HORIZONTAL_LOCKUP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 80" fill="none"><defs><linearGradient id="ipms-insta-grad-h" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#feda75"/><stop offset="25%" stop-color="#fa7e1e"/><stop offset="50%" stop-color="#d62976"/><stop offset="75%" stop-color="#962fbf"/><stop offset="100%" stop-color="#4f5bd5"/></linearGradient></defs><g transform="translate(6, 6)"><rect x="0" y="0" width="68" height="68" rx="19" fill="url(#ipms-insta-grad-h)"/><rect x="2.5" y="2.5" width="63" height="63" rx="16.5" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/><rect x="15" y="15" width="16.5" height="16.5" rx="4.5" fill="#ffffff" fill-opacity="0.95"/><rect x="36.5" y="15" width="16.5" height="16.5" rx="4.5" fill="#ffffff" fill-opacity="0.95"/><rect x="15" y="36.5" width="16.5" height="16.5" rx="4.5" fill="#ffffff" fill-opacity="0.95"/><rect x="36.5" y="36.5" width="16.5" height="16.5" rx="4.5" fill="#ffffff" fill-opacity="0.95"/><circle cx="23.2" cy="23.2" r="3.5" fill="url(#ipms-insta-grad-h)"/><path d="M41 26L45 22L49 25" stroke="url(#ipms-insta-grad-h)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M41 45L44 48L49 42" stroke="url(#ipms-insta-grad-h)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="34" cy="34" r="5.5" fill="#ffffff"/><circle cx="34" cy="34" r="2.8" fill="url(#ipms-insta-grad-h)"/></g><text x="92" y="45" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="#ffffff" letter-spacing="-0.5">IPMS</text><text x="93" y="62" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="9" fill="#94a3b8" letter-spacing="1.2">POST MANAGEMENT SYSTEM</text></svg>`;

export const IPMS_FULL_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160" fill="none"><defs><linearGradient id="ipms-insta-grad-full" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#feda75"/><stop offset="25%" stop-color="#fa7e1e"/><stop offset="50%" stop-color="#d62976"/><stop offset="75%" stop-color="#962fbf"/><stop offset="100%" stop-color="#4f5bd5"/></linearGradient></defs><g transform="translate(84, 10)"><rect x="0" y="0" width="72" height="72" rx="20" fill="url(#ipms-insta-grad-full)"/><rect x="3" y="3" width="66" height="66" rx="17" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/><rect x="16" y="16" width="18" height="18" rx="5" fill="#ffffff" fill-opacity="0.95"/><rect x="38" y="16" width="18" height="18" rx="5" fill="#ffffff" fill-opacity="0.95"/><rect x="16" y="38" width="18" height="18" rx="5" fill="#ffffff" fill-opacity="0.95"/><rect x="38" y="38" width="18" height="18" rx="5" fill="#ffffff" fill-opacity="0.95"/><circle cx="25" cy="25" r="3.8" fill="url(#ipms-insta-grad-full)"/><path d="M43 28L47 24L51 27" stroke="url(#ipms-insta-grad-full)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M43 47L46.5 50.5L51 44" stroke="url(#ipms-insta-grad-full)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="36" cy="36" r="6" fill="#ffffff"/><circle cx="36" cy="36" r="3" fill="url(#ipms-insta-grad-full)"/></g><text x="120" y="112" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="36" fill="#ffffff" letter-spacing="1">IPMS</text><text x="120" y="136" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="11" fill="#94a3b8" letter-spacing="1">INFLUENCER &amp; POST MANAGEMENT SUITE</text></svg>`;
