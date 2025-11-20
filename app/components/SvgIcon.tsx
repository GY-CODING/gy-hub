import * as React from "react";

interface SvgIconProps {
  src: string;
  alt?: string;
  className?: string;
}

export function SvgIcon({ src, alt = "", className = "size-4" }: SvgIconProps) {
  return <img src={src} alt={alt} className={className} />;
}
