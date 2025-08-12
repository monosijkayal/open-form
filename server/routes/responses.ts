import express from 'express';
import Form from '../models/Form';
import ResponseModel from '../models/Response';

const router = express.Router();

// ✅ Submit response using formId
router.post('/:formId', async (req, res) => {
  try {
    const response = new ResponseModel({
      formId: req.params.formId,
      answers: req.body.answers,
    });
    await response.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
});

// ✅ Get all responses by formId
router.get('/:formId', async (req, res) => {
  try {
    const responses = await ResponseModel.find({ formId: req.params.formId });
    res.json(responses);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
});

// ✅ Submit response using shareId
router.post('/share/:shareId', async (req, res) => {
  try {
    const form = await Form.findOne({ shareId: req.params.shareId });
    if (!form) return res.status(404).json({ error: 'Form not found' });

    const response = new ResponseModel({
      formId: form._id,
      answers: req.body.answers,
    });

    await response.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error submitting response via shareId:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
});

export default router;
