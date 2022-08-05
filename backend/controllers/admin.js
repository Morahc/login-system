import User from '../models/user.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(401, 'User not found'));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const editUserInfo = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    if (!user) {
      return next(createError(401, 'User not found'));
    }
    // user.name = name || user.name;
    // user.email = email || user.email;
    // user.password = password || user.password;
    // await user.save();
    res.status(200).json({ message: 'User updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(401, 'User not found'));
    }
    await user.remove();
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
