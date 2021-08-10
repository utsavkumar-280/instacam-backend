const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const NotificationSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "UserProfile",
			required: "User id is required",
		},
		notificationUserId: {
			type: Schema.Types.ObjectId,
			ref: "UserProfile",
			required: "activityUserId id is required",
		},
		notificationType: {
			type: String,
			enum: ["like", "follow"],
		},
		notificationHeading: {
			type: String,
		},

		likedPost: {
			type: Schema.Types.ObjectId,
			ref: "Post",
			default: null,
		},
	},
	{ timestamps: true }
);

const Notification = model("Notification", NotificationSchema);

module.exports = { Notification };
