import db from '../db.js';
import { ROLE } from '../common/enum.js';

/**
 * Checks if a user has a specific permission.
 * Super Admins (role_id = 1) always have all permissions.
 *
 * @param {number} userId - The ID of the user.
 * @param {string} permissionName - The name of the permission to check (e.g., 'posts.create').
 * @returns {Promise<boolean>} - True if the user has the permission, false otherwise.
 */
export async function userHasPermission(userId, permissionName) {
  try {
    // First, get the user's role
    // const [userRows] = await db.query(
    //   'SELECT role_id FROM users WHERE id = ?',
    //   [userId],
    // );

    // if (userRows.length === 0) {
    //   return false; // User not found
    // }

    // const user = userRows[0];

    // // Super Admin (assuming role_id 1) has all permissions
    // if (user.role_id === ROLE.SUPER_ADMIN) {
    //   return true;
    // }

    // Check for specific permission in the user_permissions table
    const [permissionRows] = await db.query(
      `SELECT 1
       FROM user_permissions up
       JOIN permissions p ON up.permission_id = p.id
       WHERE up.user_id = ? AND p.name = ?`,
      [userId, permissionName],
    );

    return permissionRows.length > 0;
  } catch (error) {
    console.error('Error checking user permission:', error);
    return false;
  }
}
