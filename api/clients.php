<?php
require_once '../db.php';
require_once '_util.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    send_json(200, ['success' => true]);
}

try {
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            handleGet();
            break;
        case 'POST':
            handlePost();
            break;
        case 'PUT':
            handlePut();
            break;
        case 'DELETE':
            handleDelete();
            break;
        default:
            send_json(405, ['success' => false, 'message' => 'Method not allowed']);
    }
} catch (Exception $e) {
    send_json(500, ['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

function handleGet() {
    global $pdo;
    
    if (isset($_GET['id'])) {
        // Get specific client
        $stmt = $pdo->prepare("SELECT * FROM clients WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $client = $stmt->fetch();
        
        if ($client) {
            send_json(200, ['success' => true, 'client' => $client]);
        } else {
            send_json(404, ['success' => false, 'message' => 'Client not found']);
        }
    } else {
        // Get all clients
        $stmt = $pdo->query("SELECT * FROM clients ORDER BY client_name");
        $clients = $stmt->fetchAll();
        send_json(200, ['success' => true, 'clients' => $clients]);
    }
}

function handlePost() {
    global $pdo;
    
    $data = read_json_body();
    
    $client_name = $data['client_name'] ?? '';
    $address = $data['address'] ?? '';
    $tin = $data['tin'] ?? '';
    $status = $data['status'] ?? 'Active';
    
    if (empty($client_name) || empty($address) || empty($tin)) {
        send_json(400, ['success' => false, 'message' => 'Client name, address, and TIN are required']);
    }
    
    // Check if TIN already exists
    $stmt = $pdo->prepare("SELECT id FROM clients WHERE tin = ?");
    $stmt->execute([$tin]);
    if ($stmt->fetch()) {
        send_json(400, ['success' => false, 'message' => 'TIN already exists']);
    }
    
    $stmt = $pdo->prepare("INSERT INTO clients (client_name, address, tin, status) VALUES (?, ?, ?, ?)");
    $stmt->execute([$client_name, $address, $tin, $status]);
    
    $id = $pdo->lastInsertId();
    send_json(201, ['success' => true, 'message' => 'Client created successfully', 'id' => $id]);
}

function handlePut() {
    global $pdo;
    
    $data = read_json_body();
    
    $id = $data['id'] ?? '';
    $client_name = $data['client_name'] ?? '';
    $address = $data['address'] ?? '';
    $tin = $data['tin'] ?? '';
    $status = $data['status'] ?? 'Active';
    
    if (empty($id) || empty($client_name) || empty($address) || empty($tin)) {
        send_json(400, ['success' => false, 'message' => 'All fields are required']);
    }
    
    // Check if TIN already exists for another client
    $stmt = $pdo->prepare("SELECT id FROM clients WHERE tin = ? AND id != ?");
    $stmt->execute([$tin, $id]);
    if ($stmt->fetch()) {
        send_json(400, ['success' => false, 'message' => 'TIN already exists for another client']);
    }
    
    $stmt = $pdo->prepare("UPDATE clients SET client_name = ?, address = ?, tin = ?, status = ? WHERE id = ?");
    $stmt->execute([$client_name, $address, $tin, $status, $id]);
    
    if ($stmt->rowCount() > 0) {
        send_json(200, ['success' => true, 'message' => 'Client updated successfully']);
    } else {
        send_json(404, ['success' => false, 'message' => 'Client not found']);
    }
}

function handleDelete() {
    global $pdo;
    
    $id = $_GET['id'] ?? '';
    
    if (empty($id)) {
        send_json(400, ['success' => false, 'message' => 'Client ID is required']);
    }
    
    $stmt = $pdo->prepare("DELETE FROM clients WHERE id = ?");
    $stmt->execute([$id]);
    
    if ($stmt->rowCount() > 0) {
        send_json(200, ['success' => true, 'message' => 'Client deleted successfully']);
    } else {
        send_json(404, ['success' => false, 'message' => 'Client not found']);
    }
}
?>
