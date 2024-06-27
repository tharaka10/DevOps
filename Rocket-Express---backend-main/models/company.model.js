const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const companySchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    userRole: {
      type: String,
      enum: ['Admin', 'RegularCompany'],
      default: 'RegularCompany',
    },
  },
  { timestamps: true }
);

companySchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = Date.now();
  next();
});

companySchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

companySchema.methods.generateAuthToken = function () {
  const payload = {
    id: this._id, // Store company ID in the token
    userRole: this.userRole, // This can be used to store role for role-based authentication
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' }); // Token expiration set to 1 hour
  return token;
};

module.exports = mongoose.model('Company', companySchema);
