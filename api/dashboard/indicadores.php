<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $conn->multi_query("CALL sp_dashboard()");

    $resultados = [];

    do {

        if ($resultado = $conn->store_result()) {

            while ($row = $resultado->fetch_assoc()) {
                $resultados[] = $row;
            }

            $resultado->free();
        }

    } while ($conn->next_result());

    echo json_encode([
        "sucesso" => true,
        "dados" => $resultados
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao buscar os indicadores."
    ]);
}