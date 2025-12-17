// expenses.routes.js
import { Router } from 'express';
import Expense from '../models/Expense.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  res.json(expenses);
});

router.post('/', requireAuth, async (req, res) => {
  const doc = await Expense.create(req.body);
  res.status(201).json(doc);
});

router.put('/:id', requireAuth, async (req, res) => {
  const doc = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
});

export default router;