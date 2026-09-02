<?php

$titulo = "Vendas - StockFlow";

require_once "templates/header.php";

?>

<div class="d-flex justify-content-between align-items-center mb-4">

    <div>

        <h1 class="page-title mb-1">
            Vendas
        </h1>

        <p class="text-muted mb-0">
            Registre e gerencie as vendas realizadas.
        </p>

    </div>

    <button
        type="button"
        class="btn btn-success"
        data-bs-toggle="modal"
        data-bs-target="#modalVenda"
    >
        Nova venda
    </button>

</div>


<div id="mensagem"></div>


<div class="card mb-4">

    <div class="card-body">

        <div class="row g-3">

            <div class="col-md-8">

                <label
                    for="busca"
                    class="form-label"
                >
                    Buscar venda
                </label>

                <input
                    type="text"
                    id="busca"
                    class="form-control"
                    placeholder="Digite o produto ou categoria..."
                >

            </div>

            <div class="col-md-4">

                <label
                    for="limite"
                    class="form-label"
                >
                    Registros por página
                </label>

                <select
                    id="limite"
                    class="form-select"
                >

                    <option value="5">
                        5
                    </option>

                    <option
                        value="10"
                        selected
                    >
                        10
                    </option>

                    <option value="20">
                        20
                    </option>

                </select>

            </div>

        </div>

    </div>

</div>


<div class="card">

    <div class="card-body">

        <div class="table-responsive">

            <table class="table table-hover mb-0">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Data</th>

                        <th>Produto</th>

                        <th>Categoria</th>

                        <th>Quantidade</th>

                        <th>Valor unitário</th>

                        <th>Total</th>

                        <th class="text-end">
                            Ações
                        </th>

                    </tr>

                </thead>

                <tbody id="tabelaVendas">

                    <tr>

                        <td
                            colspan="8"
                            class="text-center text-muted py-4"
                        >
                            Carregando vendas...
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

</div>


<!-- Modal Venda -->

<div
    class="modal fade"
    id="modalVenda"
    tabindex="-1"
    aria-hidden="true"
>

    <div class="modal-dialog">

        <div class="modal-content">

            <div class="modal-header">

                <h5
                    class="modal-title"
                    id="tituloModal"
                >
                    Nova venda
                </h5>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                ></button>

            </div>


            <div class="modal-body">

                <form id="formVenda">

                    <input
                        type="hidden"
                        id="idVenda"
                    >


                    <div class="mb-3">

                        <label
                            for="produto"
                            class="form-label"
                        >
                            Produto
                        </label>

                        <select
                            id="produto"
                            class="form-select"
                            required
                        >

                            <option value="">
                                Selecione um produto
                            </option>

                        </select>

                    </div>


                    <div class="mb-3">

                        <label
                            for="quantidade"
                            class="form-label"
                        >
                            Quantidade
                        </label>

                        <input
                            type="number"
                            id="quantidade"
                            class="form-control"
                            min="1"
                            required
                        >

                        <div
                            id="estoqueDisponivel"
                            class="form-text"
                        >
                            Selecione um produto para consultar o estoque.
                        </div>

                    </div>


                    <div class="mb-3">

                        <label
                            for="valorUnitario"
                            class="form-label"
                        >
                            Valor unitário
                        </label>

                        <input
                            type="number"
                            id="valorUnitario"
                            class="form-control"
                            min="0.01"
                            step="0.01"
                            required
                        >

                    </div>

                </form>

            </div>


            <div class="modal-footer">

                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    form="formVenda"
                    class="btn btn-success"
                >
                    Salvar venda
                </button>

            </div>

        </div>

    </div>

</div>


<!-- Paginação -->

<div class="d-flex justify-content-between align-items-center mt-3">

    <button
        type="button"
        id="btnAnterior"
        class="btn btn-outline-secondary"
    >
        Anterior
    </button>

    <span
        id="paginaAtual"
        class="text-muted"
    >
        Página 1
    </span>

    <button
        type="button"
        id="btnProxima"
        class="btn btn-outline-secondary"
    >
        Próxima
    </button>

</div>

<script
    type="module"
    src="assets/js/vendas.js"
></script>

<?php

require_once "templates/footer.php";

?>