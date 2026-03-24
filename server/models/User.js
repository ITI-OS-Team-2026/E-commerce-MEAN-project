const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
      default: 'customer',
    },

    // Email verification
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },

    // Profile
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },

    // Customer
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    // Seller
    storeName: { type: String, default: null },
    isApproved: { type: Boolean, default: false },

    // Soft delete
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
