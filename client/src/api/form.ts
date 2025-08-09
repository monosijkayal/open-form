export interface Question {
  type: "categorize" | "cloze" | "comprehension";
  question: string;
  options?: string[];
  answer?: string;
}

export interface FormPayload {
  title: string;
  description?: string;
  questions: Question[];
}

export const createForm = async (formData: FormPayload) => {
  const res = await fetch("/api/forms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    throw new Error("Failed to create form");
  }

  return res.json();
};