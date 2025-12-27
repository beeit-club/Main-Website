/**
 * Utility functions for handling images, especially Facebook CDN images
 * that may return 403 errors due to hotlinking protection
 */

/**
 * Get a safe image URL with fallback
 * @param {string} url - Original image URL
 * @param {string} fallback - Fallback image path (relative to public folder)
 * @returns {string} Safe image URL
 */
export function getSafeImageUrl(url, fallback = "/logo.jpg") {
  if (!url) return fallback;
  
  // If it's already a relative path, return as is
  if (!url.startsWith("http")) {
    return url;
  }
  
  // Convert Google Drive links to direct image URLs
  if (isGoogleDrive(url)) {
    return convertGoogleDriveUrl(url);
  }
  
  // For Facebook CDN URLs, we'll use them directly but with error handling
  // In production, these should be downloaded and stored locally
  return url;
}

/**
 * Check if URL is from Facebook CDN
 * @param {string} url - Image URL
 * @returns {boolean}
 */
export function isFacebookCDN(url) {
  if (!url) return false;
  return url.includes("fbcdn.net") || url.includes("facebook.com");
}

/**
 * Check if URL is from Google Drive
 * @param {string} url - Image URL
 * @returns {boolean}
 */
export function isGoogleDrive(url) {
  if (!url) return false;
  return url.includes("drive.google.com");
}

/**
 * Convert Google Drive sharing link to direct image URL
 * Supports formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID (already direct)
 * @param {string} url - Google Drive URL
 * @returns {string} Direct image URL
 */
export function convertGoogleDriveUrl(url) {
  if (!isGoogleDrive(url)) return url;
  
  try {
    // Extract file ID from different Google Drive URL formats
    let fileId = null;
    
    // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) {
      fileId = match1[1];
    }
    
    // Format 2: https://drive.google.com/open?id=FILE_ID
    if (!fileId) {
      const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match2) {
        fileId = match2[1];
      }
    }
    
    // Format 3: https://drive.google.com/uc?id=FILE_ID (already direct)
    if (!fileId) {
      const match3 = url.match(/\/uc\?id=([a-zA-Z0-9_-]+)/);
      if (match3) {
        fileId = match3[1];
      }
    }
    
    // If we found a file ID, convert to direct link
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    
    // If we can't extract file ID, return original URL
    return url;
  } catch (e) {
    console.error("Error converting Google Drive URL:", e);
    return url;
  }
}

/**
 * Get optimized image props for Next.js Image component
 * @param {string} src - Image source URL
 * @param {object} options - Additional options
 * @returns {object} Props for Next.js Image component
 */
export function getImageProps(src, options = {}) {
  const {
    alt = "",
    width,
    height,
    fallback = "/logo.jpg",
    unoptimized = false,
    ...rest
  } = options;

  // If Facebook CDN or Google Drive, use unoptimized to avoid 403/CORS issues
  const shouldUnoptimize = isFacebookCDN(src) || isGoogleDrive(src) || unoptimized;

  return {
    src: getSafeImageUrl(src, fallback),
    alt,
    width,
    height,
    unoptimized: shouldUnoptimize,
    onError: (e) => {
      // Fallback to default image on error
      if (e.target.src !== fallback) {
        e.target.src = fallback;
      }
    },
    ...rest,
  };
}

/**
 * Convert Facebook CDN URL to a more reliable format
 * This removes query parameters that might cause issues
 * @param {string} url - Facebook CDN URL
 * @returns {string} Cleaned URL
 */
export function cleanFacebookUrl(url) {
  if (!isFacebookCDN(url)) return url;
  
  try {
    const urlObj = new URL(url);
    // Keep only essential query params
    const essentialParams = ["_nc_cat", "_nc_sid"];
    const newParams = new URLSearchParams();
    
    essentialParams.forEach((param) => {
      if (urlObj.searchParams.has(param)) {
        newParams.set(param, urlObj.searchParams.get(param));
      }
    });
    
    urlObj.search = newParams.toString();
    return urlObj.toString();
  } catch (e) {
    return url;
  }
}

