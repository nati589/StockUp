import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    date_added: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    verification: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);