import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Clock } from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "support";
  text: string;
  timestamp: string;
}

const mockMessages: Message[] = [
  {
    id: 1,
    sender: "support",
    text: "Xin chào! Tôi là trợ lý ảo của Badminton Center. Tôi có thể giúp gì cho bạn?",
    timestamp: "10:00",
  },
];

const quickReplies = [
  "Giá sân bao nhiêu?",
  "Giờ hoạt động?",
  "Cách đặt sân?",
  "Chính sách hủy đặt?",
];

const autoReplies: { [key: string]: string } = {
  "giá": "Giá sân của chúng tôi dao động từ 100.000đ - 150.000đ/giờ tùy theo loại sân và thời gian. Sân VIP: 150.000đ/giờ, Sân thường: 100.000đ/giờ. Có nhiều khuyến mãi hấp dẫn cho khách hàng!",
  "giờ": "Chúng tôi mở cửa từ 6:00 sáng đến 23:00 tối hàng ngày. Thời gian vàng (18:00-21:00) giá có thể cao hơn.",
  "đặt": "Để đặt sân, bạn vào mục 'Đặt sân', chọn ngày giờ mong muốn, chọn sân và điền thông tin. Bạn cần cọc 30% để xác nhận đặt sân.",
  "hủy": "Chính sách hủy đặt sân: Hủy trước 24h - hoàn 100% tiền cọc, Hủy trước 12h - hoàn 50%, Hủy dưới 12h - không hoàn tiền.",
};

export function SupportChat() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text: string = inputText) => {
    if (!text.trim()) return;

    const now = new Date();
    const timestamp = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: text.trim(),
      timestamp,
    };

    setMessages([...messages, userMessage]);
    setInputText("");

    // Show typing indicator
    setIsTyping(true);

    // Auto reply after delay
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let replyText = "Cảm ơn bạn đã liên hệ. Nhân viên sẽ phản hồi sớm nhất có thể.";

      // Check for keywords
      for (const [keyword, reply] of Object.entries(autoReplies)) {
        if (lowerText.includes(keyword)) {
          replyText = reply;
          break;
        }
      }

      const supportMessage: Message = {
        id: messages.length + 2,
        sender: "support",
        text: replyText,
        timestamp: `${now.getHours()}:${(now.getMinutes() + 1).toString().padStart(2, "0")}`,
      };

      setMessages((prev) => [...prev, supportMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Nhắn tin hỗ trợ</h2>
        <p className="text-gray-600">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Window */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-200px)]">
            {/* Chat Header */}
            <div className="p-4 border-b bg-gradient-to-r from-[#00d9b8] to-[#00c4a7] text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Trợ lý Badminton Center</h3>
                  <p className="text-sm opacity-90">Trực tuyến</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[70%] ${
                      message.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === "user"
                          ? "bg-[#00d9b8]"
                          : "bg-gray-200"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-[#00d9b8] text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-1">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[70%]">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Câu hỏi thường gặp:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Thông tin liên hệ</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Hotline</p>
                <p className="text-lg font-bold text-[#00d9b8]">1900 1234</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-sm text-gray-800">support@badminton.vn</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Địa chỉ</p>
                <p className="text-sm text-gray-800">
                  123 Nguyễn Huệ, Quận 1, TP.HCM
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Giờ làm việc</p>
                <p className="text-sm text-gray-800">6:00 - 23:00 (Hàng ngày)</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Câu hỏi thường gặp</h3>
            <div className="space-y-3">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-800 hover:text-[#00d9b8]">
                  Làm sao để đặt sân?
                  <span className="ml-2">▼</span>
                </summary>
                <p className="mt-2 text-sm text-gray-600">
                  Bạn vào mục "Đặt sân", chọn ngày giờ và sân muốn đặt, sau đó điền
                  thông tin và thanh toán tiền cọc.
                </p>
              </details>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-800 hover:text-[#00d9b8]">
                  Chính sách hủy đặt sân?
                  <span className="ml-2">▼</span>
                </summary>
                <p className="mt-2 text-sm text-gray-600">
                  Hủy trước 24h: hoàn 100%, trước 12h: hoàn 50%, dưới 12h: không hoàn
                  tiền.
                </p>
              </details>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-800 hover:text-[#00d9b8]">
                  Có dịch vụ cho thuê vợt không?
                  <span className="ml-2">▼</span>
                </summary>
                <p className="mt-2 text-sm text-gray-600">
                  Có, chúng tôi có dịch vụ cho thuê vợt, giày và các phụ kiện khác với
                  giá ưu đãi.
                </p>
              </details>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-gradient-to-br from-[#00d9b8] to-[#00c4a7] rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" />
              <h3 className="font-bold">Thời gian hỗ trợ</h3>
            </div>
            <p className="text-sm opacity-90 mb-2">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn
            </p>
            <p className="text-2xl font-bold">24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
