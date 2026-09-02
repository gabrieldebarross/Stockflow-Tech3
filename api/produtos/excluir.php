<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $dados = json_decode(file_get_contents("php://input"), true);

    $id = (int) ($dados["id_produto"] ?? 0);

    if ($id <= 0) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "ID do produto inválido."
        ]);

        exit;
    }

    $stmt = $conn->prepare(
        "SELECT COUNT(*) AS total
         FROM venda
         WHERE id_produto = ?"
    );

    $stmt->bind_param("i", $id);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $row = $resultado->fetch_assoc();

    if ((int) $row["total"] > 0) {

        $stmt->close();

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Não é possível excluir este produto porque existem vendas vinculadas."
        ]);

        exit;
    }

    $stmt->close();

    $stmt = $conn->prepare(
        "DELETE FROM produto
         WHERE id_produto = ?"
    );

    $stmt->bind_param("i", $id);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {

        $stmt->close();

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Produto não encontrado."
        ]);

        exit;
    }

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Produto excluído com sucesso."
    ]);

    $stmt->close();

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao excluir produto."
    ]);
}