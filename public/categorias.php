<?php

$titulo = "Categorias - StockFlow";

require_once "templates/header.php";

?>

<div class="d-flex justify-content-between align-items-center mb-4">

    <div>
        <h1 class="page-title mb-1">
            Categorias
        </h1>

        <p class="text-muted mb-0">
            Gerencie as categorias dos produtos.
        </p>
    </div>

    <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#modalCategoria"
    >
        Nova categoria
    </button>

</div>

<div id="mensagem"></div>

<div class="card">

    <div class="card-body">

        <div class="table-responsive">

            <table class="table table-hover mb-0">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th class="text-end">Ações</th>
                    </tr>

                </thead>

                <tbody id="tabelaCategorias">

                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            Carregando categorias...
                        </td>
                    </tr>

                </tbody>

            </table>

        </div>

    </div>

</div>

<!-- Modal -->

<div
    class="modal fade"
    id="modalCategoria"
    tabindex="-1"
    aria-hidden="true"
>

    <div class="modal-dialog">

        <div class="modal-content">

            <div class="modal-header">

                <h5 class="modal-title" id="tituloModal">
                    Nova categoria
                </h5>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                ></button>

            </div>

            <div class="modal-body">

                <form id="formCategoria">

                    <input
                        type="hidden"
                        id="idCategoria"
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
                            for="descricao"
                            class="form-label"
                        >
                            Descrição
                        </label>

                        <textarea
                            id="descricao"
                            class="form-control"
                            rows="3"
                        ></textarea>

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
                    form="formCategoria"
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
    src="assets/js/categorias.js"
></script>

<?php

require_once "templates/footer.php";

?>