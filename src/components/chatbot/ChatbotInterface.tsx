import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Minimize2,
  Maximize2,
  HelpCircle,
  Target,
  Users,
  Mic,
  MicOff,
  Database,
  TrendingUp,
  Globe,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { ChatMessage } from "../../types";

interface ChatbotInterfaceProps {
  isOpen: boolean;
  onToggle: () => void;
}

const aiPersonalities = {
  scientist: {
    name: "Dr. Nexus",
    icon: "🔬",
    color: "text-blue-400",
    greeting:
      "Hello! I'm Dr. Nexus, your scientific research companion. I can help you analyze NASA data, understand atmospheric patterns, and guide you through complex missions. What would you like to explore today?",
  },
  mascot: {
    name: "AirBuddy",
    icon: "🌍",
    color: "text-green-400",
    greeting:
      "Hey there, Air Guardian! 🌟 I'm AirBuddy, and I'm super excited to help you save our planet! Whether you need mission tips, want to learn about air quality, or just need some encouragement, I'm here for you! What adventure should we start?",
  },
  advisor: {
    name: "Policy Planner",
    icon: "📊",
    color: "text-purple-400",
    greeting:
      "Greetings! I'm Policy Planner, your strategic mission advisor. I specialize in translating scientific data into actionable solutions and policy recommendations. How can I help you make a real-world impact today?",
  },
};

const quickActions = [
  { id: "explain-mission", label: "Explain Current Mission", icon: Target },
  { id: "data-help", label: "Help with NASA Data", icon: Database },
  { id: "quiz-me", label: "Quiz Me", icon: HelpCircle },
  { id: "show-progress", label: "Show My Progress", icon: TrendingUp },
  { id: "climate-story", label: "Tell Climate Story", icon: Globe },
  { id: "team-help", label: "Find Teammates", icon: Users },
];

const sampleResponses = {
  scientist: [
    "Based on the TEMPO satellite data, I can see elevated NO₂ concentrations over urban areas. This typically indicates increased vehicular emissions during rush hours.",
    "The correlation between PM2.5 levels and meteorological conditions shows a strong inverse relationship with wind speed. Higher winds help disperse particulate matter.",
    "Analyzing the spectral data from Pandora ground sensors, we can validate the satellite observations with 94% confidence. The atmospheric column measurements align perfectly.",
    "The MERRA-2 reanalysis data suggests this pollution event originated from industrial sources approximately 50km upwind. Shall we investigate further?",
  ],
  mascot: [
    "Wow! You're doing amazing! 🌟 That pollution hotspot you found is like a puzzle piece - now we can help clean up the air for everyone!",
    "Great job using the satellite data! 🛰️ It's like having super vision to see invisible pollution from space. You're becoming a real Air Guardian!",
    "Awesome work! 🎉 Every mission you complete helps real scientists understand our atmosphere better. You're making a difference!",
    "That's fantastic progress! 🚀 The way you connected the wind patterns to pollution spread was brilliant. Ready for the next challenge?",
  ],
  advisor: [
    "Excellent analysis. Your findings suggest implementing traffic reduction measures during peak hours could reduce NO₂ levels by 18-25%.",
    "This data supports a policy recommendation for increased green infrastructure. Urban trees could mitigate PM2.5 concentrations by approximately 12%.",
    "Your scenario modeling indicates significant health benefits. We project 50 fewer respiratory cases per 100,000 population with these interventions.",
    "Strategic recommendation: Focus monitoring efforts on the identified hotspot. Cost-benefit analysis shows 3:1 return on investment for targeted interventions.",
  ],
};

export function ChatbotInterface({ isOpen, onToggle }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentPersonality, setCurrentPersonality] =
    useState<keyof typeof aiPersonalities>("scientist");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: "1",
        role: "assistant",
        content: aiPersonalities[currentPersonality].greeting,
        timestamp: new Date(),
        context: {
          type: "data_guidance",
        },
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentPersonality, messages.length]);

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue;
    if (!messageContent.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = sampleResponses[currentPersonality];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
        context: {
          type: "data_guidance",
        },
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleQuickAction = (actionId: string) => {
    const actionMessages = {
      "explain-mission":
        "Can you explain the current Atmospheric Detective mission and what I need to do?",
      "data-help":
        "How do I use NASA TEMPO satellite data to analyze air pollution?",
      "quiz-me": "Can you quiz me on atmospheric science concepts?",
      "show-progress": "Show me my current progress and achievements",
      "climate-story": "Tell me an engaging story about climate science",
      "team-help": "How can I find teammates to collaborate on missions?",
    };

    const message = actionMessages[actionId as keyof typeof actionMessages];
    if (message) {
      handleSendMessage(message);
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Here you would implement speech recognition
    if (!isListening) {
      // Start listening
      setTimeout(() => {
        setIsListening(false);
        setInputValue("How does air pollution affect climate change?");
      }, 3000);
    }
  };

  const generateSuggestions = (userInput: string): string[] => {
    const suggestions = [
      "Tell me more about this",
      "Show me the data source",
      "What should I do next?",
      "Explain this in simple terms",
    ];

    if (userInput.toLowerCase().includes("mission")) {
      suggestions.push("Start this mission", "Show mission requirements");
    }

    if (userInput.toLowerCase().includes("data")) {
      suggestions.push("Visualize this data", "Compare with historical data");
    }

    return suggestions.slice(0, 3);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          onClick={onToggle}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg glow-border"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-40 ${
        isMinimized ? "w-80" : "w-96"
      } transition-all duration-300`}
    >
      <Card className="bg-gray-900/95 border-gray-700 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <CardHeader className="pb-3 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-sm">
                  {aiPersonalities[currentPersonality].icon}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  {aiPersonalities[currentPersonality].name}
                </h3>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {/* Personality Switcher */}
              <div className="flex gap-1">
                {(
                  Object.keys(aiPersonalities) as Array<
                    keyof typeof aiPersonalities
                  >
                ).map((personality) => (
                  <Button
                    key={personality}
                    variant={
                      currentPersonality === personality ? "default" : "ghost"
                    }
                    size="sm"
                    className="w-6 h-6 p-0 text-xs"
                    onClick={() => setCurrentPersonality(personality)}
                  >
                    {aiPersonalities[personality].icon}
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {/* Quick Actions */}
            <div className="p-3 border-b border-gray-800">
              <div className="grid grid-cols-3 gap-1">
                {quickActions.slice(0, 6).map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickAction(action.id)}
                      className="text-xs h-8 flex flex-col gap-1 p-1"
                    >
                      <Icon className="w-3 h-3" />
                      <span className="text-[10px] leading-none">
                        {action.label.split(" ")[0]}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.role === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-cyan-500"
                          : "bg-gradient-to-r from-purple-500 to-pink-500"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-cyan-500 text-white"
                          : "bg-gray-800 text-gray-100"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.context && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {message.context.type?.replace("_", " ")}
                        </Badge>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          message.role === "user"
                            ? "text-cyan-100"
                            : "text-gray-400"
                        }`}
                      >
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>

                    {/* Message Suggestions */}
                    {message.role === "assistant" &&
                      message.context?.type === "data_guidance" && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {generateSuggestions(message.content).map(
                            (suggestion, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="text-xs h-6"
                                onClick={() => handleSendMessage(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            )
                          )}
                        </div>
                      )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-800">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder={`Ask ${aiPersonalities[currentPersonality].name}...`}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`absolute right-1 top-1 h-6 w-6 p-0 ${
                      isListening ? "text-red-400 animate-pulse" : ""
                    }`}
                    onClick={toggleVoiceInput}
                  >
                    {isListening ? (
                      <MicOff className="w-3 h-3" />
                    ) : (
                      <Mic className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
