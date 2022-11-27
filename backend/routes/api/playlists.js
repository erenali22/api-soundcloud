const express = require("express");

const { makeError } = require("../../utils/auth");
const { check } = require("express-validator");
const { Playlist, Song, PlaylistSong } = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");

const validation = [
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Playlist name is required"),
  handleValidationErrors,
];

const router = express.Router();

router.post("/", validation, async (req, res, next) => {
  const { name, imageUrl } = req.body;
  const { user } = req
  const playlist = await Playlist.create({ userId: user.id, name, imageUrl })
  return res.json(playlist);
});

router.put("/:playlistId", validation, async (req, res, next) => {
  const { playlistId } = req.params
  const { name, imageUrl } = req.body;
  const { user } = req
  const playlist = await Playlist.findByPk(playlistId)
  if (!playlist) {
    return next(makeError('Playlist couldn\'t be found', 404))
  }
  if (playlist.userId !== user.id) {
    return next(makeError('Forbidden', 403))
  }
  Object.assign(playlist, { name, imageUrl })
  await playlist.save()
  return res.json(playlist);
});

// Add a Song to a Playlist based on the Playlists's id
router.post("/:playlistId/songs", async (req, res, next) => {
  const { playlistId } = req.params
  const { songId } = req.body
  const playlist = await Playlist.findByPk(playlistId)
  if (!playlist) {
    return next(makeError('Playlist couldn\'t be found', 404))
  }
  const song = await Song.findByPk(songId)
  if (!song) {
    return next(makeError('Song couldn\'t be found', 404))
  }
  return res.json(await PlaylistSong.create({ playlistId, songId }))
});

router.get("/current", async (req, res, next) => {
  const { user } = req
  return res.json({
    Playlists: await Playlist.findAll({ where: { userId: user.id } })
  });
});

router.get("/:playlistId", async (req, res, next) => {
  const { playlistId } = req.params
  const playlist = await Playlist.findByPk(playlistId, {
    include: [
      {
        model: Song,
        as: 'Songs'
      }
    ]
  })
  if (!playlist) {
    return next(makeError('Playlist couldn\'t be found', 404))
  }
  return res.json(playlist);
});

router.delete("/:playlistId", async (req, res, next) => {
  const { playlistId } = req.params
  const { user } = req
  const playlist = await Playlist.findByPk(playlistId)
  if (!playlist) {
    return next(makeError('Playlist couldn\'t be found', 404))
  }
  if (playlist.userId !== user.id) {
    return next(makeError('Forbidden', 403))
  }
  await playlist.destroy()
  return res.json({
    "message": "Successfully deleted",
    "statusCode": 200
  });
});

module.exports = router;
