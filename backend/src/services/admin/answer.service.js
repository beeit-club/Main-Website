import {
  ANSWER_NOT_FOUND,
  ANSWER_INVALID_VOTE_TYPE,
  QUESTION_NOT_FOUND,
} from '../../common/message/qa.message.js';
import {
  ANSWER_NOT_FOUND_CODE,
  ANSWER_INVALID_VOTE_TYPE_CODE,
  QUESTION_NOT_FOUND_CODE,
} from '../../common/message/qa.code.js';
import ServiceError from '../../error/service.error.js';
import { answerModel, questionModel } from '../../models/admin/index.js';

const answerService = {
  getAnswersForQuestion: async (questionId, options) => {
    const questionExists = await questionModel.getOneQuestion(questionId);
    if (!questionExists) {
      throw new ServiceError(
        QUESTION_NOT_FOUND,
        QUESTION_NOT_FOUND_CODE,
        null,
        404,
      );
    }
    return answerModel.getAnswersForQuestion(questionId, options);
  },

  getOneAnswer: async (id) => {
    const answer = await answerModel.getOneAnswer(id);
    if (!answer) {
      throw new ServiceError(
        ANSWER_NOT_FOUND,
        ANSWER_NOT_FOUND_CODE,
        null,
        404,
      );
    }
    return answer;
  },

  createAnswer: async (answerData) => {
    const questionExists = await questionModel.getOneQuestion(
      answerData.question_id,
    );
    if (!questionExists) {
      throw new ServiceError(
        QUESTION_NOT_FOUND,
        QUESTION_NOT_FOUND_CODE,
        null,
        404,
      );
    }
    return answerModel.createAnswer(answerData);
  },

  updateAnswer: async (id, answerData) => {
    const exists = await answerModel.getOneAnswer(id);
    if (!exists) {
      throw new ServiceError(
        ANSWER_NOT_FOUND,
        ANSWER_NOT_FOUND_CODE,
        null,
        404,
      );
    }
    return answerModel.updateAnswer(id, answerData);
  },

  deleteAnswer: async (id) => {
    const exists = await answerModel.getOneAnswer(id);
    if (!exists) {
      throw new ServiceError(
        ANSWER_NOT_FOUND,
        ANSWER_NOT_FOUND_CODE,
        null,
        404,
      );
    }
    return answerModel.deleteAnswer(id);
  },

  voteAnswer: async (id, voteType) => {
    const exists = await answerModel.getOneAnswer(id);
    if (!exists) {
      throw new ServiceError(
        ANSWER_NOT_FOUND,
        ANSWER_NOT_FOUND_CODE,
        null,
        404,
      );
    }
    if (!['upvote', 'downvote'].includes(voteType)) {
      throw new ServiceError(
        ANSWER_INVALID_VOTE_TYPE,
        ANSWER_INVALID_VOTE_TYPE_CODE,
      );
    }

    const voteValue = voteType === 'upvote' ? 1 : -1;
    await answerModel.voteAnswer(id, voteValue);
    const updatedAnswer = await answerModel.getOneAnswer(id);
    return {
      id: updatedAnswer.id,
      vote_score: updatedAnswer.vote_score,
    };
  },
};

export default answerService;
