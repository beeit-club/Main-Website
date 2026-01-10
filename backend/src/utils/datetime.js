import moment from 'moment-timezone';

export function dateTime() {
  return moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
}
