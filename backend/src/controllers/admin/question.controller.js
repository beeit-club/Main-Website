import asyncWrapper from '../../middlewares/error.handler.js';
import questionService from '../../services/admin/question.service.js';
import { slugify } from '../../utils/function.js';
import { utils } from '../../utils/index.js';
import QuestionSchema from '../../validation/admin/question.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';
import {
  QUESTION_CREATE_SUCCESS,
  QUESTION_DELETE_SUCCESS,
  QUESTION_GET_DETAIL_SUCCESS,
  QUESTION_GET_SUCCESS,
  QUESTION_UPDATE_SUCCESS,
} from '../../common/message/qa.message.js';

const questionController = {
  getQuestions: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const validQuery = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const result = await questionService.getAllQuestions({
      ...validQuery,
      filters: req.query,
    });
    utils.success(res, QUESTION_GET_SUCCESS, result);
  }),

  getQuestionById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;
    const question = await questionService.getOneQuestion(id);
    utils.success(res, QUESTION_GET_DETAIL_SUCCESS, { question });
  }),

  createQuestion: asyncWrapper(async (req, res) => {
    await QuestionSchema.create.validate(req.body, { abortEarly: false });
    const { title } = req.body;
    const slug = slugify(title);

    const questionData = { ...req.body, slug };
    const newQuestion = await questionService.createQuestion(questionData);
    utils.success(res, QUESTION_CREATE_SUCCESS, { id: newQuestion.insertId });
  }),

  updateQuestion: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await QuestionSchema.update.validate(req.body, { abortEarly: false });

    const { id } = req.params;
    const { title } = req.body;
    let updateData = { ...req.body };
    if (title) {
      updateData.slug = slugify(title);
    }
    await questionService.updateQuestion(id, updateData);
    utils.success(res, QUESTION_UPDATE_SUCCESS, { id: Number(id) });
  }),

  deleteQuestion: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;
    await questionService.deleteQuestion(id);
    utils.success(res, QUESTION_DELETE_SUCCESS, { id: Number(id) });
  }),
};

export default questionController;
