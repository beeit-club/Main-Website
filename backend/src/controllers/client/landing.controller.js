import LandingModel from '../../models/client/landing.model.js';

class LandingController {
    static async getLandingData(req, res) {
        try {
            const data = await LandingModel.getFullLandingPage();
            console.log("🔥 [BACKEND] Landing Data Response:", JSON.stringify(data, null, 2));
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching landing page data:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default LandingController;
