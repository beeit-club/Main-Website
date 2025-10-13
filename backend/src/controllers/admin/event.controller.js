// controllers/admin/event.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import { message } from '../../common/message/index.js';
import eventService from '../../services/admin/event.service.js';
import { slugify } from '../../utils/function.js';
import { utils } from '../../utils/index.js';
import EventSchema from '../../validation/admin/event.validation.js';
import { params } from '../../validation/common/common.schema.js';

const eventController = {
  // === EVENTS ===
  getEvents: asyncWrapper(async (req, res) => {
    const events = await eventService.getAllEvents(req.query);
    utils.success(res, message.Event.EVENT_GET_SUCCESS, { events });
  }),

  createEvent: asyncWrapper(async (req, res) => {
    const data = await EventSchema.create.validate(req.body, {
      abortEarly: false,
    });
    data.slug = slugify(data.title);
    // data.created_by = req.user.id; // Lấy từ middleware xác thực
    const event = await eventService.createEvent(data);
    utils.success(res, message.Event.EVENT_CREATE_SUCCESS, {
      id: event.insertId,
    });
  }),

  getEventById: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params);
    const event = await eventService.getEventById(id);
    utils.success(res, message.Event.EVENT_GET_DETAIL_SUCCESS, { event });
  }),

  updateEvent: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params);
    const data = await EventSchema.update.validate(req.body, {
      abortEarly: false,
    });
    if (data.title) {
      data.slug = slugify(data.title);
    }
    await eventService.updateEvent(id, data);
    utils.success(res, message.Event.EVENT_UPDATE_SUCCESS);
  }),

  deleteEvent: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params);
    await eventService.deleteEvent(id);
    utils.success(res, message.Event.EVENT_DELETE_SUCCESS);
  }),

  // === REGISTRATIONS ===
  getRegistrations: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params, {
      abortEarly: false,
    }); // Cần tạo schema này
    const registrations = await eventService.getAllRegistrations(id, req.query);
    utils.success(res, 'Lấy danh sách đăng ký thành công', { registrations });
  }),

  createRegistration: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params, { abortEarly: false });
    const data = await EventSchema.createRegistration.validate(req.body, {
      abortEarly: false,
    });
    // if (req.user) data.user_id = req.user.id; // Ưu tiên user đã đăng nhập
    await eventService.createRegistration(id, data);
    utils.success(res, message.Event.REGISTRATION_SUCCESS);
  }),

  // === ATTENDANCES ===
  getAttendances: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params, { abortEarly: false });
    const attendances = await eventService.getAllAttendances(id, req.query);
    utils.success(res, 'Lấy danh sách điểm danh thành công', { attendances });
  }),

  performCheckIn: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params);
    const data = await EventSchema.checkIn.validate(req.body);
    await eventService.performCheckIn(id, data.registration_id, data.notes);
    utils.success(res, message.Event.CHECKIN_SUCCESS);
  }),
};

export default eventController;
