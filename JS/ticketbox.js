import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import {
  getAuth,
  signInAnonymously,
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
const db = getFirestore(app);
const auth = getAuth(app);

const destinationData = {
  "thang-long": {
    id: "thang-long",
    name: "Hoàng Thành Thăng Long",
    adult: 120000,
    child: 60000,
    title: "Khám phá Hoàng Thành Thăng Long",
    intro:
      "Hoàng Thành Thăng Long là di tích lịch sử đặc biệt của Thăng Long - Hà Nội, nơi ghi dấu nhiều tầng lịch sử của đất nước.",
    content:
      "Tại đây, du khách có thể tham quan các khu vực khảo cổ, học về triều đại phong kiến và thưởng thức không gian văn hóa đặc trưng của thủ đô.",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    rule: "Giá vé áp dụng cho khách tham quan trong ngày tại di tích trung tâm Hà Nội.",
  },
  hue: {
    id: "hue",
    name: "Kinh Thành Huế",
    adult: 150000,
    child: 75000,
    title: "Khám phá Kinh Thành Huế",
    intro:
      "Kinh Thành Huế là di sản văn hóa thế giới, nổi tiếng với kiến trúc cung đình và những giá trị lịch sử sâu sắc.",
    content:
      "Đến với Huế, bạn sẽ được trải nghiệm bầu không khí cổ kính, tìm hiểu về triều Nguyễn và chiêm ngưỡng các công trình cung đình đồ sộ.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    rule: "Vé trẻ em áp dụng cho trẻ em từ 6 đến 12 tuổi theo quy định của khu di tích.",
  },
  "son-la": {
    id: "son-la",
    name: "Bản Cát Cánh - Sơn La",
    adult: 100000,
    child: 50000,
    title: "Khám phá Bản Cát Cánh - Sơn La",
    intro:
      "Bản Cát Cánh là nơi lưu giữ nét đẹp văn hóa dân tộc và những giá trị truyền thống của vùng núi phía Bắc.",
    content:
      "Bạn có thể lắng nghe câu chuyện của người dân bản địa, khám phá lễ hội và tận hưởng cảnh sắc thiên nhiên đa dạng.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    rule: "Giá vé có thể thay đổi vào các dịp lễ hội và sự kiện đặc biệt.",
  },
};

const destinationSelect = document.getElementById("destinationSelect");
const quantityInput = document.getElementById("ticketQuantity");
const destinationLabel = document.getElementById("destinationLabel");
const ticketSummary = document.getElementById("ticketSummary");
const ticketRule = document.getElementById("ticketRule");
const ticketTypeRadios = document.querySelectorAll('input[name="ticketType"]');
const bookingForm = document.querySelector(".booking-form");
const submitButton = document.querySelector(".ticket-submit");

function updateTicketSummary() {
  const selectedDestination = destinationData[destinationSelect.value];
  const ticketType = document.querySelector(
    'input[name="ticketType"]:checked',
  ).value;
  const quantity = Math.max(1, Number(quantityInput.value) || 1);
  const price =
    ticketType === "adult"
      ? selectedDestination.adult
      : selectedDestination.child;
  const total = price * quantity;

  destinationLabel.textContent = selectedDestination.name;
  ticketSummary.textContent = `${ticketType === "adult" ? "Người lớn" : "Trẻ em"}: ${price.toLocaleString("vi-VN")}đ mỗi vé · Tổng: ${total.toLocaleString("vi-VN")}đ`;
  ticketRule.textContent = selectedDestination.rule;
}

destinationSelect.addEventListener("change", updateTicketSummary);
quantityInput.addEventListener("input", updateTicketSummary);
ticketTypeRadios.forEach((radio) =>
  radio.addEventListener("change", updateTicketSummary),
);

function showStatus(message, isError = false) {
  const existingMessage = document.querySelector(".booking-status");
  if (existingMessage) existingMessage.remove();

  const messageBox = document.createElement("div");
  messageBox.className = `booking-status ${isError ? "message-error" : "message-success"}`;
  messageBox.textContent = message;
  messageBox.style.cssText = `
    margin-top: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 0.95rem;
    background: ${isError ? "#ffeaea" : "#eafaf1"};
    color: ${isError ? "#b42318" : "#027a48"};
    border: 1px solid ${isError ? "#f5b7b1" : "#a7f3d0"};
  `;
  bookingForm.appendChild(messageBox);
}

function getFormData() {
  const ticketType = document.querySelector(
    'input[name="ticketType"]:checked',
  ).value;
  const selectedDestination = destinationData[destinationSelect.value];
  const quantity = Math.max(1, Number(quantityInput.value) || 1);
  const price =
    ticketType === "adult"
      ? selectedDestination.adult
      : selectedDestination.child;
  const total = price * quantity;

  return {
    customerName: document.getElementById("customerName").value.trim(),
    birthYear: document.getElementById("birthYear").value,
    gender: document.getElementById("gender").value,
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    destinationId: selectedDestination.id,
    destinationName: selectedDestination.name,
    quantity,
    ticketType,
    pricePerTicket: price,
    totalAmount: total,
    createdAt: new Date().toISOString(),
  };
}

async function ensureAuthenticated() {
  if (auth.currentUser) return auth.currentUser;

  try {
    const credential = await signInAnonymously(auth);
    return credential.user;
  } catch (error) {
    console.error("Anonymous sign-in failed", error);
    throw error;
  }
}

async function saveTicketToFirestore(ticketData) {
  await ensureAuthenticated();
  const ticketsRef = collection(db, "tickets");
  const docRef = await addDoc(ticketsRef, ticketData);
  return docRef.id;
}

async function ensureDestinationContent(destinationId) {
  const contentsRef = collection(db, "destinationContents");
  const q = query(contentsRef, where("destinationId", "==", destinationId));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0].data();
  }

  const fallback = destinationData[destinationId];
  const contentDoc = {
    destinationId,
    title: fallback.title,
    intro: fallback.intro,
    content: fallback.content,
    image: fallback.image,
    createdAt: new Date().toISOString(),
  };

  const created = await addDoc(contentsRef, contentDoc);
  return { id: created.id, ...contentDoc };
}

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const ticketData = getFormData();
  const { customerName, email, destinationName, totalAmount } = ticketData;

  if (!customerName || !email || !destinationName) {
    showStatus("Vui lòng điền đầy đủ thông tin bắt buộc.", true);
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Đang xử lý...";

  try {
    const ticketId = await saveTicketToFirestore(ticketData);
    const content = await ensureDestinationContent(ticketData.destinationId);

    showStatus(
      `Đặt vé thành công! Hóa đơn #${ticketId.slice(0, 8)} đã được ghi nhận. Vé và bill sẽ được gửi tới ${email}.`,
      false,
    );

    sessionStorage.setItem(
      "lastTicket",
      JSON.stringify({
        ticketId,
        ...ticketData,
        content,
        totalAmount,
      }),
    );

    setTimeout(() => {
      window.location.href = `destination-content.html?destination=${ticketData.destinationId}`;
    }, 1200);
  } catch (error) {
    console.error(error);
    showStatus("Đã xảy ra lỗi khi lưu vé. Vui lòng thử lại.", true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Đặt vé ngay";
  }
});

updateTicketSummary();
