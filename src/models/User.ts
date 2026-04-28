import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  country: { type: String },
  emailVerified: { type: Date },
  status: { type: String, default: "active" }, // active, inactive, etc.
  
  // Roles: USER, ADMIN, BANK, PRIVATE
  role: { 
    type: String, 
    enum: ['ADMIN', 'BANK', 'PRIVATE', 'USER'], 
    default: 'USER' 
  },
  
  // For Banking Providers (BANK or PRIVATE)
  companyName: { type: String },
  registrationNumber: { type: String },
  isAuthorized: { type: Boolean, default: false }, // Requires Admin approval
  
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;
