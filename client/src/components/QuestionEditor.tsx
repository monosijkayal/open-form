import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Image as ImageIcon,
  Plus,
  X,
  Type,
  List,
  FileText,
} from "lucide-react";
import type { Question } from "./FormBuilder";

interface QuestionEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onImageUpload: () => void;
}

export const QuestionEditor = ({
  question,
  onUpdate,
  onImageUpload,
}: QuestionEditorProps) => {
  const [localOptions, setLocalOptions] = useState(question.options || []);

  const questionTypeInfo = {
    categorize: {
      icon: List,
      description: "Drag and drop items into categories",
      color: "bg-blue-100 text-blue-800",
    },
    cloze: {
      icon: Type,
      description: "Fill in the blanks in text",
      color: "bg-green-100 text-green-800",
    },
    comprehension: {
      icon: FileText,
      description: "Answer questions about a passage",
      color: "bg-purple-100 text-purple-800",
    },
  };

  const typeInfo = questionTypeInfo[question.type];
  const IconComponent = typeInfo.icon;

  const handleAddOption = () => {
    const newOptions = [...localOptions, `Option ${localOptions.length + 1}`];
    setLocalOptions(newOptions);
    onUpdate({ options: newOptions });
  };

  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...localOptions];
    newOptions[index] = value;
    setLocalOptions(newOptions);
    onUpdate({ options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);
    onUpdate({ options: newOptions });
  };

  return (
    <Card className="p-6 bg-transparent rounded-none">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${typeInfo.color}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-semibold capitalize">
              {question.type} Question
            </h3>
            <p className="text-sm text-muted-foreground">
              {typeInfo.description}
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="question-title">Question Title</Label>
          <Input
            id="question-title"
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter your question title"
            className="mt-2 rounded-none"
          />
        </div>

        <div>
          <Label htmlFor="question-content">
            {question.type === "comprehension"
              ? "Passage/Text"
              : "Question Content"}
          </Label>
          <Textarea
            id="question-content"
            value={question.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder={
              question.type === "comprehension"
                ? "Enter the text passage for comprehension..."
                : question.type === "cloze"
                ? "Enter text with blanks (use _____ for blanks)..."
                : "Enter question content or instructions..."
            }
            className="mt-2 min-h-[100px] rounded-none"
            rows={4}
          />
        </div>

        <div>
          <Label>Question Image (Optional)</Label>
          <div className="mt-2">
            {question.imageUrl ? (
              <div className="relative">
                <img
                  src={question.imageUrl}
                  alt="Question image"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onImageUpload}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                >
                  Change
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={onImageUpload}
                className="w-full h-24 border-dashed border-2 flex flex-col rounded-none items-center justify-center gap-2 hover:bg-muted/50"
              >
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Add Image</span>
              </Button>
            )}
          </div>
        </div>

        {question.type === "categorize" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Categories/Options</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="flex items-center rounded-none cursor-pointer gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </Button>
            </div>

            <div className="space-y-2">
              {localOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="w-6 h-6 rounded-none p-0 flex items-center justify-center text-xs"
                  >
                    {index + 1}
                  </Badge>
                  <Input
                    value={option}
                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 rounded-none"
                  />
                  {localOptions.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {localOptions.length < 6 && (
              <p className="text-xs text-muted-foreground mt-2">
                Add up to 6 categories for users to organize items
              </p>
            )}
          </div>
        )}

        {question.type === "cloze" && (
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Cloze Instructions</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Use underscores (____) to create blanks in your text that users
              will fill in.
            </p>
            <div className="text-sm font-mono bg-card p-2 rounded border">
              Example: "The capital of France is _____ and it's known for the
              _____ Tower."
            </div>
          </div>
        )}

        {question.type === "comprehension" && (
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Comprehension Instructions</h4>
            <p className="text-sm text-muted-foreground">
              Add a text passage above, then users will answer questions about
              it. The questions will be automatically generated or you can
              specify them in the content area.
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            Changes saved automatically
          </p>
        </div>
      </div>
    </Card>
  );
};
