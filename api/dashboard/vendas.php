<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $resultado = $conn->query(
        "CALL sp_dashboard_vendas()"
    );

    if (!$resultado) {
        throw new Exception(
            "Erro ao executar a procedure."
        );
    }

    $vendas = [];

    while ($row = $resultado->fetch_assoc()) {

        $vendas[] = [
            "id_venda" => (int) $row["id_venda"],
            "data_venda" => $row["data_venda"],
            "id_produto" => (int) $row["id_produto"],
            "produto" => $row["produto"],
            "categoria" => $row["categoria"],
            "quantidade" => (int) $row["quantidade"],
            "valor_unitario" => (float) $row["valor_unitario"],
            "total" => (float) $row["total"]
        ];
    }

    $resultado->free();

    // Limpa os resultados restantes do CALL
    while ($conn->more_results()) {

        $conn->next_result();

        $resultadoExtra =
            $conn->store_result();

        if ($resultadoExtra) {
            $resultadoExtra->free();
        }
    }

    echo json_encode([
        "sucesso" => true,
        "dados" => $vendas
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $e->getMessage()
    ]);
}