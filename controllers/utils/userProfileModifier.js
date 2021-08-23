const userProfileModifier = (userDetails, viewerId) => {
	userDetails._doc.name = `${userDetails.userId.firstname} ${userDetails.userId.lastname}`;

	userDetails._doc.followCount = {
		followers: userDetails.followers.length,
		following: userDetails.following.length,
	};
	userDetails._doc.isfollowedByViewer =
		userDetails.followers.includes(viewerId);

	userDetails._doc.isfollowingViewer = userDetails.following.includes(viewerId);

	userDetails.__v = undefined;
	userDetails.userId = undefined;
	userDetails.followers = undefined;
	userDetails.following = undefined;

	return userDetails;
};
