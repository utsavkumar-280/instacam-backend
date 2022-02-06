const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "UserProfile",
		},
		caption: {
			type: String,
			required: "Caption of the post is required",
		},
		image: {
			type: String,
			default: "",
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: "UserProfile",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Post = model("Post", PostSchema);

module.exports = { Post };
