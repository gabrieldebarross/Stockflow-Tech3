declare const bootstrap: {
    Modal: {
        getOrCreateInstance(element: HTMLElement): {
            show(): void;
            hide(): void;
        };
    };
};


interface Produto {
    id_produto: number;
    nome: string;
    preco: string;
    estoque: number;
    estoque_minimo: number;
    id_categoria: number;
    categoria: string;
}


interface Venda {
    id_venda: number;
    data_venda: string;
    id_produto?: number;
    produto: string;
    categoria: string;
    quantidade: number;
    valor_unitario: string;
    total: string;
}


interface ProdutosResponse {
    sucesso: boolean;
    dados?: Produto[];
    mensagem?: string;
}


interface VendasResponse {
    sucesso: boolean;
    pagina?: number;
    limite?: number;
    dados?: Venda[];
    mensagem?: string;
}


interface OperacaoResponse {
    sucesso: boolean;
    mensagem: string;
    id_venda?: number;
}


const tabelaVendas =
    document.getElementById("tabelaVendas");

const formVenda =
    document.getElementById(
        "formVenda"
    ) as HTMLFormElement | null;

const idVenda =
    document.getElementById(
        "idVenda"
    ) as HTMLInputElement | null;

const produto =
    document.getElementById(
        "produto"
    ) as HTMLSelectElement | null;

const quantidade =
    document.getElementById(
        "quantidade"
    ) as HTMLInputElement | null;

const valorUnitario =
    document.getElementById(
        "valorUnitario"
    ) as HTMLInputElement | null;

const estoqueDisponivel =
    document.getElementById(
        "estoqueDisponivel"
    );

const busca =
    document.getElementById(
        "busca"
    ) as HTMLInputElement | null;

const limite =
    document.getElementById(
        "limite"
    ) as HTMLSelectElement | null;

const btnAnterior =
    document.getElementById(
        "btnAnterior"
    ) as HTMLButtonElement | null;

const btnProxima =
    document.getElementById(
        "btnProxima"
    ) as HTMLButtonElement | null;

const paginaAtual =
    document.getElementById(
        "paginaAtual"
    );

const tituloModal =
    document.getElementById(
        "tituloModal"
    );

const mensagem =
    document.getElementById(
        "mensagem"
    );


let pagina = 1;

let totalVendasPagina = 0;

let produtos: Produto[] = [];


async function carregarProdutos(): Promise<void> {

    try {

        const resposta =
            await fetch(
                "../api/produtos/listar.php"
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar produtos."
            );
        }


        const dados: ProdutosResponse =
            await resposta.json();


        if (
            !dados.sucesso ||
            !dados.dados
        ) {

            throw new Error(
                dados.mensagem ??
                "Não foi possível carregar os produtos."
            );
        }


        produtos = dados.dados;


        if (!produto) {

            throw new Error(
                "Campo de produto não encontrado."
            );
        }


        produto.innerHTML = `
            <option value="">
                Selecione um produto
            </option>
        `;


        produtos
            .filter((item) => item.estoque > 0)
            .map((item) => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    item.id_produto.toString();

                option.textContent =
                    `${item.nome} - Estoque: ${item.estoque}`;

                produto.appendChild(option);
            });


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Não foi possível carregar os produtos.",
            "danger"
        );
    }
}


async function listarVendas(): Promise<void> {

    try {

        if (!tabelaVendas) {

            throw new Error(
                "Tabela de vendas não encontrada."
            );
        }


        const termoBusca =
            busca?.value.trim() ?? "";


        const limiteValor =
            Number(limite?.value ?? 10);


        if (
            Number.isNaN(limiteValor) ||
            limiteValor <= 0
        ) {

            throw new Error(
                "Limite de registros inválido."
            );
        }


        const parametros =
            new URLSearchParams();


        parametros.set(
            "pagina",
            pagina.toString()
        );


        parametros.set(
            "limite",
            limiteValor.toString()
        );


        if (termoBusca !== "") {

            parametros.set(
                "busca",
                termoBusca
            );
        }


        const resposta =
            await fetch(
                `../api/vendas/listar.php?${parametros.toString()}`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar vendas."
            );
        }


        const dados: VendasResponse =
            await resposta.json();


        if (
            !dados.sucesso ||
            !dados.dados
        ) {

            throw new Error(
                dados.mensagem ??
                "Não foi possível carregar as vendas."
            );
        }


        tabelaVendas.innerHTML = "";


        totalVendasPagina =
            dados.dados.length;


        if (dados.dados.length === 0) {

            tabelaVendas.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        class="text-center text-muted py-4"
                    >
                        Nenhuma venda encontrada.
                    </td>
                </tr>
            `;

            atualizarPaginacao();

            return;
        }


        dados.dados.forEach((venda) => {

            const tr =
                document.createElement("tr");


            const tdId =
                document.createElement("td");

            tdId.textContent =
                venda.id_venda.toString();


            const tdData =
                document.createElement("td");

            tdData.textContent =
                formatarData(venda.data_venda);


            const tdProduto =
                document.createElement("td");

            tdProduto.textContent =
                venda.produto;


            const tdCategoria =
                document.createElement("td");

            tdCategoria.textContent =
                venda.categoria;


            const tdQuantidade =
                document.createElement("td");

            tdQuantidade.textContent =
                venda.quantidade.toString();


            const tdValor =
                document.createElement("td");

            const valor =
                Number(venda.valor_unitario);


            tdValor.textContent =
                Number.isNaN(valor)
                    ? "R$ 0,00"
                    : formatarMoeda(valor);


            const tdTotal =
                document.createElement("td");

            const total =
                Number(venda.total);


            tdTotal.textContent =
                Number.isNaN(total)
                    ? "R$ 0,00"
                    : formatarMoeda(total);


            const tdAcoes =
                document.createElement("td");

            tdAcoes.className =
                "text-end";


            const btnEditar =
                document.createElement("button");

            btnEditar.type =
                "button";

            btnEditar.className =
                "btn btn-sm btn-warning me-2";

            btnEditar.textContent =
                "Editar";


            btnEditar.addEventListener(
                "click",
                () => abrirEdicao(venda)
            );


            const btnExcluir =
                document.createElement("button");

            btnExcluir.type =
                "button";

            btnExcluir.className =
                "btn btn-sm btn-danger";

            btnExcluir.textContent =
                "Excluir";


            btnExcluir.addEventListener(
                "click",
                () =>
                    excluirVenda(
                        venda.id_venda
                    )
            );


            tdAcoes.appendChild(
                btnEditar
            );

            tdAcoes.appendChild(
                btnExcluir
            );


            tr.appendChild(tdId);
            tr.appendChild(tdData);
            tr.appendChild(tdProduto);
            tr.appendChild(tdCategoria);
            tr.appendChild(tdQuantidade);
            tr.appendChild(tdValor);
            tr.appendChild(tdTotal);
            tr.appendChild(tdAcoes);


            tabelaVendas.appendChild(tr);
        });


        atualizarPaginacao();


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Não foi possível carregar as vendas.",
            "danger"
        );
    }
}


async function salvarVenda(): Promise<void> {

    if (
        !idVenda ||
        !produto ||
        !quantidade ||
        !valorUnitario
    ) {

        mostrarMensagem(
            "Elementos do formulário não encontrados.",
            "danger"
        );

        return;
    }


    const id =
        Number(idVenda.value);


    const idProduto =
        Number(produto.value);


    const quantidadeValor =
        Number(quantidade.value);


    const valor =
        Number(valorUnitario.value);


    if (
        Number.isNaN(idProduto) ||
        idProduto <= 0
    ) {

        mostrarMensagem(
            "Selecione um produto.",
            "warning"
        );

        return;
    }


    if (
        Number.isNaN(quantidadeValor) ||
        quantidadeValor <= 0
    ) {

        mostrarMensagem(
            "Informe uma quantidade válida.",
            "warning"
        );

        return;
    }


    if (
        Number.isNaN(valor) ||
        valor <= 0
    ) {

        mostrarMensagem(
            "Informe um valor unitário válido.",
            "warning"
        );

        return;
    }


    const produtoSelecionado =
        produtos.find(
            (item) =>
                item.id_produto === idProduto
        );


    if (!produtoSelecionado) {

        mostrarMensagem(
            "Produto não encontrado.",
            "danger"
        );

        return;
    }


    if (id <= 0) {

        if (
            quantidadeValor >
            produtoSelecionado.estoque
        ) {

            mostrarMensagem(
                "Quantidade maior que o estoque disponível.",
                "warning"
            );

            return;
        }
    }


    const url =
        id > 0
            ? "../api/vendas/editar.php"
            : "../api/vendas/inserir.php";


    const corpo =
        id > 0
            ? {
                id_venda: id,
                id_produto: idProduto,
                quantidade: quantidadeValor,
                valor_unitario: valor
            }
            : {
                id_produto: idProduto,
                quantidade: quantidadeValor,
                valor_unitario: valor
            };


    try {

        const resposta =
            await fetch(
                url,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(corpo)
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao enviar a venda."
            );
        }


        const dados: OperacaoResponse =
            await resposta.json();


        if (!dados.sucesso) {

            mostrarMensagem(
                dados.mensagem,
                "warning"
            );

            return;
        }


        fecharModal();

        limparFormulario();

        await carregarProdutos();

        await listarVendas();


        mostrarMensagem(
            dados.mensagem,
            "success"
        );


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao salvar a venda.",
            "danger"
        );
    }
}


function abrirEdicao(
    venda: Venda
): void {

    if (
        !idVenda ||
        !produto ||
        !quantidade ||
        !valorUnitario ||
        !tituloModal
    ) {
        return;
    }


    if (venda.id_produto === undefined) {

        mostrarMensagem(
            "Não foi possível identificar o produto da venda.",
            "danger"
        );

        return;
    }


    idVenda.value =
        venda.id_venda.toString();


    produto.value =
        venda.id_produto.toString();


    quantidade.value =
        venda.quantidade.toString();


    valorUnitario.value =
        venda.valor_unitario;


    tituloModal.textContent =
        "Editar venda";


    atualizarEstoqueDisponivel();


    const modalElement =
        document.getElementById(
            "modalVenda"
        );


    if (modalElement) {

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );

        modal.show();
    }
}


async function excluirVenda(
    id: number
): Promise<void> {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta venda?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const resposta =
            await fetch(
                "../api/vendas/excluir.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        id_venda: id
                    })
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao excluir venda."
            );
        }


        const dados: OperacaoResponse =
            await resposta.json();


        if (!dados.sucesso) {

            mostrarMensagem(
                dados.mensagem,
                "warning"
            );

            return;
        }


        await carregarProdutos();

        await listarVendas();


        mostrarMensagem(
            dados.mensagem,
            "success"
        );


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao excluir a venda.",
            "danger"
        );
    }
}


function atualizarEstoqueDisponivel(): void {

    if (
        !produto ||
        !estoqueDisponivel
    ) {
        return;
    }


    const idProduto =
        Number(produto.value);


    const produtoSelecionado =
        produtos.find(
            (item) =>
                item.id_produto === idProduto
        );


    if (!produtoSelecionado) {

        estoqueDisponivel.textContent =
            "Selecione um produto para consultar o estoque.";

        return;
    }


    estoqueDisponivel.textContent =
        `Estoque disponível: ${produtoSelecionado.estoque}`;
}


function limparFormulario(): void {

    if (
        !idVenda ||
        !produto ||
        !quantidade ||
        !valorUnitario ||
        !tituloModal
    ) {
        return;
    }


    idVenda.value = "";

    produto.value = "";

    quantidade.value = "";

    valorUnitario.value = "";

    tituloModal.textContent =
        "Nova venda";


    if (estoqueDisponivel) {

        estoqueDisponivel.textContent =
            "Selecione um produto para consultar o estoque.";
    }
}


function fecharModal(): void {

    const modalElement =
        document.getElementById(
            "modalVenda"
        );


    if (!modalElement) {
        return;
    }


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.hide();
}


function formatarMoeda(
    valor: number
): string {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


function formatarData(
    data: string
): string {

    const dataObj =
        new Date(
            data.replace(" ", "T")
        );


    if (
        Number.isNaN(
            dataObj.getTime()
        )
    ) {

        return data;
    }


    return dataObj.toLocaleString(
        "pt-BR"
    );
}


function atualizarPaginacao(): void {

    if (paginaAtual) {

        paginaAtual.textContent =
            `Página ${pagina}`;
    }


    if (btnAnterior) {

        btnAnterior.disabled =
            pagina <= 1;
    }


    if (btnProxima) {

        btnProxima.disabled =
            totalVendasPagina === 0;
    }
}


function mostrarMensagem(
    texto: string,
    tipo: "success" | "danger" | "warning"
): void {

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


if (formVenda) {

    formVenda.addEventListener(
        "submit",
        async (evento) => {

            evento.preventDefault();

            await salvarVenda();
        }
    );
}


if (produto) {

    produto.addEventListener(
        "change",
        () => {

            atualizarEstoqueDisponivel();

            const idProduto =
                Number(produto.value);

            const produtoSelecionado =
                produtos.find(
                    (item) =>
                        item.id_produto === idProduto
                );

            if (
                produtoSelecionado &&
                valorUnitario &&
                !idVenda?.value
            ) {

                valorUnitario.value =
                    produtoSelecionado.preco;
            }
        }
    );
}


if (quantidade) {

    quantidade.addEventListener(
        "input",
        () => {

            const idProduto =
                Number(produto?.value);

            const produtoSelecionado =
                produtos.find(
                    (item) =>
                        item.id_produto === idProduto
                );

            const quantidadeValor =
                Number(quantidade.value);


            if (
                produtoSelecionado &&
                !Number.isNaN(quantidadeValor) &&
                quantidadeValor >
                produtoSelecionado.estoque
            ) {

                estoqueDisponivel?.classList.add(
                    "text-danger"
                );

                if (estoqueDisponivel) {

                    estoqueDisponivel.textContent =
                        `Estoque insuficiente. Disponível: ${produtoSelecionado.estoque}`;
                }

            } else {

                estoqueDisponivel?.classList.remove(
                    "text-danger"
                );

                atualizarEstoqueDisponivel();
            }
        }
    );
}


if (busca) {

    busca.addEventListener(
        "input",
        async () => {

            pagina = 1;

            await listarVendas();
        }
    );
}


if (limite) {

    limite.addEventListener(
        "change",
        async () => {

            pagina = 1;

            await listarVendas();
        }
    );
}


if (btnAnterior) {

    btnAnterior.addEventListener(
        "click",
        async () => {

            if (pagina <= 1) {
                return;
            }

            pagina--;

            await listarVendas();
        }
    );
}


if (btnProxima) {

    btnProxima.addEventListener(
        "click",
        async () => {

            if (totalVendasPagina === 0) {
                return;
            }

            pagina++;

            await listarVendas();
        }
    );
}


const modalVenda =
    document.getElementById(
        "modalVenda"
    );


if (modalVenda) {

    modalVenda.addEventListener(
        "hidden.bs.modal",
        () => {

            limparFormulario();
        }
    );
}


async function inicializar(): Promise<void> {

    await carregarProdutos();

    await listarVendas();
}


inicializar();

export {};