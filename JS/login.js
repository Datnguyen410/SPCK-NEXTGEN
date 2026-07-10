// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmTR4Pclb8pLQ_qlPQUVXlAFpKrbpo5lc",
  authDomain: "spck-nextgen.firebaseapp.com",
  projectId: "spck-nextgen",
  storageBucket: "spck-nextgen.firebasestorage.app",
  messagingSenderId: "118699058332",
  appId: "1:118699058332:web:c22e988722f845d33e3959",
  measurementId: "G-RPXCTDN110",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// ==================== LOGIN LOGIC ====================

const loginForm = document.querySelector(".auth-form");
const emailInput = document.querySelector('input[name="email"]');
const passwordInput = document.querySelector('input[name="password"]');
const rememberCheckbox = document.querySelector('input[name="remember"]');
const loginBtn = document.querySelector(".auth-submit");

// Hiển thị thông báo
function showMessage(message, type = "error") {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    padding: 12px 16px;
    margin-bottom: 16px;
    border-radius: 4px;
    background-color: ${type === "error" ? "#fee" : "#efe"};
    color: ${type === "error" ? "#c33" : "#3c3"};
    border-left: 4px solid ${type === "error" ? "#c33" : "#3c3"};
    animation: slideIn 0.3s ease-out;
  `;

  loginForm.insertBefore(messageDiv, loginForm.firstChild);

  setTimeout(() => messageDiv.remove(), 4000);
}

// Xoá thông báo cũ
function clearMessages() {
  const messages = document.querySelectorAll(".message");
  messages.forEach((msg) => msg.remove());
}

// Kiểm tra email hợp lệ
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Xử lý đăng nhập
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessages();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Kiểm tra dữ liệu
  if (!email || !password) {
    showMessage("Vui lòng điền đầy đủ email và mật khẩu", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showMessage("Email không hợp lệ", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Mật khẩu phải có ít nhất 6 ký tự", "error");
    return;
  }

  try {
    loginBtn.disabled = true;
    loginBtn.textContent = "Đang xử lý...";

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Lưu remember login
    if (rememberCheckbox.checked) {
      localStorage.setItem("rememberEmail", email);
    } else {
      localStorage.removeItem("rememberEmail");
    }

    showMessage("Đăng nhập thành công! Đang chuyển hướng...", "success");

    setTimeout(() => {
      window.location.href = "ticketbox.html";
    }, 1500);
  } catch (error) {
    loginBtn.disabled = false;
    loginBtn.textContent = "Đăng nhập";

    let errorMessage = "Đăng nhập thất bại";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "Email không tồn tại";
        break;
      case "auth/wrong-password":
        errorMessage = "Mật khẩu không chính xác";
        break;
      case "auth/invalid-email":
        errorMessage = "Email không hợp lệ";
        break;
      case "auth/user-disabled":
        errorMessage = "Tài khoản này đã bị vô hiệu hóa";
        break;
      case "auth/too-many-requests":
        errorMessage = "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau";
        break;
      default:
        errorMessage = error.message;
    }

    showMessage(errorMessage, "error");
  }
});

// Tải email được lưu (nếu có)
window.addEventListener("load", () => {
  const savedEmail = localStorage.getItem("rememberEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }
});
