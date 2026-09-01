<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $sql = "SELECT 
                id_categoria,
                nome,
                descricao
            FROM categoria
            ORDER BY id_categoria DESC";

    $resultado = $conn->query($sql);

    $categorias = [];

    while ($row = $resultado->fetch_assoc()) {
        $categorias[] = $row;
    }

    echo json_encode([
        "sucesso" => true,
        "dados" => $categorias
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao buscar categorias."
    ]);
}