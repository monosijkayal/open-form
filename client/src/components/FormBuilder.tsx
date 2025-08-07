import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Eye,
  Edit3,
  Trash2,
  Image as ImageIcon,
  GripVertical,
} from "lucide-react";
import { QuestionEditor } from "./QuestionEditor";
import { FormPreview } from "./FormPreview";
import { useToast } from "@/hooks/use-toast";

export interface Question {
  id: string;
  type: "categorize" | "cloze" | "comprehension";
  title: string;
  content: string;
  options?: string[];
  correctAnswer?: string | string[];
  imageUrl?: string;
}

export interface FormData {
  id: string;
  title: string;
  description: string;
  headerImageUrl?: string;
  questions: Question[];
}

export const FormBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("edit");
  const [formData, setFormData] = useState<FormData>({
    id: crypto.randomUUID(),
    title: "Untitled Form",
    description: "Add a description for your form",
    questions: [],
  });

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleFormUpdate = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleAddQuestion = (type: Question["type"]) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Question`,
      content: "",
      options: type === "categorize" ? ["Option 1", "Option 2"] : undefined,
    };

    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));

    setEditingQuestion(newQuestion);
  };

  const handleQuestionUpdate = (
    questionId: string,
    updates: Partial<Question>
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const handleQuestionDelete = (questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));

    if (editingQuestion?.id === questionId) {
      setEditingQuestion(null);
    }
  };

  const handleSaveForm = () => {
    // In a real app, this would save to your backend/database
    localStorage.setItem(
      "formBuilder_" + formData.id,
      JSON.stringify(formData)
    );
    toast({
      title: "Form Saved!",
      description: "Your form has been saved successfully.",
    });
  };

  const handleImageUpload = (
    type: "header" | "question",
    questionId?: string
  ) => {
    // Demo implementation - in real app would upload to your storage service
    const demoImageUrl =
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop";

    if (type === "header") {
      handleFormUpdate({ headerImageUrl: demoImageUrl });
    } else if (questionId) {
      handleQuestionUpdate(questionId, { imageUrl: demoImageUrl });
    }

    toast({
      title: "Image Uploaded!",
      description: "Demo image has been added.",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Form Builder</h1>
            <p className="text-muted-foreground">
              Create beautiful forms with multiple question types
            </p>
          </div>

          {/* Main Content */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full border p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <TabsList className="grid w-auto grid-cols-2 border rounded-none cursor-pointer">
                <TabsTrigger
                  value="edit"
                  className="flex items-center gap-2 rounded-none cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Form
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-2 rounded-none cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <Button
                onClick={handleSaveForm}
                className="rounded-none cursor-pointer"
              >
                Save Form
              </Button>
            </div>

            <TabsContent value="edit" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Settings */}
                <div className="lg:col-span-1">
                  <Card className="p-6 border bg-transparent rounded-none">
                    <h3 className="text-lg font-semibold mb-4">
                      Form Settings
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="form-title">Form Title</Label>
                        <Input
                          id="form-title"
                          value={formData.title}
                          onChange={(e) =>
                            handleFormUpdate({ title: e.target.value })
                          }
                          className="mt-1 rounded-none"
                        />
                      </div>

                      <div>
                        <Label htmlFor="form-description">Description</Label>
                        <Textarea
                          id="form-description"
                          value={formData.description}
                          onChange={(e) =>
                            handleFormUpdate({ description: e.target.value })
                          }
                          className="mt-1 rounded-none"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Header Image</Label>
                        <Button
                          variant="outline"
                          onClick={() => handleImageUpload("header")}
                          className="w-full mt-1 h-32 border-dashed border-2 flex flex-col rounded-none items-center justify-center gap-2 hover:bg-muted/50"
                        >
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formData.headerImageUrl
                              ? "Change Image"
                              : "Upload Header Image"}
                          </span>
                        </Button>
                        {formData.headerImageUrl && (
                          <img
                            src={formData.headerImageUrl}
                            alt="Header"
                            className="w-full h-20 object-cover rounded mt-2"
                          />
                        )}
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border bg-transparent rounded-none mt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Add Questions
                    </h3>
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleAddQuestion("categorize")}
                        variant="outline"
                        className="w-full justify-start rounded-none"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Categorize Question
                      </Button>
                      <Button
                        onClick={() => handleAddQuestion("cloze")}
                        variant="outline"
                        className="w-full justify-start rounded-none"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Cloze Question
                      </Button>
                      <Button
                        onClick={() => handleAddQuestion("comprehension")}
                        variant="outline"
                        className="w-full justify-start rounded-none"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Comprehension Question
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Questions List & Editor */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Questions List */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Questions ({formData.questions.length})
                      </h3>

                      {formData.questions.length === 0 ? (
                        <Card className="p-8 text-center bg-transparent border rounded-none">
                          <div className="text-muted-foreground">
                            <Plus className="w-8 h-8 mx-auto mb-4 opacity-50" />
                            <p>No questions yet</p>
                            <p className="text-sm">
                              Add your first question to get started
                            </p>
                          </div>
                        </Card>
                      ) : (
                        <div className="space-y-3">
                          {formData.questions.map((question, index) => (
                            <Card
                              key={question.id}
                              className={`p-4 bg-transparent border rounded-none cursor-pointer transition-all hover:shadow-elegant ${
                                editingQuestion?.id === question.id
                                  ? "ring-2 ring-primary"
                                  : ""
                              }`}
                              onClick={() => setEditingQuestion(question)}
                            >
                              <div className="flex items-start gap-3">
                                <GripVertical className="w-5 h-5 text-muted-foreground mt-1 cursor-grab" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                                      {question.type}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      #{index + 1}
                                    </span>
                                  </div>
                                  <h4 className="font-medium truncate">
                                    {question.title}
                                  </h4>
                                  {question.content && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {question.content}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuestionDelete(question.id);
                                  }}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Question Editor */}
                    <div>
                      {editingQuestion ? (
                        <QuestionEditor
                          question={editingQuestion}
                          onUpdate={(updates) =>
                            handleQuestionUpdate(editingQuestion.id, updates)
                          }
                          onImageUpload={() =>
                            handleImageUpload("question", editingQuestion.id)
                          }
                        />
                      ) : (
                        <Card className="p-8 text-center bg-transparent border rounded-none">
                          <div className="text-muted-foreground">
                            <Edit3 className="w-8 h-8 mx-auto mb-4 opacity-50" />
                            <p>Select a question to edit</p>
                            <p className="text-sm">
                              Click on any question to start editing
                            </p>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <FormPreview formData={formData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
