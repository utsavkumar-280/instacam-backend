const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserProfileSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: "userId is required",
		unique: "This userId is already exists",
	},
	userName: {
		type: String,
		required: "userName is required",
		unique: "This userName is already exists",
		index: true,
	},
	profilePic: {
		type: String,
		default: "https://i.postimg.cc/9F5mFmKY/Default-pfp.jpg",
	},
	coverPic: {
		type: String,
		default: "https://i.postimg.cc/DfDWQ3DS/default-cover.png",
	},
	bio: {
		type: String,
		default: "",
	},
	location: {
		type: String,
		default: "",
	},
	website: {
		type: String,
		default: "",
	},
	followers: [
		{
			type: Schema.Types.ObjectId,
			ref: "UserProfile",
		},
	],
	following: [
		{
			type: Schema.Types.ObjectId,
			ref: "UserProfile",
		},
	],
});

const UserProfile = model("UserProfile", UserProfileSchema);

module.exports = { UserProfile };
