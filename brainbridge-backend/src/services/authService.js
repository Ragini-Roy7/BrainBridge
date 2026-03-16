import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { BadRequestError, UnauthorizedError } from '../utils/customErrors.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const syncUser = async (userData) => {
  const { supabase_id, email, username } = userData;

  if (!supabase_id || !email) {
    throw new BadRequestError('Supabase ID and email are required for sync');
  }

  // Upsert user in MongoDB based on supabase_id
  const user = await User.findOneAndUpdate(
    { supabase_id },
    { 
      supabase_id,
      email,
      username: username || email.split('@')[0],
    },
    { new: true, upsert: true, runValidators: true }
  );

  return user;
};

export default {
  syncUser,
  createSendToken,
};

