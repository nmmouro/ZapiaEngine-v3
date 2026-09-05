/**
 * ============================================================
 * PÁGINA — CHECKLIST
 * Painel Frota
 * ============================================================
 */

import { createModule } from "../engine/module.js";
import { SCHEMA_CHECKLIST } from "../schemas/checklist.js";


let moduloChecklist = null;


/* ============================================================
   INICIAR
============================================================ */

async function iniciarChecklist() {

    console.log(
        "PÁGINA CHECKLIST → INICIANDO"
    );


    const container =
        document.querySelector("#app");


    if (!container) {

        console.error(
            "PÁGINA CHECKLIST → #app não encontrado."
        );

        return;

    }


    moduloChecklist =
        createModule({

            entity: "checklist",

            schema: SCHEMA_CHECKLIST,

            container: "#app",

            stateName: "checklist",

            options: {

                titulo:
                    "Checklist",

                tabela:
                    "Checklists",

                permitirNovo:
                    true,

                permitirEditar:
                    true,

                permitirExcluir:
                    false,

                pageSize:
                    10,

                colunas: [

                    {
                        name: "data",
                        label: "Data"
                    },

                    {
                        name: "hora",
                        label: "Hora"
                    },

                    {
                        name: "empregado_matricula",
                        label: "Empregado / Matrícula"
                    },

                    {
                        name: "veiculo",
                        label: "Veículo / Modelo"
                    },

                    {
                        name: "observacoes",
                        label: "Observações"
                    }

                ]

            }

        });


    window.checklist =
        moduloChecklist;


    await moduloChecklist.iniciar();


    console.log(
        "PÁGINA CHECKLIST → INICIADO"
    );


    return moduloChecklist;

}


/* ============================================================
   EXPORT
============================================================ */

export {

    iniciarChecklist,

    iniciarChecklist as iniciar

};
