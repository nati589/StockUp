// categories.routes.js
import { Router } from 'express';
import Category from '../models/Category.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/', async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
});

router.post('/', requireAuth, async (req, res) => {
  const doc = await Category.create(req.body);
  res.status(201).json(doc);
});

export default router;