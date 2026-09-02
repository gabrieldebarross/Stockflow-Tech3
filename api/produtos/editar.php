<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $dados = json_decode(file_get_contents("php://input"), true);

    $id = (int) ($dados["id_produto"] ?? 0);
    $nome = trim($dados["nome"] ?? "");
    $preco = (float) ($dados["preco"] ?? 0);
    $estoque = (int) ($dados["estoque"] ?? 0);
    $estoque_minimo = (int) ($dados["estoque_minimo"] ?? 5);
    $id_categoria = (int) ($dados["id_categoria"] ?? 0);

    if ($id <= 0) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "ID do produto inválido."
        ]);

        exit;
    }

    if ($nome === "") {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "O nome do produto é obrigatório."
        ]);

        exit;
    }

    if ($preco < 0) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "O preço não pode ser negativo."
        ]);

        exit;
    }

    if ($estoque < 0) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "O estoque não pode ser negativo."
        ]);

        exit;
    }

    if ($estoque_minimo < 0) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "O estoque mínimo não pode ser negativo."
        ]);

        exit;
    }

    if ($id_categoria <= 0) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "A categoria é obrigatória."
        ]);

        exit;
    }

    $stmt = $conn->prepare(
        "UPDATE produto
         SET nome = ?,
             preco = ?,
             estoque = ?,
             estoque_minimo = ?,
             id_categoria = ?
         WHERE id_produto = ?"
    );

    $stmt->bind_param(
        "sdiiii",
        $nome,
        $preco,
        $estoque,
        $estoque_minimo,
        $id_categoria,
        $id
    );

    $stmt->execute();

    if ($stmt->affected_rows === 0) {

        $stmt->close();

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Produto não encontrado ou nenhum dado foi alterado."
        ]);

        exit;
    }

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Produto atualizado com sucesso."
    ]);

    $stmt->close();

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao atualizar produto."
    ]);
}