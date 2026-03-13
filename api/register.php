<?php
declare(strict_types=1);

require_once __DIR__ . '/_util.php';

require_post();

require_once __DIR__ . '/../db.php';
$body = read_json_body();

$full_name = trim((string)($body['fullName'] ?? $body['full_name'] ?? ''));
$username  = trim((string)($body['username'] ?? ''));
$email     = trim((string)($body['email'] ?? ''));
$password  = (string)($body['password'] ?? '');
$role      = trim((string)($body['role'] ?? 'employee'));

if ($full_name === '' || $username === '' || $email === '' || $password === '' || $role === '') {
  send_json(400, ['success' => false, 'message' => 'Missing required fields']);
}

$role = strtolower($role);
if ($role !== 'admin' && $role !== 'employee') {
  send_json(400, ['success' => false, 'message' => 'Invalid role']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  send_json(400, ['success' => false, 'message' => 'Invalid email']);
}

try {
  $stmt = $pdo->prepare('SELECT id FROM `register` WHERE username = ? OR email = ? LIMIT 1');
  $stmt->execute([$username, $email]);
  $existing = $stmt->fetch();
  if ($existing) {
    send_json(409, ['success' => false, 'message' => 'Username or email already exists']);
  }

  $hash = password_hash($password, PASSWORD_DEFAULT);

  $pdo->beginTransaction();

  $stmt = $pdo->prepare('INSERT INTO `register` (full_name, username, email, password, role) VALUES (?, ?, ?, ?, ?)');
  $stmt->execute([$full_name, $username, $email, $hash, $role]);

  $stmt = $pdo->prepare('INSERT INTO `login` (username, password) VALUES (?, ?)');
  $stmt->execute([$username, $hash]);

  $pdo->commit();

  send_json(201, [
    'success' => true,
    'message' => 'Registration successful',
    'user' => [
      'username' => $username,
      'fullName' => $full_name,
      'email' => $email,
      'role' => $role,
    ],
  ]);
} catch (Throwable $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  send_json(500, ['success' => false, 'message' => 'Registration failed']);
}

