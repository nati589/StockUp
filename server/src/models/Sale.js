import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    previousQuantity: { type: Number, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  },
  { _id: false }
);

const creditInfoSchema = new mongoose.Schema(
  {
    duedate: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    payment_covered: { type: Boolean, required: true },
    unpaid: { type: Number, required: true }
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    credit: { type: Boolean, required: true, default: false },
    creditinfo: {
      type: creditInfoSchema,
      required: function () {
        return this.credit === true;
      }
    },
    date_sold: { type: String, required: true, trim: true },
    buyer: { type: String, required: false, trim: true },
    items: { type: [itemSchema], required: true },
    seller: { type: String, required: true, trim: true },
    total: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Sale', saleSchema);