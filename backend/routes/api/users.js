const express = require("express");

const { setTokenCookie, makeError } = require("../../utils/auth");
const { User, Song, Playlist, Album } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("firstName")
    .matches(/^[\w\s]+$/)
    .withMessage("First name must be word characters.")
    .exists({ checkFalsy: true })
    .withMessage("First Name cannot be empty."),
  check("lastName")
    .matches(/^[\w\s]+$/)
    .withMessage("Last name must be word characters.")
    .exists({ checkFalsy: true })
    .withMessage("Last name cannot be empty."),
  handleValidationErrors,
];

const router = express.Router();

// Sign up
router.post("/", validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;
  const existing = await User.findOne({ where: { email } })
  if (existing) {
    return next(makeError(
      'User already exists', 403,
      {
        "email": "User with that email already exists"
      }
    ))
  }
  const user = await User.signup({
    email,
    username,
    password,
    firstName,
    lastName,
  });

  const token = await setTokenCookie(res, user);

  return res.json({
    ...user.toSafeObject(),
    token,
  });
});

// Get details of an Artist from an id
router.get("/:userId", requireAuth, async (req, res, next) => {
  const { userId } = req.params
  const user = await User.findByPk(userId, {
    include: [{
      model: Song,
      as: 'Songs',
      attributes: ['imageUrl']
    }]
  })
  if (!user) {
    return next(makeError('Artist couldn\'t be found', 404))
  }
  let converted = JSON.parse(JSON.stringify(user))
  converted.totalSongs = await Song.count({ where: { userId: user.id } })
  converted.totalAlbums = await Album.count({ where: { userId: user.id } })
  return res.json(converted)
})

// Get all Songs of an Artist from an id
router.get("/:userId/songs", requireAuth, async (req, res, next) => {
  const { userId } = req.params
  const user = await User.findByPk(userId)
  if (!user) {
    return next(makeError('Artist couldn\'t be found', 404))
  }
  return res.json({
    Songs: await Song.findAll({ where: { userId } })
  })
})

// Get details of an Artist from an id
router.get("/:userId", requireAuth, async (req, res, next) => {
  const { userId } = req.params
  const user = await User.findByPk(userId)
  if (!user) {
    return next(makeError('Artist couldn\'t be found', 404))
  }
  return res.json(user)
})

// Get all Playlists of an Artist from an id
router.get("/:userId/playlists", requireAuth, async (req, res, next) => {
  const { userId } = req.params
  const user = await User.findByPk(userId)
  if (!user) {
    return next(makeError('Artist couldn\'t be found', 404))
  }
  return res.json({
    Playlists: await Playlist.findAll({ where: { userId } })
  })
})

module.exports = router;
