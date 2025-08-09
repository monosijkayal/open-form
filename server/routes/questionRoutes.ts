import express from 'express';
import Question from '../models/Question';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get('/', async (_req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

export default router;