import User from '../models/user.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ msg: 'User already exist' });
    } else {
      const user = await User.create({
        name,
        email,
        password,
      });
      if (user) {
        res.status(201).json({ msg: 'User registered' });
      }
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }
    req.session.user = user._id;

    res.json(user).status(200);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const logoutUser = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json(err);
      }
      res.status(200).json({ msg: 'User logged out' });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};
