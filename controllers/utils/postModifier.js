const { timeFormatter } = require("./timeFormatter");

const postModifier = (post, viewerId) => {
	post.__v = undefined;
	post._doc.totalLikes = post.likes.length;
	post._doc.islikedByViewer = post.likes.includes(viewerId);
	post.likes = undefined;
	post._doc.time = getTimeFormatted(post.createdAt);
	post._doc.createdAt = post.createdAt.getTime();
	post.updatedAt = undefined;

	return post;
};

module.exports = { postModifier };
