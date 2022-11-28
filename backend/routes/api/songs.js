const express = require("express");
const { Song, Album, Comment, User } = require('../../db/models');
const { makeError } = require("../../utils/auth");
const { check } = require("express-validator");
const { query } = require("express-validator/check");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const validateSong = [
  check('title')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Song title is required'),
  check('url')
    .exists({ checkFalsy: true })
    .withMessage('Song audio is required'),
  handleValidationErrors
];

const validateGetAllSongs = [
  query('createdAt')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('CreatedAt is invalid'),
  query('page')
    .toInt()
    .customSanitizer(value => value || 0)
    .custom(value => value >= 0 && value <= 10)
    .withMessage('Page must be greater than or equal to 0'),
  query('size')
    .toInt()
    .customSanitizer(value => value || 20)
    .custom(value => value >= 0 && value <= 20)
    .withMessage('Size must be greater than or equal to 0'),
  handleValidationErrors
]

const validateComments = [
  check('body')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Comment body text is required'),
  handleValidationErrors
];

const router = express.Router();

// Get all Songs
router.get(
  '/',
  validateGetAllSongs,
  async (req, res) => {
    const { title, createdAt, page, size } = req.query
    const filter = {}
    if (title) {
      filter['title'] = title
    }
    if (createdAt) {
      filter['createdAt'] = createdAt
    }
    return res.json({
      Songs: await Song.findAll({
        where: filter,
        limit: size,
        offset: page * size,
      }),
      page,
      size,
    })
  }
);

// Get all Songs created by the Current User
router.get(
  '/current',
  requireAuth,
  async (req, res) => {
    const { user } = req
    return res.json(
      { Songs: await Song.findAll({ where: { userId: user.id } }) })
  }
);

// Get details of a Song from an id
router.get(
  '/:songId',
  async (req, res, next) => {
    const songId = req.params['songId']
    const song = await Song.findByPk(songId, {
      include: [{
        model: User,
        as: 'Artist'
      }, {
        model: Album,
        as: 'Album'
      }]
    })
    if (song) {
      return res.json(song)
    } else {
      return next(makeError('Song couldn\'t be found', 404))
    }
  }
);

router.delete(
  '/:songId',
  requireAuth,
  async (req, res, next) => {
    const songId = req.params['songId']
    const { user } = req
    const song = await Song.findByPk(songId)
    if (!song) {
      return next(makeError('Song couldn\'t be found', 404))
    }
    if (song.userId !== user.id) {
      return next(makeError('Forbidden', 403))
    }
    await song.destroy()
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }
);

// Create a Song
router.post(
  '/',
  requireAuth,
  validateSong,
  async (req, res, next) => {
    const { albumId, title, description, url, imageUrl } = req.body
    const album = await Album.findByPk(albumId)
    if (!album) {
      return next(makeError('Album couldn\'t be found', 404))
    }
    const song = await Song.create({
      albumId, title, description, url, imageUrl, userId: album.userId
    })
    return res.json(song)
  }
);

// Edit a Song
router.put(
  '/:songId',
  requireAuth,
  validateSong,
  async (req, res, next) => {
    const { user } = req
    const { songId } = req.params
    const { title, description, url, imageUrl } = req.body
    const song = await Song.findByPk(songId)
    if (!song) {
      return next(makeError('Song couldn\'t be found', 404))
    }
    if (song.userId !== user.id) {
      return next(makeError('Forbidden', 403))
    }
    Object.assign(song, { title, description, url, imageUrl })
    await song.save()
    return res.json(song)
  }
);

router.delete(
  '/:songId',
  requireAuth,
  async (req, res, next) => {
    const { user } = req
    const { songId } = req.params
    const song = await Song.findByPk(songId)
    if (!song) {
      return next(makeError('Song couldn\'t be found', 404))
    }
    if (song.userId !== user.id) {
      return next(makeError('Forbidden', 403))
    }
    await song.destroy()
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }
)

// Create a Comment for a Song based on the Song's id
router.post(
  '/:songId/comments',
  requireAuth,
  validateComments,
  async (req, res, next) => {
    const { songId } = req.params
    const userId = req.user.id;
    const { body } = req.body
    const song = await Song.findByPk(songId)
    if (!song) {
      return next(makeError('Song couldn\'t be found', 404))
    }
    const comment = await Comment.create({ userId, songId, body })
    return res.json(comment)
  }
);

// Get all Comments by a Song's id
router.get(
  '/:songId/comments',
  requireAuth,
  async (req, res, next) => {
    const { songId } = req.params
    const song = await Song.findByPk(songId)
    if (!song) {
      return next(makeError('Song couldn\'t be found', 404))
    }
    return res.json({
      Comments: await Comment.findAll({
        where: { songId }, include: [{
          model: User,
          as: 'Artist',
          attributes:['id', 'username']
        }]
      })
    })
  }
);

module.exports = router;
