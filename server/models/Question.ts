import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [String],
  correctAnswers: [String],
  imageUrl: String,
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);