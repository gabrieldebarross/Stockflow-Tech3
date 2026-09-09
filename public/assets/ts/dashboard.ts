interface VendaDashboard {
    id_venda: number;
    data_venda: string;
    id_produto: number;
    produto: string;
    categoria: string;
    quantidade: number;
    valor_unitario: number;
    total: number;
}

interface RespostaVendas {
    sucesso: boolean;
    dados: VendaDashboard[];
    mensagem?: string;
}

interface Produto {
    id_produto: number;
    nome: string;
    preco: number;
    estoque: number;
    estoque_minimo: number;
    id_categoria: number;
    categoria: string;
}

interface RespostaProdutos {
    sucesso: boolean;
    dados: Produto[];
    mensagem?: string;
}

interface RankingProduto {
    posicao: number;
    produto: string;
    quantidade: number;
    faturamento: number;
    faturamentoFormatado: string;
}

interface ProdutoEstoqueCritico {
    id_produto: number;
    nome: string;
    categoria: string;
    estoque: number;
    estoque_minimo: number;
}

interface RespostaEstoqueCritico {
    sucesso: boolean;
    dados: ProdutoEstoqueCritico[];
    mensagem?: string;
}


const formatarMoeda = (
    valor: number
): string => {

    if (Number.isNaN(valor)) {
        return "R$ 0,00";
    }

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
};


const mostrarMensagem = (
    elemento: HTMLElement,
    mensagem: string,
    colspan: number
): void => {

    elemento.innerHTML = "";

    const linha = document.createElement("tr");

    const coluna = document.createElement("td");

    coluna.colSpan = colspan;

    coluna.className =
        "text-center text-muted";

    coluna.textContent = mensagem;

    linha.appendChild(coluna);

    elemento.appendChild(linha);
};


const carregarVendasDashboard =
    async (): Promise<VendaDashboard[]> => {

        try {

            const resposta =
                await fetch(
                    "../api/dashboard/vendas.php"
                );

            if (!resposta.ok) {
                throw new Error(
                    "Erro HTTP ao buscar vendas."
                );
            }

            const dados: RespostaVendas =
                await resposta.json();

            if (!dados.sucesso) {
                throw new Error(
                    dados.mensagem ??
                    "Erro ao buscar vendas."
                );
            }

            return dados.dados;

        } catch (erro) {

            console.error(
                "Erro ao carregar vendas:",
                erro
            );

            return [];
        }
    };


const carregarProdutos =
    async (): Promise<Produto[]> => {

        try {

            const resposta =
                await fetch(
                    "../api/produtos/listar.php"
                );

            if (!resposta.ok) {
                throw new Error(
                    "Erro HTTP ao buscar produtos."
                );
            }

            const dados: RespostaProdutos =
                await resposta.json();

            if (!dados.sucesso) {
                throw new Error(
                    dados.mensagem ??
                    "Erro ao buscar produtos."
                );
            }

            return dados.dados;

        } catch (erro) {

            console.error(
                "Erro ao carregar produtos:",
                erro
            );

            return [];
        }
    };


const carregarEstoqueCritico =
    async (): Promise<void> => {

        const tabela =
            document.getElementById(
                "tabelaEstoqueCritico"
            );

        const indicador =
            document.getElementById(
                "estoqueCritico"
            );

        if (
            tabela === null ||
            indicador === null
        ) {
            return;
        }

        try {

            const resposta =
                await fetch(
                    "../api/dashboard/estoque-critico.php"
                );

            if (!resposta.ok) {
                throw new Error(
                    "Erro HTTP ao buscar estoque crítico."
                );
            }

            const dados:
                RespostaEstoqueCritico =
                await resposta.json();

            if (!dados.sucesso) {
                throw new Error(
                    dados.mensagem ??
                    "Erro ao buscar estoque crítico."
                );
            }

            const produtosCriticos =
                dados.dados.filter(
                    (produto) =>
                        produto.estoque <=
                        produto.estoque_minimo
                );


            indicador.textContent =
                String(produtosCriticos.length);


            if (produtosCriticos.length === 0) {

                mostrarMensagem(
                    tabela,
                    "Nenhum produto com estoque crítico.",
                    3
                );

                return;
            }


            tabela.innerHTML = "";


            produtosCriticos.forEach(
                (produto) => {

                    const linha =
                        document.createElement("tr");

                    const colunaNome =
                        document.createElement("td");

                    const colunaEstoque =
                        document.createElement("td");

                    const colunaMinimo =
                        document.createElement("td");


                    colunaNome.textContent =
                        produto.nome;

                    colunaEstoque.textContent =
                        String(produto.estoque);

                    colunaMinimo.textContent =
                        String(produto.estoque_minimo);


                    linha.appendChild(
                        colunaNome
                    );

                    linha.appendChild(
                        colunaEstoque
                    );

                    linha.appendChild(
                        colunaMinimo
                    );

                    tabela.appendChild(linha);
                }
            );

        } catch (erro) {

            console.error(
                "Erro ao carregar estoque crítico:",
                erro
            );

            indicador.textContent = "0";

            mostrarMensagem(
                tabela,
                "Não foi possível carregar o estoque.",
                3
            );
        }
    };


const processarDashboard =
    (vendas: VendaDashboard[]): void => {

        const totalVendas =
            document.getElementById(
                "totalVendas"
            );

        const faturamentoTotal =
            document.getElementById(
                "faturamentoTotal"
            );

        const produtoMaisVendido =
            document.getElementById(
                "produtoMaisVendido"
            );

        const quantidadeMaisVendida =
            document.getElementById(
                "quantidadeMaisVendida"
            );

        const tabelaRanking =
            document.getElementById(
                "tabelaRanking"
            );

        if (
            totalVendas === null ||
            faturamentoTotal === null ||
            produtoMaisVendido === null ||
            quantidadeMaisVendida === null ||
            tabelaRanking === null
        ) {
            return;
        }

        if (vendas.length === 0) {

            totalVendas.textContent = "0";

            faturamentoTotal.textContent =
                "R$ 0,00";

            produtoMaisVendido.textContent =
                "Nenhum dado registrado";

            quantidadeMaisVendida.textContent =
                "-";

            mostrarMensagem(
                tabelaRanking,
                "Nenhuma venda registrada.",
                4
            );

            return;
        }

        totalVendas.textContent =
            String(vendas.length);

        const faturamentoTotalCalculado =
            vendas.reduce(
                (
                    acumulador: number,
                    venda: VendaDashboard
                ): number => {

                    const quantidade =
                        Number(venda.quantidade);

                    const valorUnitario =
                        Number(venda.valor_unitario);


                    if (
                        Number.isNaN(quantidade) ||
                        Number.isNaN(valorUnitario)
                    ) {
                        return acumulador;
                    }


                    return acumulador +
                        (
                            quantidade *
                            valorUnitario
                        );
                },
                0
            );


        faturamentoTotal.textContent =
            formatarMoeda(
                faturamentoTotalCalculado
            );

        const rankingPorProduto =
            vendas.reduce(
                (
                    resultado:
                        Record<string, number>,
                    venda: VendaDashboard
                ): Record<string, number> => {

                    const produto =
                        venda.produto;

                    const quantidade =
                        Number(venda.quantidade);


                    if (
                        produto.trim() === "" ||
                        Number.isNaN(quantidade)
                    ) {
                        return resultado;
                    }


                    resultado[produto] =
                        (
                            resultado[produto] ?? 0
                        ) + quantidade;


                    return resultado;
                },
                {} as Record<string, number>
            );

        const faturamentoPorProduto =
            vendas.reduce(
                (
                    resultado:
                        Record<string, number>,
                    venda: VendaDashboard
                ): Record<string, number> => {

                    const produto =
                        venda.produto;

                    const total =
                        Number(venda.quantidade) *
                        Number(venda.valor_unitario);


                    if (
                        produto.trim() === "" ||
                        Number.isNaN(total)
                    ) {
                        return resultado;
                    }


                    resultado[produto] =
                        (
                            resultado[produto] ?? 0
                        ) + total;


                    return resultado;
                },
                {} as Record<string, number>
            );

        const rankingOrdenado =
            Object.entries(
                rankingPorProduto
            ).sort(
                (
                    [, quantidadeA],
                    [, quantidadeB]
                ): number =>
                    quantidadeB -
                    quantidadeA
            );

        const rankingFormatado:
            RankingProduto[] =
            rankingOrdenado.map(
                (
                    [produto, quantidade],
                    index
                ): RankingProduto => {

                    const faturamento =
                        faturamentoPorProduto[
                            produto
                        ] ?? 0;


                    return {
                        posicao: index + 1,
                        produto,
                        quantidade,
                        faturamento,
                        faturamentoFormatado:
                            formatarMoeda(
                                faturamento
                            )
                    };
                }
            );

        if (
            rankingFormatado.length > 0
        ) {

            const destaque =
                rankingFormatado[0];


            produtoMaisVendido.textContent =
                destaque.produto;


            quantidadeMaisVendida.textContent =
                `${destaque.quantidade} unidades vendidas`;
        }
        
        tabelaRanking.innerHTML = "";


        rankingFormatado.forEach(
            (item) => {

                const linha =
                    document.createElement("tr");


                const colunaPosicao =
                    document.createElement("td");

                const colunaProduto =
                    document.createElement("td");

                const colunaQuantidade =
                    document.createElement("td");

                const colunaFaturamento =
                    document.createElement("td");


                colunaPosicao.textContent =
                    String(item.posicao);


                colunaProduto.textContent =
                    item.produto;


                colunaQuantidade.textContent =
                    String(item.quantidade);


                colunaFaturamento.textContent =
                    item.faturamentoFormatado;


                linha.appendChild(
                    colunaPosicao
                );

                linha.appendChild(
                    colunaProduto
                );

                linha.appendChild(
                    colunaQuantidade
                );

                linha.appendChild(
                    colunaFaturamento
                );


                tabelaRanking.appendChild(
                    linha
                );
            }
        );
    };


const iniciarDashboard =
    async (): Promise<void> => {

        try {

            const vendas =
                await carregarVendasDashboard();

            const produtos =
                await carregarProdutos();

            processarDashboard(vendas);


            const totalProdutos =
                document.getElementById(
                    "totalProdutos"
                );

            if (totalProdutos !== null) {

                totalProdutos.textContent =
                    String(produtos.length);
            }


            await carregarEstoqueCritico();

        } catch (erro) {

            console.error(
                "Erro ao iniciar dashboard:",
                erro
            );
        }
    };


iniciarDashboard();


export {};