// ===== CHATBOX FUNCTIONALITY =====

const chatboxContainer = document.querySelector(".chatbox-container");
const chatboxToggle = document.querySelector(".chatbox-toggle");
const closeBtn = document.querySelector(".close-btn");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const messagesArea = document.querySelector(".chatbox-messages");

// Toggle chatbox
chatboxToggle.addEventListener("click", () => {
  chatboxContainer.classList.toggle("active");
  if (chatboxContainer.classList.contains("active")) {
    messageInput.focus();
  }
});

// Close chatbox
closeBtn.addEventListener("click", () => {
  chatboxContainer.classList.remove("active");
});

// Send message
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  // Add user message
  addMessage(message, "user-message");
  messageInput.value = "";

  // Show typing indicator
  showTypingIndicator();

  try {
    const botReply = await queryBotReply(message);
    removeTypingIndicator();
    addMessage(botReply, "bot-message");
  } catch (error) {
    removeTypingIndicator();
    console.error("Chatbox API error:", error);
    addMessage(
      "Xin lỗi, không thể kết nối đến dịch vụ trả lời. Vui lòng thử lại sau.",
      "bot-message",
    );
  }

  // Show suggestions for certain messages
  setTimeout(() => {
    showSuggestions();
  }, 500);
}

async function queryBotReply(message) {
  const response = await fetch("api/chatbox.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.reply || getBotReply(message);
}

function addMessage(text, className) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${className}`;
  messageDiv.innerHTML = `<p>${text}</p>`;
  messagesArea.appendChild(messageDiv);

  // Auto scroll
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "bot-typing";
  typingDiv.id = "typing-indicator";
  typingDiv.innerHTML = "<span></span><span></span><span></span>";
  messagesArea.appendChild(typingDiv);
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

function showSuggestions() {
  const suggestionsDiv = document.createElement("div");
  suggestionsDiv.className = "suggestions-container";
  suggestionsDiv.id = "suggestions";

  const suggestions = [
    "Cách mua vé",
    "Giá vé",
    "Sự kiện nào",
    "Liên hệ hỗ trợ",
  ];

  suggestions.forEach((suggestion) => {
    const btn = document.createElement("button");
    btn.className = "suggestion-btn";
    btn.textContent = suggestion;
    btn.onclick = () => {
      messageInput.value = suggestion;
      sendMessage();
      document.getElementById("suggestions").remove();
    };
    suggestionsDiv.appendChild(btn);
  });

  messagesArea.appendChild(suggestionsDiv);
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

// ===== BOT RESPONSES =====

const botResponses = {
  // About tickets
  ticket: {
    keywords: ["vé", "ticket", "mua vé", "giá vé", "bao nhiêu tiền"],
    responses: [
      "🎫 Chúng tôi bán vé cho các sự kiện lịch sử và văn hóa hấp dẫn!\n\n📌 Thông tin vé:\n- Vé cơ bản: 150.000 VND\n- Vé VIP: 250.000 VND\n- Vé nhóm (10+): Giảm 20%\n\nBạn muốn mua vé cho sự kiện nào?",
      'Giá vé phụ thuộc vào loại sự kiện:\n\n🏛️ Tham quan di tích: 80.000 - 150.000 VND\n🎭 Biểu diễn văn hóa: 200.000 - 300.000 VND\n🎨 Triển lãm: 50.000 - 100.000 VND\n\nNhấp "Mua Vé" ở đầu trang để tiếp tục!',
    ],
  },

  // How to buy
  how_to_buy: {
    keywords: ["cách mua", "mua như thế nào", "hướng dẫn", "tutorial"],
    responses: [
      '📝 Quy trình mua vé:\n\n1️⃣ Nhấp nút "Mua Vé"\n2️⃣ Chọn sự kiện bạn muốn\n3️⃣ Chọn số lượng vé\n4️⃣ Điền thông tin cá nhân\n5️⃣ Thanh toán (thẻ/chuyển khoản)\n6️⃣ Nhận xác nhận qua email\n\nCó cần hỗ trợ thêm không?',
    ],
  },

  // Event information
  event: {
    keywords: ["sự kiện", "event", "gì", "cái gì", "chương trình", "hoạt động"],
    responses: [
      "🎪 Các sự kiện đang diễn ra:\n\n🏛️ Tham quan Thành phố Tố Lịch Sử\n🎭 Biểu diễn Múa Lân\n🎨 Triển lãm Đồ Gốm Cổ\n📖 Hội thảo về Văn hóa Truyền Thống\n🎬 Chiếu Phim Tài Liệu Lịch Sử\n\nBạn quan tâm sự kiện nào?",
      '✨ Chúng tôi tổ chức hàng tháng các sự kiện văn hóa, lịch sử bổ ích.\n\nVisit trang "Khám Phá" để xem danh sách đầy đủ các sự kiện sắp tới!',
    ],
  },

  // Contact & Support
  contact: {
    keywords: [
      "liên hệ",
      "hỗ trợ",
      "support",
      "điện thoại",
      "email",
      "đặt câu hỏi",
    ],
    responses: [
      "📞 Thông tin liên hệ:\n\n☎️ Hotline: 1900-1234\n📧 Email: support@honviet.com\n💬 Live chat: 8:00 AM - 10:00 PM (hàng ngày)\n🏪 Văn phòng: 123 Đường ABC, Hà Nội\n\nChúng tôi sẵn lòng hỗ trợ bạn!",
    ],
  },

  // Payment
  payment: {
    keywords: [
      "thanh toán",
      "payment",
      "trả tiền",
      "hoàn tiền",
      "refund",
      "hoàn lại",
    ],
    responses: [
      "💳 Phương thức thanh toán:\n\n🏦 Chuyển khoản ngân hàng\n💳 Thẻ tín dụng\n📱 Ví điện tử (Momo, ZaloPay)\n💰 Thanh toán tại quầy\n\nTất cả phương thức đều an toàn và mã hóa!",
      "✅ Chính sách hoàn tiền:\n\n• Hoàn 100% nếu hủy trước 7 ngày\n• Hoàn 50% nếu hủy trước 3 ngày\n• Không hoàn nếu hủy dưới 3 ngày\n\nĐể hoàn tiền, vui lòng liên hệ support!",
    ],
  },

  // History & Culture
  history_culture: {
    keywords: [
      "lịch sử",
      "văn hóa",
      "culture",
      "history",
      "truyền thống",
      "di sản",
    ],
    responses: [
      "🏛️ Hồn Việt là nền tảng khám phá:\n\n📚 Di sản văn hóa Việt Nam\n🎭 Truyền thống nghệ thuật dân gian\n🗿 Các di tích lịch sử quý báu\n👥 Đặc sắc của các dân tộc\n🏙️ Kiến trúc cổ kính\n\nBạn muốn tìm hiểu về điều gì?",
      '🌍 Hành trình khám phá nền văn hóa Việt Nam xuyên suốt lịch sử!\n\nNhấp "Khám Phá" để xem chi tiết các di tích và sự kiện!',
    ],
  },

  // Group bookings
  group: {
    keywords: ["nhóm", "group", "tập thể", "tổ chức", "công ty", "trường"],
    responses: [
      "👥 Đặt vé nhóm:\n\n✅ 10-50 người: Giảm 15%\n✅ 50-100 người: Giảm 20%\n✅ 100+ người: Giảm 25%\n✅ Hướng dẫn viên miễn phí\n✅ Phục vụ catering\n\nLiên hệ: group@honviet.com",
    ],
  },

  // Greeting
  greeting: {
    keywords: ["xin chào", "hi", "hello", "chào", "hey"],
    responses: [
      "👋 Xin chào! Mình là trợ lý ảo của Hồn Việt!\n\nMình có thể giúp bạn:\n✅ Thông tin về vé & giá\n✅ Hướng dẫn mua vé\n✅ Chi tiết sự kiện\n✅ Liên hệ hỗ trợ\n\nBạn muốn tìm hiểu gì?",
    ],
  },

  // Help
  help: {
    keywords: ["giúp", "help", "cần gì", "hỗ trợ", "support"],
    responses: [
      "🆘 Mình có thể hỗ trợ bạn với:\n\n🎫 Mua vé & giá cả\n📋 Hướng dẫn đặt vé\n🎪 Thông tin sự kiện\n💳 Thanh toán & hoàn tiền\n👥 Đặt nhóm\n📞 Liên hệ công ty\n📚 Thông tin lịch sử & văn hóa\n\nHỏi mình bất kỳ điều gì!",
    ],
  },

  // Default response
  default: {
    responses: [
      "😊 Xin lỗi, tôi chưa hiểu câu hỏi của bạn.\n\n💡 Hãy thử hỏi về:\n• Mua vé\n• Giá vé\n• Sự kiện\n• Hỗ trợ khách hàng\n\nHoặc nhấp các gợi ý bên dưới!",
      "🤔 Câu hỏi tuyệt vời! Tôi có thể không có câu trả lời chính xác.\n\n📞 Vui lòng liên hệ với chúng tôi:\nEmail: support@honviet.com\nHotline: 1900-1234",
    ],
  },
};

function getBotReply(userMessage) {
  const lowerMessage = userMessage.toLowerCase().trim();

  // Check each category of responses
  for (let category in botResponses) {
    const categoryData = botResponses[category];

    if (categoryData.keywords) {
      for (let keyword of categoryData.keywords) {
        if (lowerMessage.includes(keyword)) {
          const responses = categoryData.responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }
  }

  // Default response
  const defaultResponses = botResponses.default.responses;
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// ===== INITIAL MESSAGE =====

window.addEventListener("load", () => {
  const initialMessage =
    "👋 Xin chào! Mình là trợ lý ảo của Hồn Việt. Bạn muốn tìm hiểu gì hôm nay?\n\n💡 Mình có thể giúp bạn với: Mua vé, Thông tin sự kiện, Liên hệ hỗ trợ...";
  addMessage(initialMessage, "bot-message");
});
