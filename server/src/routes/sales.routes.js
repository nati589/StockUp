// sales.routes.js
import { Router } from 'express';
import mongoose from 'mongoose';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  const sales = await Sale.find().sort({ createdAt: -1 });
  res.json(sales);
});

router.post('/', requireAuth, async (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'items required' });
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // Ensure all updates succeed together
      const ops = items.map((i) => ({
        updateOne: {
          filter: { _id: i.id },
          update: { $inc: { quantity: -Number(i.quantity || 0) } }
        }
      }));

      await Product.bulkWrite(ops, { session });

      const [sale] = await Sale.create([req.body], { session });
      res.status(201).json(sale);
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Sale failed', error: e?.message });
  } finally {
    session.endSession();
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { creditinfo } = req.body;
  const sale = await Sale.findByIdAndUpdate(id, { creditinfo }, { new: true });
  res.json(sale);
});
export default router;