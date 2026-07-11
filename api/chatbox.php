<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$message = trim($input['message'] ?? '');

if (!$message) {
    echo json_encode(['reply' => 'Vui lòng gửi tin nhắn trước khi hỏi.']);
    exit;
}

// TODO: Thay phần này bằng gọi API Gemini thực tế.
$reply = 'Tạm thời phản hồi thử nghiệm: ' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

echo json_encode(['reply' => $reply]);
