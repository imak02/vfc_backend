const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  country: { type: String },
  address: { type: String },
  email: { type: String, required: true, unique: true },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  gender: {
    type: String,
    enum: ["MALE", "FEMALE", "OTHER"],
  },
  dob: {
    type: Date,
  },
  otp: {
    type: Number,
  },
  emailVerified: { type: Boolean, default: false },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
});

userSchema.methods.generateOTP = function () {
  const OTP = Math.floor(100000 + Math.random() * 900000);
  this.otp = OTP;
  // Set a timeout to delete the OTP after 30 minutes (1800000 milliseconds)
  setTimeout(() => {
    this.model("User")
      .findOneAndUpdate(
        { _id: this._id },
        { $unset: { otp: 1 } },
        { new: true }
      )
      .exec();
  }, 300000);
  return OTP;
};

userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
