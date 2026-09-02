// ============================================================
// INICIALIZAR TOOLBAR
// ============================================================

if (
    toolbar &&
    typeof toolbar.iniciar === "function"
) {

    toolbar.iniciar();

}


/**
 * ============================================================
 * TOOLBAR
 * Painel Frota
 *
 * Responsabilidade:
 *
 * - Controlar os botões da barra de ferramentas
 * - Botão Novo
 *
 * Não executa CRUD diretamente.
 * ============================================================
 */


export function createToolbar(
    config = {}
) {

    const container =
        config.container || null;

    const engine =
        config.engine || null;

    const options =
        config.options || {};


    // ========================================================
    // VALIDAR
    // ========================================================

    if (!container) {

        throw new Error(
            "Toolbar: container não informado."
        );

    }


    if (!engine) {

        throw new Error(
            "Toolbar: engine não informado."
        );

    }


    // ========================================================
    // ESTADO
    // ========================================================

    let btnNovo = null;


    // ========================================================
    // INICIAR
    // ========================================================

    function iniciar() {

        console.log(
            `TOOLBAR ${engine.entity} → INICIAR`
        );


        localizarElementos();

        registrarEventos();


        console.log(
            `TOOLBAR ${engine.entity} → INICIADO`
        );

    }


    // ========================================================
    // LOCALIZAR ELEMENTOS
    // ========================================================

    function localizarElementos() {

        btnNovo =
            container.querySelector(
                "[data-engine-novo]"
            );


        /*
         * Se o botão não existe, criar.
         */

        if (
            !btnNovo &&
            options.permitirNovo !== false
        ) {

            criarBotaoNovo();

        }


        if (btnNovo) {

            console.log(
                `TOOLBAR ${engine.entity} → BOTÃO NOVO ENCONTRADO`
            );

        } else {

            console.warn(
                `TOOLBAR ${engine.entity} → BOTÃO NOVO NÃO ENCONTRADO`
            );

        }

    }


    // ========================================================
    // CRIAR BOTÃO NOVO
    // ========================================================

    function criarBotaoNovo() {

        /*
         * Procurar a toolbar.
         */

        let toolbar =
            container.querySelector(
                "[data-engine-toolbar]"
            );


        /*
         * Se não existir, criar.
         */

        if (!toolbar) {

            toolbar =
                document.createElement(
                    "div"
                );


            toolbar.className =
                "engine-toolbar";


            toolbar.setAttribute(
                "data-engine-toolbar",
                ""
            );


            const header =
                container.querySelector(
                    ".engine-header"
                );


            if (header) {

                header.appendChild(
                    toolbar
                );

            } else {

                container.prepend(
                    toolbar
                );

            }

        }


        /*
         * Criar botão.
         */

        btnNovo =
            document.createElement(
                "button"
            );


        btnNovo.type =
            "button";


        btnNovo.className =
            "btn btn-primary";


        btnNovo.setAttribute(
            "data-engine-novo",
            ""
        );


        btnNovo.textContent =
            options.textoNovo ||
            "Novo";


        toolbar.appendChild(
            btnNovo
        );


        console.log(
            `TOOLBAR ${engine.entity} → BOTÃO NOVO CRIADO`
        );

    }


    // ========================================================
    // EVENTOS
    // ========================================================

    function registrarEventos() {

        if (!btnNovo) {

            return;

        }


        /*
         * Evitar registrar duas vezes.
         */

        if (
            btnNovo.dataset.engineEvento ===
            "true"
        ) {

            return;

        }


        btnNovo.dataset.engineEvento =
            "true";


        btnNovo.addEventListener(
            "click",
            evento => {

                evento.preventDefault();


                console.log(
                    `TOOLBAR ${engine.entity} → NOVO`
                );


                if (
                    typeof engine.novo ===
                    "function"
                ) {

                    engine.novo();

                }

            }
        );

    }


    // ========================================================
    // MOSTRAR
    // ========================================================

    function mostrar() {

        if (btnNovo) {

            btnNovo.hidden =
                false;

        }

    }


    // ========================================================
    // OCULTAR
    // ========================================================

    function ocultar() {

        if (btnNovo) {

            btnNovo.hidden =
                true;

        }

    }


    // ========================================================
    // API PÚBLICA
    // ========================================================

    return {

        iniciar,

        mostrar,

        ocultar,

        criarBotaoNovo

    };

}
