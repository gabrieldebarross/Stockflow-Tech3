<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $dados = json_decode(file_get_contents("php://input"), true);

    $nome = trim($dados["nome"] ?? "");
    $preco = (float) ($dados["preco"] ?? 0);
    $estoque = (int) ($dados["estoque"] ?? 0);
    $estoque_minimo = (int) ($dados["estoque_minimo"] ?? 5);
    $id_categoria = (int) ($dados["id_categoria"] ?? 0);

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
        "INSERT INTO produto
        (nome, preco, estoque, estoque_minimo, id_categoria)
        VALUES (?, ?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "sdiii",
        $nome,
        $preco,
        $estoque,
        $estoque_minimo,
        $id_categoria
    );

    $stmt->execute();

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Produto cadastrado com sucesso.",
        "id_produto" => $conn->insert_id
    ]);

    $stmt->close();

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao cadastrar produto."
    ]);
}