import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import VoiceAssistant from "@/components/VoiceAssistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Mic, Volume2, Brain, Lightbulb, Star, MessageCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AITutor() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Professor Luna, your AI tutor. I'm here to help you learn and explore any topic you're curious about. What would you like to learn today? 🌟",
      timestamp: new Date(),
    }
  ]);
  const { toast } = useToast();

  // Fetch AI session
  const { data: session } = useQuery({
    queryKey: ['/api/ai/session'],
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: { message: string; context?: any }) => 
      apiRequest('POST', '/api/ai/chat', data),
    onSuccess: (response: any) => {
      const tutorMessage: Message = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, tutorMessage]);
      
      // Show suggestions if available
      if (response.suggestions && response.suggestions.length > 0) {
        toast({
          title: "Learning Tips",
          description: response.suggestions[0],
        });
      }
    },
    onError: () => {
      toast({
        title: "Oops!",
        description: "I'm having trouble connecting right now. Let's try again!",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate({ message });
    setMessage("");
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
      };

      recognition.onerror = () => {
        toast({
          title: "Voice Recognition Error",
          description: "Sorry, I couldn't hear you clearly. Please try typing instead.",
          variant: "destructive",
        });
      };

      recognition.start();
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Voice input is not supported in your browser. Please type your message.",
        variant: "destructive",
      });
    }
  };

  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const quickQuestions = [
    "Explain photosynthesis in simple terms",
    "Help me with fractions",
    "What's the water cycle?",
    "How do rockets work?",
    "Tell me about ancient Egypt",
    "Help with creative writing",
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-slate-900 dark:text-white mb-2">
            AI Tutor Chat
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Ask Professor Luna anything you want to learn about!
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="card-kid h-[600px] flex flex-col">
              <CardContent className="p-0 flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 border-2 border-primary">
                      <AvatarImage src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face" />
                      <AvatarFallback>PL</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Professor Luna</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Your friendly AI tutor</p>
                    </div>
                    <div className="ml-auto">
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        Online
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white' 
                          : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white'
                      } rounded-2xl p-4 shadow-sm`}>
                        <p className="text-sm">{msg.content}</p>
                        {msg.role === 'assistant' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="mt-2 h-6 text-xs"
                            onClick={() => handleTextToSpeech(msg.content)}
                          >
                            <Volume2 className="w-3 h-3 mr-1" />
                            Listen
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {sendMessageMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="animate-pulse">💭</div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Professor Luna is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask me anything about your studies..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleVoiceInput}
                      className="shrink-0"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!message.trim() || sendMessageMutation.isPending}
                      className="btn-primary shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card className="card-kid">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-accent" />
                  Quick Questions
                </h3>
                
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start text-xs h-auto py-2 px-3"
                      onClick={() => setMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Tips */}
            <Card className="card-kid">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-accent" />
                  Learning Tips
                </h3>
                
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                    <p>Ask specific questions for better help</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 shrink-0"></div>
                    <p>Use voice input for easier interaction</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>
                    <p>Listen to explanations for better understanding</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                    <p>Don't hesitate to ask follow-up questions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice Commands */}
            <Card className="card-kid">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                  Voice Commands
                </h3>
                
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <code>"Explain [topic]"</code>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <code>"Help me with [subject]"</code>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <code>"Quiz me on [topic]"</code>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <code>"Give me examples"</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BottomNavigation />
      <VoiceAssistant />
    </div>
  );
}
