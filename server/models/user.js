const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username']
  },
  photo: {
    type: String,
    default: 'user.png'
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    minlength: [4, 'Please provide a password with min length: 4'],
    required: [true, 'Please provide a password'],
    select: false
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  readList: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Story'
  }],
  readListLength: {
    type: Number,
    default: 0
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    return next(error);
  }

  next();
});

// Generate JWT Token
UserSchema.methods.generateJwtFromUser = function() {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

  const payload = {
    id: this._id,
    username: this.username,
    email: this.email
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRE });
  return token;
};

// Generate Reset Password Token
UserSchema.methods.getResetPasswordTokenFromUser = function() {
  const { RESET_PASSWORD_EXPIRE } = process.env;

  const randomHexString = crypto.randomBytes(20).toString('hex');
  const resetPasswordToken = crypto.createHash('SHA256').update(randomHexString).digest('hex');

  this.resetPasswordToken = resetPasswordToken;
  this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

  return resetPasswordToken;
};

// Avoid overwriting model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
