import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Volume2, Mic } from "lucide-react";
import { textToSpeech, startVoiceRecognition } from "@/lib/voice";
import { useToast } from "@/hooks/use-toast";

export default function AITutorChat() {
  const [currentMessage] = useState("Great job on the last quiz! Today we're exploring the solar system. Did you know that Jupiter has over 80 moons? Let's discover more! 🪐");
  const { toast } = useToast();

  const handlePlayTutorVoice = () => {
    textToSpeech(currentMessage);
  };

  const handleVoiceQuestion = async () => {
    try {
      await startVoiceRecognition((transcript: string) => {
        toast({
          title: "Question Received",
          description: `I heard: "${transcript}". Let me think about that...`,
        });
      });
    } catch (error) {
      toast({
        title: "Voice Error",
        description: "Voice input is not available. Please type your question instead.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 mb-6">
      <div className="flex items-start space-x-4">
        {/* AI Tutor Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="w-16 h-16 border-4 border-primary/20">
            <AvatarImage src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face" />
            <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white font-bold">
              PL
            </AvatarFallback>
          </Avatar>
          <div className="text-center mt-2">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Prof. Luna</p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1">
          <div className="bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-sm">
            <p className="text-slate-800 dark:text-white">
              {currentMessage}
            </p>
          </div>
          
          {/* Voice Controls */}
          <div className="flex items-center space-x-3 mt-3">
            <Button 
              onClick={handlePlayTutorVoice}
              className="btn-primary flex items-center space-x-2 text-sm"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen</span>
            </Button>
            <Button 
              onClick={handleVoiceQuestion}
              variant="secondary"
              className="flex items-center space-x-2 text-sm"
            >
              <Mic className="w-4 h-4" />
              <span>Ask Question</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
