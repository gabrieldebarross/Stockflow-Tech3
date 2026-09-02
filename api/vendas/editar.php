<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $dados = json_decode(file_get_contents("php://input"), true);

    $id_venda = (int) ($dados["id_venda"] ?? 0);
    $id_produto = (int) ($dados["id_produto"] ?? 0);
    $quantidade = (int) ($dados["quantidade"] ?? 0);
    $valor_unitario = (float) ($dados["valor_unitario"] ?? 0);

    if ($id_venda <= 0) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "ID da venda inválido."
        ]);

        exit;
    }

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

    $produto_antigo = (int) $venda["id_produto"];
    $quantidade_antiga = (int) $venda["quantidade"];

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

        $conn->rollback();

        http_response_code(404);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Produto não encontrado."
        ]);

        exit;
    }

    if ($produto_antigo === $id_produto) {

        $diferenca = $quantidade - $quantidade_antiga;

        if ($diferenca > 0 && $diferenca > (int) $produto["estoque"]) {

            $conn->rollback();

            http_response_code(400);

            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Estoque insuficiente para aumentar a quantidade da venda."
            ]);

            exit;
        }

        $stmt = $conn->prepare(
            "UPDATE produto
             SET estoque = estoque - ?
             WHERE id_produto = ?"
        );

        $stmt->bind_param(
            "ii",
            $diferenca,
            $id_produto
        );

        $stmt->execute();
        $stmt->close();

    } else {

        if ($quantidade > (int) $produto["estoque"]) {

            $conn->rollback();

            http_response_code(400);

            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Estoque insuficiente para o novo produto."
            ]);

            exit;
        }

        $stmt = $conn->prepare(
            "UPDATE produto
             SET estoque = estoque + ?
             WHERE id_produto = ?"
        );

        $stmt->bind_param(
            "ii",
            $quantidade_antiga,
            $produto_antigo
        );

        $stmt->execute();
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
    }

    $stmt = $conn->prepare(
        "UPDATE venda
         SET id_produto = ?,
             quantidade = ?,
             valor_unitario = ?
         WHERE id_venda = ?"
    );

    $stmt->bind_param(
        "iidi",
        $id_produto,
        $quantidade,
        $valor_unitario,
        $id_venda
    );

    $stmt->execute();
    $stmt->close();

    $conn->commit();

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Venda atualizada com sucesso."
    ]);

} catch (Exception $e) {

    $conn->rollback();

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao atualizar venda."
    ]);
}