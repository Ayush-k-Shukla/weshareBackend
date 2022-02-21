import mongoose from 'mongoose';
import User from '../models/userModel.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: 'user does not exist' });
    } else {
      const isPassword = await bcrypt.compare(password, existingUser.password);
      if (!isPassword) {
        return res.status(400).json({ message: 'Incorrect Password' });
      } else {
        const token = jwt.sign(
          {
            email: existingUser.email,
            id: existingUser.id,
          },
          process.env.SECRET_JWT_STRING,
          { expiresIn: '1h' }
        );

        res.status(200).json({ result: existingUser, token });
      }
    }
  } catch (error) {
    res.status(500).json({ meassage: 'something went wrong' });
  }
};
export const signUp = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  try {
    const isUser = await User.findOne(email);
    if (password !== confirmPassword) {
      res.status(400).json('password and confirm password not matches');
    }
    if (isUser) {
      res.status(400).json('Email is already taken');
    }
    const salt = 12;
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashPassword,
      name: firstName + ' ' + lastName,
    });
    const response = await user.save();
    const token = jwt.sign(
      {
        email: response.email,
        id: response._id,
      },
      process.env.SECRET_JWT_STRING,
      { expiresIn: '1h' }
    );
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.log(error);
  }
};
