const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const dbConnection = require("./db/dbConnect.js");
// const userAuthorization = require("./middlewares/userAuthorization");
const route404Handler = require("./middlewares/route404Handler");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 8040;
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());

dbConnection();

app.get("/", (req, res) => {
	res.send("Welcome to InstaCam and VizzQuizz Apis");
});

app.get("/hello", (req, res) => {
	res.json({
		success: true,
		response: "Kya bolti Public!!",
	});
});

//DO NOT MOVE THESE HANDLERS
// 404 Route Handler
app.use(route404Handler);

//Error Handeler
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`server running on http://localhost:${PORT}`);
});
