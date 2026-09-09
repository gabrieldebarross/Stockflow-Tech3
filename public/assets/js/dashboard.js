const formatarMoeda = (valor) => {
    if (Number.isNaN(valor)) {
        return "R$ 0,00";
    }
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
};

const mostrarMensagem = (elemento, mensagem, colspan) => {
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

const carregarVendasDashboard = async () => {
    try {
        const resposta = await fetch("../api/dashboard/vendas.php");
        if (!resposta.ok) {
            throw new Error("Erro HTTP ao buscar vendas.");
        }
        const dados = await resposta.json();
        if (!dados.sucesso) {
            throw new Error(dados.mensagem ??
                "Erro ao buscar vendas.");
        }
        return dados.dados;
    }
    catch (erro) {
        console.error("Erro ao carregar vendas:", erro);
        return [];
    }
};

const carregarProdutos = async () => {
    try {
        const resposta = await fetch("../api/produtos/listar.php");
        if (!resposta.ok) {
            throw new Error("Erro HTTP ao buscar produtos.");
        }
        const dados = await resposta.json();
        if (!dados.sucesso) {
            throw new Error(dados.mensagem ??
                "Erro ao buscar produtos.");
        }
        return dados.dados;
    }
    catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        return [];
    }
};

const carregarEstoqueCritico = async () => {
    const tabela = document.getElementById("tabelaEstoqueCritico");
    const indicador = document.getElementById("estoqueCritico");
    if (tabela === null ||
        indicador === null) {
        return;
    }
    try {
        const resposta = await fetch("../api/dashboard/estoque-critico.php");
        if (!resposta.ok) {
            throw new Error("Erro HTTP ao buscar estoque crítico.");
        }
        const dados = await resposta.json();
        if (!dados.sucesso) {
            throw new Error(dados.mensagem ??
                "Erro ao buscar estoque crítico.");
        }
        // FILTER
        const produtosCriticos = dados.dados.filter((produto) => produto.estoque <=
            produto.estoque_minimo);
        indicador.textContent =
            String(produtosCriticos.length);
        if (produtosCriticos.length === 0) {
            mostrarMensagem(tabela, "Nenhum produto com estoque crítico.", 3);
            return;
        }
        tabela.innerHTML = "";
        produtosCriticos.forEach((produto) => {
            const linha = document.createElement("tr");
            const colunaNome = document.createElement("td");
            const colunaEstoque = document.createElement("td");
            const colunaMinimo = document.createElement("td");
            colunaNome.textContent =
                produto.nome;
            colunaEstoque.textContent =
                String(produto.estoque);
            colunaMinimo.textContent =
                String(produto.estoque_minimo);
            linha.appendChild(colunaNome);
            linha.appendChild(colunaEstoque);
            linha.appendChild(colunaMinimo);
            tabela.appendChild(linha);
        });
    }
    catch (erro) {
        console.error("Erro ao carregar estoque crítico:", erro);
        indicador.textContent = "0";
        mostrarMensagem(tabela, "Não foi possível carregar o estoque.", 3);
    }
};
const processarDashboard = (vendas) => {
    const totalVendas = document.getElementById("totalVendas");
    const faturamentoTotal = document.getElementById("faturamentoTotal");
    const produtoMaisVendido = document.getElementById("produtoMaisVendido");
    const quantidadeMaisVendida = document.getElementById("quantidadeMaisVendida");
    const tabelaRanking = document.getElementById("tabelaRanking");

    // VALIDACAO DOM
    if (totalVendas === null ||
        faturamentoTotal === null ||
        produtoMaisVendido === null ||
        quantidadeMaisVendida === null ||
        tabelaRanking === null) {
        return;
    }
    // Não existem vendas cadastradas 
     
    if (vendas.length === 0) {
        totalVendas.textContent = "0";
        faturamentoTotal.textContent =
            "R$ 0,00";
        produtoMaisVendido.textContent =
            "Nenhum dado registrado";
        quantidadeMaisVendida.textContent =
            "-";
        mostrarMensagem(tabelaRanking, "Nenhuma venda registrada.", 4);
        return;
    }

    totalVendas.textContent =
        String(vendas.length);

    const faturamentoTotalCalculado = vendas.reduce((acumulador, venda) => {
        const quantidade = Number(venda.quantidade);
        const valorUnitario = Number(venda.valor_unitario);
        if (Number.isNaN(quantidade) ||
            Number.isNaN(valorUnitario)) {
            return acumulador;
        }
        return acumulador +
            (quantidade *
                valorUnitario);
    }, 0);
    faturamentoTotal.textContent =
        formatarMoeda(faturamentoTotalCalculado);
    
    const rankingPorProduto = vendas.reduce((resultado, venda) => {
        const produto = venda.produto;
        const quantidade = Number(venda.quantidade);
        if (produto.trim() === "" ||
            Number.isNaN(quantidade)) {
            return resultado;
        }
        resultado[produto] =
            (resultado[produto] ?? 0) + quantidade;
        return resultado;
    }, {});
   
    const faturamentoPorProduto = vendas.reduce((resultado, venda) => {
        const produto = venda.produto;
        const total = Number(venda.quantidade) *
            Number(venda.valor_unitario);
        if (produto.trim() === "" ||
            Number.isNaN(total)) {
            return resultado;
        }
        resultado[produto] =
            (resultado[produto] ?? 0) + total;
        return resultado;
    }, {});
   
    const rankingOrdenado = Object.entries(rankingPorProduto).sort(([, quantidadeA], [, quantidadeB]) => quantidadeB -
        quantidadeA);
   
    const rankingFormatado = rankingOrdenado.map(([produto, quantidade], index) => {
        const faturamento = faturamentoPorProduto[produto] ?? 0;
        return {
            posicao: index + 1,
            produto,
            quantidade,
            faturamento,
            faturamentoFormatado: formatarMoeda(faturamento)
        };
    });
    
    if (rankingFormatado.length > 0) {
        const destaque = rankingFormatado[0];
        produtoMaisVendido.textContent =
            destaque.produto;
        quantidadeMaisVendida.textContent =
            `${destaque.quantidade} unidades vendidas`;
    }
    
    tabelaRanking.innerHTML = "";
    rankingFormatado.forEach((item) => {
        const linha = document.createElement("tr");
        const colunaPosicao = document.createElement("td");
        const colunaProduto = document.createElement("td");
        const colunaQuantidade = document.createElement("td");
        const colunaFaturamento = document.createElement("td");
        colunaPosicao.textContent =
            String(item.posicao);
        colunaProduto.textContent =
            item.produto;
        colunaQuantidade.textContent =
            String(item.quantidade);
        colunaFaturamento.textContent =
            item.faturamentoFormatado;
        linha.appendChild(colunaPosicao);
        linha.appendChild(colunaProduto);
        linha.appendChild(colunaQuantidade);
        linha.appendChild(colunaFaturamento);
        tabelaRanking.appendChild(linha);
    });
};

const iniciarDashboard = async () => {
    try {
        const vendas = await carregarVendasDashboard();
        const produtos = await carregarProdutos();
        processarDashboard(vendas);
        const totalProdutos = document.getElementById("totalProdutos");
        if (totalProdutos !== null) {
            totalProdutos.textContent =
                String(produtos.length);
        }
        await carregarEstoqueCritico();
    }
    catch (erro) {
        console.error("Erro ao iniciar dashboard:", erro);
    }
};

iniciarDashboard();
export {};
