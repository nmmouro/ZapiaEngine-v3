/**
 * ============================================================
 * FORM
 * Painel Frota
 *
 * Arquivo:
 *     js/engine/form.js
 *
 * Responsabilidades:
 *
 * - Criar formulário a partir do schema
 * - Localizar [data-engine-form]
 * - Novo registro
 * - Editar registro
 * - Preencher formulário
 * - Ler dados do formulário
 * - Salvar
 * - Atualizar
 * - Cancelar edição
 *
 * O FORM NÃO conhece:
 *
 * - PostgreSQL
 * - Supabase
 * - Google Sheets
 * - crudService
 * - crud
 * - table
 * - toolbar
 *
 * Comunicação com o Engine:
 *
 *     engine.novo()
 *     engine.salvar(dados)
 *     engine.fecharFormulario()
 *     engine.state
 *
 * ============================================================
 */


/* ============================================================
   CREATE FORM
============================================================ */

export function createForm(config = {}) {

    /*
     * --------------------------------------------------------
     * VALIDAR ENGINE
     * --------------------------------------------------------
     */

    const engine = config.engine;

    if (!engine) {

        throw new Error(
            "Form: engine não informado."
        );

    }


    /*
     * --------------------------------------------------------
     * CONFIGURAÇÃO
     * --------------------------------------------------------
     */

    const entity =
        config.entity ||
        engine.entity ||
        "";

    const schema =
        config.schema ||
        engine.schema ||
        null;

    const options =
        config.options ||
        engine.options ||
        {};


    /*
     * --------------------------------------------------------
     * ESTADO LOCAL
     * --------------------------------------------------------
     */

    let container = null;

    let formulario = null;

    let iniciado = false;

    let salvando = false;


    /*
     * --------------------------------------------------------
     * API PÚBLICA
     * --------------------------------------------------------
     */

    const form = {

        entity,

        schema,

        options,

        engine,

        container: null,

        formulario: null,


        /* ====================================================
           INICIAR
        ==================================================== */

        async iniciar() {

            console.log(
                `FORM ${entity} → INICIAR`
            );


            localizarContainer();


            /*
             * O formulário pode já existir no HTML.
             *
             * Se não existir, criamos.
             */

            criarFormulario();


            /*
             * Selects com `source` são preenchidos a partir
             * da tabela correspondente antes de o formulário
             * ficar disponível para uso.
             */

            await carregarOpcoesDinamicas();


            registrarEventos();


            iniciado = true;


            console.log(
                `FORM ${entity} → INICIADO`
            );


            return form;

        },


        /* ====================================================
           NOVO
        ==================================================== */

        novo() {

            garantirInicializado();


            console.log(
                `FORM ${entity} → NOVO`
            );


            form.limpar();

   
            form.mostrar();


            focarPrimeiroCampo();


            emitir(
                "novo"
            );

        },


        /* ====================================================
           EDITAR
        ==================================================== */

        editar(registro) {

            garantirInicializado();


            if (!registro) {

                console.warn(
                    `FORM ${entity} → EDITAR → registro não informado`
                );

                return;

            }


            console.log(
                `FORM ${entity} → EDITAR`,
                registro
            );


            form.preencher(registro);

            form.mostrar();


            focarPrimeiroCampo();


            emitir(
                "editar",
                registro
            );

        },


        /* ====================================================
           PREENCHER
        ==================================================== */

        preencher(registro) {

            garantirInicializado();


            if (!formulario) {

                return;

            }


            const dados =
                registro || {};


            const campos =
                formulario.querySelectorAll(
                    "[name]"
                );


            campos.forEach(
                campo => {

                    const nome =
                        campo.name;


                    if (!nome) {

                        return;

                    }


                    /*
                     * ID nunca deve ser exibido.
                     */

                    if (
                        nome.toLowerCase() === "id"
                    ) {

                        return;

                    }


                    let valor =
                        obterValorRegistro(
                            dados,
                            nome
                        );


                    /*
                     * Selects relacionais usam o ID como value.
                     * Em registros antigos, o campo de exibição
                     * pode estar vazio; nesse caso usamos o
                     * idField correspondente como valor do select.
                     */
                    if (
                        campo.type === "select" &&
                        campo.idField &&
                        (valor === undefined || valor === null || String(valor) === "")
                    ) {

                        valor = obterValorRegistro(
                            dados,
                            campo.idField
                        );
                    }


                    preencherCampo(
                        campo,
                        valor
                    );


                    if (
                        campo.type === "select" &&
                        campo.idField
                    ) {

                        const campoId = formulario.querySelector(
                            `[name="${escaparSeletor(campo.idField)}"]`
                        );

                        if (campoId && valor !== undefined && valor !== null) {
                            campoId.value = String(valor);
                        }
                    }

                }
            );


            atualizarModo();


        },


        /* ====================================================
           OBTER DADOS
        ==================================================== */

        obterDados() {

            garantirInicializado();


            if (!formulario) {

                return {};

            }


            const dados = {};


            const elementos =
                formulario.querySelectorAll(
                    "[name]"
                );


            elementos.forEach(
                campo => {

                    const nome =
                        campo.name;


                    if (!nome) {

                        return;

                    }


                    /*
                     * ID não é enviado pelo formulário.
                     *
                     * O Engine utiliza o ID do registro
                     * em edição.
                     */

                    if (
                        nome.toLowerCase() === "id"
                    ) {

                        return;

                    }


                    let valor =
                        obterValorCampo(
                            campo
                        );

                    // Campos de texto do formulário são exibidos
                    // e enviados em CAIXA ALTA.
                    if (
                        campo.tagName === "INPUT" &&
                        campo.type === "text"
                    ) {
                        valor = String(valor ?? "")
                            .toLocaleUpperCase("pt-BR");

                        campo.value = valor;
                    }

                    dados[nome] = valor;

                }
            );


            console.log(
                `FORM ${entity} → DADOS PARA SALVAR:`,
                dados
            );


            return dados;

        },


        /* ====================================================
           SALVAR
        ==================================================== */

        async salvar() {

            garantirInicializado();


            if (salvando) {

                console.warn(
                    `FORM ${entity} → SALVAMENTO JÁ EM ANDAMENTO`
                );

                return;

            }


            salvando = true;


            try {

                const dados =
                    form.obterDados();


                /*
                 * O Engine decide:
                 *
                 * Novo:
                 *     engine.salvar(dados)
                 *
                 * Edição:
                 *     engine.salvar(dados)
                 *
                 * Não duplicamos essa lógica aqui.
                 */

                const resposta =
                    await engine.salvar(
                        dados
                    );


                form.limpar();


                form.esconder();


                emitir(
                    "salvo",
                    resposta
                );


                return resposta;


            } catch (erro) {

                console.error(
                    `FORM ${entity} → ERRO AO SALVAR:`,
                    erro
                );


                emitir(
                    "erro",
                    erro
                );


                throw erro;


            } finally {

                salvando = false;

            }

        },


        /* ====================================================
           CANCELAR
        ==================================================== */

        cancelar() {

            garantirInicializado();


            console.log(
                `FORM ${entity} → CANCELAR`
            );


            form.limpar();


            form.esconder();


            /*
             * Deixa o Engine limpar
             * registroEditando.
             */

            if (
                typeof engine.fecharFormulario ===
                "function"
            ) {

                engine.fecharFormulario();

            }


            emitir(
                "cancelado"
            );

        },


        /* ====================================================
           LIMPAR
        ==================================================== */

        limpar() {

            if (!formulario) {

                return;

            }


            formulario.reset();


            /*
             * Reset não necessariamente remove
             * valores programáticos de selects.
             */

            const campos =
                formulario.querySelectorAll(
                    "[name]"
                );


            campos.forEach(
                campo => {

                    if (
                        campo.type === "checkbox"
                    ) {

                        campo.checked = false;

                    }

                }
            );


            atualizarModo();

        },


        /* ====================================================
           MOSTRAR
        ==================================================== */

        mostrar() {

            if (!container) {

                return;

            }


            container.hidden = false;

            container.style.display = "";


            container.classList.add(
                "engine-form-visible"
            );


        },


        /* ====================================================
           ESCONDER
        ==================================================== */

        esconder() {

            if (!container) {

                return;

            }


            container.classList.remove(
                "engine-form-visible"
            );


            /*
             * Usamos hidden.
             *
             * Não removemos o HTML.
             */

            container.hidden = true;

        },


        /* ====================================================
           ATUALIZAR MODO
        ==================================================== */

        atualizarModo() {

            atualizarModo();

        },


        /* ====================================================
           RENDERIZAR
        ==================================================== */

        renderizar() {

            criarFormulario();

        },


        /* ====================================================
           EMITIR EVENTO
        ==================================================== */

        emitir(nome, detalhe) {

            emitir(
                nome,
                detalhe
            );

        }

    };


    /*
     * ========================================================
     * LOCALIZAR CONTAINER
     * ========================================================
     */

    function localizarContainer() {

        /*
         * Primeira opção:
         *
         * container recebido na configuração.
         */

        if (config.container) {

            container =
                resolverElemento(
                    config.container
                );

        }


        /*
         * Segunda opção:
         *
         * container do Engine.
         */

        if (!container && engine.container) {

            const engineContainer =
                resolverElemento(
                    engine.container
                );


            if (engineContainer) {

                container =
                    engineContainer.querySelector(
                        "[data-engine-form]"
                    );

            }

        }


        /*
         * Terceira opção:
         *
         * procurar pelo atributo dentro do
         * documento.
         */

        if (!container) {

            container =
                document.querySelector(
                    "[data-engine-form]"
                );

        }


        if (!container) {

            throw new Error(
                `Form ${entity}: elemento [data-engine-form] não encontrado.`
            );

        }


        form.container =
            container;

    }


    /*
     * ========================================================
     * CRIAR FORMULÁRIO
     * ========================================================
     */

    function criarFormulario() {

        if (!container) {

            throw new Error(
                `Form ${entity}: container não localizado.`
            );

        }


        /*
         * Se já existe um <form>,
         * reutilizamos.
         */

        const existente =
            container.querySelector(
                "form[data-engine-formulario]"
            );


        if (existente) {

            formulario =
                existente;

            form.formulario =
                formulario;

            return;

        }


        /*
         * Criar estrutura.
         */

        container.innerHTML = `

            <div class="engine-form-wrapper">

                <div class="engine-form-header">

                    <h2 data-engine-form-titulo>
                        ${escaparHTML(
                            obterTitulo()
                        )}
                    </h2>

                </div>


                <form
                    data-engine-formulario
                    autocomplete="off"
                    novalidate
                >

                    <div
                        class="engine-form-fields"
                        data-engine-form-fields
                    ></div>


                    <div class="engine-form-actions">

                        <button
                            type="submit"
                            class="btn btn-primary"
                            data-engine-salvar
                        >
                            Salvar
                        </button>


                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-engine-cancelar
                        >
                            Cancelar
                        </button>

                    </div>

                </form>

            </div>

        `;


        formulario =
            container.querySelector(
                "form[data-engine-formulario]"
            );


        form.formulario =
            formulario;


        const fieldsContainer =
            container.querySelector(
                "[data-engine-form-fields]"
            );


        gerarCampos(
            fieldsContainer
        );


        /*
         * Formulário inicia fechado.
         */

        container.hidden = true;

    }


    /*
     * ========================================================
     * GERAR CAMPOS
     * ========================================================
     */

    function gerarCampos(
        fieldsContainer
    ) {

        if (!fieldsContainer) {

            return;

        }


        const fields =
            obterFields();


        if (!fields.length) {

            fieldsContainer.innerHTML = `

                <div class="engine-form-empty">

                    Nenhum campo configurado.

                </div>

            `;

            return;

        }


        let html = "";


        fields.forEach(
            (campo, indice) => {

                /*
                 * ID nunca aparece.
                 */

                const nome =
                    obterNomeCampo(
                        campo
                    );


                if (!nome) {

                    return;

                }


                if (
                    nome.toLowerCase() === "id"
                ) {

                    return;

                }


                /*
                 * Campo explicitamente oculto.
                 */

                if (
                    campo.hidden === true ||
                    campo.visible === false
                ) {

                    return;

                }


                const tipo =
                    obterTipoCampo(
                        campo
                    );


                const label =
                    obterLabelCampo(
                        campo,
                        nome
                    );


                const obrigatorio =
                    campo.required === true ||
                    campo.obrigatorio === true;


                const placeholder =
                    campo.placeholder ||
                    "";


                const classe =
                    campo.className ||
                    campo.class ||
                    "";


                html += `

                    <div
                        class="engine-field ${escaparHTML(
                            classe
                        )}"
                        data-engine-field="${escaparAtributo(
                            nome
                        )}"
                    >

                        <label
                            for="engine-field-${indice}"
                        >

                            ${escaparHTML(label)}

                            ${
                                obrigatorio
                                    ? `<span class="engine-required">*</span>`
                                    : ""
                            }

                        </label>

                        ${gerarElementoCampo(
                            campo,
                            nome,
                            tipo,
                            indice,
                            placeholder
                        )}

                    </div>

                `;

            }
        );


        fieldsContainer.innerHTML =
            html;

    }


    /*
     * ========================================================
     * GERAR ELEMENTO
     * ========================================================
     */

    function gerarElementoCampo(
        campo,
        nome,
        tipo,
        indice,
        placeholder
    ) {

        const id =
            `engine-field-${indice}`;


        const required =
            campo.required === true ||
            campo.obrigatorio === true
                ? "required"
                : "";


        const readonly =
            campo.readonly === true ||
            campo.somenteLeitura === true
                ? "readonly"
                : "";


        const disabled =
            campo.disabled === true
                ? "disabled"
                : "";


        const min =
            campo.min !== undefined
                ? `min="${escaparAtributo(campo.min)}"`
                : "";


        const max =
            campo.max !== undefined
                ? `max="${escaparAtributo(campo.max)}"`
                : "";


        const step =
            campo.step !== undefined
                ? `step="${escaparAtributo(campo.step)}"`
                : "";


        const maxlength =
            campo.maxlength !== undefined
                ? `maxlength="${escaparAtributo(campo.maxlength)}"`
                : "";


        const pattern =
            campo.pattern
                ? `pattern="${escaparAtributo(campo.pattern)}"`
                : "";


        const autocomplete =
            campo.autocomplete
                ? `autocomplete="${escaparAtributo(campo.autocomplete)}"`
                : "autocomplete=\"off\"";


        /*
         * SELECT
         */

        if (tipo === "select") {

            return gerarSelect(
                campo,
                nome,
                id,
                required,
                disabled
            );

        }


        /*
         * TEXTAREA
         */

        if (
            tipo === "textarea" ||
            campo.multiline === true
        ) {

            return `

                <textarea
                    id="${id}"
                    name="${escaparAtributo(nome)}"
                    placeholder="${escaparAtributo(
                        placeholder
                    )}"
                    ${required}
                    ${readonly}
                    ${disabled}
                    ${maxlength}
                ></textarea>

            `;

        }


        /*
         * CHECKBOX
         */

        if (
            tipo === "checkbox" ||
            tipo === "boolean"
        ) {

            return `

                <label class="engine-checkbox">

                    <input
                        id="${id}"
                        type="checkbox"
                        name="${escaparAtributo(nome)}"
                        ${required}
                        ${disabled}
                    >

                    <span>
                        ${escaparHTML(
                            campo.checkboxLabel ||
                            "Sim"
                        )}
                    </span>

                </label>

            `;

        }


        /*
         * RADIO
         */

        if (tipo === "radio") {

            return gerarRadio(
                campo,
                nome,
                id,
                required
            );

        }


        /*
         * INPUT
         */

        return `

            <input
                id="${id}"
                type="${escaparAtributo(tipo)}"
                name="${escaparAtributo(nome)}"
                placeholder="${escaparAtributo(
                    placeholder
                )}"
                ${required}
                ${readonly}
                ${disabled}
                ${min}
                ${max}
                ${step}
                ${maxlength}
                ${pattern}
                ${autocomplete}
            >

        `;

    }


    /*
     * ========================================================
     * SELECT
     * ========================================================
     */

    function gerarSelect(
        campo,
        nome,
        id,
        required,
        disabled
    ) {

        const opcoes =
            obterOpcoes(
                campo
            );


        let html = `

            <select
                id="${id}"
                name="${escaparAtributo(nome)}"
                ${required}
                ${disabled}
            >

        `;


        /*
         * Placeholder.
         */

        if (
            campo.placeholder ||
            campo.allowEmpty !== false
        ) {

            html += `

                <option value="">

                    ${escaparHTML(
                        campo.placeholder ||
                        "Selecione..."
                    )}

                </option>

            `;

        }


        opcoes.forEach(
            opcao => {

                const valor =
                    opcao.value !== undefined
                        ? opcao.value
                        : opcao.valor;


                const texto =
                    opcao.label !== undefined
                        ? opcao.label
                        : (
                            opcao.text !== undefined
                                ? opcao.text
                                : (
                                    opcao.titulo !== undefined
                                        ? opcao.titulo
                                        : valor
                                )
                        );


                html += `

                    <option
                        value="${escaparAtributo(
                            valor
                        )}"
                    >

                        ${escaparHTML(
                            texto
                        )}

                    </option>

                `;

            }
        );


        html += `

            </select>

        `;


        return html;

    }


    /*
     * ========================================================
     * RADIO
     * ========================================================
     */

    function gerarRadio(
        campo,
        nome,
        id,
        required
    ) {

        const opcoes =
            obterOpcoes(
                campo
            );


        if (!opcoes.length) {

            return "";

        }


        return `

            <div
                class="engine-radio-group"
                id="${id}"
            >

                ${opcoes.map(
                    (opcao, indice) => {

                        const valor =
                            opcao.value !== undefined
                                ? opcao.value
                                : opcao.valor;


                        const texto =
                            opcao.label !== undefined
                                ? opcao.label
                                : (
                                    opcao.text !== undefined
                                        ? opcao.text
                                        : valor
                                );


                        return `

                            <label>

                                <input
                                    type="radio"
                                    name="${escaparAtributo(nome)}"
                                    value="${escaparAtributo(valor)}"
                                    ${indice === 0 && required
                                        ? "required"
                                        : ""}
                                >

                                <span>
                                    ${escaparHTML(texto)}
                                </span>

                            </label>

                        `;

                    }
                ).join("")}

            </div>

        `;

    }


    /*
     * ========================================================
     * CARREGAR OPÇÕES DINÂMICAS
     * ========================================================
     */

    async function carregarOpcoesDinamicas() {

        if (!formulario || !schema) {

            return;

        }

        const campos = obterFields().filter(
            campo =>
                obterTipoCampo(campo) === "select" &&
                campo &&
                typeof campo === "object" &&
                campo.source
        );

        if (!campos.length) {

            return;

        }

        if (typeof engine.listarFonte !== "function") {

            throw new Error(
                `Form ${entity}: Engine não disponibiliza listarFonte().`
            );

        }

        const cache = new Map();

        for (const campo of campos) {

            const fonte = String(campo.source).trim();

            if (!fonte) continue;

            if (!cache.has(fonte)) {

                cache.set(
                    fonte,
                    Promise.resolve(engine.listarFonte(fonte))
                );

            }

            let registros;

            try {

                registros = await cache.get(fonte);

            } catch (erro) {

                console.error(
                    `FORM ${entity} → ERRO AO CARREGAR FONTE ${fonte}:`,
                    erro
                );

                throw erro;

            }

            const opcoes = normalizarOpcoesDinamicas(campo, registros);
            const nome = obterNomeCampo(campo);
            const select = formulario.querySelector(
                `select[name="${escaparSeletor(nome)}"]`
            );

            if (!select) continue;

            preencherSelect(select, campo, opcoes);
        }

    }


    function normalizarOpcoesDinamicas(campo, registros) {

        const lista = Array.isArray(registros)
            ? registros
            : Array.isArray(registros?.data)
                ? registros.data
                : [];

        const valueField = campo.valueField || "id";
        const labelFields = Array.isArray(campo.labelFields) && campo.labelFields.length
            ? campo.labelFields
            : [valueField];
        const separator = campo.separator ?? " - ";

        return lista
            .map(registro => {

                const valor = obterPropriedade(registro, valueField);

                if (valor === undefined || valor === null || String(valor) === "") {
                    return null;
                }

                const partes = labelFields
                    .map(campoLabel => obterPropriedade(registro, campoLabel))
                    .filter(valorLabel => valorLabel !== undefined && valorLabel !== null && String(valorLabel).trim() !== "")
                    .map(valorLabel => String(valorLabel).trim());

                const label = partes.length
                    ? partes.join(separator)
                    : String(valor);

                return { value: valor, label };
            })
            .filter(Boolean);
    }


    function obterPropriedade(objeto, nome) {

        if (!objeto || typeof objeto !== "object") return undefined;

        if (Object.prototype.hasOwnProperty.call(objeto, nome)) {
            return objeto[nome];
        }

        const chave = Object.keys(objeto).find(
            item => String(item).toLowerCase() === String(nome).toLowerCase()
        );

        return chave ? objeto[chave] : undefined;
    }


    function preencherSelect(select, campo, opcoes) {

        const valorAtual = select.value;
        const placeholder = campo.placeholder || "Selecione...";

        select.innerHTML = "";

        if (campo.placeholder || campo.allowEmpty !== false) {

            const optionVazia = document.createElement("option");
            optionVazia.value = "";
            optionVazia.textContent = placeholder;
            select.appendChild(optionVazia);
        }

        opcoes.forEach(opcao => {

            const option = document.createElement("option");
            option.value = String(opcao.value);
            option.textContent = String(opcao.label);
            select.appendChild(option);
        });

        if (valorAtual) {
            select.value = String(valorAtual);
        }
    }


    function escaparSeletor(valor) {

        return String(valor || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    }


    /*
     * ========================================================
     * REGISTRAR EVENTOS
     * ========================================================
     */

    function registrarEventos() {

        if (!formulario) {

            return;

        }


        /*
         * SUBMIT
         */

        formulario.addEventListener(
            "submit",
            async evento => {

                evento.preventDefault();


                if (salvando) {

                    console.warn(
                        `FORM ${entity} → SALVAMENTO JÁ EM ANDAMENTO`
                    );

                    return;

                }


                /*
                 * Validação HTML.
                 */

                if (
                    !formulario.checkValidity()
                ) {

                    formulario.reportValidity();

                    return;

                }


                try {

                    await form.salvar();

                } catch (erro) {

                    /*
                     * O Engine já trata o erro.
                     *
                     * Não relançamos aqui para evitar
                     * Promise rejection desnecessário.
                     */

                    console.error(
                        `FORM ${entity} → ERRO AO SALVAR:`,
                        erro
                    );

                }

            }
        );


        /*
         * SELECTS DINÂMICOS
         *
         * Mantêm o campo oculto de ID sincronizado com
         * a opção escolhida.
         */

        formulario.querySelectorAll("select[name]").forEach(select => {

            const campo = obterFields().find(
                item => obterNomeCampo(item) === select.name
            );

            if (!campo?.idField) return;

            select.addEventListener("change", () => {

                const idField = formulario.querySelector(
                    `[name="${escaparSeletor(campo.idField)}"]`
                );

                if (idField) {
                    idField.value = select.value || "";
                }
            });
        });


        /*
         * CANCELAR
         */

        const btnCancelar =
            formulario.querySelector(
                "[data-engine-cancelar]"
            );


        if (btnCancelar) {

            btnCancelar.addEventListener(
                "click",
                () => {

                    form.cancelar();

                }
            );

        }

    }


    /*
     * ========================================================
     * ATUALIZAR MODO
     * ========================================================
     */

    function atualizarModo() {

        if (!container) {

            return;

        }


        const titulo =
            container.querySelector(
                "[data-engine-form-titulo]"
            );


        const editando =
            Boolean(
                engine.state &&
                engine.state.registroEditando
            );


        if (titulo) {

            titulo.textContent =
                editando
                    ? `Editar ${obterTitulo()}`
                    : `Novo ${obterTitulo()}`;

        }


        const botaoSalvar =
            container.querySelector(
                "[data-engine-salvar]"
            );


        if (botaoSalvar) {

            botaoSalvar.textContent =
                editando
                    ? "Atualizar"
                    : "Salvar";

        }


        container.classList.toggle(
            "modo-edicao",
            editando
        );

    }


    /*
     * ========================================================
     * OBTER FIELDS
     * ========================================================
     */

    function obterFields() {

        if (
            schema &&
            Array.isArray(
                schema.fields
            )
        ) {

            return schema.fields;

        }


        if (
            schema &&
            Array.isArray(
                schema.campos
            )
        ) {

            return schema.campos;

        }


        return [];

    }


    /*
     * ========================================================
     * NOME DO CAMPO
     * ========================================================
     */

    function obterNomeCampo(campo) {

        if (
            typeof campo === "string"
        ) {

            return campo;

        }


        return (
            campo?.name ||
            campo?.campo ||
            campo?.field ||
            campo?.nome ||
            ""
        );

    }


    /*
     * ========================================================
     * LABEL
     * ========================================================
     */

    function obterLabelCampo(
        campo,
        nome
    ) {

        if (
            typeof campo === "string"
        ) {

            return nome;

        }


        return (
            campo?.label ||
            campo?.titulo ||
            campo?.title ||
            campo?.rotulo ||
            nome
        );

    }


    /*
     * ========================================================
     * TIPO
     * ========================================================
     */

    function obterTipoCampo(
        campo
    ) {

        if (
            typeof campo === "string"
        ) {

            return "text";

        }


        const tipo =
            String(
                campo?.type ||
                campo?.tipo ||
                campo?.inputType ||
                "text"
            )
            .toLowerCase();


        const mapa = {

            string:
                "text",

            text:
                "text",

            number:
                "number",

            integer:
                "number",

            numeric:
                "number",

            decimal:
                "number",

            date:
                "date",

            datetime:
                "datetime-local",

            "datetime-local":
                "datetime-local",

            time:
                "time",

            email:
                "email",

            tel:
                "tel",

            url:
                "url",

            password:
                "password",

            checkbox:
                "checkbox",

            boolean:
                "checkbox",

            bool:
                "checkbox",

            select:
                "select",

            dropdown:
                "select",

            textarea:
                "textarea",

            radio:
                "radio"

        };


        return mapa[tipo] || tipo || "text";

    }


    /*
     * ========================================================
     * OPÇÕES
     * ========================================================
     */

    function obterOpcoes(
        campo
    ) {

        if (
            !campo ||
            typeof campo !== "object"
        ) {

            return [];

        }


        const opcoes =
            campo.options ||
            campo.opcoes ||
            campo.choices ||
            campo.valores ||
            [];


        if (!Array.isArray(opcoes)) {

            return [];

        }


        /*
         * Permitir formato simples:
         *
         * ["ATIVO", "INATIVO"]
         */

        return opcoes.map(
            opcao => {

                if (
                    typeof opcao === "string" ||
                    typeof opcao === "number"
                ) {

                    return {

                        value: opcao,

                        label: opcao

                    };

                }


                return opcao;

            }
        );

    }


    /*
     * ========================================================
     * OBTER VALOR DO REGISTRO
     * ========================================================
     *
     * Aceita:
     *
     * registro.id
     * registro.ID
     *
     * registro.data_cadastro
     * registro.Data
     *
     * etc.
     *
     * Primeiro procura exatamente o nome.
     * Depois procura sem diferença de maiúsculas/minúsculas.
     */

    function obterValorRegistro(
        registro,
        nome
    ) {

        if (!registro) {

            return "";

        }


        if (
            Object.prototype.hasOwnProperty.call(
                registro,
                nome
            )
        ) {

            return registro[nome];

        }


        const nomeLower =
            String(nome)
                .toLowerCase();


        const chave =
            Object.keys(
                registro
            )
            .find(
                item =>
                    String(item)
                        .toLowerCase() ===
                    nomeLower
            );


        if (chave) {

            return registro[chave];

        }


        return "";

    }


    /*
     * ========================================================
     * PREENCHER CAMPO
     * ========================================================
     */

    function preencherCampo(
        campo,
        valor
    ) {

        if (!campo) {

            return;

        }


        /*
         * CHECKBOX
         */

        if (
            campo.type === "checkbox"
        ) {

            campo.checked =
                valor === true ||
                valor === 1 ||
                String(valor)
                    .toLowerCase() === "true" ||
                String(valor)
                    .toLowerCase() === "sim" ||
                String(valor)
                    .toLowerCase() === "1";

            return;

        }


        /*
         * RADIO
         */

        if (
            campo.type === "radio"
        ) {

            campo.checked =
                String(campo.value) ===
                String(valor ?? "");

            return;

        }


        /*
         * DATETIME
         */

        if (
            campo.type === "datetime-local"
        ) {

            campo.value =
                normalizarDateTimeLocal(
                    valor
                );

            return;

        }


        /*
         * TIME
         */

        if (
            campo.type === "time"
        ) {

            campo.value =
                normalizarHora(
                    valor
                );

            return;

        }


        /*
         * DATE
         */

        if (
            campo.type === "date"
        ) {

            campo.value =
                normalizarData(
                    valor
                );

            return;

        }


        campo.value =
            valor === null ||
            valor === undefined
                ? ""
                : String(valor);

    }


    /*
     * ========================================================
     * OBTER VALOR DO CAMPO
     * ========================================================
     */

    function obterValorCampo(
        campo
    ) {

        if (
            campo.type === "checkbox"
        ) {

            return campo.checked;

        }


        /*
         * Radio:
         *
         * somente o selecionado será processado.
         */

        if (
            campo.type === "radio"
        ) {

            return campo.checked
                ? campo.value
                : "";

        }


        let valor =
            campo.value;


        /*
         * NUMBER
         *
         * Não convertemos automaticamente.
         *
         * O backend/PostgreSQL pode tratar o tipo.
         * Isso evita problemas com valores vazios.
         */

        if (
            campo.type === "number" &&
            valor === ""
        ) {

            return null;

        }


        return valor;

    }


    /*
     * ========================================================
     * NORMALIZAR DATA
     * ========================================================
     */

    function normalizarData(
        valor
    ) {

        if (!valor) {

            return "";

        }


        const texto =
            String(valor);


        /*
         * 2026-08-29
         */

        if (
            /^\d{4}-\d{2}-\d{2}$/
                .test(texto)
        ) {

            return texto;

        }


        /*
         * 2026-08-29T08:36:35
         */

        if (
            /^\d{4}-\d{2}-\d{2}T/
                .test(texto)
        ) {

            return texto.substring(
                0,
                10
            );

        }


        /*
         * 29/08/2026
         */

        const br =
            texto.match(
                /^(\d{2})\/(\d{2})\/(\d{4})$/
            );


        if (br) {

            return `${br[3]}-${br[2]}-${br[1]}`;

        }


        return texto;

    }


    /*
     * ========================================================
     * NORMALIZAR HORA
     * ========================================================
     */

    function normalizarHora(
        valor
    ) {

        if (!valor) {

            return "";

        }


        const texto =
            String(valor);


        /*
         * 08:36:35
         *
         * vira:
         *
         * 08:36
         */

        const match =
            texto.match(
                /^(\d{2}):(\d{2})/
            );


        if (match) {

            return `${match[1]}:${match[2]}`;

        }


        return texto;

    }


    /*
     * ========================================================
     * NORMALIZAR DATETIME
     * ========================================================
     */

    function normalizarDateTimeLocal(
        valor
    ) {

        if (!valor) {

            return "";

        }


        const texto =
            String(valor)
                .trim();


        /*
         * Remove segundos:
         *
         * 2026-08-29T08:36:35
         *
         * →
         *
         * 2026-08-29T08:36
         */

        const match =
            texto.match(
                /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/
            );


        if (match) {

            return `${match[1]}T${match[2]}:${match[3]}`;

        }


        return texto;

    }


    /*
     * ========================================================
     * OBTER TÍTULO
     * ========================================================
     */

    function obterTitulo() {

        return (
            options.titulo ||
            schema?.title ||
            schema?.titulo ||
            entity ||
            "Registro"
        );

    }


    /*
     * ========================================================
     * GARANTIR INICIALIZAÇÃO
     * ========================================================
     */

    function garantirInicializado() {

        if (!iniciado) {

            throw new Error(
                `Form ${entity}: não foi inicializado.`
            );

        }

    }


    /*
     * ========================================================
     * FOCAR PRIMEIRO CAMPO
     * ========================================================
     */

    function focarPrimeiroCampo() {

        if (!formulario) {

            return;

        }


        const campo =
            formulario.querySelector(
                "input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled])"
            );


        if (campo) {

            /*
             * Pequeno atraso para garantir
             * que o formulário já esteja visível.
             */

            setTimeout(
                () => {

                    try {

                        campo.focus();

                    } catch (erro) {

                        /*
                         * Não interromper o fluxo.
                         */

                    }

                },
                50
            );

        }

    }


    /*
     * ========================================================
     * EMITIR
     * ========================================================
     */

    function emitir(
        nome,
        detalhe
    ) {

        if (!container) {

            return;

        }


        container.dispatchEvent(

            new CustomEvent(
                `form:${nome}`,
                {
                    detail: detalhe
                }
            )

        );

    }


    /*
     * ========================================================
     * RESOLVER ELEMENTO
     * ========================================================
     */

    function resolverElemento(
        elemento
    ) {

        if (!elemento) {

            return null;

        }


        if (
            typeof elemento === "string"
        ) {

            return document.querySelector(
                elemento
            );

        }


        if (
            elemento instanceof Element
        ) {

            return elemento;

        }


        return null;

    }


    /*
     * ========================================================
     * ESCAPAR HTML
     * ========================================================
     */

    function escaparHTML(
        valor
    ) {

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


    /*
     * ========================================================
     * ESCAPAR ATRIBUTO
     * ========================================================
     */

    function escaparAtributo(
        valor
    ) {

        return escaparHTML(
            valor
        );

    }


    /*
     * ========================================================
     * RETORNO
     * ========================================================
     */

    return form;

}
