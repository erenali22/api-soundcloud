const express = require("express");
const { Comment } = require('../../db/models');
const { makeError } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateComments = [
  check('body')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Comment body text is required'),
  handleValidationErrors
];

const router = express.Router();

// Edit a Comment
router.put(
  '/:commentId',
  validateComments,
  async (req, res, next) => {
    const { commentId } = req.params
    const { user } = req
    const { body } = req.body
    const comment = await Comment.findByPk(commentId)
    if (!comment) {
      return next(makeError('Comment couldn\'t be found', 404))
    }
    if (comment.userId !== user.id) {
      return next(makeError('Forbidden', 403))
    }
    Object.assign(comment, { body })
    await comment.save()
    return res.json(comment)
  }
);

// Delete a Comment
router.delete(
  '/:commentId',
  async (req, res, next) => {
    const { commentId } = req.params
    const { user } = req
    const comment = await Comment.findByPk(commentId)
    if (!comment) {
      return next(makeError('Comment couldn\'t be found', 404))
    }
    if (comment.userId !== user.id) {
      return next(makeError('Forbidden', 403))
    }
    await comment.destroy()
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }
);

module.exports = router;
