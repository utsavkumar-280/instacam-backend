const express = require("express");
const router = express.Router();

const {
	createUserAndUserProfile,
	loginUser,
	getAllUsers,
	getUserProfile,
	updateUserProfile,
	getFollowersDetails,
	followOrUnfollowUser,
	getFollowingDetails,
	removeFromFollowing,
} = require("../controllers/userProfiles.controller");

const getViewerDetails = require("../middlewares/getViewerDetails");

const userAuthorization = require("../middlewares/userAuthorization");

router.route("/signup").post(createUserAndUserProfile);
router.route("/login").post(loginUser);

router.use(userAuthorization);
router.use(getViewerDetails);

router.route("/").get(getAllUsers);

router.route("/:userName").get(getUserProfile).post(updateUserProfile);

router
	.route("/:userName/followers")
	.get(getFollowersDetails)
	.post(followOrUnfollowUser);

router
	.route("/:userName/following")
	.get(getFollowingDetails)
	.post(removeFromFollowing);

module.exports = router;
