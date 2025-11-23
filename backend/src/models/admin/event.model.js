// models/admin/event.model.js
import {
  findOne,
  insert,
  selectWithPagination,
  update,
} from '../../utils/database.js';
import { dateTime } from '../../utils/datetime.js';

class eventModel {
  // === EVENTS ===
  static async getAllEvents(options = {}) {
    let sql = `SELECT id, title, slug, start_time, end_time, location, status, is_public, created_at FROM events WHERE deleted_at IS NULL`;
    const params = [];

    if (options.q) {
      sql += ` AND title LIKE ?`;
      params.push(`%${options.q}%`);
    }
    if (options.status) {
      sql += ` AND status = ?`;
      params.push(options.status);
    }
    if (options.is_public !== undefined) {
      sql += ` AND is_public = ?`;
      // Xử lý cả string và number
      const isPublicValue = options.is_public === 'true' || options.is_public === '1' || options.is_public === 1 ? 1 : 0;
      params.push(isPublicValue);
    }
    if (options.start_date) {
      sql += ` AND DATE(start_time) >= ?`;
      params.push(options.start_date);
    }
    if (options.end_date) {
      sql += ` AND DATE(end_time) <= ?`;
      params.push(options.end_date);
    }

    const validSortFields = ['start_time', 'created_at'];
    options.orderBy = {
      field: validSortFields.includes(options.sort_by)
        ? options.sort_by
        : 'created_at',
      direction: options.sort_order === 'asc' ? 'ASC' : 'DESC',
    };

    return selectWithPagination(sql, params, options);
  }

  static getEventById(id, activeOnly = true) {
    let sql = `SELECT * FROM events WHERE id = ?`;
    if (activeOnly) sql += ` AND deleted_at IS NULL`;
    return findOne(sql, [id]);
  }

  static getEventBySlug(slug, excludeId = null) {
    let sql = `SELECT id FROM events WHERE slug = ? AND deleted_at IS NULL`;
    const params = [slug];
    if (excludeId) {
      sql += ` AND id != ?`;
      params.push(excludeId);
    }
    return findOne(sql, params);
  }

  static createEvent(data) {
    return insert('events', data);
  }
  static updateEvent(id, data) {
    return update('events', data, { id });
  }
  static deleteEvent(id) {
    return update('events', { deleted_at: dateTime() }, { id });
  }

  // === REGISTRATIONS ===
  static getRegistrationCount(eventId) {
    const sql = `SELECT COUNT(id) as total FROM event_registrations WHERE event_id = ? AND deleted_at IS NULL`;
    return findOne(sql, [eventId]).then((res) => res.total || 0);
  }

  static getRegistrationByUser(eventId, userId) {
    const sql = `SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ? AND deleted_at IS NULL`;
    return findOne(sql, [eventId, userId]);
  }

  static createRegistration(data) {
    return insert('event_registrations', data);
  }

  static getRegistrationById(id) {
    return findOne(`SELECT * FROM event_registrations WHERE id = ?`, [id]);
  }

  static async getAllRegistrationsForEvent(eventId, options = {}) {
    let sql = `SELECT * FROM event_registrations WHERE event_id = ? AND deleted_at IS NULL`;
    const params = [eventId];
    if (options.registration_type) {
      sql += ` AND registration_type = ?`;
      params.push(options.registration_type);
    }
    if (options.q) {
      sql += ` AND (guest_name LIKE ? OR guest_email LIKE ?)`;
      params.push(`%${options.q}%`, `%${options.q}%`);
    }
    return selectWithPagination(sql, params, options);
  }

  // === ATTENDANCES ===
  static getAttendanceByRegistrationId(registrationId) {
    const sql = `SELECT id FROM event_attendances WHERE registration_id = ?`;
    return findOne(sql, [registrationId]);
  }

  static createAttendance(data) {
    return insert('event_attendances', data);
  }

  static async getAllAttendancesForEvent(eventId, options = {}) {
    // Câu lệnh này cần JOIN để lấy thông tin người đăng ký
    let sql = `
        SELECT a.id, a.check_in_time, a.notes, r.guest_name, r.guest_email, u.fullname 
        FROM event_attendances a
        LEFT JOIN event_registrations r ON a.registration_id = r.id
        LEFT JOIN users u ON a.user_id = u.id
        WHERE a.event_id = ?`;
    const params = [eventId];
    if (options.checked_in) {
      sql += ` AND a.checked_in = ?`;
      params.push(options.checked_in === 'true');
    }
    if (options.q) {
      sql += ` AND (r.guest_name LIKE ? OR u.fullname LIKE ?)`;
      params.push(`%${options.q}%`, `%${options.q}%`);
    }

    return selectWithPagination(sql, params, options);
  }
}

export default eventModel;
