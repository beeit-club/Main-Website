import asyncWrapper from '../../middlewares/error.handler.js';
import answerService from '../../services/admin/answer.service.js';
import { utils } from '../../utils/index.js';
import AnswerSchema from '../../validation/admin/answer.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';
import {
  ANSWER_CREATE_SUCCESS,
  ANSWER_DELETE_SUCCESS,
  ANSWER_GET_DETAIL_SUCCESS,
  ANSWER_GET_SUCCESS,
  ANSWER_UPDATE_SUCCESS,
  ANSWER_VOTE_SUCCESS,
} from '../../common/message/qa.message.js';

const answerController = {
  getAnswers: asyncWrapper(async (req, res) => {
    // Lấy question_id từ query thay vì params
    const { question_id } = req.query;
    const query = PaginationSchema.cast(req.query);
    const validQuery = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { content } = req.query;
    const result = await answerService.getAnswersForQuestion(
      question_id, // Truyền question_id vào service
      { ...validQuery, filters: { content } },
    );
    utils.success(res, ANSWER_GET_SUCCESS, result);
  }),

  // 👇 THAY ĐỔI LOGIC
  createAnswer: asyncWrapper(async (req, res) => {
    await AnswerSchema.create.validate(req.body, { abortEarly: false });

    // Lấy question_id từ body thay vì params
    const answerData = { ...req.body };
    const newAnswer = await answerService.createAnswer(answerData);
    utils.success(res, ANSWER_CREATE_SUCCESS, { id: newAnswer.insertId });
  }),

  getAnswerById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;
    const answer = await answerService.getOneAnswer(id);
    utils.success(res, ANSWER_GET_DETAIL_SUCCESS, { answer });
  }),

  updateAnswer: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await AnswerSchema.update.validate(req.body, { abortEarly: false });
    const { id } = req.params;

    await answerService.updateAnswer(id, req.body);
    utils.success(res, ANSWER_UPDATE_SUCCESS, { id: Number(id) });
  }),

  deleteAnswer: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;
    await answerService.deleteAnswer(id);
    utils.success(res, ANSWER_DELETE_SUCCESS, { id: Number(id) });
  }),

  voteAnswer: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await AnswerSchema.vote.validate(req.body);
    const { id } = req.params;
    const { vote_type } = req.body;

    const result = await answerService.voteAnswer(id, vote_type);
    utils.success(res, ANSWER_VOTE_SUCCESS, result);
  }),
};

export default answerController;
