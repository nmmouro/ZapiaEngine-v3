/**
 * ============================================================
 * HEADER
 * Painel Frota
 *
 * Arquivo:
 *     js/components/header.js
 *
 * Responsabilidades:
 *
 * - Criar/controlar o Header
 * - Exibir logo
 * - Exibir título da página
 * - Exibir data no formato brasileiro
 * - Exibir hora HH:mm
 * - Atualizar relógio automaticamente
 * - Controlar Tela Cheia
 *
 * Não depende de:
 *
 * - Engine
 * - CRUD
 * - Supabase
 * - página específica
 *
 * ============================================================
 */


/* ============================================================
   CONFIGURAÇÃO
============================================================ */

const HEADER_CONFIG = {

    logo:

        "assets/logo.png",

    tituloPadrao:

        "Painel Frota",

    intervaloRelogio:

        1000

};


/* ============================================================
   ESTADO
============================================================ */

let intervaloRelogio = null;


/* ============================================================
   INICIAR HEADER
============================================================ */

export function iniciarHeader(config = {}) {

    const opcoes = {

        ...HEADER_CONFIG,

        ...config

    };


    console.log(
        "HEADER → INICIAR"
    );


    const header =
        localizarHeader();


    if (!header) {

        console.warn(
            "HEADER → elemento não encontrado."
        );

        return null;

    }


    montarHeader(
        header,
        opcoes
    );


    iniciarRelogio();


    iniciarTelaCheia(
        header
    );


    atualizarHeader();


    console.log(
        "HEADER → INICIADO"
    );


    return header;

}


/* ============================================================
   LOCALIZAR HEADER
============================================================ */

function localizarHeader() {

    let header =
        document.querySelector(
            "[data-header]"
        );


    if (header) {

        return header;

    }


    header =
        document.querySelector(
            "header"
        );


    if (header) {

        return header;

    }


    /*
     * Se não existir,
     * cria automaticamente.
     */

    header =
        document.createElement(
            "header"
        );


    header.dataset.header =
        "";


    document.body.prepend(
        header
    );


    return header;

}


/* ============================================================
   MONTAR HEADER
============================================================ */

function montarHeader(
    header,
    config
) {

    /*
     * Evita reconstruir
     * se já estiver pronto.
     */

    if (
        header.dataset.headerMontado ===
        "true"
    ) {

        atualizarLogo(
            header,
            config.logo
        );

        atualizarTitulo(
            header,
            config.tituloPadrao
        );

        return;

    }


    header.classList.add(
        "app-header"
    );


    header.innerHTML = `

        <div class="header-logo">

            <img
                data-header-logo
                src="${escaparAtributo(config.logo)}"
                alt="Logo"
            >

        </div>


        <div class="header-titulo">

            <h1
                data-header-titulo
            >
                ${escaparHTML(
                    obterTituloPagina(
                        config.tituloPadrao
                    )
                )}
            </h1>

        </div>


        <div class="header-acoes">

            <div class="header-datahora">

                <span
                    class="header-data"
                    data-header-data
                >
                    00/00/0000
                </span>

                <span
                    class="header-separador"
                >
                    -
                </span>

                <span
                    class="header-hora"
                    data-header-hora
                >
                    00:00
                </span>

            </div>


            <button
                type="button"
                class="header-fullscreen"
                data-header-fullscreen
                title="Tela Cheia"
                aria-label="Tela Cheia"
            >

                <span
                    class="header-fullscreen-icon"
                    data-header-fullscreen-icon
                >
                    ⛶
                </span>

                <span
                    class="header-fullscreen-text"
                >
                    Tela Cheia
                </span>

            </button>

        </div>

    `;


    header.dataset.headerMontado =
        "true";


    atualizarLogo(
        header,
        config.logo
    );


    atualizarTitulo(
        header,
        config.tituloPadrao
    );

}


/* ============================================================
   LOGO
============================================================ */

function atualizarLogo(
    header,
    logo
) {

    const imagem =
        header.querySelector(
            "[data-header-logo]"
        );


    if (!imagem) {

        return;

    }


    if (logo) {

        imagem.src =
            logo;

    }


    imagem.onerror = () => {

        console.warn(
            "HEADER → Logo não encontrada:",
            imagem.src
        );

        imagem.style.display =
            "none";

    };

}


/* ============================================================
   TÍTULO
============================================================ */

function atualizarTitulo(
    header,
    tituloPadrao
) {

    const elemento =
        header.querySelector(
            "[data-header-titulo]"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        obterTituloPagina(
            tituloPadrao
        );

}


/* ============================================================
   OBTER TÍTULO DA PÁGINA
============================================================ */

function obterTituloPagina(
    tituloPadrao
) {

    /*
     * 1. data-page-title
     */

    const atributo =
        document.body.dataset.pageTitle;


    if (atributo) {

        return atributo;

    }


    /*
     * 2. título configurado
     * no elemento principal.
     */

    const app =
        document.querySelector(
            "[data-page-title]"
        );


    if (
        app &&
        app.dataset.pageTitle
    ) {

        return app.dataset.pageTitle;

    }


    /*
     * 3. <title>
     */

    const titulo =
        document.title
            ?.trim();


    if (
        titulo &&
        titulo !== "Painel Frota"
    ) {

        return titulo;

    }


    /*
     * 4. padrão
     */

    return tituloPadrao;

}


/* ============================================================
   ATUALIZAR HEADER
============================================================ */

function atualizarHeader() {

    const data =
        document.querySelector(
            "[data-header-data]"
        );


    const hora =
        document.querySelector(
            "[data-header-hora]"
        );


    if (!data || !hora) {

        return;

    }


    const agora =
        new Date();


    data.textContent =
        formatarData(
            agora
        );


    hora.textContent =
        formatarHora(
            agora
        );

}


/* ============================================================
   RELÓGIO
============================================================ */

function iniciarRelogio() {

    if (intervaloRelogio) {

        clearInterval(
            intervaloRelogio
        );

    }


    atualizarHeader();


    intervaloRelogio =
        setInterval(
            atualizarHeader,
            HEADER_CONFIG.intervaloRelogio
        );

}


/* ============================================================
   FORMATAR DATA
============================================================ */

function formatarData(
    data
) {

    const dia =
        String(
            data.getDate()
        ).padStart(
            2,
            "0"
        );


    const mes =
        String(
            data.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const ano =
        data.getFullYear();


    return `${dia}/${mes}/${ano}`;

}


/* ============================================================
   FORMATAR HORA
============================================================ */

function formatarHora(
    data
) {

    const hora =
        String(
            data.getHours()
        ).padStart(
            2,
            "0"
        );


    const minuto =
        String(
            data.getMinutes()
        ).padStart(
            2,
            "0"
        );


    return `${hora}:${minuto}`;

}


/* ============================================================
   TELA CHEIA
============================================================ */

function iniciarTelaCheia(
    header
) {

    const botao =
        header.querySelector(
            "[data-header-fullscreen]"
        );


    if (!botao) {

        return;

    }


    /*
     * Evita registrar
     * o evento duas vezes.
     */

    if (
        botao.dataset.fullscreenEvento ===
        "true"
    ) {

        return;

    }


    botao.addEventListener(
        "click",
        alternarTelaCheia
    );


    botao.dataset.fullscreenEvento =
        "true";


    document.addEventListener(
        "fullscreenchange",
        atualizarBotaoTelaCheia
    );


    atualizarBotaoTelaCheia();

}


/* ============================================================
   ALTERNAR TELA CHEIA
============================================================ */

async function alternarTelaCheia() {

    try {

        if (
            !document.fullscreenElement
        ) {

            await document.documentElement
                .requestFullscreen();

        }

        else {

            await document.exitFullscreen();

        }

    }

    catch (erro) {

        console.error(
            "HEADER → ERRO TELA CHEIA:",
            erro
        );

    }

}


/* ============================================================
   ATUALIZAR BOTÃO TELA CHEIA
============================================================ */

function atualizarBotaoTelaCheia() {

    const botao =
        document.querySelector(
            "[data-header-fullscreen]"
        );


    const icone =
        document.querySelector(
            "[data-header-fullscreen-icon]"
        );


    const texto =
        document.querySelector(
            ".header-fullscreen-text"
        );


    if (!botao) {

        return;

    }


    const telaCheia =
        Boolean(
            document.fullscreenElement
        );


    if (telaCheia) {

        botao.title =
            "Sair da Tela Cheia";

        botao.setAttribute(
            "aria-label",
            "Sair da Tela Cheia"
        );


        if (icone) {

            icone.textContent =
                "⛶";

        }


        if (texto) {

            texto.textContent =
                "Sair";

        }

    }

    else {

        botao.title =
            "Tela Cheia";

        botao.setAttribute(
            "aria-label",
            "Tela Cheia"
        );


        if (icone) {

            icone.textContent =
                "⛶";

        }


        if (texto) {

            texto.textContent =
                "Tela Cheia";

        }

    }

}


/* ============================================================
   ATUALIZAR TÍTULO MANUALMENTE
============================================================ */

export function definirTituloHeader(
    titulo
) {

    const elemento =
        document.querySelector(
            "[data-header-titulo]"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        titulo || "Painel Frota";

}


/* ============================================================
   ESCAPAR HTML
============================================================ */

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


/* ============================================================
   ESCAPAR ATRIBUTO
============================================================ */

function escaparAtributo(
    valor
) {

    return escaparHTML(
        valor
    );

}


/* ============================================================
   EXPORT DEFAULT
============================================================ */

export default {

    iniciarHeader,

    definirTituloHeader

};
