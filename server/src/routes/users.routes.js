// users.routes.js
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

function requireAdmin(req, res, next) {
  if (!req.user?.admin) return res.status(403).json({ message: 'Admin only' });
  next();
}

router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  const users = await User.find().select('-passwordHash').sort({ username: 1 });
  res.json(users);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { username, password, fullname, admin = false, disable = false } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: passwordHash, fullname, admin, disable });
  res.status(201).json({ id: user._id, username: user.username, fullname: user.fullname, admin: user.admin, disable: user.disable });
});

export default router;