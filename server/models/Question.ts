import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // to store your UUID
  type: { type: String, required: true },
  title: String,
  content: String,
  options: [String],
  correctAnswer: mongoose.Schema.Types.Mixed,
  imageUrl: String,
}, { timestamps: true });

export default QuestionSchema;