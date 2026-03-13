<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ─── DB Config ──────────────────────────────────────────────────────────────
$host   = "localhost";
$user   = "root";
$pass   = "";
$dbname = "db_inventory";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed: " . $conn->connect_error]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$input  = json_decode(file_get_contents("php://input"), true);
$id     = isset($_GET['id']) ? intval($_GET['id']) : null;

// ─── GET all clients ─────────────────────────────────────────────────────────
if ($method === "GET") {
    $result  = $conn->query("SELECT * FROM client ORDER BY client_id ASC");
    $clients = [];
    while ($row = $result->fetch_assoc()) {
        $clients[] = [
            "id"         => $row["client_id"],
            "clientName" => $row["client_name"],
            "address"    => $row["client_address"],
            "tin"        => $row["client_tin"],
            "status"     => $row["client_status"],
        ];
    }
    echo json_encode($clients);
}

// ─── POST create client ──────────────────────────────────────────────────────
elseif ($method === "POST") {
    $name    = $conn->real_escape_string($input["client_name"]    ?? "");
    $address = $conn->real_escape_string($input["client_address"] ?? "");
    $tin     = $conn->real_escape_string($input["client_tin"]     ?? "");
    $status  = $conn->real_escape_string($input["client_status"]  ?? "");

    if (!$name || !$address || !$tin || !$status) {
        http_response_code(400);
        echo json_encode(["error" => "All fields are required"]);
        exit();
    }

    $sql = "INSERT INTO client (client_name, client_address, client_tin, client_status)
            VALUES ('$name', '$address', '$tin', '$status')";

    if ($conn->query($sql)) {
        http_response_code(201);
        echo json_encode(["id" => $conn->insert_id, "message" => "Client created"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to create client"]);
    }
}

// ─── PUT update client ───────────────────────────────────────────────────────
elseif ($method === "PUT") {
    if (!$id) { http_response_code(400); echo json_encode(["error" => "ID required"]); exit(); }

    $name    = $conn->real_escape_string($input["client_name"]    ?? "");
    $address = $conn->real_escape_string($input["client_address"] ?? "");
    $tin     = $conn->real_escape_string($input["client_tin"]     ?? "");
    $status  = $conn->real_escape_string($input["client_status"]  ?? "");

    if (!$name || !$address || !$tin || !$status) {
        http_response_code(400);
        echo json_encode(["error" => "All fields are required"]);
        exit();
    }

    $sql = "UPDATE client
            SET client_name='$name', client_address='$address', client_tin='$tin', client_status='$status'
            WHERE client_id=$id";

    if ($conn->query($sql)) {
        echo json_encode(["message" => "Client updated"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update client"]);
    }
}

// ─── DELETE client ───────────────────────────────────────────────────────────
elseif ($method === "DELETE") {
    if (!$id) { http_response_code(400); echo json_encode(["error" => "ID required"]); exit(); }

    if ($conn->query("DELETE FROM client WHERE client_id=$id")) {
        echo json_encode(["message" => "Client deleted"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete client"]);
    }
}

$conn->close();
?>