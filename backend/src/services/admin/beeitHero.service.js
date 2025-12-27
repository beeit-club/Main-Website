// services/admin/beeitHero.service.js

import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { BeeitHeroModel } from '../../models/admin/index.js';
import { revalidateBeeit } from '../../utils/revalidateCache.js';

const beeitHeroService = {
  // Lấy Hero
  getHero: async () => {
    try {
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔍 [HERO SERVICE] ===== BẮT ĐẦU LẤY HERO =====');
      console.log('📅 [HERO SERVICE] Time:', new Date().toISOString());
      
      let hero = await BeeitHeroModel.getHero();
      
      console.log('📊 [HERO SERVICE] Hero từ database:');
      if (hero) {
        console.log('  ✅ Hero found!');
        console.log('  📋 ID:', hero.id);
        console.log('  📋 Title Line 1:', hero.title_line1);
        console.log('  📋 Title Line 2:', hero.title_line2);
        console.log('  ✅ Is Active:', hero.is_active);
        console.log('  📅 Updated At:', hero.updated_at);
      } else {
        console.log('  ❌ Hero: NULL');
      }
      
      // Nếu chưa có, tạo mặc định
      if (!hero) {
        console.log('───────────────────────────────────────────────────────');
        console.log('⚠️  [HERO SERVICE] Không tìm thấy Hero, tạo mặc định...');
        const defaultData = {
          background_image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
          title_line1: 'BUILDING THE',
          title_line2: 'DIGITAL HIVE',
          subtitle: 'Cộng đồng lập trình viên đam mê công nghệ. Nơi kết nối tri thức, chia sẻ kinh nghiệm và kiến tạo những sản phẩm đột phá.',
          is_active: true,
        };
        console.log('📝 [HERO SERVICE] Default data:', defaultData);
        
        try {
          console.log('🔄 [HERO SERVICE] Calling createHero...');
          const result = await BeeitHeroModel.createHero(defaultData);
          console.log('✅ [HERO SERVICE] Đã tạo Hero mặc định thành công!');
          console.log('  📋 Insert ID:', result.insertId);
          console.log('  📋 Affected Rows:', result.affectedRows);
          
          // Fetch lại hero sau khi tạo
          console.log('🔄 [HERO SERVICE] Fetch lại Hero sau khi tạo...');
          hero = await BeeitHeroModel.getHero();
          
          if (!hero) {
            console.log('⚠️  [HERO SERVICE] Vẫn không tìm thấy Hero sau khi tạo, tạo object từ result');
            // Nếu vẫn không có, tạo object từ result
            hero = { id: result.insertId, ...defaultData };
          } else {
            console.log('✅ [HERO SERVICE] Đã fetch lại Hero thành công');
          }
        } catch (createError) {
          console.error('❌ [HERO SERVICE] Lỗi khi tạo Hero mặc định:');
          console.error('  💥 Error Message:', createError.message);
          console.error('  💥 Error Code:', createError.code);
          console.error('  💥 Error SQL State:', createError.sqlState);
          console.error('  💥 Error Stack:', createError.stack);
          
          // Nếu lỗi do duplicate (đã có hero), thử fetch lại
          if (createError.message?.includes('already exists') || createError.code === 'ER_DUP_ENTRY') {
            console.log('⚠️  [HERO SERVICE] Hero đã tồn tại (duplicate), fetch lại...');
            hero = await BeeitHeroModel.getHero();
          } else {
            throw createError;
          }
        }
      }
      
      console.log('───────────────────────────────────────────────────────');
      console.log('✅ [HERO SERVICE] ===== KẾT QUẢ =====');
      if (hero) {
        console.log('  ✅ Hero sẽ được trả về:');
        console.log('  📋 ID:', hero.id);
        console.log('  📋 Title Line 1:', hero.title_line1);
        console.log('  📋 Title Line 2:', hero.title_line2);
        console.log('  📋 Subtitle:', hero.subtitle?.substring(0, 60) + '...');
        console.log('  🖼️  Background Image:', hero.background_image_url?.substring(0, 60) + '...');
      } else {
        console.log('  ❌ Hero: NULL (sẽ trả về null)');
      }
      console.log('═══════════════════════════════════════════════════════');
      
      return hero;
    } catch (error) {
      console.error('❌ [HERO SERVICE] Lỗi khi lấy Hero:', error);
      console.error('❌ [HERO SERVICE] Error stack:', error.stack);
      throw error;
    }
  },

  // Cập nhật Hero
  updateHero: async (id, heroData) => {
    const hero = await BeeitHeroModel.getHeroById(id);
    if (!hero) {
      throw new ServiceError(
        'Hero không tồn tại',
        'HERO_NOT_FOUND',
        'Không tìm thấy Hero với ID này',
        404,
      );
    }

    const result = await BeeitHeroModel.updateHero(id, heroData);
    
    // Revalidate cache ngay lập tức
    revalidateBeeit().catch(err => {
      console.error('Error revalidating BeeIT cache after Hero update:', err);
    });

    return result;
  },

  // Tạo Hero mới (nếu chưa có)
  createHero: async (heroData) => {
    // Kiểm tra xem đã có Hero chưa
    const existing = await BeeitHeroModel.getHero();
    if (existing) {
      throw new ServiceError(
        'Hero đã tồn tại',
        'HERO_ALREADY_EXISTS',
        'Chỉ có thể có một Hero. Vui lòng cập nhật Hero hiện tại.',
        409,
      );
    }

    return await BeeitHeroModel.createHero(heroData);
  },
};

export default beeitHeroService;

