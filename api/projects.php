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
        // Get specific project
        $stmt = $pdo->prepare("SELECT p.*, c.client_name FROM projects p JOIN clients c ON p.client_id = c.id WHERE p.id = ?");
        $stmt->execute([$_GET['id']]);
        $project = $stmt->fetch();
        
        if ($project) {
            send_json(200, ['success' => true, 'project' => $project]);
        } else {
            send_json(404, ['success' => false, 'message' => 'Project not found']);
        }
    } elseif (isset($_GET['client_id'])) {
        // Get projects for specific client
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE client_id = ? ORDER BY project_name");
        $stmt->execute([$_GET['client_id']]);
        $projects = $stmt->fetchAll();
        send_json(200, ['success' => true, 'projects' => $projects]);
    } else {
        // Get all projects
        $stmt = $pdo->query("SELECT p.*, c.client_name FROM projects p JOIN clients c ON p.client_id = c.id ORDER BY p.project_name");
        $projects = $stmt->fetchAll();
        send_json(200, ['success' => true, 'projects' => $projects]);
    }
}

function handlePost() {
    global $pdo;
    
    $data = read_json_body();
    
    $client_id = $data['client_id'] ?? '';
    $project_name = $data['project_name'] ?? '';
    $description = $data['description'] ?? '';
    $start_date = $data['start_date'] ?? null;
    $end_date = $data['end_date'] ?? null;
    $status = $data['status'] ?? 'Active';
    
    if (empty($client_id) || empty($project_name)) {
        send_json(400, ['success' => false, 'message' => 'Client ID and project name are required']);
    }
    
    // Validate client exists
    $stmt = $pdo->prepare("SELECT id FROM clients WHERE id = ?");
    $stmt->execute([$client_id]);
    if (!$stmt->fetch()) {
        send_json(400, ['success' => false, 'message' => 'Client not found']);
    }
    
    $stmt = $pdo->prepare("INSERT INTO projects (client_id, project_name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$client_id, $project_name, $description, $start_date, $end_date, $status]);
    
    $id = $pdo->lastInsertId();
    send_json(201, ['success' => true, 'message' => 'Project created successfully', 'id' => $id]);
}

function handlePut() {
    global $pdo;
    
    $data = read_json_body();
    
    $id = $data['id'] ?? '';
    $client_id = $data['client_id'] ?? '';
    $project_name = $data['project_name'] ?? '';
    $description = $data['description'] ?? '';
    $start_date = $data['start_date'] ?? null;
    $end_date = $data['end_date'] ?? null;
    $status = $data['status'] ?? 'Active';
    
    if (empty($id) || empty($client_id) || empty($project_name)) {
        send_json(400, ['success' => false, 'message' => 'ID, client ID, and project name are required']);
    }
    
    // Validate client exists
    $stmt = $pdo->prepare("SELECT id FROM clients WHERE id = ?");
    $stmt->execute([$client_id]);
    if (!$stmt->fetch()) {
        send_json(400, ['success' => false, 'message' => 'Client not found']);
    }
    
    $stmt = $pdo->prepare("UPDATE projects SET client_id = ?, project_name = ?, description = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?");
    $stmt->execute([$client_id, $project_name, $description, $start_date, $end_date, $status, $id]);
    
    if ($stmt->rowCount() > 0) {
        send_json(200, ['success' => true, 'message' => 'Project updated successfully']);
    } else {
        send_json(404, ['success' => false, 'message' => 'Project not found']);
    }
}

function handleDelete() {
    global $pdo;
    
    $id = $_GET['id'] ?? '';
    $client_id = $_GET['client_id'] ?? '';
    
    if (!empty($client_id)) {
        // Delete all projects for a specific client
        $stmt = $pdo->prepare("DELETE FROM projects WHERE client_id = ?");
        $stmt->execute([$client_id]);
        
        $deletedCount = $stmt->rowCount();
        if ($deletedCount > 0) {
            send_json(200, ['success' => true, 'message' => "{$deletedCount} projects deleted successfully"]);
        } else {
            send_json(404, ['success' => false, 'message' => 'No projects found for this client']);
        }
    } elseif (!empty($id)) {
        // Delete specific project
        $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            send_json(200, ['success' => true, 'message' => 'Project deleted successfully']);
        } else {
            send_json(404, ['success' => false, 'message' => 'Project not found']);
        }
    } else {
        send_json(400, ['success' => false, 'message' => 'Project ID or Client ID is required']);
    }
}
?>
