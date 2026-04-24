import mongoose, { Schema, model, models } from 'mongoose';

const VirtualCardSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  cardNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Should be hashed in a real app
  balanceETB: { type: Number, default: 0 },
}, { timestamps: true });

const VirtualCard = models.VirtualCard || model('VirtualCard', VirtualCardSchema);

export default VirtualCard;
