<?php
declare(strict_types=1);

function send_json(int $status, array $payload): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  echo json_encode($payload);
  exit;
}

function read_json_body(): array {
  $raw = file_get_contents('php://input');
  if ($raw === false || trim($raw) === '') return [];
  $data = json_decode($raw, true);
  if (is_array($data)) return $data;

  $contentType = (string)($_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '');
  if (stripos($contentType, 'application/x-www-form-urlencoded') !== false) {
    $out = [];
    parse_str($raw, $out);
    return is_array($out) ? $out : [];
  }

  return [];
}

function require_post(): void {
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    send_json(200, ['success' => true]);
  }
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(405, ['success' => false, 'message' => 'Method not allowed']);
  }
}

function require_methods(array $allowed_methods): void {
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    send_json(200, ['success' => true]);
  }
  if (!in_array($_SERVER['REQUEST_METHOD'], $allowed_methods)) {
    send_json(405, ['success' => false, 'message' => 'Method not allowed']);
  }
}

