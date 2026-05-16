const express = require("express");
const postController = require("../controllers/post.controller");
const commentController = require("../controllers/comment.controller");

const router = express.Router();

router.get("/", postController.getPostList);
router.get("/:postId", postController.getPostDetail);
router.post("/", postController.createPost);
router.patch("/:postId", postController.updatePost);
router.delete("/:postId", postController.deletePost);
router.post("/:postId/like", postController.togglePostLike);

router.get("/:postId/comments", commentController.getCommentListByPostId);
router.post("/:postId/comments", commentController.createCommentByPostId);

module.exports = router;
