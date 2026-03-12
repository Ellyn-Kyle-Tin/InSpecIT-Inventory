<?php
declare(strict_types=1);

require_once __DIR__ . '/_util.php';

require_post();

require_once __DIR__ . '/../db.php';
$body = read_json_body();

$identifier = trim((string)($body['username'] ?? $body['email'] ?? ''));
$password = (string)($body['password'] ?? '');

if ($identifier === '' || $password === '') {
  send_json(400, ['success' => false, 'message' => 'Missing email/username or password']);
}

try {
  // Prefer pulling role/name/email from register table
  $stmt = $pdo->prepare('SELECT id, full_name, username, email, password, role FROM `register` WHERE username = ? OR email = ? LIMIT 1');
  $stmt->execute([$identifier, $identifier]);
  $user = $stmt->fetch();

  if (!$user) {
    send_json(401, [
      'success' => false,
      'message' => 'Incorrect username/email.',
      'errorField' => 'username',
    ]);
  }

  if (!password_verify($password, (string)$user['password'])) {
    send_json(401, [
      'success' => false,
      'message' => 'Incorrect password.',
      'errorField' => 'password',
    ]);
  }

  send_json(200, [
    'success' => true,
    'message' => 'Login successful',
    'user' => [
      'id' => (int)$user['id'],
      'username' => $user['username'],
      'fullName' => $user['full_name'],
      'email' => $user['email'],
      'role' => $user['role'],
    ],
  ]);
} catch (Throwable $e) {
  send_json(500, ['success' => false, 'message' => 'Login failed']);
}

