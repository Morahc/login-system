import User from '../models/user.js';
import { createError, verifyToken } from '../utils/index.js';

export const protect = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(403, 'Unauthorized'));
  }
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(createError(403, 'Unauthorized'));
    }
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const admin = async (req, res, next) => {
  if (!req.user) {
    return next(createError(400, 'User not logged in'));
  }
  if (!req.user.isAdmin) {
    return next(createError(403, 'User not authorized'));
  }
  next();
};
