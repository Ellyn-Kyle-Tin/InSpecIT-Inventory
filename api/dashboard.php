<?php
require_once '../db.php';
require_once '_util.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    send_json(200, ['success' => true]);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        global $pdo;
        
        // Get inventory summary
        $inventoryStmt = $pdo->query("SELECT 
            COUNT(*) as total_products,
            SUM(stocks) as total_stocks,
            COUNT(CASE WHEN stocks <= min_stock THEN 1 END) as low_stock_count
            FROM inventory");
        $inventoryData = $inventoryStmt->fetch(PDO::FETCH_ASSOC);
        
        // Get low stock items
        $lowStockStmt = $pdo->query("SELECT product_name, stocks, min_stock 
            FROM inventory 
            WHERE stocks <= min_stock 
            ORDER BY stocks ASC 
            LIMIT 10");
        $lowStockItems = $lowStockStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get clients summary
        $clientsStmt = $pdo->query("SELECT 
            COUNT(*) as total_clients,
            COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_clients,
            COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive_clients
            FROM clients");
        $clientsData = $clientsStmt->fetch(PDO::FETCH_ASSOC);
        
        // Get projects summary
        $projectsStmt = $pdo->query("SELECT 
            COUNT(*) as total_projects,
            COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_projects,
            COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_projects,
            COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_projects
            FROM projects");
        $projectsData = $projectsStmt->fetch(PDO::FETCH_ASSOC);
        
        // Get recent clients
        $recentClientsStmt = $pdo->query("SELECT client_name, status, created_at 
            FROM clients 
            ORDER BY created_at DESC 
            LIMIT 5");
        $recentClients = $recentClientsStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get recent projects
        $recentProjectsStmt = $pdo->query("SELECT p.project_name, p.status, c.client_name, p.created_at 
            FROM projects p 
            JOIN clients c ON p.client_id = c.id 
            ORDER BY p.created_at DESC 
            LIMIT 5");
        $recentProjects = $recentProjectsStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get inventory by category
        $categoryStmt = $pdo->query("SELECT category, COUNT(*) as count, SUM(stocks) as total_stocks
            FROM inventory 
            WHERE category != '' 
            GROUP BY category 
            ORDER BY count DESC");
        $categories = $categoryStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get top inventory items by stock value
        $topItemsStmt = $pdo->query("SELECT product_name, stocks, unit_price, (stocks * unit_price) as total_value
            FROM inventory 
            ORDER BY total_value DESC 
            LIMIT 5");
        $topItems = $topItemsStmt->fetchAll(PDO::FETCH_ASSOC);
        
        $dashboardData = [
            'inventory' => [
                'total_products' => (int)$inventoryData['total_products'],
                'total_stocks' => (int)$inventoryData['total_stocks'],
                'low_stock_count' => (int)$inventoryData['low_stock_count'],
                'low_stock_items' => array_map(function($item) {
                    return [
                        'product_name' => $item['product_name'],
                        'stocks' => (int)$item['stocks'],
                        'min_stock' => (int)$item['min_stock']
                    ];
                }, $lowStockItems),
                'categories' => array_map(function($cat) {
                    return [
                        'name' => $cat['category'],
                        'count' => (int)$cat['count'],
                        'total_stocks' => (int)$cat['total_stocks']
                    ];
                }, $categories),
                'top_items' => array_map(function($item) {
                    return [
                        'product_name' => $item['product_name'],
                        'stocks' => (int)$item['stocks'],
                        'unit_price' => (float)$item['unit_price'],
                        'total_value' => (float)$item['total_value']
                    ];
                }, $topItems)
            ],
            'clients' => [
                'total_clients' => (int)$clientsData['total_clients'],
                'active_clients' => (int)$clientsData['active_clients'],
                'inactive_clients' => (int)$clientsData['inactive_clients'],
                'recent_clients' => array_map(function($client) {
                    return [
                        'client_name' => $client['client_name'],
                        'status' => $client['status'],
                        'created_at' => $client['created_at']
                    ];
                }, $recentClients)
            ],
            'projects' => [
                'total_projects' => (int)$projectsData['total_projects'],
                'active_projects' => (int)$projectsData['active_projects'],
                'completed_projects' => (int)$projectsData['completed_projects'],
                'pending_projects' => (int)$projectsData['pending_projects'],
                'recent_projects' => array_map(function($project) {
                    return [
                        'project_name' => $project['project_name'],
                        'status' => $project['status'],
                        'client_name' => $project['client_name'],
                        'created_at' => $project['created_at']
                    ];
                }, $recentProjects)
            ]
        ];
        
        send_json(200, ['success' => true, 'data' => $dashboardData]);
        
    } catch (Exception $e) {
        send_json(500, ['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
}

send_json(405, ['success' => false, 'message' => 'Method not allowed']);
?>
