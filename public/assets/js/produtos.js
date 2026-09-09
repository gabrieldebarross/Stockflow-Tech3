const tabelaProdutos = document.getElementById("tabelaProdutos");
const formProduto = document.getElementById("formProduto");
const idProduto = document.getElementById("idProduto");
const nome = document.getElementById("nome");
const categoria = document.getElementById("categoria");
const filtroCategoria = document.getElementById("filtroCategoria");
const preco = document.getElementById("preco");
const estoque = document.getElementById("estoque");
const estoqueMinimo = document.getElementById("estoqueMinimo");
const busca = document.getElementById("busca");
const tituloModal = document.getElementById("tituloModal");
const mensagem = document.getElementById("mensagem");

async function carregarCategorias() {
    try {
        const resposta = await fetch("../api/categorias/listar.php");
        if (!resposta.ok) {
            throw new Error("Erro ao consultar categorias.");
        }
        const dados = await resposta.json();
        if (!dados.sucesso ||
            !dados.dados) {
            throw new Error(dados.mensagem ??
                "Não foi possível carregar as categorias.");
        }
        if (!categoria ||
            !filtroCategoria) {
            throw new Error("Elementos de categoria não encontrados.");
        }
        categoria.innerHTML = `
            <option value="">
                Selecione uma categoria
            </option>
        `;
        filtroCategoria.innerHTML = `
            <option value="0">
                Todas as categorias
            </option>
        `;
        dados.dados.forEach((item) => {
            const option = document.createElement("option");
            option.value =
                item.id_categoria.toString();
            option.textContent =
                item.nome;
            categoria.appendChild(option);
            const optionFiltro = document.createElement("option");
            optionFiltro.value =
                item.id_categoria.toString();
            optionFiltro.textContent =
                item.nome;
            filtroCategoria.appendChild(optionFiltro);
        });
    }
    catch (erro) {
        console.error(erro);
        mostrarMensagem("Não foi possível carregar as categorias.", "danger");
    }
}
async function listarProdutos() {
    try {
        if (!tabelaProdutos) {
            throw new Error("Tabela de produtos não encontrada.");
        }
        const termoBusca = busca?.value.trim() ?? "";
        const categoriaSelecionada = filtroCategoria?.value ?? "0";
        const parametros = new URLSearchParams();
        if (termoBusca !== "") {
            parametros.set("busca", termoBusca);
        }
        if (categoriaSelecionada !== "0") {
            parametros.set("categoria", categoriaSelecionada);
        }
        const query = parametros.toString();
        const url = query !== ""
            ? `../api/produtos/listar.php?${query}`
            : "../api/produtos/listar.php";
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error("Erro ao consultar produtos.");
        }
        const dados = await resposta.json();
        if (!dados.sucesso ||
            !dados.dados) {
            throw new Error(dados.mensagem ??
                "Não foi possível carregar os produtos.");
        }
        tabelaProdutos.innerHTML = "";
        if (dados.dados.length === 0) {
            tabelaProdutos.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="text-center text-muted py-4"
                    >
                        Nenhum produto encontrado.
                    </td>
                </tr>
            `;
            return;
        }
        dados.dados.forEach((produto) => {
            const tr = document.createElement("tr");
            const tdId = document.createElement("td");
            tdId.textContent =
                produto.id_produto.toString();
            const tdNome = document.createElement("td");
            tdNome.textContent =
                produto.nome;
            const tdCategoria = document.createElement("td");
            tdCategoria.textContent =
                produto.categoria;
            const tdPreco = document.createElement("td");
            const valor = Number(produto.preco);
            tdPreco.textContent =
                Number.isNaN(valor)
                    ? "R$ 0,00"
                    : valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    });
            const tdEstoque = document.createElement("td");
            const estoqueAtual = Number(produto.estoque);
            const estoqueMinimo = Number(produto.estoque_minimo);
            const badge = document.createElement("span");
            if (Number.isNaN(estoqueAtual) ||
                Number.isNaN(estoqueMinimo)) {
                badge.className =
                    "badge text-bg-secondary";
                badge.textContent =
                    "Inválido";
            }
            else if (estoqueAtual <= estoqueMinimo) {
                badge.className =
                    "badge text-bg-danger";
                badge.textContent =
                    estoqueAtual.toString();
            }
            else {
                badge.className =
                    "badge text-bg-success";
                badge.textContent =
                    estoqueAtual.toString();
            }
            tdEstoque.appendChild(badge);
            const tdMinimo = document.createElement("td");
            tdMinimo.textContent =
                produto.estoque_minimo.toString();
            const tdAcoes = document.createElement("td");
            tdAcoes.className =
                "text-end";
            const btnEditar = document.createElement("button");
            btnEditar.type =
                "button";
            btnEditar.className =
                "btn btn-sm btn-warning me-2";
            btnEditar.textContent =
                "Editar";
            btnEditar.addEventListener("click", () => abrirEdicao(produto));
            const btnExcluir = document.createElement("button");
            btnExcluir.type =
                "button";
            btnExcluir.className =
                "btn btn-sm btn-danger";
            btnExcluir.textContent =
                "Excluir";
            btnExcluir.addEventListener("click", () => excluirProduto(produto.id_produto));
            tdAcoes.appendChild(btnEditar);
            tdAcoes.appendChild(btnExcluir);
            tr.appendChild(tdId);
            tr.appendChild(tdNome);
            tr.appendChild(tdCategoria);
            tr.appendChild(tdPreco);
            tr.appendChild(tdEstoque);
            tr.appendChild(tdMinimo);
            tr.appendChild(tdAcoes);
            tabelaProdutos.appendChild(tr);
        });
    }
    catch (erro) {
        console.error(erro);
        mostrarMensagem("Não foi possível carregar os produtos.", "danger");
    }
}
async function salvarProduto() {
    if (!idProduto ||
        !nome ||
        !categoria ||
        !preco ||
        !estoque ||
        !estoqueMinimo) {
        mostrarMensagem("Elementos do formulário não encontrados.", "danger");
        return;
    }
    const nomeValor = nome.value.trim();
    const idCategoria = Number(categoria.value);
    const precoValor = Number(preco.value);
    const estoqueValor = Number(estoque.value);
    const estoqueMinimoValor = Number(estoqueMinimo.value);
    const id = Number(idProduto.value);
    if (nomeValor === "") {
        mostrarMensagem("Informe o nome do produto.", "warning");
        return;
    }
    if (Number.isNaN(idCategoria) ||
        idCategoria <= 0) {
        mostrarMensagem("Selecione uma categoria.", "warning");
        return;
    }
    if (Number.isNaN(precoValor) ||
        precoValor < 0) {
        mostrarMensagem("Informe um preço válido.", "warning");
        return;
    }
    if (Number.isNaN(estoqueValor) ||
        estoqueValor < 0) {
        mostrarMensagem("Informe um estoque válido.", "warning");
        return;
    }
    if (Number.isNaN(estoqueMinimoValor) ||
        estoqueMinimoValor < 0) {
        mostrarMensagem("Informe um estoque mínimo válido.", "warning");
        return;
    }
    const url = id > 0
        ? "../api/produtos/editar.php"
        : "../api/produtos/inserir.php";
    const corpo = id > 0
        ? {
            id_produto: id,
            nome: nomeValor,
            preco: precoValor,
            estoque: estoqueValor,
            estoque_minimo: estoqueMinimoValor,
            id_categoria: idCategoria
        }
        : {
            nome: nomeValor,
            preco: precoValor,
            estoque: estoqueValor,
            estoque_minimo: estoqueMinimoValor,
            id_categoria: idCategoria
        };
    try {
        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(corpo)
        });
        if (!resposta.ok) {
            throw new Error("Erro ao enviar os dados.");
        }
        const dados = await resposta.json();
        if (!dados.sucesso) {
            mostrarMensagem(dados.mensagem, "danger");
            return;
        }
        fecharModal();
        limparFormulario();
        await listarProdutos();
        mostrarMensagem(dados.mensagem, "success");
    }
    catch (erro) {
        console.error(erro);
        mostrarMensagem("Erro ao salvar o produto.", "danger");
    }
}
function abrirEdicao(produto) {
    if (!idProduto ||
        !nome ||
        !categoria ||
        !preco ||
        !estoque ||
        !estoqueMinimo ||
        !tituloModal) {
        return;
    }
    idProduto.value =
        produto.id_produto.toString();
    nome.value =
        produto.nome;
    categoria.value =
        produto.id_categoria.toString();
    preco.value =
        produto.preco;
    estoque.value =
        produto.estoque.toString();
    estoqueMinimo.value =
        produto.estoque_minimo.toString();
    tituloModal.textContent =
        "Editar produto";
    const modalElement = document.getElementById("modalProduto");
    if (modalElement) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    }
}
async function excluirProduto(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmar) {
        return;
    }
    try {
        const resposta = await fetch("../api/produtos/excluir.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_produto: id
            })
        });
        if (!resposta.ok) {
            throw new Error("Erro ao excluir produto.");
        }
        const dados = await resposta.json();
        if (!dados.sucesso) {
            mostrarMensagem(dados.mensagem, "warning");
            return;
        }
        await listarProdutos();
        mostrarMensagem(dados.mensagem, "success");
    }
    catch (erro) {
        console.error(erro);
        mostrarMensagem("Erro ao excluir o produto.", "danger");
    }
}
function limparFormulario() {
    if (!idProduto ||
        !nome ||
        !categoria ||
        !preco ||
        !estoque ||
        !estoqueMinimo ||
        !tituloModal) {
        return;
    }
    idProduto.value = "";
    nome.value = "";
    categoria.value = "";
    preco.value = "";
    estoque.value = "";
    estoqueMinimo.value = "5";
    tituloModal.textContent =
        "Novo produto";
}
function fecharModal() {
    const modalElement = document.getElementById("modalProduto");
    if (!modalElement) {
        return;
    }
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.hide();
}
function mostrarMensagem(texto, tipo) {
    if (!mensagem) {
        return;
    }
    mensagem.innerHTML = `
        <div
            class="alert alert-${tipo} alert-dismissible fade show"
            role="alert"
        >
            ${texto}

            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Fechar"
            ></button>

        </div>
    `;
}
if (formProduto) {
    formProduto.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        await salvarProduto();
    });
}
if (busca) {
    busca.addEventListener("input", async () => {
        await listarProdutos();
    });
}
if (filtroCategoria) {
    filtroCategoria.addEventListener("change", async () => {
        await listarProdutos();
    });
}
const modalProduto = document.getElementById("modalProduto");
if (modalProduto) {
    modalProduto.addEventListener("hidden.bs.modal", () => {
        limparFormulario();
    });
}
async function inicializar() {
    await carregarCategorias();
    await listarProdutos();
}
inicializar();
export {};
