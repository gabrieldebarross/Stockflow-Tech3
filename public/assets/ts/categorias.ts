declare const bootstrap: {
    Modal: {
        getOrCreateInstance(element: HTMLElement): {
            show(): void;
            hide(): void;
        };
    };
};


interface Categoria {
    id_categoria: number;
    nome: string;
    descricao: string | null;
}


interface CategoriaResponse {
    sucesso: boolean;
    dados?: Categoria[];
    mensagem?: string;
}


interface OperacaoResponse {
    sucesso: boolean;
    mensagem: string;
    id_categoria?: number;
}


const tabelaCategorias =
    document.getElementById("tabelaCategorias");

const formCategoria =
    document.getElementById(
        "formCategoria"
    ) as HTMLFormElement | null;

const idCategoria =
    document.getElementById(
        "idCategoria"
    ) as HTMLInputElement | null;

const nome =
    document.getElementById(
        "nome"
    ) as HTMLInputElement | null;

const descricao =
    document.getElementById(
        "descricao"
    ) as HTMLTextAreaElement | null;

const tituloModal =
    document.getElementById("tituloModal");

const mensagem =
    document.getElementById("mensagem");


async function listarCategorias(): Promise<void> {

    try {

        const resposta = await fetch(
            "../api/categorias/listar.php"
        );

        if (!resposta.ok) {
            throw new Error(
                "Erro ao consultar a API."
            );
        }

        const dados: CategoriaResponse =
            await resposta.json();

        if (!dados.sucesso || !dados.dados) {

            throw new Error(
                dados.mensagem ??
                "Não foi possível carregar as categorias."
            );
        }

        if (!tabelaCategorias) {

            throw new Error(
                "Tabela de categorias não encontrada."
            );
        }

        tabelaCategorias.innerHTML = "";

        if (dados.dados.length === 0) {

            tabelaCategorias.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="text-center text-muted"
                    >
                        Nenhuma categoria cadastrada.
                    </td>
                </tr>
            `;

            return;
        }

        dados.dados.forEach((categoria) => {

            const tr =
                document.createElement("tr");

            const tdId =
                document.createElement("td");

            tdId.textContent =
                categoria.id_categoria.toString();

            const tdNome =
                document.createElement("td");

            tdNome.textContent =
                categoria.nome;

            const tdDescricao =
                document.createElement("td");

            tdDescricao.textContent =
                categoria.descricao ??
                "Sem descrição";

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
                () => abrirEdicao(categoria)
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
                    excluirCategoria(
                        categoria.id_categoria
                    )
            );


            tdAcoes.appendChild(btnEditar);
            tdAcoes.appendChild(btnExcluir);

            tr.appendChild(tdId);
            tr.appendChild(tdNome);
            tr.appendChild(tdDescricao);
            tr.appendChild(tdAcoes);

            tabelaCategorias.appendChild(tr);
        });

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Não foi possível carregar as categorias.",
            "danger"
        );
    }
}


async function salvarCategoria(): Promise<void> {

    if (
        !nome ||
        !descricao ||
        !idCategoria
    ) {

        mostrarMensagem(
            "Elementos do formulário não encontrados.",
            "danger"
        );

        return;
    }


    const nomeValor =
        nome.value.trim();

    const descricaoValor =
        descricao.value.trim();

    const id =
        Number(idCategoria.value);


    if (nomeValor === "") {

        mostrarMensagem(
            "Informe o nome da categoria.",
            "warning"
        );

        return;
    }


    const url =
        id > 0
            ? "../api/categorias/editar.php"
            : "../api/categorias/inserir.php";


    const corpo =
        id > 0
            ? {
                id_categoria: id,
                nome: nomeValor,
                descricao: descricaoValor
            }
            : {
                nome: nomeValor,
                descricao: descricaoValor
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
                "Erro ao enviar os dados."
            );
        }


        const dados: OperacaoResponse =
            await resposta.json();


        if (!dados.sucesso) {

            mostrarMensagem(
                dados.mensagem,
                "danger"
            );

            return;
        }


        fecharModal();

        limparFormulario();

        await listarCategorias();

        mostrarMensagem(
            dados.mensagem,
            "success"
        );

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao salvar a categoria.",
            "danger"
        );
    }
}


function abrirEdicao(
    categoria: Categoria
): void {

    if (
        !idCategoria ||
        !nome ||
        !descricao ||
        !tituloModal
    ) {
        return;
    }


    idCategoria.value =
        categoria.id_categoria.toString();

    nome.value =
        categoria.nome;

    descricao.value =
        categoria.descricao ?? "";

    tituloModal.textContent =
        "Editar categoria";


    const modalElement =
        document.getElementById(
            "modalCategoria"
        );


    if (modalElement) {

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );

        modal.show();
    }
}


async function excluirCategoria(
    id: number
): Promise<void> {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta categoria?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const resposta =
            await fetch(
                "../api/categorias/excluir.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        id_categoria: id
                    })
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao excluir categoria."
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


        await listarCategorias();

        mostrarMensagem(
            dados.mensagem,
            "success"
        );

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao excluir a categoria.",
            "danger"
        );
    }
}


function limparFormulario(): void {

    if (
        !idCategoria ||
        !nome ||
        !descricao ||
        !tituloModal
    ) {
        return;
    }


    idCategoria.value = "";

    nome.value = "";

    descricao.value = "";

    tituloModal.textContent =
        "Nova categoria";
}


function fecharModal(): void {

    const modalElement =
        document.getElementById(
            "modalCategoria"
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


if (formCategoria) {

    formCategoria.addEventListener(
        "submit",
        async (evento) => {

            evento.preventDefault();

            await salvarCategoria();
        }
    );
}


const modalCategoria =
    document.getElementById(
        "modalCategoria"
    );


if (modalCategoria) {

    modalCategoria.addEventListener(
        "hidden.bs.modal",
        () => {

            limparFormulario();
        }
    );
}


listarCategorias();
export {};