import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['ADMIN', 'PROVIDER', 'USER'], 
    default: 'USER' 
  },
  // For Providers
  companyName: { type: String },
  registrationNumber: { type: String },
  isAuthorized: { type: Boolean, default: false },
  // For Users
  internationalCardDetails: {
    cardNumber: String,
    expiryDate: String,
    cvv: String,
  }
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;
