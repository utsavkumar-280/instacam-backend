const isFollowedByViewer = (user, viewerId) => {
	user.followedByViewer = user.followers.find((id) => id == viewerId);
	user.followers = undefined;
	return user;
};

module.exports = { isFollowedByViewer };
