import BaseVariableProvider from './base.provider.js';
import UserDataMapper from '../../userDataMapper.service.js'; // Tạm thời dùng lại logic tính toán của mapper cũ

class UserProvider extends BaseVariableProvider {
    getNamespace() {
        return 'user';
    }

    /**
     * Context yêu cầu: { user: Object } hoặc { userData: Object }
     */
    async getVariables(context) {
        const user = context.user || context.userData;
        
        if (!user) {
            return {};
        }

        // Tận dụng lại logic map chuẩn từ UserDataMapper cũ để đảm bảo tính nhất quán
        // Sau này có thể move logic đó hẳn vào đây và xóa file cũ
        return UserDataMapper.mapUserToVariables(user);
    }
}

export default new UserProvider();
