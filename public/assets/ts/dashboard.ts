interface Indicadores {
    total_vendas: string;
    faturamento_total: string;
}

interface TotalProdutos {
    total_produtos: string;
}

interface EstoqueCriticoQuantidade {
    produtos_estoque_critico: string;
}

interface IndicadoresResponse {
    sucesso: boolean;
    dados?: [
        Indicadores,
        TotalProdutos,
        EstoqueCriticoQuantidade
    ];
    mensagem?: string;
}

interface RankingProduto {
    produto: string;
    quantidade_vendida: string;
    faturamento: string;
}

interface RankingResponse {
    sucesso: boolean;
    dados?: RankingProduto[];
    mensagem?: string;
}

interface EstoqueCritico {
    id_produto: number;
    nome: string;
    categoria: string;
    estoque: number;
    estoque_minimo: number;
}

interface EstoqueCriticoResponse {
    sucesso: boolean;
    dados?: EstoqueCritico[];
    mensagem?: string;
}


const totalVendas =
    document.getElementById("totalVendas");

const faturamento =
    document.getElementById("faturamento");

const totalProdutos =
    document.getElementById("totalProdutos");

const estoqueCritico =
    document.getElementById("estoqueCritico");

const tabelaRanking =
    document.getElementById("tabelaRanking");

const tabelaEstoqueCritico =
    document.getElementById(
        "tabelaEstoqueCritico"
    );

const mensagem =
    document.getElementById("mensagem");


async function carregarIndicadores(): Promise<void> {

    try {

        const resposta =
            await fetch(
                "../api/dashboard/indicadores.php"
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar os indicadores."
            );
        }


        const dados: IndicadoresResponse =
            await resposta.json();


        if (
            !dados.sucesso ||
            !dados.dados
        ) {

            throw new Error(
                dados.mensagem ??
                "Não foi possível carregar os indicadores."
            );
        }


        const indicadores =
            dados.dados[0];

        const produtos =
            dados.dados[1];

        const estoque =
            dados.dados[2];


        if (
            !totalVendas ||
            !faturamento ||
            !totalProdutos ||
            !estoqueCritico
        ) {

            throw new Error(
                "Elementos da dashboard não encontrados."
            );
        }


        totalVendas.textContent =
            indicadores.total_vendas;


        const valorFaturamento =
            Number(
                indicadores.faturamento_total
            );


        faturamento.textContent =
            Number.isNaN(valorFaturamento)
                ? "R$ 0,00"
                : formatarMoeda(
                    valorFaturamento
                );


        totalProdutos.textContent =
            produtos.total_produtos;


        estoqueCritico.textContent =
            estoque.produtos_estoque_critico;


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Não foi possível carregar os indicadores.",
            "danger"
        );
    }
}


async function carregarRanking(): Promise<void> {

    try {

        const resposta =
            await fetch(
                "../api/dashboard/ranking.php"
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar o ranking."
            );
        }


        const dados: RankingResponse =
            await resposta.json();


        if (
            !dados.sucesso ||
            !dados.dados
        ) {

            throw new Error(
                dados.mensagem ??
                "Não foi possível carregar o ranking."
            );
        }


        if (!tabelaRanking) {

            throw new Error(
                "Tabela de ranking não encontrada."
            );
        }


        tabelaRanking.innerHTML = "";


        if (dados.dados.length === 0) {

            tabelaRanking.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="text-center text-muted"
                    >
                        Nenhuma venda registrada.
                    </td>
                </tr>
            `;

            return;
        }


        /*
         * MAP
         * Transforma os dados recebidos da API
         * antes de apresentar no DOM.
         */

        const ranking =
            dados.dados.map(
                (item, index) => {

                    return {
                        posicao: index + 1,
                        produto: item.produto,
                        quantidade:
                            Number(
                                item.quantidade_vendida
                            ),
                        faturamento:
                            Number(
                                item.faturamento
                            )
                    };
                }
            );


        /*
         * REDUCE
         * Calcula o faturamento total
         * dos produtos apresentados.
         */

        const faturamentoPagina =
            ranking.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    (
                        Number.isNaN(
                            item.faturamento
                        )
                            ? 0
                            : item.faturamento
                    ),
                0
            );


        console.log(
            "Faturamento do ranking:",
            faturamentoPagina
        );


        ranking.forEach(
            (item) => {

                const tr =
                    document.createElement("tr");


                const tdPosicao =
                    document.createElement("td");

                tdPosicao.textContent =
                    item.posicao.toString();


                const tdProduto =
                    document.createElement("td");

                tdProduto.textContent =
                    item.produto;


                const tdQuantidade =
                    document.createElement("td");

                tdQuantidade.textContent =
                    Number.isNaN(
                        item.quantidade
                    )
                        ? "0"
                        : item.quantidade.toString();


                const tdFaturamento =
                    document.createElement("td");

                tdFaturamento.textContent =
                    Number.isNaN(
                        item.faturamento
                    )
                        ? "R$ 0,00"
                        : formatarMoeda(
                            item.faturamento
                        );


                tr.appendChild(tdPosicao);
                tr.appendChild(tdProduto);
                tr.appendChild(tdQuantidade);
                tr.appendChild(tdFaturamento);


                tabelaRanking.appendChild(tr);
            }
        );


    } catch (erro) {

        console.error(erro);

        if (tabelaRanking) {

            tabelaRanking.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="text-center text-danger"
                    >
                        Erro ao carregar o ranking.
                    </td>
                </tr>
            `;
        }
    }
}


async function carregarEstoqueCritico(): Promise<void> {

    try {

        const resposta =
            await fetch(
                "../api/dashboard/estoque-critico.php"
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar estoque crítico."
            );
        }


        const dados: EstoqueCriticoResponse =
            await resposta.json();


        if (
            !dados.sucesso ||
            !dados.dados
        ) {

            throw new Error(
                dados.mensagem ??
                "Não foi possível carregar o estoque crítico."
            );
        }


        if (!tabelaEstoqueCritico) {

            throw new Error(
                "Tabela de estoque crítico não encontrada."
            );
        }


        tabelaEstoqueCritico.innerHTML = "";


        if (dados.dados.length === 0) {

            tabelaEstoqueCritico.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="text-center text-success"
                    >
                        Nenhum produto em estoque crítico.
                    </td>
                </tr>
            `;

            return;
        }


        /*
         * FILTER
         * Mantém somente produtos realmente
         * dentro da condição de estoque crítico.
         */

        const produtosCriticos =
            dados.dados.filter(
                (item) =>
                    item.estoque <=
                    item.estoque_minimo
            );


        produtosCriticos.forEach(
            (item) => {

                const tr =
                    document.createElement("tr");


                const tdNome =
                    document.createElement("td");

                tdNome.textContent =
                    item.nome;


                const tdCategoria =
                    document.createElement("td");

                tdCategoria.textContent =
                    item.categoria;


                const tdEstoque =
                    document.createElement("td");

                tdEstoque.textContent =
                    item.estoque.toString();


                const tdMinimo =
                    document.createElement("td");

                tdMinimo.textContent =
                    item.estoque_minimo.toString();


                const tdStatus =
                    document.createElement("td");


                const badge =
                    document.createElement("span");

                badge.className =
                    "badge text-bg-danger";

                badge.textContent =
                    "Reposição necessária";


                tdStatus.appendChild(
                    badge
                );


                tr.appendChild(tdNome);
                tr.appendChild(tdCategoria);
                tr.appendChild(tdEstoque);
                tr.appendChild(tdMinimo);
                tr.appendChild(tdStatus);


                tabelaEstoqueCritico.appendChild(
                    tr
                );
            }
        );


    } catch (erro) {

        console.error(erro);

        if (tabelaEstoqueCritico) {

            tabelaEstoqueCritico.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="text-center text-danger"
                    >
                        Erro ao carregar o estoque crítico.
                    </td>
                </tr>
            `;
        }
    }
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


async function inicializar(): Promise<void> {

    await Promise.all([
        carregarIndicadores(),
        carregarRanking(),
        carregarEstoqueCritico()
    ]);
}


inicializar();


export {};