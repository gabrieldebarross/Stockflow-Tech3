<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $dados = json_decode(file_get_contents("php://input"), true);

    $id = (int) ($dados["id_categoria"] ?? 0);
    $nome = trim($dados["nome"] ?? "");
    $descricao = trim($dados["descricao"] ?? "");

    if ($id <= 0) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "ID da categoria inválido."
        ]);

        exit;
    }

    if ($nome === "") {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "O nome da categoria é obrigatório."
        ]);

        exit;
    }

    $stmt = $conn->prepare(
        "UPDATE categoria
         SET nome = ?, descricao = ?
         WHERE id_categoria = ?"
    );

    $stmt->bind_param(
        "ssi",
        $nome,
        $descricao,
        $id
    );

    $stmt->execute();

    if ($stmt->affected_rows === 0) {

        $stmt->close();

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Categoria não encontrada ou nenhum dado foi alterado."
        ]);

        exit;
    }

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Categoria atualizada com sucesso."
    ]);

    $stmt->close();

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao atualizar categoria."
    ]);
}