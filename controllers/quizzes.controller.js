const { response } = require("express");
const { Quiz } = require("../models/quiz.model");

const getAllQuizzes = async (req, res) => {
	try {
		console.log("hello quiz");
		const quizzes = await Quiz.find({});

		console.log(quizzes);
		res.status(200).json({ success: true, response: quizzes });
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

		res.status(200).json({
			success: true,
			message: "Quiz added successfully",
			response: savedQuiz,
		});
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
