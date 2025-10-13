// services/admin/event.service.js

import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import eventModel from '../../models/admin/event.model.js';

const eventService = {
  // === EVENTS ===
  getAllEvents: (options) => eventModel.getAllEvents(options),

  async getEventById(id, activeOnly = true) {
    const event = await eventModel.getEventById(id, activeOnly);
    if (!event) {
      throw new ServiceError(
        message.Event.EVENT_NOT_FOUND,
        code.Event.EVENT_NOT_FOUND_CODE,
        null,
        404,
      );
    }
    return event;
  },

  async createEvent(data) {
    const existing = await eventModel.getEventBySlug(data.slug);
    if (existing) {
      throw new ServiceError(
        message.Event.EVENT_SLUG_EXISTS,
        code.Event.EVENT_SLUG_EXISTS_CODE,
        null,
        409,
      );
    }
    return eventModel.createEvent(data);
  },

  async updateEvent(id, data) {
    await this.getEventById(id);
    if (data.slug) {
      const existing = await eventModel.getEventBySlug(data.slug, id);
      if (existing) {
        throw new ServiceError(
          message.Event.EVENT_SLUG_EXISTS,
          code.Event.EVENT_SLUG_EXISTS_CODE,
          null,
          409,
        );
      }
    }
    return eventModel.updateEvent(id, data);
  },

  async deleteEvent(id) {
    await this.getEventById(id);
    return eventModel.deleteEvent(id);
  },

  // === REGISTRATIONS ===
  getAllRegistrations: (eventId, options) =>
    eventModel.getAllRegistrationsForEvent(eventId, options),

  async createRegistration(eventId, data) {
    const event = await this.getEventById(eventId);

    if (
      event.registration_deadline &&
      new Date(event.registration_deadline) < new Date()
    ) {
      throw new ServiceError(
        message.Event.REGISTRATION_DEADLINE_PASSED,
        code.Event.REGISTRATION_DEADLINE_PASSED_CODE,
      );
    }

    if (event.max_participants) {
      const currentCount = await eventModel.getRegistrationCount(eventId);
      if (currentCount >= event.max_participants) {
        throw new ServiceError(
          message.Event.EVENT_IS_FULL,
          code.Event.EVENT_IS_FULL_CODE,
        );
      }
    }

    const registrationData = { event_id: eventId, ...data };
    if (data.user_id) {
      registrationData.registration_type = 'private';
      const existingReg = await eventModel.getRegistrationByUser(
        eventId,
        data.user_id,
      );
      if (existingReg) {
        throw new ServiceError(
          message.Event.USER_ALREADY_REGISTERED,
          code.Event.USER_ALREADY_REGISTERED_CODE,
          null,
          409,
        );
      }
    } else {
      registrationData.registration_type = 'public';
    }

    return eventModel.createRegistration(registrationData);
  },

  // === ATTENDANCES ===
  getAllAttendances: (eventId, options) =>
    eventModel.getAllAttendancesForEvent(eventId, options),

  async performCheckIn(eventId, registrationId, notes) {
    const registration = await eventModel.getRegistrationById(registrationId);
    if (!registration || registration.event_id !== Number(eventId)) {
      throw new ServiceError(
        message.Event.REGISTRATION_NOT_FOUND,
        code.Event.REGISTRATION_NOT_FOUND_CODE,
        null,
        404,
      );
    }

    const existingCheckIn = await eventModel.getAttendanceByRegistrationId(
      registrationId,
    );
    if (existingCheckIn) {
      throw new ServiceError(
        message.Event.ALREADY_CHECKED_IN,
        code.Event.ALREADY_CHECKED_IN_CODE,
        null,
        409,
      );
    }

    const attendanceData = {
      event_id: eventId,
      registration_id: registrationId,
      user_id: registration.user_id, // Lấy từ bản ghi registration
      checked_in: true,
      check_in_time: new Date(),
      notes: notes,
      // checked_in_by: req.user.id // Lấy từ middleware
    };

    return eventModel.createAttendance(attendanceData);
  },
};

export default eventService;
