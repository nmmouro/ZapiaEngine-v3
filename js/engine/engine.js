/**
 * ============================================================
 * ENGINE
 * Painel Frota
 *
 * Arquivo:
 *     js/engine/engine.js
 *
 * RESPONSABILIDADE
 * ------------------------------------------------------------
 * O Engine é o controlador central do módulo.
 *
 * Ele:
 *
 * - mantém referência ao estado;
 * - comunica com crud.js;
 * - controla Novo;
 * - controla Editar;
 * - controla Salvar;
 * - controla Excluir;
 * - dispara eventos;
 * - coordena Form;
 * - coordena Table;
 * - coordena Toolbar.
 *
 * NÃO FAZ:
 *
 * - HTML do formulário
 * - HTML da tabela
 * - HTML da toolbar
 * - criação de campos
 * - comunicação direta com Supabase
 * - comunicação direta com PostgreSQL
 *
 * Essas responsabilidades pertencem aos módulos separados.
 *
 * ============================================================
 */

import {
    gerarId
} from "./idService.js";

import {
    listar,
    obter,
    criar,
    atualizar,
    excluir
} from "./crud.js";


// ============================================================
// CREATE ENGINE
// ============================================================

export function createEngine(config = {}) {

    // ========================================================
    // VALIDAR CONFIGURAÇÃO
    // ========================================================

    if (!config.entity) {
        throw new Error(
            "Engine: entidade não informada."
        );
    }

    if (!config.container) {
        throw new Error(
            `Engine ${config.entity}: container não informado.`
        );
    }


    // ========================================================
    // CONFIGURAÇÃO
    // ========================================================

    const entity =
        String(config.entity);

    const schema =
        config.schema || null;

    const options =
        config.options || {};

    const container =
        typeof config.container === "string"
            ? document.querySelector(config.container)
            : config.container;


    if (!container) {
        throw new Error(
            `Engine ${entity}: container não encontrado.`
        );
    }


    // ========================================================
    // ESTADO
    // ========================================================

    const state = {

        registros: [],

        registroEditando: null,

        carregando: false,

        salvando: false,

        filtro: "",

        paginaAtual: 1,

        paginaTamanho:
            Number(options.pageSize) || 10

    };


    // ========================================================
    // COMPONENTES
    // ========================================================

    let form = null;

    let table = null;

    let toolbar = null;


    // ========================================================
    // ENGINE
    // ========================================================

    const engine = {

        entity,

        schema,

        options,

        container,

        state,


        // ====================================================
        // COMPONENTES
        // ====================================================

        setComponents({

            form: formComponent = null,

            table: tableComponent = null,

            toolbar: toolbarComponent = null

        } = {}) {

            form =
                formComponent;

            table =
                tableComponent;

            toolbar =
                toolbarComponent;

            return engine;
        },


        // ====================================================
        // INICIAR
        // ====================================================

        async iniciar() {

            console.log(
                `ENGINE ${entity} → INICIAR`
            );

            emitir(
                "iniciando"
            );

            try {

                /*
                 * Os componentes são iniciados pelo module.js.
                 *
                 * O Engine apenas garante que eles existam.
                 */

                if (!form) {
                    console.warn(
                        `ENGINE ${entity}: Form não configurado.`
                    );
                }

                if (!table) {
                    console.warn(
                        `ENGINE ${entity}: Table não configurado.`
                    );
                }

                if (!toolbar) {
                    console.warn(
                        `ENGINE ${entity}: Toolbar não configurado.`
                    );
                }


                await engine.carregar();


                console.log(
                    `ENGINE ${entity} → INICIADO`
                );

                emitir(
                    "iniciado",
                    state.registros
                );


                return engine;

            } catch (erro) {

                console.error(
                    `ENGINE ${entity}: falha na inicialização`,
                    erro
                );

                emitir(
                    "erro",
                    erro
                );

                throw erro;
            }
        },


        // ====================================================
        // CARREGAR
        // ====================================================

        async carregar() {

            if (state.carregando) {

                return state.registros;

            }


            console.log(
                `ENGINE ${entity} → CARREGAR`
            );


            state.carregando =
                true;


            emitir(
                "carregando"
            );


            try {

                const resposta =
                    await listar(
                        entity
                    );


                state.registros =
                    normalizarLista(
                        resposta
                    );


                state.paginaAtual =
                    1;


                console.log(
                    `ENGINE ${entity} → REGISTROS CARREGADOS:`,
                    state.registros
                );


                /*
                 * IMPORTANTE:
                 *
                 * O Engine NÃO monta a tabela.
                 *
                 * Apenas entrega os dados ao Table.
                 */

                if (
                    table &&
                    typeof table.renderizar === "function"
                ) {

                    table.renderizar(
                        state.registros,
                        state
                    );

                }


                emitir(
                    "carregado",
                    state.registros
                );


                return state.registros;


            } catch (erro) {

                console.error(
                    `ENGINE ${entity}: erro ao carregar`,
                    erro
                );


                mostrarErro(
                    erro
                );


                throw erro;


            } finally {

                state.carregando =
                    false;


                emitir(
                    "fim-carregamento"
                );

            }

        },


        // ====================================================
        // RECARREGAR
        // ====================================================

        async recarregar() {

            return engine.carregar();

        },


        // ====================================================
        // OBTER
        // ====================================================

        async obter(id) {

            const identificador =
                normalizarId(id);


            if (!identificador) {

                throw new Error(
                    "Engine: ID não informado."
                );

            }


            return obter(
                entity,
                identificador
            );

        },


        // ====================================================
        // NOVO
        // ====================================================

        novo() {

            console.log(
                `ENGINE ${entity} → NOVO`
            );


            state.registroEditando =
                null;


            /*
             * Form fica responsável por limpar
             * e mostrar o formulário.
             */

            if (
                form &&
                typeof form.novo === "function"
            ) {

                form.novo(
                    engine,
                    schema,
                    options
                );

            } else if (
                form &&
                typeof form.limpar === "function"
            ) {

                form.limpar();

            }


            emitir(
                "novo"
            );


            return true;

        },


        // ====================================================
        // EDITAR
        // ====================================================

        async editar(id) {

            const identificador =
                normalizarId(id);


            console.log(
                `ENGINE ${entity} → EDITAR → ID:`,
                identificador
            );


            if (!identificador) {

                throw new Error(
                    "Engine: ID não informado."
                );

            }


            try {

                const registro =
                    await obter(
                        entity,
                        identificador
                    );


                console.log(
                    "ENGINE → REGISTRO OBTIDO:",
                    registro
                );


                if (!registro) {

                    throw new Error(
                        `Registro ${identificador} não encontrado.`
                    );

                }


                state.registroEditando =
                    registro;


                /*
                 * Form recebe o registro.
                 */

                if (
                    form &&
                    typeof form.editar === "function"
                ) {

                    form.editar(
                        registro,
                        engine,
                        schema,
                        options
                    );

                } else if (
                    form &&
                    typeof form.preencher === "function"
                ) {

                    form.preencher(
                        registro
                    );

                }


                emitir(
                    "editar",
                    registro
                );


                return registro;


            } catch (erro) {

                console.error(
                    `ENGINE ${entity}: erro ao editar`,
                    erro
                );


                mostrarErro(
                    erro
                );


                throw erro;

            }

        },


        // ====================================================
        // SALVAR
        // ====================================================

        async salvar(dados) {

            if (state.salvando) {

                console.warn(
                    `ENGINE ${entity}: salvamento já em andamento.`
                );

                return;

            }


            state.salvando =
                true;


            console.log(
                `ENGINE ${entity} → SALVAR`,
                dados
            );


            emitir(
                "salvando",
                dados
            );


            try {

                let resposta;


                // ==================================================
                // ATUALIZAR
                // ==================================================

                if (
                    state.registroEditando
                ) {

                    const id =
                        normalizarId(
                            state.registroEditando.id
                        );


                    if (!id) {

                        throw new Error(
                            "Engine: registro em edição sem ID."
                        );

                    }


                    const registro =
                        {

                            ...state.registroEditando,

                            ...dados,

                            id

                        };


                    console.log(
                        `ENGINE ${entity} → ATUALIZAR`,
                        registro
                    );



console.log(
    "DEBUG ENGINE → CHAMANDO ATUALIZAR",
    {
        entity,
        id,
        registro,
        tipoRegistro: typeof registro
    }
);


                    


                    resposta =
                        await atualizar(
                            entity,
                            
                            registro
                        );


                    const registroAtualizado =
                        normalizarRegistroResposta(
                            resposta
                        ) ||
                        registro;


                    atualizarEstadoLocal(
                        registroAtualizado
                    );

                }


               
// ==================================================
// CRIAR
// ==================================================

else {

    console.log(
        `ENGINE ${entity} → CRIAR`
    );


    /*
     * Gerar ID antes de enviar
     * para o Supabase.
     */

    const id =
        await gerarId(
            entity
        );


    const dadosCriar = {

        ...dados,

        id

    };


    console.log(
        `ENGINE ${entity} → NOVO ID:`,
        id
    );


    resposta =
        await criar(
            entity,
            dadosCriar
        );


    const novoRegistro =
        normalizarRegistroResposta(
            resposta
        );


    if (novoRegistro) {

        state.registros.push(
            novoRegistro
        );

    }

}



                // ==================================================
                // FINALIZAR
                // ==================================================

                state.registroEditando =
                    null;


                if (
                    form &&
                    typeof form.limpar === "function"
                ) {

                    form.limpar();

                }


                if (
                    form &&
                    typeof form.fechar === "function"
                ) {

                    form.fechar();

                }


                renderizarTabela();


                emitir(
                    "salvo",
                    resposta
                );


                return resposta;


            } catch (erro) {

                console.error(
                    `ENGINE ${entity}: erro ao salvar`,
                    erro
                );


                mostrarErro(
                    erro
                );


                throw erro;


            } finally {

                state.salvando =
                    false;


                emitir(
                    "fim-salvamento"
                );

            }

        },


        // ====================================================
        // EXCLUIR
        // ====================================================

        async excluir(id) {

            const identificador =
                normalizarId(id);


            console.log(
                `ENGINE ${entity} → EXCLUIR → ID:`,
                identificador
            );


            if (!identificador) {

                throw new Error(
                    "Engine: ID não informado."
                );

            }


            const confirmar =
                window.confirm(
                    "Deseja realmente excluir este registro?"
                );


            if (!confirmar) {

                return false;

            }


            try {

                await excluir(
                    entity,
                    identificador
                );


                state.registros =
                    state.registros.filter(
                        registro =>
                            normalizarId(
                                registro?.id
                            ) !== identificador
                    );


                renderizarTabela();


                emitir(
                    "excluido",
                    identificador
                );


                return true;


            } catch (erro) {

                console.error(
                    `ENGINE ${entity}: erro ao excluir`,
                    erro
                );


                mostrarErro(
                    erro
                );


                throw erro;

            }

        },


        // ====================================================
        // FILTRAR
        // ====================================================

        filtrar(valor) {

            state.filtro =
                String(
                    valor ?? ""
                )
                .trim()
                .toLowerCase();


            state.paginaAtual =
                1;


            renderizarTabela();

        },


        // ====================================================
        // PAGINAÇÃO
        // ====================================================

        pagina(numero) {

            const total =
                obterRegistrosFiltrados()
                    .length;


            const totalPaginas =
                Math.max(
                    1,
                    Math.ceil(
                        total /
                        state.paginaTamanho
                    )
                );


            state.paginaAtual =
                Math.min(
                    Math.max(
                        Number(numero) || 1,
                        1
                    ),
                    totalPaginas
                );


            renderizarTabela();

        },


        // ====================================================
        // FECHAR FORMULÁRIO
        // ====================================================

        fecharFormulario() {

            state.registroEditando =
                null;


            if (
                form &&
                typeof form.fechar === "function"
            ) {

                form.fechar();

            } else if (
                form &&
                typeof form.esconder === "function"
            ) {

                form.esconder();

            }


            emitir(
                "formulario-fechado"
            );

        },


        // ====================================================
        // ACTION
        // ====================================================

        action(
            nome,
            registro
        ) {

            const actions =
                options.actions || {};


            const funcao =
                actions[nome];


            if (
                typeof funcao !== "function"
            ) {

                console.warn(
                    `ENGINE ${entity}: action "${nome}" não encontrada.`
                );

                return;

            }


            return funcao(
                registro,
                engine
            );

        },


        // ====================================================
        // RENDERIZAR TABELA
        // ====================================================

        renderizarTabela() {

            if (
                table &&
                typeof table.renderizar === "function"
            ) {

                const registros =
                    obterRegistrosFiltrados();


                table.renderizar(
                    registros,
                    state,
                    engine
                );

            }

        },


        // ====================================================
        // REGISTROS FILTRADOS
        // ====================================================

        obterRegistrosFiltrados() {

            return obterRegistrosFiltrados();

        },


        // ====================================================
        // GET REGISTRO EM EDIÇÃO
        // ====================================================

        getRegistroEditando() {

            return state.registroEditando;

        },


        // ====================================================
        // SET REGISTRO EM EDIÇÃO
        // ====================================================

        setRegistroEditando(registro) {

            state.registroEditando =
                registro || null;

        }

    };


    // ========================================================
    // REGISTROS FILTRADOS
    // ========================================================

    function obterRegistrosFiltrados() {

        if (!state.filtro) {

            return state.registros;

        }


        return state.registros.filter(
            registro => {

                return Object.values(
                    registro || {}
                )
                .some(
                    valor =>
                        String(
                            valor ?? ""
                        )
                        .toLowerCase()
                        .includes(
                            state.filtro
                        )
                );

            }
        );

    }


    // ========================================================
    // ATUALIZAR ESTADO LOCAL
    // ========================================================

    function atualizarEstadoLocal(
        registro
    ) {

        const id =
            normalizarId(
                registro?.id
            );


        if (!id) {

            return;

        }


        const indice =
            state.registros.findIndex(
                item =>
                    normalizarId(
                        item?.id
                    ) === id
            );


        if (indice >= 0) {

            state.registros[indice] =
                registro;

        } else {

            state.registros.push(
                registro
            );

        }

    }


    // ========================================================
    // RENDERIZAR TABELA
    // ========================================================

    function renderizarTabela() {

        if (
            !table ||
            typeof table.renderizar !== "function"
        ) {

            return;

        }


        const registros =
            obterRegistrosFiltrados();


        table.renderizar(
            registros,
            state,
            engine
        );

    }


    // ========================================================
    // NORMALIZAR LISTA
    // ========================================================

    function normalizarLista(
        resposta
    ) {

        if (
            Array.isArray(resposta)
        ) {

            return resposta;

        }


        if (
            resposta &&
            Array.isArray(resposta.data)
        ) {

            return resposta.data;

        }


        if (
            resposta &&
            Array.isArray(resposta.dados)
        ) {

            return resposta.dados;

        }


        return [];

    }


    // ========================================================
    // NORMALIZAR REGISTRO
    // ========================================================

    function normalizarRegistroResposta(
        resposta
    ) {

        if (!resposta) {

            return null;

        }


        if (
            Array.isArray(resposta)
        ) {

            return resposta[0] || null;

        }


        if (
            resposta.data
        ) {

            if (
                Array.isArray(
                    resposta.data
                )
            ) {

                return (
                    resposta.data[0] ||
                    null
                );

            }


            if (
                typeof resposta.data === "object"
            ) {

                return resposta.data;

            }

        }


        if (
            resposta.dados
        ) {

            if (
                Array.isArray(
                    resposta.dados
                )
            ) {

                return (
                    resposta.dados[0] ||
                    null
                );

            }


            if (
                typeof resposta.dados === "object"
            ) {

                return resposta.dados;

            }

        }


        if (
            typeof resposta === "object" &&
            resposta.id
        ) {

            return resposta;

        }


        return null;

    }


    // ========================================================
    // NORMALIZAR ID
    // ========================================================

    function normalizarId(id) {

        if (
            id === undefined ||
            id === null
        ) {

            return "";

        }


        return String(
            id
        ).trim();

    }


    // ========================================================
    // EVENTO
    // ========================================================

    function emitir(
        nome,
        detalhe = null
    ) {

        if (!container) {

            return;

        }


        container.dispatchEvent(

            new CustomEvent(
                `engine:${nome}`,
                {
                    detail: detalhe
                }
            )

        );

    }


    // ========================================================
    // ERRO
    // ========================================================

    function mostrarErro(
        erro
    ) {

        const mensagem =
            erro?.message ||
            String(erro) ||
            "Ocorreu um erro.";


        console.error(
            `ENGINE ${entity}:`,
            erro
        );


        if (
            typeof window.mostrarToast ===
            "function"
        ) {

            window.mostrarToast(
                mensagem,
                "erro"
            );

            return;

        }


        window.alert(
            mensagem
        );

    }


    // ========================================================
    // RETORNAR ENGINE
    // ========================================================

    return engine;

}


// ============================================================
// EXPORT DEFAULT
// ============================================================

export default createEngine;
