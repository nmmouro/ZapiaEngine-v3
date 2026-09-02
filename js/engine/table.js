/**
 * ============================================================
 * TABLE
 * Painel Frota
 *
 * Arquivo:
 *     js/engine/table.js
 *
 * Responsabilidade:
 *     - Criar tabela
 *     - Renderizar registros
 *     - Paginação
 *     - Filtro
 *     - Ações editar/excluir
 *
 * NÃO conhece:
 *     - Supabase
 *     - PostgreSQL
 *     - Google Sheets
 *
 * Comunicação:
 *     Recebe o ENGINE através de createTable().
 *
 * ============================================================
 */


/**
 * ============================================================
 * CREATE TABLE
 * ============================================================
 */

export function createTable(config = {}) {

    // --------------------------------------------------------
    // VALIDAÇÃO
    // --------------------------------------------------------

    if (!config.engine) {

        throw new Error(
            "Table: engine não informado."
        );

    }


    if (!config.container) {

        throw new Error(
            "Table: container não informado."
        );

    }


    // --------------------------------------------------------
    // CONFIGURAÇÃO
    // --------------------------------------------------------

    const engine =
        config.engine;

    const schema =
        config.schema ||
        engine.schema ||
        null;

    const entity =
        config.entity ||
        engine.entity ||
        "";


    const containerSelector =
        config.container;


    const options =
        config.options ||
        engine.options ||
        {};


    // --------------------------------------------------------
    // CONTAINER
    // --------------------------------------------------------

    let container =
        typeof containerSelector === "string"

            ? document.querySelector(
                containerSelector
            )

            : containerSelector;


    if (!container) {

        throw new Error(
            `Table ${entity}: container não encontrado.`
        );

    }


    // --------------------------------------------------------
    // ESTADO LOCAL
    // --------------------------------------------------------

    let filtro = "";

    let paginaAtual = 1;

    let paginaTamanho =
        Number(
            options.pageSize ||
            engine.state?.paginaTamanho ||
            10
        );


    // --------------------------------------------------------
    // API PÚBLICA
    // --------------------------------------------------------

    const table = {

        entity,

        schema,

        options,

        engine,

        container,


        /**
         * ----------------------------------------------------
         * INICIAR
         * ----------------------------------------------------
         */

        iniciar() {

            console.log(
                `TABLE ${entity} → INICIAR`
            );


            localizarContainer();


            registrarEventos();


            renderizar();


            console.log(
                `TABLE ${entity} → INICIADO`
            );

        },


        /**
         * ----------------------------------------------------
         * RENDERIZAR
         * ----------------------------------------------------
         */

        renderizar,


        /**
         * ----------------------------------------------------
         * ATUALIZAR
         * ----------------------------------------------------
         */

        atualizar() {

            renderizar();

        },


        /**
         * ----------------------------------------------------
         * FILTRAR
         * ----------------------------------------------------
         */

        filtrar(valor) {

            filtro =
                String(
                    valor ?? ""
                )
                .trim()
                .toLowerCase();


            paginaAtual = 1;


            renderizar();

        },


        /**
         * ----------------------------------------------------
         * PAGINAÇÃO
         * ----------------------------------------------------
         */

        pagina(numero) {

            const total =
                obterRegistrosFiltrados()
                    .length;


            const totalPaginas =
                Math.max(
                    1,
                    Math.ceil(
                        total /
                        paginaTamanho
                    )
                );


            paginaAtual =
                Math.min(
                    Math.max(
                        1,
                        Number(numero) || 1
                    ),
                    totalPaginas
                );


            renderizar();

        },


        /**
         * ----------------------------------------------------
         * DEFINIR CONTAINER
         * ----------------------------------------------------
         */

        definirContainer(novoContainer) {

            if (!novoContainer) {

                return;

            }


            container =
                typeof novoContainer === "string"

                    ? document.querySelector(
                        novoContainer
                    )

                    : novoContainer;


            if (!container) {

                throw new Error(
                    `Table ${entity}: novo container não encontrado.`
                );

            }


            table.container =
                container;


            renderizar();

        }

    };


    // ========================================================
    // LOCALIZAR CONTAINER
    // ========================================================

    function localizarContainer() {

        if (!container) {

            throw new Error(
                `Table ${entity}: container não encontrado.`
            );

        }

    }


    // ========================================================
    // EVENTOS
    // ========================================================

    function registrarEventos() {

        container.addEventListener(
            "click",
            tratarClique
        );

    }


    // ========================================================
    // TRATAR CLIQUES
    // ========================================================

    function tratarClique(evento) {

        const botao =
            evento.target.closest(
                "button"
            );


        if (!botao) {

            return;

        }


        const acao =
            botao.dataset.action;


        const id =
            botao.dataset.id;


        if (!acao) {

            return;

        }


        // ----------------------------------------------------
        // EDITAR
        // ----------------------------------------------------

        if (acao === "editar") {

            if (!id) {

                console.error(
                    `TABLE ${entity} → EDITAR → ID não informado`
                );

                return;

            }


            if (
                engine &&
                typeof engine.editar === "function"
            ) {

                engine.editar(id)
                    .catch(
                        erro => {

                            console.error(
                                `TABLE ${entity} → EDITAR`,
                                erro
                            );

                        }
                    );

            }

            return;

        }


        // ----------------------------------------------------
        // EXCLUIR
        // ----------------------------------------------------

        if (acao === "excluir") {

            if (!id) {

                console.error(
                    `TABLE ${entity} → EXCLUIR → ID não informado`
                );

                return;

            }


            if (
                engine &&
                typeof engine.excluir === "function"
            ) {

                engine.excluir(id)
                    .catch(
                        erro => {

                            console.error(
                                `TABLE ${entity} → EXCLUIR`,
                                erro
                            );

                        }
                    );

            }

            return;

        }


        // ----------------------------------------------------
        // ACTION PERSONALIZADA
        // ----------------------------------------------------

        if (
            acao === "custom"
        ) {

            const nome =
                botao.dataset.engineAction;


            if (
                nome &&
                engine &&
                typeof engine.action === "function"
            ) {

                const registro =
                    obterRegistroPorId(id);


                engine.action(
                    nome,
                    registro
                );

            }

        }

    }


    // ========================================================
    // RENDERIZAR
    // ========================================================

    function renderizar() {

        if (!container) {

            return;

        }


        const registros =
            obterRegistrosPagina();


        // ----------------------------------------------------
        // VAZIO
        // ----------------------------------------------------

        if (!registros.length) {

            container.innerHTML = `

                <div class="engine-empty">

                    Nenhum registro encontrado.

                </div>

            `;

            return;

        }


        const colunas =
            obterColunas();


        let html = `

            <div class="engine-table-wrapper">

                <table class="engine-table">

                    <thead>

                        <tr>

        `;


        // ----------------------------------------------------
        // CABEÇALHO
        // ----------------------------------------------------

        colunas.forEach(
            coluna => {

                html += `

                    <th>
                        ${escaparHTML(
                            obterTituloColuna(
                                coluna
                            )
                        )}
                    </th>

                `;

            }
        );


        // ----------------------------------------------------
        // AÇÕES
        // ----------------------------------------------------

        const permitirEditar =
            options.permitirEditar !== false;


        const permitirExcluir =
            options.permitirExcluir !== false;


        if (
            permitirEditar ||
            permitirExcluir ||
            possuiActions()
        ) {

            html += `

                <th class="engine-actions-header">
                    Ações
                </th>

            `;

        }


        html += `

                        </tr>

                    </thead>

                    <tbody>

        `;


        // ----------------------------------------------------
        // LINHAS
        // ----------------------------------------------------

        registros.forEach(
            registro => {

                html += `

                    <tr>

                `;


                colunas.forEach(
                    coluna => {

                        const nome =
                            obterNomeColuna(
                                coluna
                            );


                        const valor =
                            registro?.[nome];


                        html += `

                            <td>

                                ${formatarCelula(
                                    valor,
                                    coluna
                                )}

                            </td>

                        `;

                    }
                );


                // ------------------------------------------------
                // ID
                // ------------------------------------------------

                const id =
                    obterIdRegistro(
                        registro
                    );


                // ------------------------------------------------
                // AÇÕES
                // ------------------------------------------------

                if (
                    permitirEditar ||
                    permitirExcluir ||
                    possuiActions()
                ) {

                    html += `

                        <td class="engine-actions">

                    `;


                    if (permitirEditar) {

                        html += `

                            <button
                                type="button"
                                class="engine-btn engine-btn-editar"
                                data-action="editar"
                                data-id="${escaparAtributo(id)}"
                            >
                                Editar
                            </button>

                        `;

                    }


                    if (permitirExcluir) {

                        html += `

                            <button
                                type="button"
                                class="engine-btn engine-btn-excluir"
                                data-action="excluir"
                                data-id="${escaparAtributo(id)}"
                            >
                                Excluir
                            </button>

                        `;

                    }


                    html +=
                        renderizarActions(
                            registro
                        );


                    html += `

                        </td>

                    `;

                }


                html += `

                    </tr>

                `;

            }
        );


        html += `

                    </tbody>

                </table>

            </div>

        `;


        // ----------------------------------------------------
        // PAGINAÇÃO
        // ----------------------------------------------------

        html +=
            renderizarPaginacao();


        container.innerHTML =
            html;

    }


    // ========================================================
    // REGISTROS
    // ========================================================

    function obterRegistros() {

        if (
            engine &&
            engine.state &&
            Array.isArray(
                engine.state.registros
            )
        ) {

            return engine.state.registros;

        }


        return [];

    }


    // ========================================================
    // REGISTROS FILTRADOS
    // ========================================================

    function obterRegistrosFiltrados() {

        const registros =
            obterRegistros();


        if (!filtro) {

            return registros;

        }


        return registros.filter(
            registro => {

                return Object.values(
                    registro || {}
                )
                .some(
                    valor => {

                        return String(
                            valor ?? ""
                        )
                        .toLowerCase()
                        .includes(
                            filtro
                        );

                    }
                );

            }
        );

    }


    // ========================================================
    // REGISTROS DA PÁGINA
    // ========================================================

    function obterRegistrosPagina() {

        const registros =
            obterRegistrosFiltrados();


        const inicio =
            (
                paginaAtual - 1
            ) *
            paginaTamanho;


        return registros.slice(
            inicio,
            inicio + paginaTamanho
        );

    }


    // ========================================================
    // OBTER REGISTRO POR ID
    // ========================================================

    function obterRegistroPorId(id) {

        if (!id) {

            return null;

        }


        return obterRegistros()
            .find(
                registro => {

                    return String(
                        obterIdRegistro(
                            registro
                        )
                    ) === String(id);

                }
            ) || null;

    }


    // ========================================================
    // OBTER ID
    // ========================================================

    function obterIdRegistro(registro) {

        if (!registro) {

            return "";

        }


        /*
         * PostgreSQL / Supabase
         *
         * id
         */

        if (
            registro.id !== undefined &&
            registro.id !== null
        ) {

            return registro.id;

        }


        /*
         * Compatibilidade com estruturas antigas
         */

        if (
            registro.ID !== undefined &&
            registro.ID !== null
        ) {

            return registro.ID;

        }


        return "";

    }


    // ========================================================
    // COLUNAS
    // ========================================================

    function obterColunas() {

        // ----------------------------------------------------
        // COLUNAS EXPLICITAMENTE CONFIGURADAS
        // ----------------------------------------------------

        if (
            Array.isArray(
                options.colunas
            )
        ) {

            return options.colunas.filter(
                coluna => {

                    const nome =
                        obterNomeColuna(
                            coluna
                        );


                    return (
                        nome !== "id" &&
                        nome !== "ID"
                    );

                }
            );

        }


        // ----------------------------------------------------
        // SCHEMA
        // ----------------------------------------------------

        if (
            schema &&
            Array.isArray(
                schema.fields
            )
        ) {

            return schema.fields.filter(
                campo => {

                    const nome =
                        obterNomeColuna(
                            campo
                        );


                    return (
                        campo.visible !== false &&
                        campo.hidden !== true &&
                        nome !== "id" &&
                        nome !== "ID"
                    );

                }
            );

        }


        // ----------------------------------------------------
        // AUTOMÁTICO
        // ----------------------------------------------------

        const primeiro =
            obterRegistros()[0];


        if (!primeiro) {

            return [];

        }


        return Object.keys(
            primeiro
        )
        .filter(
            nome =>
                nome !== "id" &&
                nome !== "ID"
        )
        .map(
            nome => ({

                name: nome,

                label: nome

            })
        );

    }


    // ========================================================
    // NOME DA COLUNA
    // ========================================================

    function obterNomeColuna(coluna) {

        if (
            typeof coluna === "string"
        ) {

            return coluna;

        }


        return (
            coluna?.name ||
            coluna?.campo ||
            coluna?.field ||
            ""
        );

    }


    // ========================================================
    // TÍTULO DA COLUNA
    // ========================================================

    function obterTituloColuna(coluna) {

        if (
            typeof coluna === "string"
        ) {

            return coluna;

        }


        return (
            coluna?.label ||
            coluna?.titulo ||
            coluna?.title ||
            coluna?.name ||
            coluna?.campo ||
            ""
        );

    }


    // ========================================================
    // FORMATAR CÉLULA
    // ========================================================

    function formatarCelula(
        valor,
        coluna
    ) {

        if (
            valor === null ||
            valor === undefined ||
            valor === ""
        ) {

            return "";

        }


        const tipo =
            coluna?.type ||
            coluna?.tipo ||
            "";


        // ----------------------------------------------------
        // BOOLEAN
        // ----------------------------------------------------

        if (
            tipo === "boolean"
        ) {

            return valor
                ? "SIM"
                : "NÃO";

        }


        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        if (
            tipo === "status"
        ) {

            const texto =
                String(valor);


            const classe =
                obterClasseStatus(
                    texto
                );


            return `

                <span class="status-badge ${classe}">
                    ${escaparHTML(texto)}
                </span>

            `;

        }


        // ----------------------------------------------------
        // DATA
        // ----------------------------------------------------

        if (
            tipo === "date"
        ) {

            return escaparHTML(
                formatarData(
                    valor
                )
            );

        }


        return escaparHTML(
            String(valor)
        );

    }


    // ========================================================
    // STATUS
    // ========================================================

    function obterClasseStatus(valor) {

        const status =
            String(
                valor || ""
            )
            .toLowerCase()
            .trim();


        const mapa = {

            livre:
                "status-livre",

            ocupado:
                "status-ocupado",

            viagem:
                "status-viagem",

            manutencao:
                "status-manutencao",

            manutenção:
                "status-manutencao",

            andamento:
                "status-andamento",

            agendado:
                "status-agendado",

            concluido:
                "status-concluido",

            concluído:
                "status-concluido",

            cancelado:
                "status-cancelado",

            ativo:
                "status-ativo",

            inativo:
                "status-inativo"

        };


        return (
            mapa[status] ||
            "status-default"
        );

    }


    // ========================================================
    // DATA
    // ========================================================

    function formatarData(valor) {

        const data =
            String(
                valor || ""
            );


        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                data
            )
        ) {

            const partes =
                data.split("-");


            return `${partes[2]}/${partes[1]}/${partes[0]}`;

        }


        return data;

    }


    // ========================================================
    // ACTIONS
    // ========================================================

    function possuiActions() {

        return (
            options.actions &&
            typeof options.actions === "object" &&
            Object.keys(
                options.actions
            ).length > 0
        );

    }


    // ========================================================
    // RENDERIZAR ACTIONS
    // ========================================================

    function renderizarActions(
        registro
    ) {

        if (!possuiActions()) {

            return "";

        }


        const id =
            obterIdRegistro(
                registro
            );


        return Object.keys(
            options.actions
        )
        .map(
            nome => {

                if (
                    typeof options.actions[nome] !==
                    "function"
                ) {

                    return "";

                }


                return `

                    <button
                        type="button"
                        class="engine-btn"
                        data-action="custom"
                        data-engine-action="${escaparAtributo(nome)}"
                        data-id="${escaparAtributo(id)}"
                    >
                        ${escaparHTML(
                            obterTituloAction(
                                nome
                            )
                        )}
                    </button>

                `;

            }
        )
        .join("");

    }


    // ========================================================
    // TÍTULO ACTION
    // ========================================================

    function obterTituloAction(nome) {

        const titulos = {

            abrirChecklist:
                "Checklist",

            abastecer:
                "Abastecer",

            visualizar:
                "Visualizar",

            finalizar:
                "Finalizar"

        };


        return (
            titulos[nome] ||
            nome
        );

    }


    // ========================================================
    // PAGINAÇÃO
    // ========================================================

    function renderizarPaginacao() {

        const total =
            obterRegistrosFiltrados()
                .length;


        const totalPaginas =
            Math.max(
                1,
                Math.ceil(
                    total /
                    paginaTamanho
                )
            );


        if (
            totalPaginas <= 1
        ) {

            return "";

        }


        let html = `

            <div class="engine-pagination">

                <button
                    type="button"
                    data-table-page="${paginaAtual - 1}"
                    ${paginaAtual <= 1 ? "disabled" : ""}
                >
                    Anterior
                </button>

        `;


        for (
            let pagina = 1;
            pagina <= totalPaginas;
            pagina++
        ) {

            html += `

                <button
                    type="button"
                    data-table-page="${pagina}"
                    ${pagina === paginaAtual ? "aria-current='page'" : ""}
                >
                    ${pagina}
                </button>

            `;

        }


        html += `

                <button
                    type="button"
                    data-table-page="${paginaAtual + 1}"
                    ${paginaAtual >= totalPaginas ? "disabled" : ""}
                >
                    Próxima
                </button>

            </div>

        `;


        return html;

    }


    // ========================================================
    // EVENTO PAGINAÇÃO
    // ========================================================

    container.addEventListener(
        "click",
        evento => {

            const botao =
                evento.target.closest(
                    "[data-table-page]"
                );


            if (!botao) {

                return;

            }


            const pagina =
                Number(
                    botao.dataset.tablePage
                );


            if (
                Number.isNaN(pagina)
            ) {

                return;

            }


            table.pagina(
                pagina
            );

        }
    );


    // ========================================================
    // ESCAPAR HTML
    // ========================================================

    function escaparHTML(valor) {

        return String(
            valor ?? ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }


    // ========================================================
    // ESCAPAR ATRIBUTO
    // ========================================================

    function escaparAtributo(valor) {

        return escaparHTML(
            valor
        );

    }


    // ========================================================
    // RETORNO
    // ========================================================

    return table;

}
