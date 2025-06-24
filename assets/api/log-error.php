<?php
// Configura el archivo de log donde se guardarán los errores
$log_file = 'error-log.txt';

// Verifica que la solicitud sea de tipo POST y que contenga datos JSON
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] === 'application/json') {
    
    // Lee los datos JSON enviados en la solicitud
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Verifica si el campo "error" existe en los datos
    if (isset($data['error'])) {
        $error_message = $data['error'];
        $timestamp = date('Y-m-d H:i:s');
        
        // Formato del mensaje que se guardará en el archivo
        $log_entry = "$timestamp - $error_message\n";
        
        // Intenta escribir el error en el archivo de log
        if (file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX)) {
            // Respuesta exitosa
            http_response_code(200);
            echo json_encode(['message' => 'Error logged successfully.']);
        } else {
            // Respuesta en caso de fallo al escribir en el archivo
            http_response_code(500);
            echo json_encode(['message' => 'Failed to write to log file.']);
        }
    } else {
        // Respuesta en caso de que no haya un campo "error" en los datos
        http_response_code(400);
        echo json_encode(['message' => 'No error message provided.']);
    }
} else {
    // Respuesta para solicitudes que no sean POST o que no contengan JSON
    http_response_code(400);
    echo json_encode(['message' => 'Invalid request.']);
}
?>