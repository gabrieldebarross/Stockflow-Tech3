<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $dados = json_decode(file_get_contents("php://input"), true);

    $nome = trim($dados["nome"] ?? "");
    $descricao = trim($dados["descricao"] ?? "");

    if ($nome === "") {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "O nome da categoria é obrigatório."
        ]);

        exit;
    }

    $stmt = $conn->prepare(
        "INSERT INTO categoria (nome, descricao) VALUES (?, ?)"
    );

    $stmt->bind_param(
        "ss",
        $nome,
        $descricao
    );

    $stmt->execute();

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Categoria cadastrada com sucesso.",
        "id_categoria" => $conn->insert_id
    ]);

    $stmt->close();

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao cadastrar categoria."
    ]);
}