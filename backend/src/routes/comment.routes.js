const express = require("express");
const commentController = require("../controllers/comment.controller");

const router = express.Router();

router.delete("/:commentId", commentController.deleteComment);

module.exports = router;
