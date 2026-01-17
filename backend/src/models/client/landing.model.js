import pool from '../../db.js';

class LandingModel {
  static async getFullLandingPage() {
    try {
      const queries = {
        hero: `SELECT * FROM bee_hero_section WHERE is_active = 1 LIMIT 1`,
        stats: `SELECT * FROM bee_stats WHERE is_active = 1 ORDER BY display_order ASC`,
        leaders: `SELECT * FROM bee_leaders WHERE is_active = 1 ORDER BY display_order ASC`,
        achievements: `SELECT * FROM bee_achievements WHERE is_active = 1 ORDER BY \`row_number\` ASC, display_order ASC`,
        timeline: `SELECT * FROM bee_timeline_events WHERE is_active = 1 ORDER BY display_order ASC`,
        activities: `SELECT * FROM bee_activities WHERE is_active = 1 ORDER BY display_order ASC`,
        projects: `SELECT * FROM bee_projects WHERE is_active = 1 ORDER BY display_order ASC`,
        gallery: `SELECT id, image_url as src, caption, height_class as height, display_order FROM bee_gallery WHERE is_active = 1 ORDER BY display_order ASC`,
        photos: `SELECT * FROM bee_photos WHERE is_active = 1 ORDER BY display_order ASC`,
        testimonials: `SELECT * FROM bee_testimonials WHERE is_active = 1 ORDER BY display_order ASC`,
        joinProcess: `SELECT * FROM bee_join_process WHERE is_active = 1 ORDER BY display_order ASC`,
      };

      const [
        [hero],
        [stats],
        [leaders],
        [achievements],
        [timeline],
        [activities],
        [projects],
        [gallery],
        [photos],
        [testimonials],
        [joinProcess]
      ] = await Promise.all([
        pool.query(queries.hero),
        pool.query(queries.stats),
        pool.query(queries.leaders),
        pool.query(queries.achievements),
        pool.query(queries.timeline),
        pool.query(queries.activities),
        pool.query(queries.projects),
        pool.query(queries.gallery),
        pool.query(queries.photos),
        pool.query(queries.testimonials),
        pool.query(queries.joinProcess),
      ]);

      return {
        hero: hero[0] || null,
        stats: stats || [],
        leaders: leaders || [],
        achievements: achievements || [],
        timeline: {
          events: timeline || [],
          pillars: [
            {
              icon: "Target",
              title: "Mục Tiêu",
              desc: "Xây dựng cộng đồng CNTT vững mạnh.",
              color: "text-orange-600",
              bg: "bg-orange-100",
              border: "border-gray-200",
            },
            {
              icon: "Flag",
              title: "Sứ Mệnh",
              desc: "Lan tỏa đam mê, trang bị kỹ năng thực chiến.",
              color: "text-yellow-700",
              bg: "bg-yellow-100",
              border: "border-gray-200",
            },
            {
              icon: "Zap",
              title: "Giá Trị",
              desc: "Đam mê - Sáng tạo - Hợp tác - Học hỏi.",
              color: "text-blue-600",
              bg: "bg-blue-100",
              border: "border-gray-200",
            },
            {
              icon: "Users",
              title: "Cộng Đồng",
              desc: "Kết nối Mentor, Alumni và Doanh nghiệp.",
              color: "text-green-600",
              bg: "bg-green-100",
              border: "border-gray-200",
            },
          ]
        }, // Frontend expects timeline.events and timeline.pillars
        activities: activities || [],
        projects: projects || [],
        photos: photos || [], // BehindTheCode
        moments: gallery || [], // MemberMoments (mapped from gallery)
        testimonials: testimonials || [],
        joinProcess: joinProcess || [],
      };
    } catch (error) {
      throw error;
    }
  }
}

export default LandingModel;
