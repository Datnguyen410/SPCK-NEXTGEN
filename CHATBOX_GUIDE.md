# Hướng Dẫn Tạo Chatbox

## 1. Cấu Trúc Dự Án

```
CSS/
  ├── chatbox.css (mới)
JS/
  ├── chatbox.js (mới)
HTML/
  ├── chatbox.html (nếu cần trang riêng)
```

## 2. Bước 1: Tạo HTML Structure

### Cấu Trúc cơ bản của chatbox:
```html
<div class="chatbox-container">
  <!-- Chat Header -->
  <div class="chatbox-header">
    <h3>Trợ Lý Chat</h3>
    <button class="close-btn">×</button>
  </div>
  
  <!-- Chat Messages Area -->
  <div class="chatbox-messages">
    <div class="message bot-message">
      <p>Xin chào! Tôi có thể giúp bạn gì?</p>
    </div>
  </div>
  
  <!-- Chat Input Area -->
  <div class="chatbox-input">
    <input type="text" id="messageInput" placeholder="Nhập tin nhắn...">
    <button id="sendBtn">Gửi</button>
  </div>
</div>

<!-- Button to toggle chatbox -->
<button class="chatbox-toggle">💬 Chat</button>
```

## 3. Bước 2: Tạo CSS (chatbox.css)

```css
/* Chatbox Container */
.chatbox-container {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 9999;
  display: none; /* Ẩn mặc định */
}

.chatbox-container.active {
  display: flex; /* Hiện khi active */
}

/* Chatbox Header */
.chatbox-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chatbox-header h3 {
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

/* Messages Area */
.chatbox-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #f9f9f9;
}

.message {
  margin-bottom: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  max-width: 80%;
  word-wrap: break-word;
}

.user-message {
  background: #667eea;
  color: white;
  margin-left: auto;
  text-align: right;
}

.bot-message {
  background: #e9ecef;
  color: #333;
}

/* Input Area */
.chatbox-input {
  display: flex;
  gap: 5px;
  padding: 10px;
  border-top: 1px solid #ddd;
}

#messageInput {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

#sendBtn {
  padding: 10px 15px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

#sendBtn:hover {
  background: #764ba2;
}

/* Toggle Button */
.chatbox-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  z-index: 9998;
}

.chatbox-toggle:hover {
  background: #764ba2;
}
```

## 4. Bước 3: Tạo JavaScript (chatbox.js)

```javascript
// Lấy các phần tử DOM
const chatboxContainer = document.querySelector('.chatbox-container');
const chatboxToggle = document.querySelector('.chatbox-toggle');
const closeBtn = document.querySelector('.close-btn');
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const messagesArea = document.querySelector('.chatbox-messages');

// Toggle chatbox
chatboxToggle.addEventListener('click', () => {
  chatboxContainer.classList.toggle('active');
  messageInput.focus();
});

// Close chatbox
closeBtn.addEventListener('click', () => {
  chatboxContainer.classList.remove('active');
});

// Gửi tin nhắn
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const message = messageInput.value.trim();
  
  if (!message) return;
  
  // Thêm tin nhắn người dùng
  addMessage(message, 'user-message');
  messageInput.value = '';
  
  // Phản hồi từ bot
  setTimeout(() => {
    const botReply = getBotReply(message);
    addMessage(botReply, 'bot-message');
  }, 500);
}

function addMessage(text, className) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${className}`;
  messageDiv.innerHTML = `<p>${text}</p>`;
  messagesArea.appendChild(messageDiv);
  
  // Auto scroll xuống
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

function getBotReply(userMessage) {
  // Các câu trả lời mẫu
  const responses = {
    'hello': 'Xin chào! Bạn khỏe không?',
    'hi': 'Chào bạn! 👋',
    'help': 'Tôi có thể giúp bạn với:\n- Thông tin vé\n- Đặt vé\n- Hủy vé\n- Hỗ trợ khác',
    'ticket': 'Bạn muốn tìm hiểu về vé nào?',
    'price': 'Giá vé tuỳ thuộc vào sự kiện. Vui lòng kiểm tra chi tiết sự kiện.',
    'default': 'Xin lỗi, tôi chưa hiểu. Bạn có thể hỏi về:\n- Vé sự kiện\n- Cách đặt vé\n- Chính sách hoàn tiền'
  };
  
  const lowerMessage = userMessage.toLowerCase();
  
  for (let key in responses) {
    if (lowerMessage.includes(key)) {
      return responses[key];
    }
  }
  
  return responses['default'];
}
```

## 5. Bước 4: Tích Hợp vào HTML

Thêm vào file HTML chính của bạn (trước `</body>`):

```html
<!-- Chatbox HTML -->
<div class="chatbox-container">
  <div class="chatbox-header">
    <h3>Trợ Lý Chat</h3>
    <button class="close-btn">×</button>
  </div>
  
  <div class="chatbox-messages">
    <div class="message bot-message">
      <p>Xin chào! Tôi có thể giúp bạn gì?</p>
    </div>
  </div>
  
  <div class="chatbox-input">
    <input type="text" id="messageInput" placeholder="Nhập tin nhắn...">
    <button id="sendBtn">Gửi</button>
  </div>
</div>

<button class="chatbox-toggle">💬 Chat</button>

<!-- Link CSS và JS -->
<link rel="stylesheet" href="CSS/chatbox.css">
<script src="JS/chatbox.js"></script>
```

## 6. Tính Năng Nâng Cao (Tùy Chọn)

### 6.1. Lưu Lịch Sử Chat
```javascript
function saveChatHistory() {
  const messages = [];
  document.querySelectorAll('.message').forEach(msg => {
    messages.push(msg.textContent);
  });
  localStorage.setItem('chatHistory', JSON.stringify(messages));
}

function loadChatHistory() {
  const saved = localStorage.getItem('chatHistory');
  if (saved) {
    const messages = JSON.parse(saved);
    messages.forEach(msg => {
      addMessage(msg, 'bot-message');
    });
  }
}
```

### 6.2. Kết Nối API Backend
```javascript
async function getBotReplyFromAPI(userMessage) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMessage })
    });
    const data = await response.json();
    return data.reply;
  } catch (error) {
    return 'Có lỗi khi kết nối. Vui lòng thử lại.';
  }
}
```

## 7. Danh Sách Kiểm Tra

- [ ] Tạo file `chatbox.css`
- [ ] Tạo file `chatbox.js`
- [ ] Thêm HTML vào trang chính
- [ ] Link CSS và JS đúng
- [ ] Test toggle/close chatbox
- [ ] Test gửi tin nhắn
- [ ] Test responsive design
- [ ] Tùy chỉnh màu sắc/theme
- [ ] Thêm tính năng nâng cao (nếu cần)

## 8. Tips & Tricks

✅ Sử dụng `localStorage` để lưu chat history
✅ Thêm emoji để chatbox thân thiện hơn
✅ Dùng `setTimeout` để chatbot phản hồi tự nhiên hơn
✅ Tối ưu mobile responsiveness
✅ Thêm animation khi mở/đóng chatbox

---

**Bạn cần hỗ trợ gì thêm?**
