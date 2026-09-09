<?php

$titulo = "Dashboard";

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

    <a
        href="vendas.php"
        class="btn btn-primary"
    >
        Nova venda
    </a>

</div>


<!-- INDICADORES -->

<div class="row g-4 mb-4">

    <div class="col-md-6 col-lg-3">

        <div class="card h-100">

            <div class="card-body">

                <h6 class="text-muted">
                    Total de vendas
                </h6>

                <h2
                    id="totalVendas"
                    class="fw-bold"
                >
                    0
                </h2>

            </div>

        </div>

    </div>


    <div class="col-md-6 col-lg-3">

        <div class="card h-100">

            <div class="card-body">

                <h6 class="text-muted">
                    Faturamento
                </h6>

                <h2
                    id="faturamentoTotal"
                    class="fw-bold"
                >
                    R$ 0,00
                </h2>

            </div>

        </div>

    </div>


    <div class="col-md-6 col-lg-3">

        <div class="card h-100">

            <div class="card-body">

                <h6 class="text-muted">
                    Produtos
                </h6>

                <h2
                    id="totalProdutos"
                    class="fw-bold"
                >
                    0
                </h2>

            </div>

        </div>

    </div>


    <div class="col-md-6 col-lg-3">

        <div class="card h-100">

            <div class="card-body">

                <h6 class="text-muted">
                    Estoque crítico
                </h6>

                <h2
                    id="estoqueCritico"
                    class="fw-bold text-danger"
                >
                    0
                </h2>

            </div>

        </div>

    </div>

</div>


<!-- PRODUTO DESTAQUE -->

<div class="card mb-4">

    <div class="card-body">

        <div class="row align-items-center">

            <div class="col-md-8">

                <h5 class="card-title">
                    🏆 Produto mais vendido
                </h5>

                <p
                    id="produtoMaisVendido"
                    class="fs-4 fw-bold mb-1"
                >
                    Nenhum dado registrado
                </p>

                <p
                    id="quantidadeMaisVendida"
                    class="text-muted mb-0"
                >
                    -
                </p>

            </div>

            <div class="col-md-4 text-md-end mt-3 mt-md-0">

                <a
                    href="produtos.php"
                    class="btn btn-outline-primary"
                >
                    Ver produtos
                </a>

            </div>

        </div>

    </div>

</div>


<div class="row g-4">

    <!-- RANKING -->

    <div class="col-lg-7">

        <div class="card h-100">

            <div class="card-body">

                <h5 class="card-title">
                    Ranking de produtos
                </h5>

                <div class="table-responsive">

                    <table class="table">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Produto
                                </th>

                                <th>
                                    Quantidade
                                </th>

                                <th>
                                    Faturamento
                                </th>

                            </tr>

                        </thead>

                        <tbody id="tabelaRanking">

                            <tr>

                                <td
                                    colspan="4"
                                    class="text-center text-muted"
                                >
                                    Carregando...
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    </div>


    <!-- ESTOQUE CRÍTICO -->

    <div class="col-lg-5">

        <div class="card h-100">

            <div class="card-body">

                <h5 class="card-title">
                    Estoque crítico
                </h5>

                <div class="table-responsive">

                    <table class="table">

                        <thead>

                            <tr>

                                <th>
                                    Produto
                                </th>

                                <th>
                                    Estoque
                                </th>

                                <th>
                                    Mínimo
                                </th>

                            </tr>

                        </thead>

                        <tbody id="tabelaEstoqueCritico">

                            <tr>

                                <td
                                    colspan="3"
                                    class="text-center text-muted"
                                >
                                    Carregando...
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

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