import mongoose, { Schema, model, models } from 'mongoose';

const DepositRequestSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // The forex provider chosen
  amountForeign: { type: Number, required: true }, // e.g., amount in USD
  currency: { type: String, default: 'USD' },
  rateUsed: { type: Number, required: true }, // The ETB rate at the time of request
  amountETB: { type: Number, required: true }, // Calculated amount in ETB
  status: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED'], 
    default: 'PENDING' 
  },
}, { timestamps: true });

const DepositRequest = models.DepositRequest || model('DepositRequest', DepositRequestSchema);

export default DepositRequest;
