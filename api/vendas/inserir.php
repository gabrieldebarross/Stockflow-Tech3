<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $dados = json_decode(file_get_contents("php://input"), true);

    $id_produto = (int) ($dados["id_produto"] ?? 0);
    $quantidade = (int) ($dados["quantidade"] ?? 0);
    $valor_unitario = (float) ($dados["valor_unitario"] ?? 0);

    if ($id_produto <= 0) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Produto inválido."
        ]);

        exit;
    }

    if ($quantidade <= 0) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "A quantidade deve ser maior que zero."
        ]);

        exit;
    }

    if ($valor_unitario <= 0) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "O valor unitário deve ser maior que zero."
        ]);

        exit;
    }

    $stmt = $conn->prepare(
        "SELECT estoque
         FROM produto
         WHERE id_produto = ?"
    );

    $stmt->bind_param("i", $id_produto);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $produto = $resultado->fetch_assoc();

    $stmt->close();

    if (!$produto) {

        http_response_code(404);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Produto não encontrado."
        ]);

        exit;
    }

    if ($quantidade > (int) $produto["estoque"]) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Quantidade vendida maior que o estoque disponível."
        ]);

        exit;
    }

    $conn->begin_transaction();

    $stmt = $conn->prepare(
        "INSERT INTO venda
        (id_produto, quantidade, valor_unitario)
        VALUES (?, ?, ?)"
    );

    $stmt->bind_param(
        "iid",
        $id_produto,
        $quantidade,
        $valor_unitario
    );

    $stmt->execute();

    $id_venda = $conn->insert_id;

    $stmt->close();

    $stmt = $conn->prepare(
        "UPDATE produto
         SET estoque = estoque - ?
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
        "mensagem" => "Venda cadastrada com sucesso.",
        "id_venda" => $id_venda
    ]);

} catch (Exception $e) {

    $conn->rollback();

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao cadastrar venda."
    ]);
}