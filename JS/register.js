// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmTR4Pclb8pLQ_qlPQUVXlAFpKrbpo5lc",
  authDomain: "spck-nextgen.firebaseapp.com",
  projectId: "spck-nextgen",
  storageBucket: "spck-nextgen.firebasestorage.app",
  messagingSenderId: "118699058332",
  appId: "1:118699058332:web:c22e988722f845d33e3959",
  measurementId: "G-RPXCTDN110",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const registerForm = document.querySelector(".auth-form");
const fullNameInput = document.querySelector('input[name="fullname"]');
const emailInput = document.querySelector('input[name="email"]');
const passwordInput = document.querySelector('input[name="password"]');
const confirmPasswordInput = document.querySelector(
  'input[name="password_confirm"]',
);
const registerBtn = document.querySelector(".auth-submit");
const googleBtn = document.querySelector(".google-btn");
const googleProvider = new GoogleAuthProvider();

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

  registerForm.insertBefore(messageDiv, registerForm.firstChild);

  setTimeout(() => messageDiv.remove(), 4000);
}

function clearMessages() {
  const messages = document.querySelectorAll(".message");
  messages.forEach((msg) => msg.remove());
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessages();

  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!fullName || !email || !password || !confirmPassword) {
    showMessage("Vui lòng điền đầy đủ thông tin", "error");
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

  if (password !== confirmPassword) {
    showMessage("Mật khẩu xác nhận không khớp", "error");
    return;
  }

  try {
    registerBtn.disabled = true;
    registerBtn.textContent = "Đang xử lý...";

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await updateProfile(userCredential.user, {
      displayName: fullName,
    });

    showMessage("Đăng ký thành công! Vui lòng đăng nhập.", "success");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  } catch (error) {
    registerBtn.disabled = false;
    registerBtn.textContent = "Tạo tài khoản";

    let errorMessage = "Đăng ký thất bại";

    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "Email này đã được sử dụng";
        break;
      case "auth/invalid-email":
        errorMessage = "Email không hợp lệ";
        break;
      case "auth/operation-not-allowed":
        errorMessage = "Đăng ký hiện đang tạm dừng";
        break;
      case "auth/weak-password":
        errorMessage = "Mật khẩu quá yếu";
        break;
      default:
        errorMessage = error.message;
    }

    showMessage(errorMessage, "error");
  }
});

if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    clearMessages();

    try {
      registerBtn.disabled = true;
      googleBtn.disabled = true;
      googleBtn.textContent = "Đang xử lý...";

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user.displayName && fullNameInput.value.trim()) {
        await updateProfile(user, { displayName: fullNameInput.value.trim() });
      }

      showMessage("Đăng ký/đăng nhập bằng Google thành công!", "success");
      setTimeout(() => {
        window.location.href = "ticketbox.html";
      }, 1200);
    } catch (error) {
      registerBtn.disabled = false;
      googleBtn.disabled = false;
      googleBtn.textContent = "Đăng ký bằng Google";

      let errorMessage = "Đăng ký bằng Google thất bại";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Bạn đã đóng cửa sổ đăng nhập. Vui lòng thử lại.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Yêu cầu đăng nhập đã bị hủy. Vui lòng thử lại.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage =
          "Trình duyệt chặn popup. Vui lòng mở lại hoặc cho phép popup.";
      } else if (error.code === "auth/unauthorized-domain") {
        errorMessage =
          "Miền hiện tại chưa được phép cho OAuth. Vui lòng thêm 127.0.0.1 hoặc tên miền của bạn vào Firebase Console > Authentication > Authorized domains.";
      } else {
        errorMessage = error.message;
      }

      showMessage(errorMessage, "error");
    }
  });
}
