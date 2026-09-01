<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $resultado = $conn->query("CALL sp_produtos_estoque_critico()");

    $produtos = [];

    while ($row = $resultado->fetch_assoc()) {
        $produtos[] = $row;
    }

    $resultado->free();

    while ($conn->more_results()) {
        $conn->next_result();
        $conn->use_result();
    }

    echo json_encode([
        "sucesso" => true,
        "dados" => $produtos
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao buscar estoque crítico."
    ]);
}