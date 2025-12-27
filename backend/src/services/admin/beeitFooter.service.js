// services/admin/beeitFooter.service.js

import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { BeeitFooterModel } from '../../models/admin/index.js';
import { revalidateBeeit } from '../../utils/revalidateCache.js';

const beeitFooterService = {
  // Lấy footer settings
  getFooterSettings: async () => {
    try {
      let settings = await BeeitFooterModel.getFooterSettings();
      
      // Nếu chưa có, tạo mặc định
      if (!settings) {
        const defaultData = {
          terminal_prompt: 'guest@beeit-terminal:~',
          heading_text: '# Kết nối với chúng tôi',
          subheading_text: 'Sẵn sàng kích hoạt tiềm năng của bạn?',
          command_prompt: 'guest@beeit:~$',
          command_text: 'join --email',
          placeholder_text: 'nhập_email_của_bạn',
          button_text: '[GỬI_LỆNH]',
          contact_email: 'contact@beeit.club',
          location_text: 'TP.HCM, Việt Nam',
          copyright_text: '© {year} BEE IT CLUB. MỌI HỆ THỐNG ĐANG HOẠT ĐỘNG.',
        };
        const result = await BeeitFooterModel.createFooterSettings(defaultData);
        settings = { id: result.insertId, ...defaultData };
      }
      
      return settings;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật footer settings
  updateFooterSettings: async (id, settingsData) => {
    const settings = await BeeitFooterModel.getFooterSettingsById(id);
    if (!settings) {
      throw new ServiceError(
        'Footer settings không tồn tại',
        'FOOTER_SETTINGS_NOT_FOUND',
        'Không tìm thấy Footer settings với ID này',
        404,
      );
    }

    const result = await BeeitFooterModel.updateFooterSettings(id, settingsData);
    
    // Revalidate cache ngay lập tức
    revalidateBeeit().catch(err => {
      console.error('Error revalidating BeeIT cache after Footer update:', err);
    });

    return result;
  },

  // Tạo footer settings mới (nếu chưa có)
  createFooterSettings: async (settingsData) => {
    // Kiểm tra xem đã có settings chưa
    const existing = await BeeitFooterModel.getFooterSettings();
    if (existing) {
      throw new ServiceError(
        'Footer settings đã tồn tại',
        'FOOTER_SETTINGS_ALREADY_EXISTS',
        'Chỉ có thể có một Footer settings. Vui lòng cập nhật settings hiện tại.',
        409,
      );
    }

    return await BeeitFooterModel.createFooterSettings(settingsData);
  },
};

export default beeitFooterService;

