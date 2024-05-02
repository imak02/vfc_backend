const User = require("../models/User");
const registerValidatorSchema = require("../utils/registrationValidator");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/errorHandler");

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

    if (newUser) {
      return res.status(200).send({
        success: true,
        message: "User registered successfully. ",
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
module.exports = { register };
