const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      maxLength: [100, 'User name can not exceed 100 characters'],
    },
    email: {
      type: String,
      unique: true,
    },
    nic: {
      type: String,
      required: [true, 'NIC is required'],
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile Number is required'],
      unique: true,
    },
    role: {
      type: String,
      default: 'admin',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password should not contain less than 8 characters'],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      uri: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

// save prehook to hash the password before saving user
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password, 10); // salt rounds: 10
});

// retrieve jwt
adminSchema.methods.getJwt = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

adminSchema.methods.comparePasswords = async function (plainTextPassword) {
  return await bcrypt.compare(plainTextPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
