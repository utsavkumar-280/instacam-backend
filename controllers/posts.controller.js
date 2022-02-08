const { Post } = require("../models/post.model");
const { UserProfile } = require("../models/userProfile.model");
const { Notification } = require("../models/notification.model");

const { getUserProfileName } = require("./utils/getUserProfileName");
const { postModifier } = require("./utils/postModifier");

const { pushLikeNotification } = require("./notfications.controller");

const createPost = async (res, req) => {
	try {
		const { viewer } = req;
		const postDetails = req.body;

		let createdPost = new Post({ ...postDetails, userId: viewer._id });

		await createdPost.save();

		await createdPost.populate({
			path: "userId",
			select: "userId userName profilePic",
			populate: { path: "userId", select: "firstname lastname" },
		});

		createdPost = postModifier(createdPost, viewer._id);

		res.status(200).json({ response: createdPost });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Creating the post failed",
			errorMessage: error.message,
		});
	}
};

const getAllPosts = async (res, req) => {
	try {
		const { viewer } = req;
		const allPosts = await Post.find({
			userId: { $in: [...viewer.following, viewer._id] },
		})
			.populate({
				path: "userId",
				select: "userId userName profilePic",
				populate: { path: "userId", select: "firstname lastname" },
			})
			.sort({ createdAt: -1 });

		for (let post of allPosts) {
			post = postModifier(post, viewer._id);
		}

		res.status(200).json({ response: allPosts });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Getting all the posts failed",
			errorMessage: error.message,
		});
	}
};

const getAllPostsOfUser = async (req, res) => {
	try {
		const { viewer } = req;
		console.log(req.params);
		const { userName } = req.params;

		const user = await UserProfile.findOne({ userName });
		if (!user) {
			res.status(403).json({ message: "User not found" });
			return;
		}

		const allPosts = await Post.find({ userId: user._id })
			.populate({
				path: "userId",
				select: "userId userName profilePic",
				populate: { path: "userId", select: "firstname lastname" },
			})
			.sort({ createdAt: -1 });

		for (let post of allPosts) {
			post = postModifier(post, viewer._id);
		}

		res.status(200).json({ response: allPosts });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Getting all the posts of User failed",
			errorMessage: error.message,
		});
	}
};

const getLikedUsers = async (req, res) => {
	try {
		const { postId } = req.params;
		const { viewer } = req;

		const post = await Post.findById(postId, { likes: 1 })
			.lean()
			.populate({
				path: "likes",
				select: "userId userName profilePic followers",
				populate: { path: "userId", select: "firstname lastname" },
			});

		post.likes = post.likes.map((user) => getUserProfileName(user, viewer._id));

		res.status(200).json({ response: post.likes });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Getting the users who liked the post failed",
			errorMessage: error.message,
		});
	}
};

const likeOrDislikePost = async (req, res) => {
	try {
		const { viewer } = req;
		const { postId } = req.params;
		let isLiked = false;

		const post = await Post.findById(postId);
		if (!post) {
			res.status(400).json({ message: "No post found" });
			return;
		}

		const index = post.likes.indexOf(viewer._id);

		if (index === -1) {
			post.likes.unshift(viewer._id);
			isLiked = true;
			await pushLikeNotification({
				userIdWhoLiked: viewer._id,
				ownerUserId: post.userId,
				likedPostId: post._id,
				type: "like",
			});
		} else {
			post.likes.splice(index, 1);
			await pushLikeNotification({
				userIdWhoLiked: viewer._id,
				ownerUserId: post.userId,
				likedPostId: post._id,
				type: "dislike",
			});
		}

		await post.save();

		res.status(200).json({ response: isLiked });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Liking or Disliking the post failed",
			errorMessage: error.message,
		});
	}
};

const deletePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const { viewer } = req;

		const post = await Post.findOne({ _id: postId, userId: viewer._id });

		if (!post) {
			res.status(400).json({ message: "No post found" });
			return;
		}

		await post.remove();
		await Notification.deleteMany({ likedPost: post._id });

		res.status(200).json({ response: post._id });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Deleting the post failed",
			errorMessage: error.message,
		});
	}
};

module.exports = {
	createPost,
	getAllPosts,
	getAllPostsOfUser,
	getLikedUsers,
	likeOrDislikePost,
	deletePost,
};
