import User from '../models/user.js';
import { createError, generateToken } from '../utils/index.js';

export const registerUser = async (req, res, next) => {
  const { name, email, password, referral } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return next(createError(400, 'User already exist'));
    }
    if (referral) {
      const referree = await User.findOne({ email: referral });
      if (!referree) {
        return next(createError(400, 'Referree not found'));
      }
      referree.referrals.push({ referree: referree._id });
      await referree.save();
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    if (user) {
      req.user = user._id;
      res.status(201).json(user);
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, 'User not found'));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(createError(401, 'Invalid Password'));
    }

    const token = generateToken({ id: user._id, isAdmin: user.isAdmin });
    const { name, isAdmin } = user;

    res
      .cookie('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'none',
        secure: true,
      })
      .json({ name, email: user.email, isAdmin })
      .status(200);
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id)
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  res.clearCookie('access_token');
  res.status(200).json({ message: 'User logged out' });
};