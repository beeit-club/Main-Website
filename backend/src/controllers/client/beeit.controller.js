// controllers/client/beeit.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import {
  beeitHeroService,
  beeitStatService,
  beeitFooterService,
  beeitLeaderService,
  beeitEmailSubmissionService,
  beeitAchievementService,
  beeitBehindSceneService,
} from '../../services/admin/index.js';
import { utils } from '../../utils/index.js';

const beeitController = {
  // Lấy tất cả dữ liệu BeeIT Landing Page (Public)
  getBeeitData: asyncWrapper(async (req, res) => {
    try {
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔍 [BEEIT API] ===== BẮT ĐẦU FETCH DỮ LIỆU BEEIT =====');
      console.log('📅 [BEEIT API] Time:', new Date().toISOString());
      console.log('🌐 [BEEIT API] Request URL:', req.url);
      console.log('🌐 [BEEIT API] Request Method:', req.method);
      const startTime = Date.now();

      // Fetch tất cả data song song
      console.log(
        '🔄 [BEEIT API] Bắt đầu fetch song song: Hero, Stats, Footer, Leaders, Achievements, Photos...',
      );
      const [hero, stats, footer, leaders, achievements, photos] =
        await Promise.all([
          beeitHeroService.getHero().catch((err) => {
            console.error('❌ [BEEIT API] Lỗi fetch Hero:', err.message);
            console.error('❌ [BEEIT API] Hero Error Stack:', err.stack);
            return null;
          }),
          beeitStatService.getAllStats().catch((err) => {
            console.error('❌ [BEEIT API] Lỗi fetch Stats:', err.message);
            console.error('❌ [BEEIT API] Stats Error Stack:', err.stack);
            return { data: [] };
          }),
          beeitFooterService.getFooterSettings().catch((err) => {
            console.error('❌ [BEEIT API] Lỗi fetch Footer:', err.message);
            console.error('❌ [BEEIT API] Footer Error Stack:', err.stack);
            return null;
          }),
          beeitLeaderService
            .getAllLeaders({ filters: { status: 'active' } })
            .catch((err) => {
              console.error('❌ [BEEIT API] Lỗi fetch Leaders:', err.message);
              console.error('❌ [BEEIT API] Leaders Error Stack:', err.stack);
              return { data: [] };
            }),
          beeitAchievementService
            .getAllAchievements({ filters: { status: 'active' } })
            .catch((err) => {
              console.error(
                '❌ [BEEIT API] Lỗi fetch Achievements:',
                err.message,
              );
              console.error(
                '❌ [BEEIT API] Achievements Error Stack:',
                err.stack,
              );
              return { data: [] };
            }),
          beeitBehindSceneService
            .getAllPhotos({ filters: { status: 'active' } })
            .catch((err) => {
              console.error('❌ [BEEIT API] Lỗi fetch Photos:', err.message);
              console.error('❌ [BEEIT API] Photos Error Stack:', err.stack);
              return { data: [] };
            }),
        ]);

      console.log('✅ [BEEIT API] Đã fetch xong tất cả data');

      const responseData = {
        hero: hero || null,
        stats: stats?.data || [],
        footer: footer || null,
        leaders: leaders?.data || [],
        achievements: achievements?.data || [],
        photos: photos?.data || [],
      };

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Log chi tiết dữ liệu
      console.log('═══════════════════════════════════════════════════════');
      console.log('📊 [BEEIT API] ===== KẾT QUẢ FETCH =====');
      console.log('⏱️  [BEEIT API] Thời gian xử lý:', duration, 'ms');
      console.log('───────────────────────────────────────────────────────');

      // Log Hero
      console.log('🦸 [BEEIT API] === HERO ===');
      if (hero) {
        console.log('  ✅ Hero found!');
        console.log('  📋 ID:', hero.id);
        console.log('  📋 Title Line 1:', hero.title_line1);
        console.log('  📋 Title Line 2:', hero.title_line2);
        console.log('  📋 Subtitle:', hero.subtitle?.substring(0, 80) + '...');
        console.log(
          '  🖼️  Background Image:',
          hero.background_image_url?.substring(0, 60) + '...',
        );
        console.log('  ✅ Is Active:', hero.is_active);
        console.log('  📅 Created At:', hero.created_at);
        console.log('  📅 Updated At:', hero.updated_at);
        console.log('  📦 Full Hero Object:', JSON.stringify(hero, null, 2));
      } else {
        console.log('  ❌ Hero: NULL');
      }

      // Log Stats
      console.log('───────────────────────────────────────────────────────');
      console.log('📊 [BEEIT API] === STATS ===');
      console.log('  📈 Count:', stats?.data?.length || 0);
      if (stats?.data?.length > 0) {
        stats.data.forEach((stat, index) => {
          console.log(`  📊 Stat ${index + 1}:`, {
            id: stat.id,
            stat_key: stat.stat_key,
            value: stat.value,
            label: stat.label,
            suffix: stat.suffix,
            display_order: stat.display_order,
            updated_at: stat.updated_at,
          });
        });
      } else {
        console.log('  ❌ Stats: Empty array');
      }

      // Log Footer
      console.log('───────────────────────────────────────────────────────');
      console.log('📄 [BEEIT API] === FOOTER ===');
      if (footer) {
        console.log('  ✅ Footer found!');
        console.log('  📋 ID:', footer.id);
        console.log('  📧 Contact Email:', footer.contact_email);
        console.log('  📍 Location:', footer.location_text);
        console.log('  📅 Updated At:', footer.updated_at);
      } else {
        console.log('  ❌ Footer: NULL');
      }

      // Log Leaders
      console.log('───────────────────────────────────────────────────────');
      console.log('👥 [BEEIT API] === LEADERS ===');
      console.log('  👤 Count:', leaders?.data?.length || 0);
      if (leaders?.data?.length > 0) {
        leaders.data.forEach((leader, index) => {
          console.log(`  👤 Leader ${index + 1}:`, {
            id: leader.id,
            name: leader.name,
            role: leader.role,
            image_url: leader.image_url?.substring(0, 50) + '...',
            status: leader.status,
            updated_at: leader.updated_at,
          });
        });
      } else {
        console.log('  ❌ Leaders: Empty array');
      }

      // Log Achievements
      console.log('───────────────────────────────────────────────────────');
      console.log('🏆 [BEEIT API] === ACHIEVEMENTS ===');
      console.log('  🏅 Raw result:', achievements ? 'Has data' : 'NULL');
      console.log('  🏅 Data type:', typeof achievements);
      console.log('  🏅 Has data property:', !!achievements?.data);
      console.log('  🏅 Count:', achievements?.data?.length || 0);
      if (achievements?.data?.length > 0) {
        console.log('  ✅ Achievements found! Full list:');
        achievements.data.forEach((achievement, index) => {
          console.log(`  🏅 Achievement ${index + 1}:`, {
            id: achievement.id,
            title: achievement.title,
            year: achievement.year,
            description: achievement.description?.substring(0, 50) + '...',
            image_url: achievement.image_url?.substring(0, 50) + '...',
            row_number: achievement.row_number,
            display_order: achievement.display_order,
            status: achievement.status,
            created_at: achievement.created_at,
            updated_at: achievement.updated_at,
          });
        });
      } else {
        console.log('  ❌ Achievements: Empty array or no data');
        console.log(
          '  🔍 Debug - achievements object:',
          JSON.stringify(achievements, null, 2),
        );
      }

      // Log Photos
      console.log('───────────────────────────────────────────────────────');
      console.log('📸 [BEEIT API] === PHOTOS ===');
      console.log('  📷 Raw result:', photos ? 'Has data' : 'NULL');
      console.log('  📷 Data type:', typeof photos);
      console.log('  📷 Has data property:', !!photos?.data);
      console.log('  📷 Count:', photos?.data?.length || 0);
      if (photos?.data?.length > 0) {
        console.log('  ✅ Photos found! Full list:');
        photos.data.forEach((photo, index) => {
          console.log(`  📷 Photo ${index + 1}:`, {
            id: photo.id,
            image_url: photo.image_url?.substring(0, 50) + '...',
            alt_text: photo.alt_text,
            display_order: photo.display_order,
            status: photo.status,
            created_at: photo.created_at,
            updated_at: photo.updated_at,
          });
        });
      } else {
        console.log('  ❌ Photos: Empty array or no data');
        console.log(
          '  🔍 Debug - photos object:',
          JSON.stringify(photos, null, 2),
        );
      }

      console.log('───────────────────────────────────────────────────────');
      console.log('📤 [BEEIT API] Sending response...');
      console.log('📦 [BEEIT API] Response Data Structure:', {
        hasHero: !!responseData.hero,
        statsCount: responseData.stats?.length || 0,
        hasFooter: !!responseData.footer,
        leadersCount: responseData.leaders?.length || 0,
        achievementsCount: responseData.achievements?.length || 0,
        photosCount: responseData.photos?.length || 0,
      });
      console.log('═══════════════════════════════════════════════════════');

      utils.success(res, 'Lấy dữ liệu BeeIT thành công', responseData);
    } catch (error) {
      console.error('❌ [BEEIT API] Error fetching BeeIT data:', error);
      // Return empty data structure instead of error
      utils.success(res, 'Lấy dữ liệu BeeIT thành công', {
        hero: null,
        stats: [],
        footer: null,
        leaders: [],
        achievements: [],
        photos: [],
      });
    }
  }),

  // Submit email từ Footer form (Public)
  submitEmail: asyncWrapper(async (req, res) => {
    const { email } = req.body;

    try {
      const result = await beeitEmailSubmissionService.createSubmission(email);
      utils.success(res, 'Gửi email thành công', { submission: result });
    } catch (error) {
      throw error;
    }
  }),
};

export default beeitController;
