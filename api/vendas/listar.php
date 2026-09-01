<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $busca = $_GET["busca"] ?? "";
    $pagina = isset($_GET["pagina"]) ? (int) $_GET["pagina"] : 1;
    $limite = isset($_GET["limite"]) ? (int) $_GET["limite"] : 10;

    if ($pagina < 1) {
        $pagina = 1;
    }

    if ($limite < 1) {
        $limite = 10;
    }

    $stmt = $conn->prepare("CALL sp_listar_vendas(?, ?, ?)");

    $stmt->bind_param(
        "sii",
        $busca,
        $pagina,
        $limite
    );

    $stmt->execute();

    $resultado = $stmt->get_result();

    $vendas = [];

    while ($row = $resultado->fetch_assoc()) {
        $vendas[] = $row;
    }

    $resultado->free();
    $stmt->close();

    while ($conn->more_results()) {
        $conn->next_result();
        $conn->use_result();
    }

    echo json_encode([
        "sucesso" => true,
        "pagina" => $pagina,
        "limite" => $limite,
        "dados" => $vendas
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao buscar vendas."
    ]);
}