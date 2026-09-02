/**
 * ============================================================
 * PÁGINA — EMPREGADOS
 * Painel Frota
 * Arquivo: js/pages/Empregados.js
 *
 * Responsabilidade:
 *
 * - Configurar o módulo EMPREGADOS
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
    SCHEMA_EMPREGADOS
} from "../schemas/empregados.js";


// ============================================================
// INICIALIZAÇÃO
// ============================================================

async function iniciarEmpregados() {

    console.log(
        "PÁGINA EMPREGADOS → INICIANDO"
    );


    const container =
        document.querySelector(
            "#app"
        );


    if (!container) {

        console.error(
            "PÁGINA EMPREGADOS → container #app não encontrado."
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
                "empregados",


            // ------------------------------------------------
            // SCHEMA
            // ------------------------------------------------

            schema:
                SCHEMA_EMPREGADOS,


            // ------------------------------------------------
            // CONTAINER
            // ------------------------------------------------

            container:
                "#app",


            // ------------------------------------------------
            // NOME DO ESTADO
            // ------------------------------------------------

            stateName:
                "empregados",


            // ------------------------------------------------
            // OPÇÕES
            // ------------------------------------------------

            options: {

                titulo:
                    "Cadastro de Empregados",

                tabela:
                    "Empregados Cadastrados",

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

    window.empregados =
        modulo;

    await modulo.iniciar();

    console.log(
        "PÁGINA EMPREGADOS → MÓDULO CRIADO:",
        modulo
    );


    return modulo;

}


// ============================================================
// EXPORT
// ============================================================

export {
    iniciarEmpregados,
    iniciarEmpregados as iniciar
};
