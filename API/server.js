const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let bearerToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBoYW1taW5oaGlldUB2bnB0LnZuIiwianRpIjoiMGFhNGQyYTEtMGFiYy00NDczLTllYmItOTJjMjYwZjBhMGRjIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI5NzUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicGhhbW1pbmhoaWV1QHZucHQudm4iLCJVc2VySWQiOiI5NzUiLCJSb2xlTWF4IjoiOTk5OSIsIlJvbGVMZXZlbCI6Ijk5IiwiQWNjZXNzS2V5IjoiREJEOjEwMDAwMDAwMC1RTFNQOjEwMDAwMDAwMC1EU1NQOjEwMDAwMTAwMC1RTERWOjEwMDAwMDAwMC1EU0RWOjEwMDAwMTAwMC1RTFNQRFY6MTAwMDAwMDAwLVFUSFQ6MDAwMDAwMDAwIiwiRG9uVmlJZCI6IjEiLCJleHAiOjE3MTM1MjA1NjgsImlzcyI6Imh0dHA6Ly92bnB0LnZuLyIsImF1ZCI6Imh0dHA6Ly92bnB0LnZuLyJ9.BTBE5WhUQFsCGM-RLyIW-bt0WwncGTx81MypgNGOksE";

// 🧩 Middleware log request + chống lỗi khi body null
app.use((req, res, next) => {
  console.log("------------------------------------------------");
  console.log(`${new Date().toLocaleString()} | ${req.method} ${req.url}`);

  try {
    if (req.body && typeof req.body === "object" && Object.keys(req.body || {}).length > 0) {
      console.log("Body:", req.body);
    } else {
      console.log("Body rỗng hoặc không có JSON.");
    }
  } catch (err) {
    console.log("⚠️ Không thể đọc body (body có thể null hoặc không hợp lệ)");
  }

  next();
});

// 📦 API: Lấy token hiện tại
app.get("/get-token", (req, res) => {
  console.log("Gửi token hiện tại về cho client");
  res.json({ token: bearerToken });
});

// 🔄 API: Cập nhật token mới
app.post("/set-token", (req, res) => {
  const { token } = req.body || {};
  if (!token) {
    console.log("⚠️ Gọi /set-token nhưng không có 'token' trong body!");
    return res.status(400).json({ error: "Thiếu token trong body" });
  }

  bearerToken = token;
  console.log("✅ Token mới đã được cập nhật:");
  console.log(bearerToken);

  res.json({ message: "Token updated successfully", token: bearerToken });
});

// 🧱 Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error("💥 Lỗi server:", err);
  res.status(500).json({ error: "Lỗi server nội bộ" });
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("================================================");
  console.log(`✅ API server đang chạy ở cổng ${PORT}`);
  console.log("GET  /get-token   → Trả về token hiện tại");
  console.log("POST /set-token   → Cập nhật token mới (JSON body: { token: '...' })");
  console.log("================================================\n");
});
