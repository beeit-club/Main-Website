import pool from '../../db.js';
import { findOne } from '../../utils/database.js';

class DashboardModel {
  /**
   * Lấy thống kê tổng quan cho dashboard
   */
  static async getDashboardStats() {
    try {
      // Query tất cả thống kê trong một transaction để đảm bảo tính nhất quán
      const queries = {
        // Users stats
        users: `
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN deleted_at IS NULL AND is_active = 1 THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN deleted_at IS NULL AND is_active = 0 THEN 1 ELSE 0 END) as inactive,
            SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) as deleted
          FROM users
        `,
        
        // Posts stats
        posts: `
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN deleted_at IS NULL AND status = 1 THEN 1 ELSE 0 END) as published,
            SUM(CASE WHEN deleted_at IS NULL AND status = 0 THEN 1 ELSE 0 END) as draft,
            SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) as deleted,
            SUM(CASE WHEN deleted_at IS NULL THEN view_count ELSE 0 END) as total_views
          FROM posts
        `,
        
        // Events stats
        events: `
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN deleted_at IS NULL AND start_time > NOW() THEN 1 ELSE 0 END) as upcoming,
            SUM(CASE WHEN deleted_at IS NULL AND end_time < NOW() THEN 1 ELSE 0 END) as past,
            SUM(CASE WHEN deleted_at IS NULL AND start_time <= NOW() AND end_time >= NOW() THEN 1 ELSE 0 END) as ongoing,
            SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) as deleted
          FROM events
        `,
        
        // Applications stats
        applications: `
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as rejected
          FROM membership_applications
        `,
        
        // Documents stats
        documents: `
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN deleted_at IS NULL THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) as deleted,
            SUM(CASE WHEN deleted_at IS NULL THEN download_count ELSE 0 END) as total_downloads
          FROM documents
        `,
        
        // Questions stats
        questions: `
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN deleted_at IS NULL AND status = 1 THEN 1 ELSE 0 END) as published,
            SUM(CASE WHEN deleted_at IS NULL AND status = 0 THEN 1 ELSE 0 END) as draft,
            SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) as deleted,
            SUM(CASE WHEN deleted_at IS NULL THEN view_count ELSE 0 END) as total_views
          FROM questions
        `,
        
        // Answers stats
        answers: `
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN deleted_at IS NULL THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) as deleted,
            SUM(CASE WHEN deleted_at IS NULL AND is_accepted = 1 THEN 1 ELSE 0 END) as accepted
          FROM answers
        `,
        
        // Transactions stats
        transactions: `
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN type = 1 THEN amount ELSE 0 END) as total_income,
            SUM(CASE WHEN type = 2 THEN amount ELSE 0 END) as total_expense,
            SUM(CASE WHEN type = 1 THEN 1 ELSE 0 END) as income_count,
            SUM(CASE WHEN type = 2 THEN 1 ELSE 0 END) as expense_count
          FROM transactions
        `,
        
        // Email logs stats
        email_logs: `
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
          FROM email_logs
        `,
        
        // Event registrations stats
        event_registrations: `
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN deleted_at IS NULL THEN 1 ELSE 0 END) as active
          FROM event_registrations
        `,
        
        // Event attendances stats
        event_attendances: `
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN checked_in = 1 THEN 1 ELSE 0 END) as checked_in
          FROM event_attendances
        `,
      };

      // Thực thi tất cả queries song song
      const [
        [usersResult],
        [postsResult],
        [eventsResult],
        [applicationsResult],
        [documentsResult],
        [questionsResult],
        [answersResult],
        [transactionsResult],
        [emailLogsResult],
        [eventRegistrationsResult],
        [eventAttendancesResult],
      ] = await Promise.all([
        pool.query(queries.users),
        pool.query(queries.posts),
        pool.query(queries.events),
        pool.query(queries.applications),
        pool.query(queries.documents),
        pool.query(queries.questions),
        pool.query(queries.answers),
        pool.query(queries.transactions),
        pool.query(queries.email_logs),
        pool.query(queries.event_registrations),
        pool.query(queries.event_attendances),
      ]);

      return {
        users: usersResult[0] || {},
        posts: postsResult[0] || {},
        events: eventsResult[0] || {},
        applications: applicationsResult[0] || {},
        documents: documentsResult[0] || {},
        questions: questionsResult[0] || {},
        answers: answersResult[0] || {},
        transactions: transactionsResult[0] || {},
        email_logs: emailLogsResult[0] || {},
        event_registrations: eventRegistrationsResult[0] || {},
        event_attendances: eventAttendancesResult[0] || {},
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy dữ liệu thống kê theo thời gian cho biểu đồ
   * @param {string} period - '7d', '30d', '90d', '1y'
   */
  static async getTimeSeriesData(period = '30d') {
    try {
      let daysToSubtract = 30;
      if (period === '7d') daysToSubtract = 7;
      else if (period === '30d') daysToSubtract = 30;
      else if (period === '90d') daysToSubtract = 90;
      else if (period === '1y') daysToSubtract = 365;

      // Query riêng cho từng bảng và join lại
      const usersSql = `
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM users
        WHERE deleted_at IS NULL AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
      `;
      
      const postsSql = `
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM posts
        WHERE deleted_at IS NULL AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
      `;
      
      const eventsSql = `
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM events
        WHERE deleted_at IS NULL AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
      `;
      
      const applicationsSql = `
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM membership_applications
        WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
      `;

      const [usersData] = await pool.query(usersSql, [daysToSubtract]);
      const [postsData] = await pool.query(postsSql, [daysToSubtract]);
      const [eventsData] = await pool.query(eventsSql, [daysToSubtract]);
      const [applicationsData] = await pool.query(applicationsSql, [daysToSubtract]);

      // Tạo map để dễ lookup
      const usersMap = new Map(usersData.map(row => [row.date.toISOString().split('T')[0], parseInt(row.count) || 0]));
      const postsMap = new Map(postsData.map(row => [row.date.toISOString().split('T')[0], parseInt(row.count) || 0]));
      const eventsMap = new Map(eventsData.map(row => [row.date.toISOString().split('T')[0], parseInt(row.count) || 0]));
      const applicationsMap = new Map(applicationsData.map(row => [row.date.toISOString().split('T')[0], parseInt(row.count) || 0]));

      // Lấy tất cả các ngày unique
      const allDates = new Set();
      [usersData, postsData, eventsData, applicationsData].forEach(data => {
        data.forEach(row => {
          allDates.add(row.date.toISOString().split('T')[0]);
        });
      });

      // Tạo mảng kết quả
      const result = Array.from(allDates).sort().map(date => ({
        date,
        users: usersMap.get(date) || 0,
        posts: postsMap.get(date) || 0,
        events: eventsMap.get(date) || 0,
        applications: applicationsMap.get(date) || 0,
      }));

      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default DashboardModel;

