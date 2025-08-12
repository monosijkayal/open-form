import express from 'express';
import ResponseModel from '../models/Response';

const router = express.Router();

router.post('/:formId', async (req, res) => {
  try {
    const response = new ResponseModel({
      formId: req.params.formId,
      answers: req.body.answers,
    });
    await response.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
});

router.get('/:formId', async (req, res) => {
  try {
    const responses = await ResponseModel.find({ formId: req.params.formId });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
});

export default router;