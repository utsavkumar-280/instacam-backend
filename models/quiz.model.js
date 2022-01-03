const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const OptionSchema = new Schema({
	content: { type: String, required: "Content of the option is required" },
	isCorrect: { type: Boolean, required, default: false },
});

const QuestionSchema = new Schema({
	question: { type: String, required: "Question  is required" },
	points: {
		type: Number,
		required: "Points of the question is required",
		default: 10,
	},
	negativePoints: {
		type: Number,
		required: "Negative points of the question is required",
		default: 5,
	},
	options: [OptionSchema],
});

const QuizSchema = new Schema({
	name: { type: String, required: "Name of the quiz is required" },
	coverImage: { type: String, required: "Cover image of the quiz is required" },
	category: { type: String, required: "Category of the question is required" },
	totalScore: {
		type: Number,
		required: "Total score of quiz is required",
	},
	questions: [QuestionSchema],
});

const Quiz = model("Quiz", QuizSchema);

module.exports = { Quiz };
