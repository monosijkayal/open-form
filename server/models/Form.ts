import mongoose from 'mongoose';
import { nanoid } from 'nanoid'; // make sure to: pnpm add nanoid
import  QuestionSchema  from "./Question" // Adjust the import path as necessary

const FormSchema = new mongoose.Schema({
  // Unique public ID for sharing
  shareId: { type: String, unique: true, default: () => nanoid(8) },

  // Optional: internal formId if you really need it for editing logic
  formId: { type: String, unique: true, sparse: true },

  editKey: { type: String },
  title: String,
  description: String,

  questions: [QuestionSchema],

  // If you’re storing responses inside the form doc itself
  responses: [mongoose.Schema.Types.Mixed],

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Form', FormSchema);
