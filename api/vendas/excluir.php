<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $dados = json_decode(file_get_contents("php://input"), true);

    $id_venda = (int) ($dados["id_venda"] ?? 0);

    if ($id_venda <= 0) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "ID da venda inválido."
        ]);

        exit;
    }

    $conn->begin_transaction();

    $stmt = $conn->prepare(
        "SELECT id_produto, quantidade
         FROM venda
         WHERE id_venda = ?"
    );

    $stmt->bind_param("i", $id_venda);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $venda = $resultado->fetch_assoc();

    $stmt->close();

    if (!$venda) {

        $conn->rollback();

        http_response_code(404);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Venda não encontrada."
        ]);

        exit;
    }

    $id_produto = (int) $venda["id_produto"];
    $quantidade = (int) $venda["quantidade"];

    $stmt = $conn->prepare(
        "DELETE FROM venda
         WHERE id_venda = ?"
    );

    $stmt->bind_param("i", $id_venda);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {

        $stmt->close();
        $conn->rollback();

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Venda não encontrada."
        ]);

        exit;
    }

    $stmt->close();

    $stmt = $conn->prepare(
        "UPDATE produto
         SET estoque = estoque + ?
         WHERE id_produto = ?"
    );

    $stmt->bind_param(
        "ii",
        $quantidade,
        $id_produto
    );

    $stmt->execute();

    $stmt->close();

    $conn->commit();

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Venda excluída com sucesso e estoque restaurado."
    ]);

} catch (Exception $e) {

    $conn->rollback();

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao excluir venda."
    ]);
}