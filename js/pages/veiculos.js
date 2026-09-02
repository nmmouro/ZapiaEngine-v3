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

import {
    SCHEMA_VEICULOS
} from "../schemas/veiculos.js";


// ============================================================
// INICIALIZAÇÃO
// ============================================================

async function iniciarVeiculos() {

    console.log(
        "PÁGINA VEÍCULOS → INICIANDO"
    );


    const container =
        document.querySelector(
            "#app"
        );


    if (!container) {

        console.error(
            "PÁGINA VEÍCULOS → container #app não encontrado."
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
                "veiculos",


            // ------------------------------------------------
            // SCHEMA
            // ------------------------------------------------

            schema:
                SCHEMA_VEICULOS,


            // ------------------------------------------------
            // CONTAINER
            // ------------------------------------------------

            container:
                "#app",


            // ------------------------------------------------
            // NOME DO ESTADO
            // ------------------------------------------------

            stateName:
                "veiculos",


            // ------------------------------------------------
            // OPÇÕES
            // ------------------------------------------------

            options: {

                titulo:
                    "Cadastro de Veículos",

                tabela:
                    "Veículos Cadastrados",

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

    window.veiculos =
        modulo;

    await modulo.iniciar();

    console.log(
        "PÁGINA VEÍCULOS → MÓDULO CRIADO:",
        modulo
    );


    return modulo;

}


// ============================================================
// EXPORT
// ============================================================

export {
    iniciarVeiculos,
    iniciarVeiculos as iniciar
};
