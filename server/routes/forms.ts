import express from 'express';
import Form from '../models/Form';
import { nanoid } from 'nanoid';

const router = express.Router();

// Create a new form
router.post('/', async (req, res) => {
  try {
    const formId = nanoid(6); // internal ID
    const editKey = nanoid(10); // edit protection key
    const shareId = nanoid(8); // public sharing ID

    const form = new Form({
      formId,
      editKey,
      shareId,
      ...req.body,
    });

    await form.save();

    const shareUrl = `http://localhost:5173/respond/${shareId}`; // Local dev link

    res.json({ formId, editKey, shareId, shareUrl });
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

// Get form by shareId (public)
router.get('/respond/:shareId', async (req, res) => {
  try {
    const form = await Form.findOne({ shareId: req.params.shareId });
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

// Get form by formId (internal use)
router.get('/:formId', async (req, res) => {
  try {
    const form = await Form.findOne({ formId: req.params.formId });
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

// Edit a form (with key)
router.put('/:formId', async (req, res) => {
  try {
    const { key } = req.query;
    const form = await Form.findOne({ formId: req.params.formId });

    if (!form || form.editKey !== key) {
      return res.status(403).json({ error: 'Invalid edit key' });
    }

    await Form.updateOne({ formId: req.params.formId }, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit form' });
  }
});

// ✅ Submit a response to a form using shareId
router.post('/share/:shareId/submit', async (req, res) => {
  try {
    const form = await Form.findOne({ shareId: req.params.shareId });

    if (!form) return res.status(404).json({ error: 'Form not found' });

    if (!Array.isArray(form.responses)) {
      form.responses = [];
    }

    form.responses.push(req.body);
    await form.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
});

// ✅ Submit a response using formId (if needed)
router.post('/:formId/submit', async (req, res) => {
  try {
    const form = await Form.findOne({ formId: req.params.formId });

    if (!form) return res.status(404).json({ error: 'Form not found' });

    if (!Array.isArray(form.responses)) {
      form.responses = [];
    }

    form.responses.push(req.body);
    await form.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
});

export default router;
