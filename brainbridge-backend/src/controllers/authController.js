import authService from '../services/authService.js';

// Helper to catch async errors - if catchAsync is not globally available
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export const signup = catchAsync(async (req, res, next) => {
  await authService.register(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Registration successful! Please check your email for verification link.',
  });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  const user = await authService.verifyEmail(req.params.token);
  authService.createSendToken(user, 200, res);
});


export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  authService.createSendToken(user, 200, res);
});

export default {
  signup,
  login,
  verifyEmail,
};

