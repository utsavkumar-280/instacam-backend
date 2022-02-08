const getUserProfileName = (user, viewerId) => {
	// console.log({ user });

	user.name = `${user.userId.firstname} ${user.userId.lastname}`;
	user.followedByViewer = user.followers.find(
		(id) => id.toString() == viewerId.toString()
	);

	console.log(user.followedByViewer);

	user.followers = undefined;
	user.userId = undefined;
	// console.log({ modifiedUsers: user });

	return user;
};
module.exports = { getUserProfileName };
