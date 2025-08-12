import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  type: string;
  title: string;
  content?: string;
  imageUrl?: string;
  options?: string[];
}

interface FormData {
  _id: string;
  formId: string;
  shareId: string;
  title: string;
  description: string;
  questions: Question[];
  headerImageUrl?: string;
}

interface Answer {
  questionId: string;
  value: string | string[];
}

export default function PublicFormView() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [form, setForm] = useState<FormData | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/forms/respond/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Form not found");
        return res.json();
      })
      .then((data: FormData) => {
        setForm(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
        setForm(null);
      });
  }, [id]);

  const handleAnswerUpdate = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, value } : a
        );
      } else {
        return [...prev, { questionId, value }];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const url = `http://localhost:5000/api/responses/share/${form?.shareId}`;
      console.log("Submitting to URL:", url);
      console.log("form.shareId:", form?.shareId);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) throw new Error("Submission failed");

      setSubmitted(true);
      toast({
        title: "Submitted!",
        description: "Your responses have been saved.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Submission failed. Try again later.",
        variant: "destructive",
      });
    }
  };

  const getAnswer = (questionId: string) =>
    answers.find((a) => a.questionId === questionId)?.value || "";

  const renderQuestion = (question: Question, index: number) => {
    switch (question.type) {
      case "categorize":
      case "multiple-choice":
        return (
          <CategoryQuestion
            question={question}
            answer={getAnswer(question.id) as string}
            onAnswerChange={(value) => handleAnswerUpdate(question.id, value)}
          />
        );

      case "cloze":
        return (
          <ClozeQuestion
            question={question}
            answer={getAnswer(question.id) as string}
            onAnswerChange={(value) => handleAnswerUpdate(question.id, value)}
          />
        );

      case "comprehension":
      case "text":
      default:
        return (
          <ComprehensionQuestion
            question={question}
            answer={getAnswer(question.id) as string}
            onAnswerChange={(value) => handleAnswerUpdate(question.id, value)}
          />
        );
    }
  };

  if (loading) return <p className="text-center mt-10">Loading form...</p>;
  if (!form) return <p className="text-center mt-10">Form not found</p>;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card className="p-8 text-center shadow-elegant border-success/20 bg-success/5">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-success" />
          <h2 className="text-2xl font-bold mb-2 text-success">Thank You!</h2>
          <p className="text-muted-foreground mb-6">
            Your responses have been submitted successfully.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Submit Another Response
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card className="p-8 bg-transparent mb-6">
        {form.headerImageUrl && (
          <img
            src={form.headerImageUrl}
            alt="Form header"
            className="w-full h-48 object-cover rounded-lg mb-6"
          />
        )}

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
          <p className="text-muted-foreground">{form.description}</p>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {form.questions.length} Questions
          </Badge>
        </div>
      </Card>

      <div className="space-y-6">
        {form.questions.map((question, index) => (
          <Card key={question.id} className="p-6 animate-fade-in">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {index + 1}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {question.type}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">{question.title}</h3>
              {question.content && (
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {question.content}
                </p>
              )}
            </div>

            {question.imageUrl && (
              <img
                src={question.imageUrl}
                alt="Question"
                className="w-full max-h-64 object-cover rounded-lg mb-4 border"
              />
            )}

            {renderQuestion(question, index)}
          </Card>
        ))}

        <Card className="p-6 bg-muted/5 text-center">
          <Button
            onClick={handleSubmit}
            size="lg"
            className="bg-white shadow-elegant"
            disabled={answers.length === 0}
          >
            <Send className="w-5 h-5 mr-2" />
            Submit Form
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            {answers.length} of {form.questions.length} questions answered
          </p>
        </Card>
      </div>
    </div>
  );
}

// 🔽 Subcomponents

const CategoryQuestion = ({
  question,
  answer,
  onAnswerChange,
}: {
  question: Question;
  answer: string;
  onAnswerChange: (value: string) => void;
}) => (
  <div>
    <RadioGroup value={answer} onValueChange={onAnswerChange}>
      {question.options?.map((option, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <RadioGroupItem value={option} id={`${question.id}-${index}`} />
          <Label htmlFor={`${question.id}-${index}`} className="flex-1">
            {option}
          </Label>
        </div>
      ))}
    </RadioGroup>
  </div>
);

const ClozeQuestion = ({
  question,
  answer,
  onAnswerChange,
}: {
  question: Question;
  answer: string;
  onAnswerChange: (value: string) => void;
}) => (
  <Textarea
    value={answer}
    onChange={(e) => onAnswerChange(e.target.value)}
    placeholder="Fill in the blanks..."
    className="min-h-[100px]"
  />
);

const ComprehensionQuestion = ({
  question,
  answer,
  onAnswerChange,
}: {
  question: Question;
  answer: string;
  onAnswerChange: (value: string) => void;
}) => (
  <Textarea
    value={answer}
    onChange={(e) => onAnswerChange(e.target.value)}
    placeholder="Write your answer here..."
    className="min-h-[120px]"
  />
);
