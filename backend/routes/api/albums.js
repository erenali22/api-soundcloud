const express = require("express");
const { Album, User, Song } = require('../../db/models');
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { makeError } = require("../../utils/auth");

const validation = [
  check('title')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Album title is required'),
  handleValidationErrors
];

const router = express.Router();

// Get all Albums
router.get(
  '/',
  async (_req, res) => {
    return res.json({
      Albums: await Album.findAll()
    })
  }
);

// Get all Albums created by the Current User
router.get(
  '/current',
  async (req, res) => {
    const { user } = req
    return res.json({
      Albums: await Album.findAll({ where: { userId: user.id } })
    })
  }
);

// Get all Albums of an Artist from an id
router.get(
  '/:albumId',
  async (req, res, next) => {
    const { albumId } = req.params
    const album = await Album.findByPk(albumId, {
      include: [{
        model: User,
        as: 'Artist'
      }, {
        model: Song,
        as: 'Songs'
      }]
    })
    if (!album) {
      return next(makeError('Album couldn\'t be found', 404))
    }
    return res.json(album)
  }
);

// Create an Album
router.post(
  '/',
  validation,
  async (req, res) => {
    const { user } = req
    const { title, description, imageUrl } = req.body
    const album = await Album.create({ title, description, imageUrl, userId: user.id })
    return res.json(album)
  }
);

router.delete(
  '/:albumId',
  async (req, res, next) => {
    const { albumId } = req.params
    const { user } = req
    const album = await Album.findByPk(albumId)
    if (!album) {
      return next(makeError('Album couldn\'t be found', 404))
    }
    if (album.userId !== user.id) {
      return next(makeError('Forbidden', 403))
    }
    await album.destroy()
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }
);

// Edit an Album
router.put(
  '/:albumId',
  validation,
  async (req, res, next) => {
    const { albumId } = req.params
    const { title, description, imageUrl } = req.body
    const album = await Album.findByPk(albumId)
    if (!album) {
      return next(makeError('Album couldn\'t be found', 404))
    }
    Object.assign(album, { title, description, imageUrl })
    await album.save()
    return res.json(album)
  }
);

module.exports = router;
