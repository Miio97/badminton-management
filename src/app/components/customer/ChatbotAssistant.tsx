import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Calendar, Tag, Search, Sparkles, Bot } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

export function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Xin chào! Tôi là trợ lý ảo của Badminton Center. Tôi có thể giúp bạn đặt sân, tìm giờ trống hoặc xem khuyến mãi. Bạn cần hỗ trợ gì?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    {
      icon: Search,
      label: "Xem sân trống",
      color: "from-emerald-500 to-teal-600",
      action: () => handleQuickAction("Tôi muốn xem sân trống"),
    },
    {
      icon: Calendar,
      label: "Đặt sân nhanh",
      color: "from-blue-500 to-cyan-600",
      action: () => handleQuickAction("Tôi muốn đặt sân"),
    },
    {
      icon: Tag,
      label: "Xem khuyến mãi",
      color: "from-purple-500 to-pink-600",
      action: () => handleQuickAction("Có khuyến mãi gì không?"),
    },
  ];

  const handleQuickAction = (message: string) => {
    handleSendMessage(message);
  };

  const simulateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("sân trống") || lowerMessage.includes("xem sân")) {
      setTimeout(() => {
        navigate("/customer/booking");
        toast.success("Đang chuyển đến trang đặt sân...");
      }, 1500);
      return "Hiện tại chúng tôi có 8 sân đang trống. Tôi sẽ chuyển bạn đến trang đặt sân để xem chi tiết nhé! 🎯";
    }

    if (lowerMessage.includes("đặt sân")) {
      setTimeout(() => {
        navigate("/customer/booking");
        toast.success("Đang mở form đặt sân...");
      }, 1500);
      return "Được rồi! Để đặt sân, bạn cần chọn ngày, giờ và sân phù hợp. Tôi sẽ chuyển bạn đến trang đặt sân ngay nhé! 📅";
    }

    if (lowerMessage.includes("khuyến mãi") || lowerMessage.includes("giảm giá") || lowerMessage.includes("ưu đãi")) {
      setTimeout(() => {
        navigate("/customer/promotions");
        toast.success("Xem các chương trình khuyến mãi...");
      }, 1500);
      return "Hiện tại chúng tôi đang có nhiều chương trình khuyến mãi hấp dẫn:\n- Giảm 20% giờ vàng (18h-20h)\n- Giảm 50% cho khách hàng mới\n- Tặng 1 giờ khi mua combo 5 giờ\n\nTôi sẽ chuyển bạn đến trang khuyến mãi để xem chi tiết! 🎁";
    }

    if (lowerMessage.includes("giá") || lowerMessage.includes("bao nhiêu")) {
      return "Giá sân của chúng tôi:\n- Sân thường: 100,000đ - 120,000đ/giờ\n- Sân VIP: 150,000đ/giờ\n\nBạn có thể được giảm giá thêm với các chương trình khuyến mãi hiện tại! 💰";
    }

    if (lowerMessage.includes("giờ") || lowerMessage.includes("mở cửa")) {
      return "Badminton Center mở cửa từ 6:00 sáng đến 24:00 đêm hàng ngày, kể cả cuối tuần và ngày lễ. Bạn có thể đặt sân bất cứ lúc nào trong khung giờ này! ⏰";
    }

    if (lowerMessage.includes("địa chỉ") || lowerMessage.includes("ở đâu")) {
      return "Chúng tôi tọa lạc tại:\n📍 123 Đường Lê Lợi, Phường 1, Quận Gò Vấp\nThành phố Hồ Chí Minh, Việt Nam\n\nBạn có thể xem bản đồ trong mục Liên hệ! 🗺️";
    }

    if (lowerMessage.includes("hủy") || lowerMessage.includes("cancel")) {
      return "Để hủy đặt sân, bạn vui lòng:\n1. Vào mục 'Lịch sử đặt sán'\n2. Chọn booking cần hủy\n3. Nhấn 'Hủy đặt sân'\n\nLưu ý: Hủy trước 24h sẽ được hoàn tiền cọc 100%! 🔄";
    }

    if (lowerMessage.includes("cảm ơn") || lowerMessage.includes("thanks")) {
      return "Rất vui được hỗ trợ bạn! Chúc bạn có những trận đấu thú vị tại Badminton Center! 😊🏸";
    }

    // Default response
    return "Tôi có thể giúp bạn:\n✅ Xem sân trống và đặt sân\n✅ Tìm hiểu về giá và khuyến mãi\n✅ Kiểm tra lịch sử đặt sân\n✅ Trả lời các câu hỏi về dịch vụ\n\nBạn cần hỗ trợ gì nhé? 💬";
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: textToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = simulateBotResponse(textToSend);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl flex items-center justify-center group"
      >
        <motion.div
          animate={!isOpen ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        </motion.div>

        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">1</span>
          </motion.div>
        )}

        {/* Pulse Effect */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-emerald-500"
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Trợ lý ảo</h3>
                  <div className="text-sm text-emerald-100 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                    Đang hoạt động
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-800 rounded-bl-none"
                    }`}
                  >
                    {message.type === "bot" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-600">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 rounded-full bg-slate-400"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 rounded-full bg-slate-400"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 rounded-full bg-slate-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 pb-4 space-y-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={action.action}
                      className={`w-full p-3 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all`}
                    >
                      <Icon className="w-4 h-4" />
                      {action.label}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-200/50 bg-white/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
