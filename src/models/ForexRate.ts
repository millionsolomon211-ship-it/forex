import mongoose, { Schema, model, models } from 'mongoose';

const ForexRateSchema = new Schema({
  provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rate: { type: Number, required: true }, // Rate for 1 USD in ETB
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const ForexRate = models.ForexRate || model('ForexRate', ForexRateSchema);

export default ForexRate;
