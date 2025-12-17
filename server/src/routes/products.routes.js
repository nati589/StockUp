// products.routes.js
import { Router } from 'express';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// Public read
router.get('/', async (_req, res) => {
  const products = await Product.find().sort({ name: 1 });
  res.json(products);
});

// Protected writes
router.post('/', requireAuth, async (req, res) => {
  const doc = await Product.create(req.body);
  res.status(201).json(doc);
});

router.put('/:id', requireAuth, async (req, res) => {
  const doc = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
});

export default router;