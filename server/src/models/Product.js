import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    added_by: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    date_added: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    price_bought: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true },
    restock: { type: Number, required: true },
    unit: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);