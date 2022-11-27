const express = require("express");
const { Album, User } = require('../../db/models');
const { makeError } = require("../../utils/auth");

const router = express.Router();

// Get all Albums of an Artist from an id
router.get(
  '/:artistId/albums',
  async (req, res, next) => {
    const { artistId } = req.params
    const user = await User.findByPk(artistId)
    if (!user) {
      return next(makeError('Artist couldn\'t be found', 404))
    }
    return res.json({
      Albums: await Album.findAll({ where: { userId: user.id } })
    })
  }
);

module.exports = router;
