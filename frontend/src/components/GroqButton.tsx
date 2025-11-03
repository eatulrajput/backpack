import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface GroqButtonProps {
  question: string;
  onResponse: (response: string) => void;
}

const GroqButton: React.FC<GroqButtonProps> = ({ question, onResponse }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!question.trim()) return;

    setIsLoading(true);

    try {
      // This URL points to your FastAPI backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/groq-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }), // ✅ match backend's expected key
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      onResponse(data.reply || "No answer found.");
    } catch (error) {
      console.error(error);
      onResponse("Error connecting to Groq backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!question.trim() || isLoading}
      className="px-4 flex items-center gap-2"
    >
      <BookOpen className="w-4 h-4" />
      {isLoading ? "Loading..." : "Groq Answer"}
    </Button>
  );
};

export default GroqButton;
