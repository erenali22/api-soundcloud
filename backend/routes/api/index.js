const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const songsRouter = require('./songs.js');
const albumsRouter = require('./albums.js');
const artistsRouter = require('./artists.js');
const commentRouter = require('./comments.js');
const playlistRouter = require('./playlists.js');
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);
// router.use(requireAuth)

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/songs', songsRouter);
router.use('/albums', albumsRouter);
router.use('/artists', artistsRouter);
router.use('/comments', commentRouter);
router.use('/playlists', playlistRouter);

router.get("/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    "XSRF-Token": csrfToken,
  });
});

module.exports = router;
