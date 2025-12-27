// services/client/beeitClient.js

const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;
const ONE_HOUR_IN_SECONDS = 3600;

/**
 * Lấy tất cả dữ liệu BeeIT Landing Page (Server-side)
 */
export const getBeeitData = async () => {
  try {
    const url = `${baseUrl}/client/beeit`;
    console.log("🔍 [FRONTEND] Fetching BeeIT data from:", url);
    const startTime = Date.now();

    const res = await fetch(url, {
      method: "GET",
      next: {
        revalidate: ONE_HOUR_IN_SECONDS, // Revalidate mỗi giờ (fallback)
        tags: [
          "beeit",
          "beeit-hero",
          "beeit-stats",
          "beeit-footer",
          "beeit-leaders",
        ],
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(
      "📡 [FRONTEND] Response status:",
      res.status,
      "in",
      duration,
      "ms"
    );

    if (res.status === 404) {
      console.warn("⚠️ [FRONTEND] BeeIT data not found (404)");
      return null;
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        "❌ [FRONTEND] Failed to fetch BeeIT data. Status:",
        res.status
      );
      console.error("❌ [FRONTEND] Error response:", errorText);
      throw new Error(`Failed to fetch BeeIT data. Status: ${res.status}`);
    }

    const data = await res.json();

    // LOG CHI TIẾT RESPONSE OBJECT
    console.log("═══════════════════════════════════════════════════════");
    console.log("🔍 [FRONTEND] ===== RAW RESPONSE OBJECT =====");
    console.log(
      "📦 [FRONTEND] Full response keys:",
      data ? Object.keys(data) : "null"
    );
    console.log("📦 [FRONTEND] Response status:", data?.status);
    console.log("📦 [FRONTEND] Response message:", data?.message);
    console.log("📦 [FRONTEND] Has data property:", !!data?.data);
    console.log("📦 [FRONTEND] data.data type:", typeof data?.data);
    if (data?.data) {
      console.log("📦 [FRONTEND] data.data keys:", Object.keys(data.data));
      console.log(
        "📦 [FRONTEND] data.data.achievements:",
        data.data.achievements
          ? `Array(${data.data.achievements.length})`
          : "null/undefined"
      );
      console.log(
        "📦 [FRONTEND] data.data.photos:",
        data.data.photos
          ? `Array(${data.data.photos.length})`
          : "null/undefined"
      );
    }
    console.log(
      "📦 [FRONTEND] Full response (first 500 chars):",
      JSON.stringify(data).substring(0, 500)
    );
    console.log("═══════════════════════════════════════════════════════");

    // Parse response - utils.success trả về { status: 'success', message: '...', data: {...} }
    // Vậy cần lấy data.data (không phải data.data.data)
    const beeitData = data?.data || {
      hero: null,
      stats: [],
      footer: null,
      leaders: [],
      achievements: [],
      photos: [],
    };

    console.log("✅ [FRONTEND] Parsed beeitData keys:", Object.keys(beeitData));
    console.log(
      "✅ [FRONTEND] Parsed achievements count:",
      beeitData.achievements?.length || 0
    );
    console.log(
      "✅ [FRONTEND] Parsed photos count:",
      beeitData.photos?.length || 0
    );

    // Log chi tiết dữ liệu nhận được
    console.log("✅ [FRONTEND] BeeIT data received:");
    console.log(
      "📊 [FRONTEND] Hero:",
      beeitData.hero
        ? {
            id: beeitData.hero.id,
            title_line1: beeitData.hero.title_line1,
            title_line2: beeitData.hero.title_line2,
            background_image_url:
              beeitData.hero.background_image_url?.substring(0, 50) + "...",
            updated_at: beeitData.hero.updated_at,
          }
        : "null"
    );
    console.log("📊 [FRONTEND] Stats count:", beeitData.stats?.length || 0);
    if (beeitData.stats?.length > 0) {
      console.log(
        "📊 [FRONTEND] Stats:",
        beeitData.stats.map((s) => ({
          id: s.id,
          stat_key: s.stat_key,
          value: s.value,
          label: s.label,
          updated_at: s.updated_at,
        }))
      );
    }
    console.log(
      "📊 [FRONTEND] Footer:",
      beeitData.footer
        ? {
            id: beeitData.footer.id,
            contact_email: beeitData.footer.contact_email,
            updated_at: beeitData.footer.updated_at,
          }
        : "null"
    );
    console.log("📊 [FRONTEND] Leaders count:", beeitData.leaders?.length || 0);
    if (beeitData.leaders?.length > 0) {
      console.log(
        "📊 [FRONTEND] Leaders:",
        beeitData.leaders.map((l) => ({
          id: l.id,
          name: l.name,
          role: l.role,
          image_url: l.image_url?.substring(0, 50) + "...",
          updated_at: l.updated_at,
        }))
      );
    }
    console.log(
      "📊 [FRONTEND] Achievements count:",
      beeitData.achievements?.length || 0
    );
    if (beeitData.achievements?.length > 0) {
      console.log(
        "📊 [FRONTEND] Achievements:",
        beeitData.achievements.map((a) => ({
          id: a.id,
          title: a.title,
          year: a.year,
          row_number: a.row_number,
          display_order: a.display_order,
          updated_at: a.updated_at,
        }))
      );
    }
    console.log("📊 [FRONTEND] Photos count:", beeitData.photos?.length || 0);
    if (beeitData.photos?.length > 0) {
      console.log(
        "📊 [FRONTEND] Photos:",
        beeitData.photos.map((p) => ({
          id: p.id,
          image_url: p.image_url?.substring(0, 50) + "...",
          alt_text: p.alt_text,
          display_order: p.display_order,
          updated_at: p.updated_at,
        }))
      );
    }

    return beeitData;
  } catch (error) {
    console.error("❌ [FRONTEND] Error fetching BeeIT data:", error);
    // Return empty structure on error
    return {
      hero: null,
      stats: [],
      footer: null,
      leaders: [],
      achievements: [],
      photos: [],
    };
  }
};

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
