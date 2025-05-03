import { User } from '../models/user.model.js';
import * as crypto from "node:crypto";
import bcryptjs from 'bcryptjs';
import {generateVerificationToken} from "../utils/generateVerificationToken.js";
import {generateTokenAndSetCookie} from "../utils/generateTokenAndSetCookie.js";
import {sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail,sendPasswordResetSuccessEmail} from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const {email, password, name} = req.body;

  try {
  //   check empty fields
    if(!email || !password || !name) {
      throw new Error("All fields are required.");
    }

  //   check if email already registered
    const userEmailExists = await User.findOne({email});
    if(userEmailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      })
    }
  //   hash the password with bcrypt1
      const hashedPassword = await bcryptjs.hash(password,10);

  //   generate varification code with crypt
      const verificationToken = generateVerificationToken();

      const user = new User({
        email,
        password: hashedPassword,
        name,
        verificationToken,
        verificationTokenExpiredAt: Date.now() + 1000 * 60 * 60 * 24
      });

      await user.save();

      generateTokenAndSetCookie(res, user._id);

      await sendVerificationEmail(user.email, verificationToken);

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          ...user._doc,
          password: undefined
        }
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const verifyEmail = async (req, res) => {
  const {verificationCode} = req.body;

  try {
    //   check empty fields
    if(!verificationCode) {
      throw new Error("All fields are required.");
    }

    //   check if email already registered
    const user = await User.findOne({
      verificationToken: verificationCode,
      verificationTokenExpiredAt: { $gt: Date.now() }
    });

    if(!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code"
      })
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiredAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({
      success: true,
      message: "Email verification successfully",
      user: {
        ...user._doc,
        password: undefined
      }
    });
  } catch (error) {
    console.log("Error in verifyEmai", error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export const login = async (req, res) => {
  const {email, password} = req.body;
  try {
    //   check empty fields
    if(!email || !password) {
      throw new Error("All fields are required.");
    }

    //   check if email already registered
    const user = await User.findOne({email});
    if(!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist."
      })
    }

    const isValid = await bcryptjs.compare(password, user.password);

    if(!isValid) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password."
      });
    }

    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      user: {
        ...user._doc,
        password: undefined
      }
    });

  } catch (error) {
    console.log("Error in Login", error);
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
};

export const forgotPassword = async (req, res) => {
  const {email} = req.body;

  try {
    if(!email) {
      throw new Error("All fields are required.");
    }

    const user = await User.findOne({ email });

    if(!user) {
      return res.status(400).json({
        success: false,
        message: "Email not found."
      })
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpiredAt = Date.now() + 1000 * 60 * 60;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiredAt = resetPasswordExpiredAt;

    await user.save();

    const resetUrl = `http://localhost:5000/api/auth/password-reset/${resetToken}`;

    sendPasswordResetEmail(user.email, resetUrl);


    return res.status(200).json({
      success: true,
      message: "Password reset mail was sent to your email"
    })
  } catch (error) {
    console.log("Error in password reset", error);
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
};

export const resetPassword = async (req, res) => {
  const {id} = req.params;
  const {newpassword, renewpassword} = req.body;
  try {
    if(newpassword !== renewpassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords does not match"
      })
    }

    const user = await User.findOne({
      resetPasswordToken: id,
      resetPasswordExpiredAt: { $gt: Date.now() }
    })

    if(!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link."
      });
    }

    const hashedPassword = await bcryptjs.hash(newpassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined
    user.resetPasswordExpiredAt = undefined
    await user.save();

    sendPasswordResetSuccessEmail(user.email);

    res.send("Page");

  } catch (error) {
    console.log("Error in Reset Password", error);
    return res.status(400).json({
      success: false,
      message: "Password reset failed."
    })
  }
}

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if(!user) {
      return res.status(400).json({
        success: false,
        message: "User not found."
      })
    }

    return res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: undefined
      }
    })

  } catch (error) {
    console.log("Error in Authorization", error);
    return res.status(400).json({
      success: false,
      message: "Authorization failed."
    });
  }

}