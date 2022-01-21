const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { extend } = require("lodash");
const JWT_SECRET = process.env.JWT_SECRET;

const { User } = require("../models/user.model");
const { UserProfile } = require("../models/userProfile.model");

const { getUserProfileName } = require("./utils/getUserProfileName");
const { userProfileModifier } = require("./utils/userProfileModifier");
const { isFollowedByViewer } = require("./utils/isFollowedByViewer");

const { pushFollowNotification } = require("./notfications.controller");

const createUserAndUserProfile = async (req, res) => {
	try {
		const userDetails = req.body;

		const user = await User.findOne({ email: userDetails.email });
		const viewer = await UserProfile.findOne({ userId: user._id });

		if (user && viewer) {
			res.status(409).json({ message: "Account already exists, please login" });
			return;
		}

		const userName = await UserProfile.findOne({
			userName: userDetails.userName,
		});

		if (userName) {
			res.status(409).json({
				message: "Username not available",
			});
			return;
		}

		const newUser = new User(userDetails);
		const salt = await bcrypt.genSalt(10);
		newUser.password = await bcrypt.hash(newUser.password, salt);
		await newUser.save();

		const newUserProfile = new UserProfile({
			...userDetails,
			userId: newUser._id,
		});
		await newUserProfile.save();

		res.status(201).json({ response: "User account created successfully!" });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			errorMessage: error.message,
			message: "Signing up the user failed",
		});
	}
};

const loginUser = async () => {
	try {
		const email = req.get("email");
		const password = req.get("password");
		const user = await User.findOne({ email });
		const userProfile = await UserProfile.findOne({ userId: user._id });
		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!user) {
			res.status(403).json({ message: "User does not exists, please Sign up" });
			return;
		}
		if (!userProfile) {
			res.status(403).json({ message: "User does not exists, please Sign up" });
			return;
		}

		if (!isValidPassword) {
			res.status(403).json({ message: "Incorrect password" });
			return;
		}

		const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
			expiresIn: "24h",
		});

		res.status(200).json({
			response: {
				name: `${user.firstname} ${user.lastname}`,
				token,
				userId: userProfile._id,
				userName: userProfile.userName,
				profilePic: userProfile.profilePic,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Logging in the user failed",
			errorMessage: error.message,
		});
	}
};

const getAllUsers = async (req, res) => {
	try {
		const { viewer } = req;
		let users = await UserProfile.find(
			{},
			{ userName: 1, userId: 1, profilePic: 1, followers: 1 }
		)
			.lean()
			.populate({ path: "userId", select: "firstname lastname" });

		for (let user of users) {
			user = getUserProfileName(user, viewer._id);
		}

		res.status(200).json({ response: users });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Getting all users failed",
			errorMessage: error.message,
		});
	}
};

const getUserProfile = async (req, res) => {
	try {
		const { viewer } = req;
		const { userName } = req.params;

		let userDetails = await UserProfile.findOne({ userName }).populate({
			path: "userId",
			select: "firstname lastname",
		});

		if (!userDetails || !viewer) {
			res.status(403).json({ message: "Invalid user id" });
			return;
		}

		userDetails = userProfileModifier(userDetails, viewer._id);

		res.status(200).json({ response: userDetails });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Getting user profile failed",
			errorMessage: error.message,
		});
	}
};

const updateUserProfile = async (req, res) => {
	try {
		let { viewer } = req;
		const { userName } = req.params;

		if (userName !== viewer.userName) {
			res.status(403).json({ message: "Invalid userName" });
			return;
		}

		const viewerUpdates = req.body;
		viewer = extend(viewer, viewerUpdates);

		await viewer.save();
		res.status(200).json({
			response: {
				bio: viewer.bio,
				website: viewer.website,
				location: viewer.location,
				profilePic: viewer.profilePic,
				coverPic: viewer.coverPic,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Updating user profile failed",
			errorMessage: error.message,
		});
	}
};

const getFollowersDetails = async (req, res) => {
	try {
		const { userName } = req.params;
		const { viewer } = req;

		let userDetails = await UserProfile.findOne({ userName }).lean().populate({
			path: "followers",
			select: "userName profilePic followers",
		});

		if (!userDetails) {
			res.status(404).json({ message: "User not found" });
			return;
		}
		userDetails.followers = userDetails.followers.map((user) =>
			isFollowedByViewer(user, viewer._id)
		);

		res.status(200).json({ response: userDetails.followers });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Getting followers details failed",
			errorMessage: error.message,
		});
	}
};

const followOrUnfollowUser = async (req, res) => {
	try {
		const { viewer } = req;
		const { userName } = req.params;
		let userDetails = await UserProfile.findOne({ userName });

		let isAdded = false;

		if (!userDetails || userName === viewer.userName) {
			res.status(400).json({ message: "Invalid request" });
			return;
		}

		if (viewer.following.includes(userDetails._id)) {
			viewer.following = viewer.following.filter(
				(id) => id.toString() !== userDetails._id.toString()
			);

			userDetails.followers = userDetails.followers.filter(
				(id) => id.toString() !== viewer._id.toString()
			);

			await pushFollowNotification({
				userIdWhoFollowed: viewer._id,
				ownerUserId: userDetails._id,
				type: "unfollow",
			});
		} else {
			viewer.following.unshift(userDetails._id);
			userDetails.followers.unshift(viewer._id);
			isAdded = true;

			await pushFollowNotification({
				userIdWhoFollowed: viewer._id,
				ownerUserId: userDetails._id,
				type: "follow",
			});
		}

		await viewer.save();
		await userDetails.save();

		res.status(200).json({ isAdded });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Following or Unfollowing user failed",
			errorMessage: error.message,
		});
	}
};

const getFollowingDetails = async (req, res) => {
	try {
		const { userName } = req.params;
		const { viewer } = req;

		let userDetails = await UserProfile.findOne({ userName }).lean().populate({
			path: "following",
			select: "userName profilePic followers",
		});

		if (!userDetails) {
			res.status(404).json({ message: "User not found" });
			return;
		}
		userDetails.following = userDetails.following.map((user) =>
			isFollowedByViewer(user, viewer._id)
		);

		res.status(200).json({ response: userDetails.following });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Getting following details failed",
			errorMessage: error.message,
		});
	}
};

const removeFromFollowing = async (req, res) => {
	try {
		const { viewer } = req;
		const { userName } = req.params;
		let userDetails = await UserProfile.findOne({ userName });

		let isAdded = false;

		if (!userDetails || userName === viewer.userName) {
			res.status(400).json({ message: "Invalid request" });
			return;
		}

		if (viewer.following.includes(userDetails._id)) {
			viewer.following = viewer.following.filter(
				(id) => id.toString() !== userDetails._id.toString()
			);

			userDetails.followers = userDetails.followers.filter(
				(id) => id.toString() !== viewer._id.toString()
			);
		} else {
			res.status(400).json({ message: "Invalid request" });
		}

		await viewer.save();
		await userDetails.save();

		res.status(200).json({ isAdded });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Removing user from following list failed",
			errorMessage: error.message,
		});
	}
};

module.exports = {
	createUserAndUserProfile,
	loginUser,
	getAllUsers,
	getUserProfile,
	updateUserProfile,
	getFollowersDetails,
	followOrUnfollowUser,
	getFollowingDetails,
	removeFromFollowing,
};
