<?php
declare(strict_types=1);

require_once __DIR__ . '/_util.php';
require_once __DIR__ . '/../db.php';

// CORS headers for all methods
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  try {
    $stmt = $pdo->query('SELECT id, inventory_id, product_id, product_name, stocks, min_stock, unit_price, category FROM `inventory` ORDER BY inventory_id');
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $items = array_map(function ($r) {
      return [
        'id' => (int)$r['id'],
        'inventoryId' => $r['inventory_id'],
        'productId' => $r['product_id'],
        'productName' => $r['product_name'],
        'stocks' => (int)$r['stocks'],
        'minStock' => (int)$r['min_stock'],
        'unitPrice' => (float)$r['unit_price'],
        'category' => $r['category'] ?? '',
      ];
    }, $rows);
    http_response_code(200);
    echo json_encode(['success' => true, 'items' => $items]);
    exit;
  } catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to load inventory']);
    exit;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = read_json_body();
  $id = (int)($body['id'] ?? $body['inventory_id'] ?? 0);
  $inventoryId = trim((string)($body['inventoryId'] ?? $body['inventory_id'] ?? ''));
  $quantity = (int)($body['quantity'] ?? 0);

  if ($quantity < 1) {
    send_json(400, ['success' => false, 'message' => 'Quantity must be at least 1']);
  }

  try {
    if ($id > 0) {
      $stmt = $pdo->prepare('UPDATE `inventory` SET stocks = stocks + ? WHERE id = ?');
      $stmt->execute([$quantity, $id]);
    } elseif ($inventoryId !== '') {
      $stmt = $pdo->prepare('UPDATE `inventory` SET stocks = stocks + ? WHERE inventory_id = ?');
      $stmt->execute([$quantity, $inventoryId]);
    } else {
      send_json(400, ['success' => false, 'message' => 'Missing id or inventoryId']);
    }

    if ($stmt->rowCount() === 0) {
      send_json(404, ['success' => false, 'message' => 'Inventory item not found']);
    }

    if ($id > 0) {
      $stmt = $pdo->prepare('SELECT id, inventory_id, product_id, product_name, stocks, min_stock, unit_price, category FROM `inventory` WHERE id = ?');
      $stmt->execute([$id]);
    } else {
      $stmt = $pdo->prepare('SELECT id, inventory_id, product_id, product_name, stocks, min_stock, unit_price, category FROM `inventory` WHERE inventory_id = ?');
      $stmt->execute([$inventoryId]);
    }
    $r = $stmt->fetch(PDO::FETCH_ASSOC);

    send_json(200, [
      'success' => true,
      'message' => 'Stock updated',
      'item' => $r ? [
        'id' => (int)$r['id'],
        'inventoryId' => $r['inventory_id'],
        'productId' => $r['product_id'],
        'productName' => $r['product_name'],
        'stocks' => (int)$r['stocks'],
        'minStock' => (int)$r['min_stock'],
        'unitPrice' => (float)$r['unit_price'],
        'category' => $r['category'] ?? '',
      ] : null,
    ]);
  } catch (Throwable $e) {
    send_json(500, ['success' => false, 'message' => 'Failed to update stock']);
  }
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
