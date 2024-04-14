import jsonwebtoken from "jsonwebtoken";
import config from "../config/config.js";
import User from "../db/models/user.model.js";
import AppError from "../utils/appError.js";
import { hashPassword, comparePassword } from "../security/password/index.js";
import { securityHelper, generateToken } from "../utils/tools.js";
import MailService from "./email.service.js";



export const findOneByField = async (field, value) => {
  const user = await User.findOne({ [field]: value });
  return user;
};



export const findAll = async (queryString) => {
  try {
    const users = await User.find(queryString);
    return users;
  } catch (error) {
    throw new AppError(500, "fail", error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    const user = await findOneByField("email", email);

    if (!user) {
      throw new AppError(401, "fail", "Invalid email or password")
    }

    const isPasswordValid = comparePassword(
      password,
      user.passwordHash,
      user.passwordSalt
    )

    if (!isPasswordValid) {
      throw new AppError(401, "fail", "Invalid email or password")
    }

    if ("user token",user.token) {
      throw new AppError(
        401,
        "fail",
        "Your account is not active, please contact the administrator"
      )
    }
    const token = jsonwebtoken.sign(
      {
        payload: {
          user: { id: user.id, role: user.role },
        },
      },
      config.security.session.secret,
      { expiresIn: config.security.session.expireAfter }
    )
    return [user, token];
  } catch (error) {
    throw error;
  }
};

export const createOne = async (user) => {
  try {
    const existingUser = await findOneByField("email", user.email);

    if (existingUser) {
      throw new AppError(409, "fail", "Email already exists");
    }

    if (!securityHelper.emailRegex.test(user.email)) {
      throw new AppError(400, "fail", "Invalid email format");
    }

    if (!securityHelper.passwordRegex.test(user.password)) {
      throw new AppError(400, "fail", securityHelper.passwordError);
    }

    const [passwordHash, passwordSalt] = hashPassword(user.password)

    user.passwordHash = passwordHash
    user.passwordSalt = passwordSalt

    user.validateToken = generateToken();

    delete user.password

    // const newUser = await User.query().insertAndFetch(user);
    const newUser = await new User(user).save();

   MailService.sendMail(
      newUser.email,
      "Confirm your email",
      "Please confirm your email by clicking the link below",
      `<a href="http:localhost:4000/api/users/confirm/${newUser.validateToken}">Confirm</a>`
    );

    return newUser;
  } catch (error) {
    throw error;
  }
};

export const confirmEmailUser = async (token) => {
  try {
    const user = await User.findOne({ validateToken: token });

    if (!user) {
      throw new AppError(404, "fail", "User not found");
    }

    user.validateToken = ""

    const newUser = await User.findByIdAndUpdate(user.id, user, { new: true });
    

    return newUser;
  } catch (error) {
    throw error;
  }
};

export const findOneById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(404, "fail", "No user found with that id");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export const updateOneWithPatch = async (userId, updatedFields) => {
  try {
    const user = await findOneById(userId);

    if (updatedFields.email) {
      if (!securityHelper.emailRegex.test(updatedFields.email)) {
        throw new AppError(400, "fail", "Invalid email format");
      }

      const existingUser = await findOneByField("email", updatedFields.email);
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new AppError(409, "fail", "Email already exists");
      }
    }

    Object.assign(user, updatedFields);
    await user.save();

    return user;
  } catch (error) {
    throw error;
  }
};

export const deleteOne = async (userId) => {
  try {
    const user = await findOneById(userId);
    await user.remove();
  } catch (error) {
    throw error;
  }
};
