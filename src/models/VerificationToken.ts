import mongoose, { Schema, model, models } from 'mongoose';

const VerificationTokenSchema = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true }
}, { timestamps: true });

// Ensure a combination of email and token is unique
VerificationTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const VerificationToken = models.VerificationToken || model('VerificationToken', VerificationTokenSchema);

export default VerificationToken;
