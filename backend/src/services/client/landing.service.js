import LandingModel from '../../models/client/landing.model.js';

const LandingService = {
  getLandingPage: async () => {
    try {
      const data = await LandingModel.getFullLandingPage();
      
      // Process media if needed (e.g., separate by type)
      if (data.media) {
        data.moments = data.media.filter(m => m.type === 'moment');
        data.behind_scenes = data.media.filter(m => m.type === 'behind_scene');
        delete data.media;
      }

      // Process about section if needed (map by section name)
      if (data.about) {
        const aboutMap = {};
        data.about.forEach(item => {
            if (!aboutMap[item.section]) {
                aboutMap[item.section] = [];
            }
            aboutMap[item.section].push(item);
        });
        data.about = aboutMap;
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default LandingService;
