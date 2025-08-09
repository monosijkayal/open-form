import mongoose from 'mongoose';

const ResponseSchema = new mongoose.Schema({
  formId: { type: String, required: true },
  answers: mongoose.Schema.Types.Mixed,
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Response', ResponseSchema);