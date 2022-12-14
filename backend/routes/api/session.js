// backend/routes/api/session.js
const express = require('express');

const { setTokenCookie, makeError } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require("../../utils/auth");

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email or username is required'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors
];

const router = express.Router();

// Log in
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    if (!user) {
      return next(makeError('Invalid credentials', 401))
    }

    const token = await setTokenCookie(res, user);

    return res.json({
      ...user.toSafeObject(),
      token
    });
  }
);

// Get the Current User
router.get(
  '/',
  requireAuth,
  (req, res) => {
    const { user } = req;
    return res.json({
      ...user.toSafeObject()
    })
  }
);

// Log out
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

module.exports = router;
