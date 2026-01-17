
import pool from '../../db.js';
import { callRevalidateAPI } from '../../utils/revalidateCache.js';

class LandingController {
    // Mapping section name to table name
    static TABLE_MAP = {
        hero: 'bee_hero_section',
        stats: 'bee_stats',
        leaders: 'bee_leaders',
        achievements: 'bee_achievements',
        timeline: 'bee_timeline_events',
        activities: 'bee_activities',
        projects: 'bee_projects',
        gallery: 'bee_gallery',
        photos: 'bee_photos',
        testimonials: 'bee_testimonials',
        join_process: 'bee_join_process',
    };

    static getTableName(section) {
        return LandingController.TABLE_MAP[section];
    }

    // GET /admin/landing/:section
    static async getSectionData(req, res) {
        try {
            const { section } = req.params;
            const table = LandingController.getTableName(section);

            if (!table) {
                return res.status(400).json({ message: 'Invalid section name' });
            }

            let query = `SELECT * FROM ${table}`;

            if (section !== 'hero') {
                query += ` ORDER BY display_order ASC, id DESC`;
            }

            const [rows] = await pool.query(query);
            res.json(rows);
        } catch (error) {
            console.error(`Error getting ${req.params.section}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // POST /admin/landing/:section
    static async createItem(req, res) {
        try {
            const { section } = req.params;
            const table = LandingController.getTableName(section);
            const data = req.body;

            if (!table) {
                return res.status(400).json({ message: 'Invalid section name' });
            }

            // Remove id if present to let auto increment work
            delete data.id;
            delete data.created_at;
            delete data.updated_at;

            const keys = Object.keys(data);
            const values = Object.values(data);

            if (keys.length === 0) {
                return res.status(400).json({ message: 'No data provided' });
            }

            const placeholders = keys.map(() => '?').join(', ');
            const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

            const [result] = await pool.query(query, values);

            // Fetch the created item
            const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [result.insertId]);

            // Revalidate Frontend Cache
            callRevalidateAPI('landing').catch(err => console.error('Revalidate failed:', err));

            res.status(201).json(rows[0]);
        } catch (error) {
            console.error(`Error creating item in ${req.params.section}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // PUT /admin/landing/:section/:id
    static async updateItem(req, res) {
        try {
            const { section, id } = req.params;
            const table = LandingController.getTableName(section);
            const data = req.body;

            if (!table) {
                return res.status(400).json({ message: 'Invalid section name' });
            }

            delete data.id;
            delete data.created_at;
            delete data.updated_at;

            const keys = Object.keys(data);
            const values = Object.values(data);

            if (keys.length === 0) {
                return res.status(400).json({ message: 'No data provided' });
            }

            const setClause = keys.map(key => `${key} = ?`).join(', ');
            const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;

            await pool.query(query, [...values, id]);

            const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);

            // Revalidate Frontend Cache
            callRevalidateAPI('landing').catch(err => console.error('Revalidate failed:', err));

            res.json(rows[0]);
        } catch (error) {
            console.error(`Error updating item in ${req.params.section}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // DELETE /admin/landing/:section/:id
    static async deleteItem(req, res) {
        try {
            const { section, id } = req.params;
            const table = LandingController.getTableName(section);

            if (!table) {
                return res.status(400).json({ message: 'Invalid section name' });
            }

            await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);

            // Revalidate Frontend Cache
            callRevalidateAPI('landing').catch(err => console.error('Revalidate failed:', err));

            res.json({ message: 'Deleted successfully' });
        } catch (error) {
            console.error(`Error deleting item in ${req.params.section}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // PATCH /admin/landing/:section/reorder
    static async reorderItems(req, res) {
        try {
            const { section } = req.params;
            const table = LandingController.getTableName(section);
            const { items } = req.body; // Array of { id, display_order }

            if (!table) {
                return res.status(400).json({ message: 'Invalid section name' });
            }

            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ message: 'Invalid items array' });
            }

            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();

                for (const item of items) {
                    await connection.query(
                        `UPDATE ${table} SET display_order = ? WHERE id = ?`,
                        [item.display_order, item.id]
                    );
                }

                await connection.commit();

                // Revalidate Frontend Cache
                callRevalidateAPI('landing').catch(err => console.error('Revalidate failed:', err));

                res.json({ message: 'Reordered successfully' });
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error(`Error reordering ${req.params.section}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default LandingController;
