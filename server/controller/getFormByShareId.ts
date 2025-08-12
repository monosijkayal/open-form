import { Request, Response } from "express";
import Form from "../models/Form"; // adjust path as needed

export const getFormByShareId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // 'id' here refers to shareId from the URL
    const form = await Form.findOne({ shareId: id });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(form);
  } catch (error) {
    console.error("Error fetching form by shareId:", error);
    res.status(500).json({ message: "Server error" });
  }
};
