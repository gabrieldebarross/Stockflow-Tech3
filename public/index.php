<?php

$titulo = "Dashboard - StockFlow";

require_once "templates/header.php";

?>

<div class="d-flex justify-content-between align-items-center mb-4">

    <div>

        <h1 class="page-title mb-1">
            Dashboard
        </h1>

        <p class="text-muted mb-0">
            Visão geral do estoque e das vendas.
        </p>

    </div>

</div>


<div id="mensagem"></div>


<!-- Indicadores -->

<div class="row g-4">

    <div class="col-md-6 col-xl-3">

        <div class="card h-100">

            <div class="card-body">

                <h6 class="text-muted">
                    Total de vendas
                </h6>

                <p
                    id="totalVendas"
                    class="display-6 fw-bold mb-1"
                >
                    0
                </p>

                <small class="text-muted">
                    Vendas registradas
                </small>

            </div>

        </div>

    </div>


    <div class="col-md-6 col-xl-3">

        <div class="card h-100">

            <div class="card-body">

                <h6 class="text-muted">
                    Faturamento
                </h6>

                <p
                    id="faturamento"
                    class="display-6 fw-bold mb-1"
                >
                    R$ 0,00
                </p>

                <small class="text-muted">
                    Faturamento total
                </small>

            </div>

        </div>

    </div>


    <div class="col-md-6 col-xl-3">

        <div class="card h-100">

            <div class="card-body">

                <h6 class="text-muted">
                    Produtos
                </h6>

                <p
                    id="totalProdutos"
                    class="display-6 fw-bold mb-1"
                >
                    0
                </p>

                <small class="text-muted">
                    Produtos cadastrados
                </small>

            </div>

        </div>

    </div>


    <div class="col-md-6 col-xl-3">

        <div class="card h-100">

            <div class="card-body">

                <h6 class="text-muted">
                    Estoque crítico
                </h6>

                <p
                    id="estoqueCritico"
                    class="display-6 fw-bold text-danger mb-1"
                >
                    0
                </p>

                <small class="text-muted">
                    Produtos abaixo do mínimo
                </small>

            </div>

        </div>

    </div>

</div>


<!-- Ranking -->

<div class="card mt-4">

    <div class="card-body">

        <div class="d-flex justify-content-between align-items-center mb-3">

            <div>

                <h5 class="card-title mb-1">
                    Produtos mais vendidos
                </h5>

                <p class="text-muted mb-0">
                    Ranking por quantidade vendida.
                </p>

            </div>

            <a
                href="vendas.php"
                class="btn btn-sm btn-outline-primary"
            >
                Ver vendas
            </a>

        </div>


        <div class="table-responsive">

            <table class="table table-hover mb-0">

                <thead>

                    <tr>

                        <th>#</th>

                        <th>Produto</th>

                        <th>Quantidade vendida</th>

                        <th>Faturamento</th>

                    </tr>

                </thead>


                <tbody id="tabelaRanking">

                    <tr>

                        <td
                            colspan="4"
                            class="text-center text-muted"
                        >
                            Carregando ranking...
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

</div>


<!-- Estoque crítico -->

<div class="card mt-4">

    <div class="card-body">

        <div class="d-flex justify-content-between align-items-center mb-3">

            <div>

                <h5 class="card-title mb-1">
                    Estoque crítico
                </h5>

                <p class="text-muted mb-0">
                    Produtos que precisam de reposição.
                </p>

            </div>

            <a
                href="produtos.php"
                class="btn btn-sm btn-outline-danger"
            >
                Ver produtos
            </a>

        </div>


        <div class="table-responsive">

            <table class="table table-hover mb-0">

                <thead>

                    <tr>

                        <th>Produto</th>

                        <th>Categoria</th>

                        <th>Estoque atual</th>

                        <th>Estoque mínimo</th>

                        <th>Status</th>

                    </tr>

                </thead>


                <tbody id="tabelaEstoqueCritico">

                    <tr>

                        <td
                            colspan="5"
                            class="text-center text-muted"
                        >
                            Carregando estoque...
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

</div>


<!-- Ações rápidas -->

<div class="card mt-4">

    <div class="card-body">

        <h5 class="card-title">
            Ações rápidas
        </h5>

        <div class="d-flex gap-2 flex-wrap">

            <a
                href="categorias.php"
                class="btn btn-secondary"
            >
                Categorias
            </a>

            <a
                href="produtos.php"
                class="btn btn-primary"
            >
                Produtos
            </a>

            <a
                href="vendas.php"
                class="btn btn-success"
            >
                Nova venda
            </a>

        </div>

    </div>

</div>


<script
    type="module"
    src="assets/js/dashboard.js"
></script>


<?php

require_once "templates/footer.php";

?>