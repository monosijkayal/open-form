import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ExternalLink, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FormData, Question } from "./FormBuilder";

interface FormPreviewProps {
  formData: FormData;
}

interface Answer {
  questionId: string;
  value: string | string[];
}

export const FormPreview = ({ formData }: FormPreviewProps) => {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState(false);

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

  const handleCopyLink = () => {
    if (!formData?.shareId) return;
    console.log("formData at copy time:", formData);
    const publicLink = `${window.location.origin}/form/${formData.shareId}`;
    navigator.clipboard
      .writeText(publicLink)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Form link has been copied to your clipboard.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/forms/share/${formData.shareId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit");

      setSubmitted(true);
      toast({
        title: "Form Submitted!",
        description: "Your responses have been recorded.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Something went wrong while submitting the form.",
        variant: "destructive",
      });
    }
  };

  const getAnswer = (questionId: string) => {
    return answers.find((a) => a.questionId === questionId)?.value || "";
  };

  const renderQuestion = (question: Question, index: number) => {
    switch (question.type) {
      case "categorize":
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
        return (
          <ComprehensionQuestion
            question={question}
            answer={getAnswer(question.id) as string}
            onAnswerChange={(value) => handleAnswerUpdate(question.id, value)}
          />
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    console.log("FormPreview formData:", formData);
  }, [formData]);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
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
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 rounded-none bg-transparent mb-6">
        {formData.headerImageUrl && (
          <img
            src={formData.headerImageUrl}
            alt="Form header"
            className="w-full h-48 object-cover rounded-lg mb-6"
          />
        )}

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">{formData.title}</h1>
          <p className="text-muted-foreground">{formData.description}</p>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20"
          >
            {formData.questions.length} Questions
          </Badge>
          <Badge
            variant="outline"
            className={`bg-muted cursor-pointer ${
              !formData?.shareId ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={handleCopyLink}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Shareable Form
          </Badge>
        </div>
      </Card>

      {formData.questions.length === 0 ? (
        <Card className="p-8 text-center shadow-soft border-border/50">
          <div className="text-muted-foreground">
            <p className="text-lg mb-2">No questions added yet</p>
            <p className="text-sm">
              Switch to Edit mode to add questions to your form
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {formData.questions.map((question, index) => (
            <Card
              key={question.id}
              className="p-6 shadow-soft border-border/50 animate-fade-in"
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary"
                  >
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
                  alt="Question image"
                  className="w-full max-h-64 object-cover rounded-lg mb-4 border"
                />
              )}

              {renderQuestion(question, index)}
            </Card>
          ))}

          <Card className="p-6 shadow-elegant border-border/50 bg-gradient-subtle">
            <div className="text-center">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="bg-white cursor-pointer shadow-elegant"
                disabled={answers.length === 0}
              >
                <Send className="w-5 h-5 mr-2" />
                Submit Form
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                {answers.length} of {formData.questions.length} questions
                answered
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

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
    <Label className="text-base font-medium mb-3 block">
      Select a category:
    </Label>
    <RadioGroup value={answer} onValueChange={onAnswerChange}>
      {question.options?.map((option, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <RadioGroupItem value={option} id={`${question.id}-${index}`} />
          <Label
            htmlFor={`${question.id}-${index}`}
            className="flex-1 cursor-pointer font-medium"
          >
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
  <div>
    <Label className="text-base font-medium mb-3 block">
      Fill in the blanks:
    </Label>
    <Textarea
      value={answer}
      onChange={(e) => onAnswerChange(e.target.value)}
      placeholder="Type your answers here..."
      className="min-h-[100px]"
    />
    <p className="text-sm text-muted-foreground mt-2">
      Provide answers for each blank in the text above
    </p>
  </div>
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
  <div>
    <Label className="text-base font-medium mb-3 block">Your answer:</Label>
    <Textarea
      value={answer}
      onChange={(e) => onAnswerChange(e.target.value)}
      placeholder="Write your response based on the passage above..."
      className="min-h-[120px]"
    />
  </div>
);
