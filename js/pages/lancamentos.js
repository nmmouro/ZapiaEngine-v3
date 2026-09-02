/**
 * ============================================================
 * PÁGINA — VEÍCULOS
 * Painel Frota
 * Arquivo: js/pages/veiculos.js
 *
 * Responsabilidade:
 *
 * - Configurar o módulo VEÍCULOS
 * - Informar o schema
 * - Informar o container
 * - Definir opções da página
 *
 * Não executa CRUD diretamente.
 * Não conhece Supabase.
 * Não manipula formulário diretamente.
 * Não manipula tabela diretamente.
 *
 * ============================================================
 */

import { createModule } from "../engine/module.js";
import { SCHEMA_LANCAMENTOS } from "../schemas/lancamentos.js";


// ============================================================
// INICIALIZAÇÃO
// ============================================================

async function iniciarLancamentos() {

    console.log(
        "PÁGINA LANÇAMENTOS → INICIANDO"
    );


    const container =
        document.querySelector(
            "#app"
        );


    if (!container) {

        console.error(
            "PÁGINA LANÇAMENTOS → container #app não encontrado."
        );

        return;

    }


    // ========================================================
    // CRIAR MÓDULO
    // ========================================================

    const modulo =
        createModule({

            // ------------------------------------------------
            // ENTIDADE
            // ------------------------------------------------

            entity:
                "lancamentos",


            // ------------------------------------------------
            // SCHEMA
            // ------------------------------------------------

            schema:
                SCHEMA_LANCAMENTOS,


            // ------------------------------------------------
            // CONTAINER
            // ------------------------------------------------

            container:
                "#app",


            // ------------------------------------------------
            // NOME DO ESTADO
            // ------------------------------------------------

            stateName:
                "lancamentos",


            // ------------------------------------------------
            // OPÇÕES
            // ------------------------------------------------

            options: {

                titulo:
                    "Cadastro de Lancamentos",

                tabela:
                    "Lançamentos Cadastrados",

                permitirNovo:
                    true,

                permitirEditar:
                    true,

                permitirExcluir:
                    true,

                pageSize:
                    10

            }

        });


    // ========================================================
    // DISPONIBILIZAR PARA A PÁGINA
    // ========================================================

    window.lancamentos =
        modulo;

    await modulo.iniciar();

    console.log(
        "PÁGINA LANÇAMENTOS → MÓDULO CRIADO:",
        modulo
    );


    return modulo;

}


// ============================================================
// EXPORT
// ============================================================

export {
    iniciarLancamentos,
    iniciarLancamentos as iniciar
};
