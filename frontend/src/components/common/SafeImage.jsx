"use client";

import { useState } from "react";
import Image from "next/image";
import { getSafeImageUrl, isFacebookCDN, isGoogleDrive, getImageProps } from "@/lib/imageUtils";

/**
 * Safe Image component that handles Facebook CDN 403 errors
 * Falls back to a default image if the original fails to load
 */
export default function SafeImage({
  src,
  alt = "",
  width,
  height,
  fallback = "/logo.jpg",
  className = "",
  unoptimized,
  priority = false,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(() => getSafeImageUrl(src, fallback));
  const [hasError, setHasError] = useState(false);

  // Use unoptimized for Facebook CDN and Google Drive to avoid 403/CORS issues
  const shouldUnoptimize = unoptimized !== undefined
    ? unoptimized
    : isFacebookCDN(src) || isGoogleDrive(src);

  const handleError = () => {
    if (!hasError && imgSrc !== fallback) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  // If width/height not provided and using unoptimized, use regular img tag
  if (shouldUnoptimize && (!width || !height)) {
    // Extract fill from props to avoid passing it to img element
    const { fill, style, ...rest } = props;

    // If fill is true, we need to simulate Next.js Image fill behavior
    const fillStyle = fill ? {
      position: 'absolute',
      height: '100%',
      width: '100%',
      inset: 0,
      objectFit: 'cover',
      ...style
    } : style;

    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        style={fillStyle}
        {...rest}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={shouldUnoptimize}
      priority={priority}
      onError={handleError}
      {...props}
    />
  );
}

