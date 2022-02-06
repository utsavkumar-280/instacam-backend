const express = require("express");
const router = express.Router();

const {
	getAllQuizzes,
	createQuiz,
} = require("../controllers/quizzes.controller");

router.route("/").get(getAllQuizzes).post(createQuiz);

module.exports = router;
