// services/client/beeitClient.js

const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;
const ONE_HOUR_IN_SECONDS = 3600;

// getBeeitData removed as we now use mock data


/**
 * Submit email từ Footer form (Client-side)
 */
export const submitEmail = async (email) => {
  try {
    const res = await fetch(`${baseUrl}/client/beeit/email-submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Gửi email thất bại");
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
};
