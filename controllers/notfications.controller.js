const { Notification } = require("../models/notification.model");

const { timeFormatter } = require("../controllers/utils/timeFormatter");

const pushLikeNotification = async ({
	userIdWhoLiked,
	ownerUserId,
	likedPostId,
	type,
}) => {
	try {
		if (userIdWhoLiked.toString() === ownerUserId.toString()) {
			return;
		}
		if (type === "like") {
			const activity = {
				userId: ownerUserId,
				notificationUserId: userIdWhoLiked,
				notificationType: "like",
				notificationTitle: "liked your post",
				likedPost: likedPostId,
			};

			const newNotification = new Notification(activity);
			await newNotification.save();
			let notifications = await Notification.find({ userId: ownerUserId });
			if (notifications.length > 10) {
				await notifications[0].remove();
			}
		}
		if (type === "dislike") {
			const notification = await Notification.findOne({
				userId: ownerUserId,
				notificationUserId: userIdWhoLiked,
				notificationType: "like",
				likedPost: likedPostId,
			});
			if (notification) {
				await notification.remove();
			}
		}
	} catch (error) {
		console.log(error);
	}
};

const pushFollowNotification = async ({
	userIdWhoFollowed,
	ownerUserId,
	type,
}) => {
	try {
		if (userIdWhoFollowed.toString() === ownerUserId.toString()) {
			return;
		}

		if (type === "follow") {
			const activity = {
				userId: ownerUserId,
				notificationUserId: userIdWhoFollowed,
				notificationTitle: "started following you",
				notificationType: "follow",
				likedPost: null,
			};
			const newNotification = new Notification(activity);
			await newNotification.save();

			let notifications = await Notification.find({ userId: ownerUserId });
			if (notifications.length > 10) {
				await notifications[0].remove();
			}
		}
		if (type === "unfollow") {
			const notification = await Notification.findOne({
				userId: ownerUserId,
				notificationUserId: userIdWhoFollowed,
				likedPost: null,
				notificationType: "follow",
			});
			if (notification) {
				await notification.remove();
			}
		}
	} catch (error) {
		console.log(error);
	}
};

const getNotificationsOfUser = async (req, res) => {
	try {
		const userId = req.viewer._id;

		let notifications = await Notification.find(
			{ userId },
			{
				notificationUserId: 1,
				notificationTitle: 1,
				likedPost: 1,
				createdAt: 1,
			}
		)
			.lean()
			.populate({
				path: "notificationUserId",
				select: "userId userName profilePic",
				populate: { path: "userId", select: "firstname lastname" },
			})
			.populate({ path: "likedPost", select: "caption" })
			.sort({ createdAt: -1 });

		for (notification of notifications) {
			notification.time = timeFormatter(notification.createdAt);
		}

		res.status(200).json({ response: notifications });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Request failed please check errorMessage key for more details",
			errorMessage: error.message,
		});
	}
};

module.exports = {
	pushLikeNotification,
	pushFollowNotification,
	getNotificationsOfUser,
};
