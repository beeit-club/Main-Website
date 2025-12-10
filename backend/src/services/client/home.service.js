import ServiceError from '../../error/service.error.js';
import postModel from '../../models/admin/post.model.js';
import HomeModel from '../../models/client/home.model.js';
import questionModel from '../../models/admin/question.model.js';
import answerModel from '../../models/admin/answer.model.js';
import eventModel from '../../models/admin/event.model.js';
import { documentModel } from '../../models/admin/index.js';

/**
 * Build tree structure từ flat array của answers
 * @param {Array} answers - Flat array của answers
 * @returns {Array} - Tree structure với children
 */
function buildAnswerTree(answers) {
  // Tạo map để dễ dàng tìm answer theo id
  const answerMap = new Map();
  const rootAnswers = [];

  // Bước 1: Tạo map và clone answers
  answers.forEach((answer) => {
    answerMap.set(answer.id, { ...answer, children: [] });
  });

  // Bước 2: Xây dựng tree structure
  answers.forEach((answer) => {
    const answerWithChildren = answerMap.get(answer.id);

    if (answer.parent_id === null || answer.parent_id === undefined) {
      // Root answer (trả lời trực tiếp câu hỏi)
      rootAnswers.push(answerWithChildren);
    } else {
      // Nested answer (trả lời một answer khác)
      const parent = answerMap.get(answer.parent_id);
      if (parent) {
        parent.children.push(answerWithChildren);
      } else {
        // Nếu không tìm thấy parent, coi như root answer
        rootAnswers.push(answerWithChildren);
      }
    }
  });

  return rootAnswers;
}

const HomeService = {
  home: async () => {
    try {
      const home = await HomeModel.home();
      return home;
    } catch (error) {
      throw error;
    }
  },
  // lấy toàn bộ
  getAllCategory: async (option) => {
    try {
      const categories = await HomeModel.getAllCategory(option);
      return categories;
    } catch (error) {
      throw error;
    }
  },
  getAllDocumentCategory: async (option) => {
    try {
      const documentCategories = await HomeModel.getAllDocumentCategory(option);
      console.log(
        '🚀 ~ HomeService ~ getAllDocumentCategory ~ documentCategories:',
        documentCategories,
      );
      return documentCategories;
    } catch (error) {
      throw error;
    }
  },
  getAllTag: async (option) => {
    try {
      const tags = await HomeModel.getAllTag(option);
      return tags;
    } catch (error) {
      throw error;
    }
  },
  getAllPost: async (option) => {
    try {
      const tags = await HomeModel.getAllPost(option);
      return tags;
    } catch (error) {
      throw error;
    }
  },
  getPostDetaill: async (slug) => {
    try {
      // kiểm tra xem post tồn tại không
      const isCheck = await postModel.checkIsPost(slug);
      console.log('🚀 ~ isCheck:', isCheck);
      if (!isCheck) {
        throw new ServiceError(
          'Bài viết không tồn tại', // Bạn cần định nghĩa message này
          'POST_NO_EXISTS_CODE', // và code này
          'Bài không tồn tại',
          404,
        );
      }
      const post = await HomeModel.getPostDetaill(slug);
      return post;
    } catch (error) {
      throw error;
    }
  },
  getAllQuestions: async (option) => {
    try {
      const questions = await HomeModel.getAllQuestions(option);
      return questions;
    } catch (error) {
      throw error;
    }
  },

  getQuestionDetail: async (slug) => {
    try {
      const question = await HomeModel.getQuestionBySlug(slug);
      if (!question) {
        throw new ServiceError(
          'Câu hỏi không tồn tại',
          'QUESTION_NOT_FOUND',
          'Câu hỏi không tồn tại hoặc chưa được duyệt',
          404,
        );
      }

      // Build tree structure cho answers (nested comments)
      if (question.answers && question.answers.length > 0) {
        question.answers = buildAnswerTree(question.answers);
      }

      // (Nếu cần có thể tăng view_count ở đây)
      return question;
    } catch (error) {
      throw error;
    }
  },

  createQuestion: async (data) => {
    try {
      const result = await questionModel.createQuestion(data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  createAnswer: async (data) => {
    try {
      // Kiểm tra question tồn tại
      const questionExists = await questionModel.getOneQuestion(
        data.question_id,
      );
      if (!questionExists) {
        throw new ServiceError(
          'Câu hỏi không tồn tại',
          'QUESTION_NOT_FOUND',
          'Câu hỏi không tồn tại',
          404,
        );
      }
      const result = await answerModel.createAnswer(data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách thành viên CLB
  getAllMembers: async (options) => {
    try {
      const members = await HomeModel.getAllMembers(options);
      return members;
    } catch (error) {
      throw error;
    }
  },

  // === EVENTS (PUBLIC) ===
  getAllEvents: async (options) => {
    try {
      // Chỉ lấy events published (status = 1) và public
      const events = await eventModel.getAllEvents({
        ...options,
        status: options.status || 1, // Chỉ lấy published events
        is_public: '1', // Chỉ lấy public events (pass as string để model xử lý)
      });
      return events;
    } catch (error) {
      throw error;
    }
  },

  getEventBySlug: async (slug) => {
    try {
      // Lấy event by slug, chỉ lấy published và public
      const eventId = await eventModel.getEventBySlug(slug);
      if (!eventId || !eventId.id) {
        throw new ServiceError(
          'Sự kiện không tồn tại',
          'EVENT_NOT_FOUND',
          'Sự kiện không tồn tại hoặc chưa được công khai',
          404,
        );
      }
      // Kiểm tra event có published và public không
      const fullEvent = await eventModel.getEventById(eventId.id, true);
      if (!fullEvent || fullEvent.status !== 1 || fullEvent.is_public !== 1) {
        throw new ServiceError(
          'Sự kiện không tồn tại',
          'EVENT_NOT_FOUND',
          'Sự kiện không tồn tại hoặc chưa được công khai',
          404,
        );
      }
      return fullEvent;
    } catch (error) {
      throw error;
    }
  },

  // === DOCUMENTS (PUBLIC) ===
  getAllDocuments: async (options) => {
    try {
      // Chỉ lấy documents published (status = 1) và public (access_level = 'public')
      const documents = await documentModel.getAllDocuments({
        ...options,
        filters: {
          ...(options.filters || {}),
          status: 1, // Chỉ lấy published documents
          access_level: 'public', // Chỉ lấy public documents
        },
      });
      return documents;
    } catch (error) {
      throw error;
    }
  },

  getDocumentBySlug: async (slug) => {
    try {
      // Lấy document by slug, chỉ lấy published và public
      const documentId = await documentModel.checkIsDocument(slug);
      if (!documentId || !documentId.id) {
        throw new ServiceError(
          'Tài liệu không tồn tại',
          'DOCUMENT_NOT_FOUND',
          'Tài liệu không tồn tại hoặc chưa được công khai',
          404,
        );
      }
      // Kiểm tra document có published và public không
      const fullDocument = await documentModel.getOneDocument(documentId.id);
      if (
        !fullDocument ||
        fullDocument.status !== 1 ||
        fullDocument.access_level !== 'public'
      ) {
        throw new ServiceError(
          'Tài liệu không tồn tại',
          'DOCUMENT_NOT_FOUND',
          'Tài liệu không tồn tại hoặc chưa được công khai',
          404,
        );
      }
      return fullDocument;
    } catch (error) {
      throw error;
    }
  },

  // === SEARCH (PUBLIC) ===
  searchPostsAndQuestions: async (options) => {
    try {
      const results = await HomeModel.searchPostsAndQuestions(options);
      return results;
    } catch (error) {
      throw error;
    }
  },
};
export default HomeService;
