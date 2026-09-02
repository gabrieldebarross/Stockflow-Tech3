<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexao.php";

try {

    $busca = trim($_GET["busca"] ?? "");
    $categoria = isset($_GET["categoria"]) ? (int) $_GET["categoria"] : 0;

    $sql = "SELECT
                p.id_produto,
                p.nome,
                p.preco,
                p.estoque,
                p.estoque_minimo,
                p.id_categoria,
                c.nome AS categoria
            FROM produto p
            INNER JOIN categoria c
                ON p.id_categoria = c.id_categoria
            WHERE 1 = 1";

    $parametros = [];
    $tipos = "";

    if ($busca !== "") {
        $sql .= " AND p.nome LIKE ?";
        $parametros[] = "%" . $busca . "%";
        $tipos .= "s";
    }

    if ($categoria > 0) {
        $sql .= " AND p.id_categoria = ?";
        $parametros[] = $categoria;
        $tipos .= "i";
    }

    $sql .= " ORDER BY p.id_produto DESC";

    $stmt = $conn->prepare($sql);

    if (!empty($parametros)) {
        $stmt->bind_param($tipos, ...$parametros);
    }

    $stmt->execute();

    $resultado = $stmt->get_result();

    $produtos = [];

    while ($row = $resultado->fetch_assoc()) {
        $produtos[] = $row;
    }

    echo json_encode([
        "sucesso" => true,
        "dados" => $produtos
    ]);

    $stmt->close();

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao buscar produtos."
    ]);
}