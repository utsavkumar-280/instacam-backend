const express = require("express");
const router = express.Router();

const userAuthorization = require("../middlewares/userAuthorization");
const getViewerDetails = require("../middlewares/getViewerDetails");

const {
	createPost,
	getAllPosts,
	getAllPostsOfUser,
	getLikedUsers,
	likeOrDislikePost,
	deletePost,
} = require("../controllers/posts.controller");

router.use(userAuthorization);
router.use(getViewerDetails);

router.route("/").get(getAllPosts).post(createPost);

router.route("/user/:userName").get(getAllPostsOfUser);

router.route("/:postId/likedby").get(getLikedUsers).post(likeOrDislikePost);

router.route("/:postId").delete(deletePost);

module.exports = router;
