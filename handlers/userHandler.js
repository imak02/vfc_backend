const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");
const registerValidatorSchema = require("../utils/registrationValidator");
const errorHandler = require("../utils/errorHandler");
const sendMail = require("../utils/nodeMailer");

//Create a new user (Register a new user)

const register = async (req, res) => {
  try {
    const { error, value } = registerValidatorSchema.validate(req.body);

    if (error) {
      return res.status(400).send({
        success: false,
        message: error.details[0].message,
        data: null,
      });
    }

    let { firstName, lastName, username, email, password, phone, dob, gender } =
      await value;

    const emailAlreadyExists = await User.exists({ email: email.trim() });
    if (emailAlreadyExists) {
      return res.status(400).send({
        success: false,
        message: "Email is already registered.",
        data: null,
      });
    }

    const usernameNotAvailable = await User.exists({
      username: username.trim(),
    });
    if (usernameNotAvailable) {
      return res.status(400).send({
        success: false,
        message: "Username is already taken.",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      phone,
      password: hashedPassword,
      dob,
      gender,
    });

    const otp = newUser.generateOTP();
    newUser.save();

    sendMail({
      to: email,
      subject: "Email Verification",
      text: "Please verify your mail to continue.",
      html: `<p>Your otp for email verification is:</p> <h1>${otp}</h1> <p>This otp will expire in 30 minutes.</p>`,
    });

    if (newUser) {
      return res.status(200).send({
        success: true,
        message:
          "User registered successfully. Please check your email for verification otp.",
        data: {
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
        },
      });
    }
  } catch (error) {
    errorHandler({ error, res });
  }
};

//Verify email address
const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid request", data: null });
  }

  try {
    const verifiedUser = await User.findOneAndUpdate(
      { otp },
      { emailVerified: true },
      { new: true }
    );

    if (verifiedUser) {
      res.status(200).send("Email Address verified!!!");
    }
  } catch (error) {
    errorHandler({ error, res });
  }
};

//Login the user
const login = async (req, res, next) => {
  const { user, password } = req.body;

  console.log(user);

  try {
    const foundUser = await User.findOne({
      $or: [{ email: user }, { username: user }],
    }).select(["username", "email", "password"]);

    if (!foundUser) {
      return res.status(400).send({
        success: false,
        message: "User does not exist.",
        data: null,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).send({
        success: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    const token = foundUser.generateToken();

    return res.status(200).send({
      success: true,
      message: "Login Successful",
      data: { username: foundUser.username, email: foundUser.email, token },
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

//Fetch current User
const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;
    const currentUser = await User.findOne({
      _id: new mongoose.Types.ObjectId(user._id.toString()),
    });
    if (!currentUser) {
      return res.status(400).send({
        success: false,
        message: "The requested user does not exist",
        data: null,
      });
    }

    return res.status(200).send({
      success: true,
      message: "The requested user was found",
      data: currentUser,
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

module.exports = { register, login, verifyEmail, getCurrentUser };