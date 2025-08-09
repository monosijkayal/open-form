import express from 'express';
import ResponseModel from '../models/Response.js';

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
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:formId', async (req, res) => {
  try {
    const responses = await ResponseModel.find({ formId: req.params.formId });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;