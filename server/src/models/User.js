import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    fullname: { type: String, trim: true },
    admin: { type: Boolean, default: false },
    disable: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);