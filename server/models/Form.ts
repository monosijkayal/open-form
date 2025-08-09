import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema({
  formId: { type: String, required: true, unique: true },
  editKey: { type: String },
  title: String,
  description: String,
  questions: [
    {
      type: { type: String, required: true },
      prompt: String,
      options: [String],
      answer: mongoose.Schema.Types.Mixed,
    }
  ],
  responses: [mongoose.Schema.Types.Mixed],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Form', FormSchema);