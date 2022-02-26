import mongoose from 'mongoose';
import User from '../models/userModel.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//these routes are working good prob in frontend

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  console.log(`user : ${email}`);
  try {
    const existingUser = await User.findOne({ email });
    console.log(`user : ${existingUser}`);
    if (!existingUser) {
      return res.status(404).json({ message: 'user does not exist' });
    }
    console.log(`user : ${existingUser}`);

    const isPassword = await bcrypt.compare(password, existingUser.password);
    if (!isPassword) {
      return res.status(400).json({ message: 'Incorrect Password' });
    }
    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
      },
      process.env.SECRET_JWT_STRING,
      { expiresIn: '1h' }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ meassage: 'something went wrong' });
  }
};

export const signUp = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    console.log(req.body);
    const isUser = await User.findOne({ email });
    if (password !== confirmPassword) {
      res.status(400).json('password and confirm password not matches');
    }
    if (isUser) {
      console.log('taken');
      res.status(400).json('Email is already taken');
    }
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email: email,
      password: hashPassword,
      name: `${firstName} ${lastName}`,
    });
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.SECRET_JWT_STRING,
      { expiresIn: '1h' }
    );
    console.log(user);
    res.status(201).json({ result: user, token });
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' });
    console.log(error);
  }
};
