import express from 'express';
import { getAllUsers, createUser } from '../services/userService.js';

const router = express.Router();

/**
 * GET /api/users
 * Get all active users
 */
router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

/**
 * POST /api/users
 * Register a new user/enumerator
 */
router.post('/', async (req, res) => {
    try {
        const { phone, name, role } = req.body;

        if (!phone || !name) {
            return res.status(400).json({ error: 'Phone and Name are required' });
        }

        const newUser = await createUser({
            phone,
            name,
            role: role || 'ENUMERATOR',
            isActive: true
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: error.message || 'Failed to create user' });
    }
});

/**
 * DELETE /api/users/:phone
 * Delete a user/enumerator
 */
router.get('/delete/:phone', async (req, res) => {
    try {
        const { phone } = req.params;
        await User.findOneAndDelete({ phone });
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

/**
 * PATCH /api/users/:phone/status
 * Toggle user active status
 */
router.post('/toggle-status/:phone', async (req, res) => {
    try {
        const { phone } = req.params;
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({ success: true, isActive: user.isActive });
    } catch (error) {
        console.error('Error toggling status:', error);
        res.status(500).json({ error: 'Failed to toggle user status' });
    }
});

export default router;
