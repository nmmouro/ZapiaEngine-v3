/**
 * ============================================================
 * PAINEL FROTA
 * APP.JS
 * ============================================================
 *
 * Bootstrap principal da aplicação.
 *
 * Este arquivo:
 *
 * - detecta a página
 * - carrega o módulo correspondente
 * - inicializa a página
 *
 * NÃO utiliza:
 *
 * - localStorage
 * - sessionStorage
 * - cookies
 * - IndexedDB
 * - spa-maker
 * - notifications
 *
 * ============================================================
 */

(() => {

    "use strict";


    /* ========================================================
       EVITAR DUPLA INICIALIZAÇÃO
    ======================================================== */

    if (
        window.__PAINEL_FROTA_APP_INICIADO__
    ) {

        console.warn(
            "APP → já inicializado"
        );

        return;

    }


    window.__PAINEL_FROTA_APP_INICIADO__ =
        true;


    /* ========================================================
       CONFIGURAÇÃO
    ======================================================== */

    const config = {

        container: "#app",

        paginaPadrao: "home"

    };


    /* ========================================================
       LOG INICIAL
    ======================================================== */

    console.log(
        "APP → INICIANDO PAINEL FROTA"
    );


    /* ========================================================
       INICIAR
    ======================================================== */

    async function iniciar() {

        console.log(
            "APP → INICIAR"
        );


        /*
         * ----------------------------------------------------
         * CONTAINER
         * ----------------------------------------------------
         */

        const container =
            document.querySelector(
                config.container
            );


        if (!container) {

            console.error(
                "APP → #app não encontrado"
            );

            return;

        }


        /*
         * ----------------------------------------------------
         * PÁGINA
         * ----------------------------------------------------
         */

        const pagina =
            detectarPagina();


        console.log(
            "APP → PÁGINA:",
            pagina
        );


        /*
         * ----------------------------------------------------
         * CARREGAR
         * ----------------------------------------------------
         */

        try {

            const resultado =
                await carregarPagina(
                    pagina
                );


            console.log(
                "APP → PÁGINA CARREGADA:",
                pagina
            );


            console.log(
                "APP → RESULTADO:",
                resultado
            );


        } catch (erro) {

            console.error(
                "APP → ERRO AO CARREGAR:",
                erro
            );


            mostrarErro(
                container,
                erro
            );

        }

    }


    /* ========================================================
       DETECTAR PÁGINA
    ======================================================== */

    function detectarPagina() {

        const body =
            document.body;


        /*
         * ----------------------------------------------------
         * DATA-PAGE
         * ----------------------------------------------------
         */

        if (body) {

            const dataPage =
                body.getAttribute(
                    "data-page"
                );


            if (dataPage) {

                return normalizarPagina(
                    dataPage
                );

            }

        }


        /*
         * ----------------------------------------------------
         * DATA-MODULE
         * ----------------------------------------------------
         */

        if (body) {

            const dataModule =
                body.getAttribute(
                    "data-module"
                );


            if (dataModule) {

                return normalizarPagina(
                    dataModule
                );

            }

        }


        /*
         * ----------------------------------------------------
         * NOME DO ARQUIVO
         * ----------------------------------------------------
         */

        const caminho =
            window.location.pathname
                .toLowerCase();


        if (
            caminho.endsWith(
                "/veiculos.html"
            )
        ) {

            return "veiculos";

        }


        if (
            caminho.endsWith(
                "/empregados.html"
            )
        ) {

            return "empregados";

        }


        if (
            caminho.endsWith(
                "/abastecimentos.html"
            )
        ) {

            return "abastecimentos";

        }


        if (
            caminho.endsWith(
                "/checklist.html"
            )
        ) {

            return "checklist";

        }


        if (
            caminho.endsWith(
                "/avarias.html"
            )
        ) {

            return "avarias";

        }


        if (
            caminho.endsWith(
                "/lancamentos.html"
            )
        ) {

            return "lancamentos";

        }


        if (
            caminho.endsWith(
                "/dashboard.html"
            )
        ) {

            return "dashboard";

        }


        /*
         * ----------------------------------------------------
         * RAIZ / INDEX
         * ----------------------------------------------------
         */

        return config.paginaPadrao;

    }


    /* ========================================================
       NORMALIZAR
    ======================================================== */

    function normalizarPagina(
        pagina
    ) {

        return String(
            pagina || ""
        )
            .trim()
            .toLowerCase()
            .replace(
                /\.html$/,
                ""
            );

    }


    /* ========================================================
       CARREGAR PÁGINA
    ======================================================== */

    async function carregarPagina(
        pagina
    ) {

        switch (pagina) {


            /* =================================================
               HOME
            ================================================= */

            case "":

            case "home":

            case "index":

                console.log(
                    "APP → HOME"
                );


                /*
                 * O index.html já possui
                 * seu próprio conteúdo.
                 */

                return {

                    pagina: "home",

                    inicializado: true

                };


            /* =================================================
               VEÍCULOS
            ================================================= */

            case "veiculos": {

                console.log(
                    "APP → CARREGANDO VEÍCULOS"
                );


                const modulo =
                    await import(
                        "./pages/veiculos.js"
                    );


                return executarModulo(
                    modulo,
                    "VEÍCULOS"
                );

            }


            /* =================================================
               EMPREGADOS
            ================================================= */

            case "empregados": {

                console.log(
                    "APP → CARREGANDO EMPREGADOS"
                );


                const modulo =
                    await import(
                        "./pages/empregados.js"
                    );


                return executarModulo(
                    modulo,
                    "EMPREGADOS"
                );

            }


            /* =================================================
               ABASTECIMENTOS
            ================================================= */

            case "abastecimentos": {

                console.log(
                    "APP → CARREGANDO ABASTECIMENTOS"
                );

                const modulo =
                    await import(
                        "./pages/abastecimentos.js"
                    );

                return executarModulo(
                    modulo,
                    "ABASTECIMENTOS"
                );

            }


            /* =================================================
               AVARIAS
            ================================================= */

            case "avarias": {

                console.log(
                    "APP → CARREGANDO AVARIAS"
                );

                const modulo =
                    await import(
                        "./pages/avarias.js"
                    );

                return executarModulo(
                    modulo,
                    "AVARIAS"
                );

            }


            /* =================================================
               CHECKLIST
            ================================================= */

            case "checklist": {

                console.log(
                    "APP → CARREGANDO CHECKLIST"
                );

                const modulo =
                    await import(
                        "./pages/checklist.js"
                    );

                return executarModulo(
                    modulo,
                    "CHECKLIST"
                );

            }


            /* =================================================
               LANÇAMENTOS
            ================================================= */

            case "lancamentos": {

                console.log(
                    "APP → CARREGANDO LANÇAMENTOS"
                );


                const modulo =
                    await import(
                        "./pages/lancamentos.js"
                    );


                return executarModulo(
                    modulo,
                    "LANÇAMENTOS"
                );

            }


            /* =================================================
               DASHBOARD
            ================================================= */

            case "dashboard": {

                console.log(
                    "APP → CARREGANDO DASHBOARD"
                );


                const modulo =
                    await import(
                        "./pages/dashboard.js"
                    );


                return executarModulo(
                    modulo,
                    "DASHBOARD"
                );

            }


            /* =================================================
               DESCONHECIDO
            ================================================= */

            default:

                throw new Error(
                    `Página não reconhecida: ${pagina}`
                );

        }

    }


    /* ========================================================
       EXECUTAR MÓDULO
    ======================================================== */

    async function executarModulo(
        modulo,
        nome
    ) {

        if (!modulo) {

            throw new Error(
                `Módulo ${nome} não carregado.`
            );

        }


        /*
         * ----------------------------------------------------
         * iniciar()
         * ----------------------------------------------------
         */

        if (
            typeof modulo.iniciar ===
            "function"
        ) {

            console.log(
                `APP → ${nome} → iniciar()`
            );


            return await modulo.iniciar();

        }




        /*
         * ----------------------------------------------------
         * init()
         * ----------------------------------------------------
         */

        if (
            typeof modulo.init ===
            "function"
        ) {

            console.log(
                `APP → ${nome} → init()`
            );


            return await modulo.init();

        }


        /*
         * ----------------------------------------------------
         * default
         * ----------------------------------------------------
         */

        if (
            modulo.default !==
            undefined
        ) {

            if (
                typeof modulo.default ===
                "function"
            ) {

                console.log(
                    `APP → ${nome} → default()`
                );


                return await modulo.default();

            }


            return modulo.default;

        }


        /*
         * ----------------------------------------------------
         * MÓDULO JÁ EXECUTADO
         * ----------------------------------------------------
         */

        console.log(
            `APP → ${nome} → módulo carregado`
        );


        return modulo;

    }


    /* ========================================================
       MOSTRAR ERRO
    ======================================================== */

    function mostrarErro(
        container,
        erro
    ) {

        const mensagem =
            erro instanceof Error
                ? erro.message
                : String(erro);


        container.innerHTML = `

            <section
                class="engine-error"
                role="alert"
            >

                <h2>
                    Erro ao carregar a aplicação
                </h2>

                <p>
                    ${escaparHTML(
                        mensagem
                    )}
                </p>

                <button
                    type="button"
                    data-app-recarregar
                >
                    Recarregar
                </button>

            </section>

        `;


        const botao =
            container.querySelector(
                "[data-app-recarregar]"
            );


        if (botao) {

            botao.addEventListener(
                "click",
                () => {

                    window.location.reload();

                }
            );

        }

    }


    /* ========================================================
       ESCAPAR HTML
    ======================================================== */

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


    /* ========================================================
       DOM
    ======================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            iniciar,
            {
                once: true
            }
        );

    } else {

        iniciar();

    }

})();
