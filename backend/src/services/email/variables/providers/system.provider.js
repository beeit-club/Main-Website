import BaseVariableProvider from './base.provider.js';

class SystemProvider extends BaseVariableProvider {
    getNamespace() {
        return 'system';
    }

    async getVariables(context) {
        const today = new Date();
        return {
            company_name: process.env.COMPANY_NAME || 'Bee IT Club',
            support_email: process.env.MAIL_USER || 'support@beeit.com',
            website_url: process.env.CLIENT_URL || 'http://localhost:3000',
            today_date: today.toLocaleDateString('vi-VN'),
            current_year: today.getFullYear()
        };
    }
}

export default new SystemProvider();
