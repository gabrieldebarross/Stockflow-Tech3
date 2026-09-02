<?php

$titulo = "Produtos - StockFlow";

require_once "templates/header.php";

?>

<div class="d-flex justify-content-between align-items-center mb-4">

    <div>
        <h1 class="page-title mb-1">
            Produtos
        </h1>

        <p class="text-muted mb-0">
            Gerencie os produtos e o estoque.
        </p>
    </div>

    <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#modalProduto"
    >
        Novo produto
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
                    Buscar produto
                </label>

                <input
                    type="text"
                    id="busca"
                    class="form-control"
                    placeholder="Digite o nome do produto..."
                >

            </div>

            <div class="col-md-4">

                <label
                    for="filtroCategoria"
                    class="form-label"
                >
                    Categoria
                </label>

                <select
                    id="filtroCategoria"
                    class="form-select"
                >
                    <option value="0">
                        Todas as categorias
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
                        <th>Produto</th>
                        <th>Categoria</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                        <th>Mínimo</th>
                        <th class="text-end">
                            Ações
                        </th>

                    </tr>

                </thead>

                <tbody id="tabelaProdutos">

                    <tr>

                        <td
                            colspan="7"
                            class="text-center text-muted"
                        >
                            Carregando produtos...
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

</div>


<!-- Modal Produto -->

<div
    class="modal fade"
    id="modalProduto"
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
                    Novo produto
                </h5>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                ></button>

            </div>

            <div class="modal-body">

                <form id="formProduto">

                    <input
                        type="hidden"
                        id="idProduto"
                    >

                    <div class="mb-3">

                        <label
                            for="nome"
                            class="form-label"
                        >
                            Nome
                        </label>

                        <input
                            type="text"
                            id="nome"
                            class="form-control"
                            required
                        >

                    </div>


                    <div class="mb-3">

                        <label
                            for="categoria"
                            class="form-label"
                        >
                            Categoria
                        </label>

                        <select
                            id="categoria"
                            class="form-select"
                            required
                        >

                            <option value="">
                                Selecione uma categoria
                            </option>

                        </select>

                    </div>


                    <div class="row">

                        <div class="col-md-6 mb-3">

                            <label
                                for="preco"
                                class="form-label"
                            >
                                Preço
                            </label>

                            <input
                                type="number"
                                id="preco"
                                class="form-control"
                                min="0"
                                step="0.01"
                                required
                            >

                        </div>


                        <div class="col-md-6 mb-3">

                            <label
                                for="estoque"
                                class="form-label"
                            >
                                Estoque
                            </label>

                            <input
                                type="number"
                                id="estoque"
                                class="form-control"
                                min="0"
                                required
                            >

                        </div>

                    </div>


                    <div class="mb-3">

                        <label
                            for="estoqueMinimo"
                            class="form-label"
                        >
                            Estoque mínimo
                        </label>

                        <input
                            type="number"
                            id="estoqueMinimo"
                            class="form-control"
                            min="0"
                            value="5"
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
                    form="formProduto"
                    class="btn btn-primary"
                >
                    Salvar
                </button>

            </div>

        </div>

    </div>

</div>

<script
    type="module"
    src="assets/js/produtos.js"
></script>

<?php

require_once "templates/footer.php";

?>