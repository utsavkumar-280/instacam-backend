const { response } = require("express");
const { Quiz } = require("../models/quiz.model");

const getAllQuizzes = async (req, res) => {
	try {
		const quizzes = await Quiz.find({});

		response.status(200).json({ response: quizzes, success: true });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Getting all quizzes failed. See error message for more detail.",
			errorMessage: error.message,
		});
	}
};

const createQuiz = async (req, res) => {
	try {
		const quizDetails = req.body;

		let NewQuiz = new Quiz(quizDetails);
		const savedQuiz = await NewQuiz.save();

		res.status(200).json({ response: savedQuiz, success: true });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Creating a quiz failed. See error message for more detail.",
			errorMessage: error.message,
		});
	}
};

module.exports = {
	getAllQuizzes,
	createQuiz,
};
