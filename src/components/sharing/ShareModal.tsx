import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Share2,
  Copy,
  Download,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Camera,
  Image,
  FileText,
  Globe,
  Lock,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { dataService } from "../../services/dataService";
import { GameSession, Achievement } from "../../types";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    type: "mission_result" | "achievement" | "air_quality_report" | "custom";
    title: string;
    description?: string;
    data: any;
    imageUrl?: string;
  };
}

interface ShareOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

export function ShareModal({ isOpen, onClose, content }: ShareModalProps) {
  const { user } = useAuth();
  const [isSharing, setIsSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [privacy, setPrivacy] = useState<"public" | "friends" | "private">(
    "public"
  );
  const [customMessage, setCustomMessage] = useState("");
  const [includeData, setIncludeData] = useState(true);
  const [includeImage, setIncludeImage] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateShareText = () => {
    const baseText = customMessage || content.description || "";
    const hashtags = "#CleanSpace #AirQuality #NASA #Environment";

    switch (content.type) {
      case "mission_result":
        return `🎯 Just completed a CleanSpace mission! ${baseText} ${hashtags}`;
      case "achievement":
        return `🏆 New achievement unlocked in CleanSpace! ${baseText} ${hashtags}`;
      case "air_quality_report":
        return `📊 Air quality report from CleanSpace: ${baseText} ${hashtags}`;
      default:
        return `${baseText} ${hashtags}`;
    }
  };

  const generateShareUrl = () => {
    const params = new URLSearchParams({
      type: content.type,
      title: content.title,
      user: user?.username || "anonymous",
    });
    return `${window.location.origin}/shared?${params}`;
  };

  const generateShareImage = async (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        resolve("");
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("");
        return;
      }

      // Set canvas size
      canvas.width = 1200;
      canvas.height = 630;

      // Create gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#1F2937");
      gradient.addColorStop(1, "#111827");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add title
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText(content.title, canvas.width / 2, 150);

      // Add description
      if (content.description) {
        ctx.fillStyle = "#D1D5DB";
        ctx.font = "24px Arial";
        const words = content.description.split(" ");
        let line = "";
        let y = 220;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " ";
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > 1000 && i > 0) {
            ctx.fillText(line, canvas.width / 2, y);
            line = words[i] + " ";
            y += 40;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, canvas.width / 2, y);
      }

      // Add user info
      if (user) {
        ctx.fillStyle = "#06B6D4";
        ctx.font = "20px Arial";
        ctx.fillText(
          `Shared by ${user.username} on CleanSpace`,
          canvas.width / 2,
          canvas.height - 100
        );
      }

      // Add logo/branding
      ctx.fillStyle = "#06B6D4";
      ctx.font = "bold 32px Arial";
      ctx.fillText("CleanSpace", canvas.width / 2, canvas.height - 50);

      // Convert to data URL
      resolve(canvas.toDataURL("image/png"));
    });
  };

  const shareOptions: ShareOption[] = [
    {
      id: "native",
      name: "Share",
      icon: <Share2 className="w-5 h-5" />,
      color: "bg-blue-500",
      action: async () => {
        if (navigator.share) {
          try {
            const shareData: ShareData = {
              title: content.title,
              text: generateShareText(),
              url: generateShareUrl(),
            };

            if (includeImage && content.imageUrl) {
              // Note: Files in share API have limited support
              shareData.text += `\n\nView the full report: ${generateShareUrl()}`;
            }

            await navigator.share(shareData);
            setShareStatus("success");
          } catch (error) {
            console.error("Error sharing:", error);
            setShareStatus("error");
          }
        }
      },
    },
    {
      id: "copy",
      name: "Copy Link",
      icon: <Copy className="w-5 h-5" />,
      color: "bg-gray-500",
      action: async () => {
        try {
          await navigator.clipboard.writeText(generateShareUrl());
          setShareStatus("success");
        } catch (error) {
          console.error("Error copying:", error);
          setShareStatus("error");
        }
      },
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      color: "bg-blue-400",
      action: () => {
        const text = encodeURIComponent(generateShareText());
        const url = encodeURIComponent(generateShareUrl());
        window.open(
          `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
          "_blank"
        );
      },
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      color: "bg-blue-600",
      action: () => {
        const url = encodeURIComponent(generateShareUrl());
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          "_blank"
        );
      },
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      color: "bg-blue-700",
      action: () => {
        const url = encodeURIComponent(generateShareUrl());
        const title = encodeURIComponent(content.title);
        const summary = encodeURIComponent(generateShareText());
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`,
          "_blank"
        );
      },
    },
    {
      id: "download",
      name: "Download",
      icon: <Download className="w-5 h-5" />,
      color: "bg-green-500",
      action: async () => {
        try {
          if (includeImage) {
            const imageUrl = await generateShareImage();
            const link = document.createElement("a");
            link.download = `${content.title.replace(/\s+/g, "_")}.png`;
            link.href = imageUrl;
            link.click();
          }

          if (includeData) {
            const dataStr = JSON.stringify(content.data, null, 2);
            const dataBlob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement("a");
            link.download = `${content.title.replace(/\s+/g, "_")}_data.json`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }

          setShareStatus("success");
        } catch (error) {
          console.error("Error downloading:", error);
          setShareStatus("error");
        }
      },
    },
  ];

  const handleShare = async () => {
    if (!user) {
      setShareStatus("error");
      return;
    }

    setIsSharing(true);
    try {
      // Create shared content in database
      const sharedContent = {
        content_type: content.type,
        title: content.title,
        description: customMessage || content.description || "",
        content_data: content.data,
        media_urls: content.imageUrl ? [content.imageUrl] : null,
        is_public: privacy === "public",
        tags: ["cleanspace", "air_quality", "nasa"],
      };

      const { error } = await dataService.createSharedContent(sharedContent);
      if (error) throw error;

      setShareStatus("success");
    } catch (error) {
      console.error("Error creating shared content:", error);
      setShareStatus("error");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share {content.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Status Messages */}
                {shareStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Shared successfully!</span>
                  </motion.div>
                )}

                {shareStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Failed to share. Please try again.</span>
                  </motion.div>
                )}

                {/* Preview */}
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">
                    {content.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    {content.description || "No description provided"}
                  </p>
                  {content.imageUrl && (
                    <img
                      src={content.imageUrl}
                      alt="Share preview"
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                </div>

                {/* Custom Message */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Add a message (optional)
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
                    placeholder="Share your thoughts..."
                    rows={3}
                    maxLength={280}
                  />
                  <div className="text-xs text-gray-400 text-right">
                    {customMessage.length}/280
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Privacy
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: "public", icon: Globe, label: "Public" },
                      { value: "friends", icon: Users, label: "Friends" },
                      { value: "private", icon: Lock, label: "Private" },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={
                          privacy === option.value ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setPrivacy(option.value as any)}
                        className="flex items-center gap-2"
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Share Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Include
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={includeData}
                        onChange={(e) => setIncludeData(e.target.checked)}
                        className="rounded border-gray-600 bg-gray-800"
                      />
                      <FileText className="w-4 h-4" />
                      Data
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={includeImage}
                        onChange={(e) => setIncludeImage(e.target.checked)}
                        className="rounded border-gray-600 bg-gray-800"
                      />
                      <Image className="w-4 h-4" />
                      Image
                    </label>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {shareOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      className={`${option.color} border-0 text-white hover:opacity-80`}
                      onClick={option.action}
                    >
                      {option.icon}
                      <span className="ml-2">{option.name}</span>
                    </Button>
                  ))}
                </div>

                {/* Save to Community */}
                <div className="pt-4 border-t border-gray-700">
                  <Button
                    onClick={handleShare}
                    disabled={isSharing || !user}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    {isSharing ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Share2 className="w-4 h-4 mr-2" />
                    )}
                    {isSharing ? "Sharing..." : "Share to Community"}
                  </Button>
                  {!user && (
                    <p className="text-xs text-gray-400 text-center mt-2">
                      Sign in to share to the community
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hidden canvas for image generation */}
            <canvas
              ref={canvasRef}
              style={{ display: "none" }}
              width={1200}
              height={630}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
