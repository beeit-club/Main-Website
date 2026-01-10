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
      if (!isCheck) {
        throw new ServiceError(
          'Bài viết không tồn tại', // Bạn cần định nghĩa message này
          'POST_NO_EXISTS_CODE', // và code này
          'Bài không tồn tại',
          404,
        );
      }

      // Tăng số lượt xem trước khi lấy bài viết
      await postModel.incrementViewCount(slug);

      // Lấy thông tin bài viết
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

      // Log dữ liệu từ service
      console.log('=== DEBUG: Question data in Service ===');
      console.log('Question object:', JSON.stringify(question, null, 2));
      console.log('author_name:', question?.author_name);
      console.log('author_avatar:', question?.author_avatar);
      console.log('author_id:', question?.author_id);
      console.log('Type of author_avatar:', typeof question?.author_avatar);
      console.log('Is author_avatar null?', question?.author_avatar === null);
      console.log(
        'Is author_avatar undefined?',
        question?.author_avatar === undefined,
      );
      console.log('========================================');

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

  // === EVENTS (CLIENT) ===
  getAllEvents: async (options) => {
    try {
      // Chỉ lấy events published (status = 1)
      const filters = {
        ...options,
        status: options.status || 1,
      };

      // Nếu không phải member/admin thì chỉ lấy public
      if (!options.isMember) {
        filters.is_public = '1';
      }

      const events = await eventModel.getAllEvents(filters);
      return events;
    } catch (error) {
      throw error;
    }
  },

  getEventBySlug: async (slug, isMember = false) => {
    try {
      // Lấy event by slug
      const eventId = await eventModel.getEventBySlug(slug);
      if (!eventId || !eventId.id) {
        throw new ServiceError(
          'Sự kiện không tồn tại',
          'EVENT_NOT_FOUND',
          'Sự kiện không tồn tại hoặc chưa được công khai',
          404,
        );
      }
      // Kiểm tra event có published hoặc finished không
      const fullEvent = await eventModel.getEventById(eventId.id, true);
      
      // Cho phép xem nếu status là 1 (published) hoặc 3 (finished)
      const isValidStatus = fullEvent && (fullEvent.status === 1 || fullEvent.status === 3);

      if (!fullEvent || !isValidStatus || (!isMember && fullEvent.is_public !== 1)) {
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

  checkEventRegistration: async (eventId, userId) => {
    try {
      const registration = await eventModel.getRegistrationByUser(eventId, userId);
      return registration;
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
