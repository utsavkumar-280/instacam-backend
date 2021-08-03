const mongoose = require("mongoose");
//const { User } = require("./user.model");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		content: {
			type: String,
			required: "Content of the post is required",
		},
		image: {
			type: String,
			default: "",
		},
		likedBy: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Post = model("Post", PostSchema);

module.exports = { Post };
