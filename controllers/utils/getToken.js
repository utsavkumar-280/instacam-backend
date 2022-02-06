const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const getToken = (userId) => {
	const token = jwt.sign({ userId }, JWT_SECRET, {
		expiresIn: "24h",
	});
	return token;
};

module.exports = { getToken };
