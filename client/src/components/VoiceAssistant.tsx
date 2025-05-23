import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { startVoiceRecognition, stopVoiceRecognition, textToSpeech } from "@/lib/voice";

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleVoiceToggle = async () => {
    if (isListening) {
      stopVoiceRecognition();
      setIsListening(false);
      toast({
        title: "Voice Assistant Off",
        description: "Voice commands are now disabled.",
      });
    } else {
      try {
        await startVoiceRecognition((transcript: string) => {
          handleVoiceCommand(transcript);
        });
        setIsListening(true);
        textToSpeech("Voice assistant activated. How can I help you learn today?");
        toast({
          title: "Voice Assistant On",
          description: "Listening for voice commands...",
        });
      } catch (error) {
        toast({
          title: "Voice Recognition Error",
          description: "Voice commands are not supported in your browser.",
          variant: "destructive",
        });
      }
    }
  };

  const handleVoiceCommand = (transcript: string) => {
    const command = transcript.toLowerCase();
    
    if (command.includes("go home") || command.includes("home page")) {
      window.location.href = "/";
      textToSpeech("Going to home page");
    } else if (command.includes("subjects") || command.includes("subject")) {
      window.location.href = "/subjects";
      textToSpeech("Opening subjects page");
    } else if (command.includes("ai tutor") || command.includes("tutor") || command.includes("chat")) {
      window.location.href = "/ai-tutor";
      textToSpeech("Opening AI tutor chat");
    } else if (command.includes("progress") || command.includes("stats")) {
      window.location.href = "/progress";
      textToSpeech("Opening progress page");
    } else if (command.includes("profile") || command.includes("settings")) {
      window.location.href = "/profile";
      textToSpeech("Opening profile page");
    } else if (command.includes("help") || command.includes("what can you do")) {
      textToSpeech("I can help you navigate the app. Try saying 'go home', 'open subjects', 'ai tutor', 'show progress', or 'open profile'.");
    } else {
      textToSpeech("I didn't understand that command. Try saying 'help' to learn what I can do.");
    }
  };

  return (
    <Button
      onClick={handleVoiceToggle}
      className={`fixed bottom-20 right-6 lg:bottom-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl hover:scale-110 transition-all ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 animate-glow'
      }`}
    >
      {isListening ? (
        <MicOff className="text-lg w-5 h-5" />
      ) : (
        <Mic className="text-lg w-5 h-5" />
      )}
    </Button>
  );
}
