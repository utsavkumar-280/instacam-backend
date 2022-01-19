const { UserProfile } = require("../models/userProfile.model");

const getViewerDetails = async (req, res, next) => {
	try {
		const userId = req.user._id;
		const viewer = await UserProfile.findOne({ userId });

		if (!viewer) {
			res.status(403).json({ message: "user does not exist" });
		}

		req.viewer = viewer;
		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "getting viewer details failed",
			errorMessage: error.message,
		});
	}
};

module.exports = getViewerDetails;
