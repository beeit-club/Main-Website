// services/admin/event.service.js

import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import eventModel from '../../models/admin/event.model.js';
import { emailService } from '../email/emailService.js';
import { AuthModel } from '../../models/auth/index.js';

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
    const oldEvent = await this.getEventById(id);

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

    // Kiểm tra xem có thay đổi về thời gian hoặc địa điểm không
    const hasChanges =
      (data.start_time && data.start_time !== oldEvent.start_time) ||
      (data.location && data.location !== oldEvent.location);

    const result = await eventModel.updateEvent(id, data);

    // Nếu có thay đổi về thời gian hoặc địa điểm, gửi email thông báo
    if (hasChanges) {
      try {
        const updatedEvent = await this.getEventById(id);
        const changes = {
          original_start_time: oldEvent.start_time,
          new_start_time: data.start_time || oldEvent.start_time,
          original_location: oldEvent.location,
          new_location: data.location || oldEvent.location,
          reason: data.change_reason || null,
        };

        // Lấy tất cả registrations của event này
        const registrationsResult =
          await eventModel.getAllRegistrationsForEvent(id, {});
        const registrations = registrationsResult.data || registrationsResult;

        // Gửi email cho từng registration
        for (const reg of registrations) {
          try {
            const user = reg.user_id
              ? await AuthModel.getUserById(reg.user_id)
              : null;
            await emailService.sendEventCancellation(
              reg,
              updatedEvent,
              false, // isCancelled = false (chỉ thay đổi)
              changes,
              user,
            );
          } catch (emailError) {
            console.error(
              `Lỗi khi gửi email thông báo thay đổi cho registration ${reg.id}:`,
              emailError,
            );
          }
        }
      } catch (error) {
        console.error('Lỗi khi gửi email thông báo thay đổi sự kiện:', error);
        // Không throw error để không ảnh hưởng đến việc update
      }
    }

    return result;
  },

  async deleteEvent(id) {
    const event = await this.getEventById(id);
    const result = await eventModel.deleteEvent(id);

    // Gửi email thông báo hủy sự kiện cho tất cả registrations
    try {
      const registrationsResult = await eventModel.getAllRegistrationsForEvent(
        id,
        {},
      );
      const registrations = registrationsResult.data || registrationsResult;

      // Gửi email cho từng registration
      for (const reg of registrations) {
        try {
          const user = reg.user_id
            ? await AuthModel.getUserById(reg.user_id)
            : null;
          await emailService.sendEventCancellation(
            reg,
            event,
            true, // isCancelled = true
            { reason: 'Sự kiện đã bị hủy bởi Ban Quản Lý' },
            user,
          );
        } catch (emailError) {
          console.error(
            `Lỗi khi gửi email thông báo hủy cho registration ${reg.id}:`,
            emailError,
          );
        }
      }
    } catch (error) {
      console.error('Lỗi khi gửi email thông báo hủy sự kiện:', error);
      // Không throw error để không ảnh hưởng đến việc xóa
    }

    return result;
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
    let user = null;

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
      // Lấy thông tin user để gửi email
      user = await AuthModel.getUserById(data.user_id);
    } else {
      registrationData.registration_type = 'public';
    }

    const registration = await eventModel.createRegistration(registrationData);

    // Gửi email xác nhận đăng ký
    try {
      await emailService.sendEventRegistrationConfirmed(
        { ...registration, ...registrationData },
        event,
        user,
      );
    } catch (emailError) {
      console.error('Lỗi khi gửi email xác nhận đăng ký sự kiện:', emailError);
      // Không throw error để không ảnh hưởng đến việc đăng ký
    }

    return registration;
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

    const attendance = await eventModel.createAttendance(attendanceData);

    // Gửi email xác nhận check-in nếu có user_id
    if (registration.user_id) {
      try {
        const user = await AuthModel.getUserById(registration.user_id);
        const event = await this.getEventById(eventId);
        await emailService.sendEventCheckInConfirmation(
          attendance,
          event,
          user,
        );
      } catch (emailError) {
        console.error('Lỗi khi gửi email xác nhận check-in:', emailError);
        // Không throw error để không ảnh hưởng đến việc check-in
      }
    }

    return attendance;
  },
};

export default eventService;
