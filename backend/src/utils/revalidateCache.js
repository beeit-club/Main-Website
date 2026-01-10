/**
 * Utility để gọi Next.js revalidate API từ backend
 * Sử dụng khi admin update content
 */

/**
 * Call Next.js revalidate API
 * @param {string} tag - Cache tag để revalidate
 * @returns {Promise<boolean>} - true nếu thành công
 */
export async function callRevalidateAPI(tag) {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const secret = process.env.REVALIDATE_SECRET;

    if (!frontendUrl) {
      console.warn('FRONTEND_URL not set, skipping revalidate');
      return false;
    }

    const url = new URL(`${frontendUrl}/api/revalidate`);
    url.searchParams.set('tag', tag);
    if (secret) {
      url.searchParams.set('secret', secret);
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(
        `Revalidate failed for tag "${tag}":`,
        response.status,
        response.statusText,
      );
      return false;
    }

    const data = await response.json();
    console.log(`Revalidated cache for tag: ${tag}`, data);
    return true;
  } catch (error) {
    console.error(`Error calling revalidate API for tag "${tag}":`, error);
    // Không throw error để không block flow
    return false;
  }
}