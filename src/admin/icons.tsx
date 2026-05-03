import React from "react";

export function Icon({ name, className = "", size = 16 }: { name: string; className?: string; size?: number }) {
  const cn = `inline-block ${className}`;
  switch (name) {
    case "trash":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18" />
          <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      );
    case "edit":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21v-3l11-11 3 3L6 21H3z" />
          <path d="M14.5 6.5l3 3" />
        </svg>
      );
    case "upload":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="M7 10l5-5 5 5" />
          <path d="M12 5v14" />
        </svg>
      );
    case "inbox":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6" />
          <path d="M16 6l-4-4-4 4" />
          <path d="M12 2v10" />
        </svg>
      );
    case "leaf":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11c0 5-4 9-9 9S3 16 3 11c0-4 2-7 6-9 0 0 5 1 9 5 3 3 2 4 3 4z" />
        </svg>
      );
    case "hike":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 20l4-6 2 3 5-8 3 6" />
          <circle cx="5" cy="19" r="1" />
        </svg>
      );
    case "yoga":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4" />
          <path d="M6 12c1-3 5-6 6-6s5 3 6 6" />
          <path d="M12 22s-4-4-6-6" />
        </svg>
      );
    case "bike":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M6 18l6-8 4 4" />
        </svg>
      );
    case "camera":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="7" width="18" height="14" rx="2" />
          <circle cx="12" cy="14" r="3" />
        </svg>
      );
    case "star":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7z" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "home":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L4 14h5v8h6v-8h5L12 2z" />
        </svg>
      );
    case "news":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M7 8h10M7 12h6" />
        </svg>
      );
    case "gift":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="8" width="18" height="8" />
          <path d="M12 8v12M3 12h18" />
        </svg>
      );
    case "gallery":
      return (
        <svg className={cn} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 21l-6-6-4 4-6-6" />
        </svg>
      );
    default:
      return <span className={cn} />;
  }
}

export default Icon;
