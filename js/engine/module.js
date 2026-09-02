/**
 * ============================================================
 * MODULE
 * Painel Frota
 *
 * Arquivo:
 *     js/engine/module.js
 *
 * Responsabilidade:
 *
 *     Conectar:
 *         Engine
 *         Form
 *         Table
 *         Toolbar
 *         State
 *         Schema
 *
 * Fluxo:
 *
 *     createModule()
 *          ↓
 *     prepararEstrutura()
 *          ↓
 *     createEngine()
 *          ↓
 *     createForm()
 *          ↓
 *     createTable()
 *          ↓
 *     createToolbar()
 *          ↓
 *     conectarComponentes()
 *          ↓
 *     iniciar()
 *
 * IMPORTANTE:
 *
 *     O Module NÃO acessa PostgreSQL.
 *     O Module NÃO acessa Supabase.
 *
 *     Backend:
 *         crud.js
 *         crudService.js
 *
 * ============================================================
 */


/* ============================================================
   IMPORTS
============================================================ */

import { createEngine } from "./engine.js";
import { createForm } from "./form.js";
import { createTable } from "./table.js";
import { createToolbar } from "./toolbar.js";


/* ============================================================
   CREATE MODULE
============================================================ */

export function createModule(config = {}) {

    console.log(
        "MODULE → CRIAR →",
        config.entity
    );


    /* ========================================================
       VALIDAR CONFIGURAÇÃO
    ======================================================== */

    if (!config || typeof config !== "object") {

        throw new Error(
            "Module: configuração inválida."
        );

    }


    if (!config.entity) {

        throw new Error(
            "Module: entidade não informada."
        );

    }


    if (!config.container) {

        throw new Error(
            `Module ${config.entity}: container não informado.`
        );

    }


    /* ========================================================
       CONFIGURAÇÕES
    ======================================================== */

    const entity =
        config.entity;

    const schema =
        config.schema || null;

    const options =
        config.options || {};


    /* ========================================================
       LOCALIZAR CONTAINER
    ======================================================== */

    const container =
        localizarContainer(
            config.container
        );


    if (!container) {

        throw new Error(
            `Module ${entity}: container não encontrado.`
        );

    }


    console.log(
        `MODULE ${entity} → CONTAINER LOCALIZADO`,
        container
    );


    /* ========================================================
       PREPARAR ESTRUTURA
    ======================================================== */

    const estrutura =
        prepararEstrutura(
            container
        );


    /* ========================================================
       CRIAR ENGINE
    ======================================================== */

    const engine =
        createEngine({

            entity,

            schema,

            container,

            options

        });


    if (!engine) {

        throw new Error(
            `Module ${entity}: createEngine() não retornou Engine.`
        );

    }


    /* ========================================================
       CRIAR FORM
    ======================================================== */

    const form =
        createForm({

            engine,

            schema,

            container: estrutura.form,

            options,

            entity

        });


    if (!form) {

        throw new Error(
            `Module ${entity}: createForm() não retornou Form.`
        );

    }


    /* ========================================================
       CRIAR TABLE
    ======================================================== */

    const table =
        createTable({

            engine,

            schema,

            container: estrutura.table,

            options,

            entity

        });


    if (!table) {

        throw new Error(
            `Module ${entity}: createTable() não retornou Table.`
        );

    }


    /* ========================================================
       CRIAR TOOLBAR
    ======================================================== */

    const toolbar =
        createToolbar({

            engine,

            schema,

            container: estrutura.toolbar,

            options,

            entity

        });


    if (!toolbar) {

        throw new Error(
            `Module ${entity}: createToolbar() não retornou Toolbar.`
        );

    }


    /* ========================================================
       CONECTAR COMPONENTES AO ENGINE
    ======================================================== */

    conectarComponentes({

        engine,

        form,

        table,

        toolbar

    });


    /* ========================================================
       API PÚBLICA DO MODULE
    ======================================================== */

    const module = {

        /* ----------------------------------------------------
           PROPRIEDADES
        ---------------------------------------------------- */

        entity,

        schema,

        options,

        container,

        engine,

        form,

        table,

        toolbar,


        /* ----------------------------------------------------
           INICIAR
        ---------------------------------------------------- */

        async iniciar() {

            console.log(
                `MODULE → INICIAR → ${entity}`
            );


            try {

           
/* ============================================
   FORM
============================================ */

if (
    form &&
    typeof form.iniciar === "function"
) {

    await form.iniciar();

}


/* ============================================
   TABLE
============================================ */

if (
    table &&
    typeof table.iniciar === "function"
) {

    await table.iniciar();

}


/* ============================================
   TOOLBAR
============================================ */

if (
    toolbar &&
    typeof toolbar.iniciar === "function"
) {

    await toolbar.iniciar();

}


/* ============================================
   VINCULAR COMPONENTES AO ENGINE
============================================ */

if (
    engine &&
    typeof engine.setComponents === "function"
) {

    engine.setComponents({

        form,
        table,
        toolbar

    });

}


/* ============================================
   ENGINE
============================================ */

if (
    engine &&
    typeof engine.iniciar === "function"
) {

    await engine.iniciar();

}


console.log(
    `MODULE → INICIADO → ${entity}`
);


return module;



            }

            catch (erro) {

                console.error(
                    `Module ${entity}: falha na inicialização`,
                    erro
                );

                throw erro;

            }

        },


        /* ----------------------------------------------------
           CARREGAR
        ---------------------------------------------------- */

        carregar() {

            if (
                engine &&
                typeof engine.carregar === "function"
            ) {

                return engine.carregar();

            }

        },


        /* ----------------------------------------------------
           RECARREGAR
        ---------------------------------------------------- */

        recarregar() {

            if (
                engine &&
                typeof engine.recarregar === "function"
            ) {

                return engine.recarregar();

            }

            return this.carregar();

        },


        /* ----------------------------------------------------
           NOVO
        ---------------------------------------------------- */

        novo() {

            if (
                engine &&
                typeof engine.novo === "function"
            ) {

                return engine.novo();

            }

        },


        /* ----------------------------------------------------
           EDITAR
        ---------------------------------------------------- */

        editar(id) {

            if (
                engine &&
                typeof engine.editar === "function"
            ) {

                return engine.editar(id);

            }

        },


        /* ----------------------------------------------------
           SALVAR
        ---------------------------------------------------- */

        salvar(dados) {

            if (
                engine &&
                typeof engine.salvar === "function"
            ) {

                return engine.salvar(dados);

            }

        },


        /* ----------------------------------------------------
           EXCLUIR
        ---------------------------------------------------- */

        excluir(id) {

            if (
                engine &&
                typeof engine.excluir === "function"
            ) {

                return engine.excluir(id);

            }

        },


        /* ----------------------------------------------------
           FILTRAR
        ---------------------------------------------------- */

        filtrar(valor) {

            if (
                engine &&
                typeof engine.filtrar === "function"
            ) {

                return engine.filtrar(valor);

            }

        },


        /* ----------------------------------------------------
           PAGINAÇÃO
        ---------------------------------------------------- */

        pagina(numero) {

            if (
                engine &&
                typeof engine.pagina === "function"
            ) {

                return engine.pagina(numero);

            }

        },


        /* ----------------------------------------------------
           FECHAR FORMULÁRIO
        ---------------------------------------------------- */

        fecharFormulario() {

            if (
                engine &&
                typeof engine.fecharFormulario === "function"
            ) {

                return engine.fecharFormulario();

            }

        },


        /* ----------------------------------------------------
           ACTION
        ---------------------------------------------------- */

        action(nome, registro) {

            if (
                engine &&
                typeof engine.action === "function"
            ) {

                return engine.action(
                    nome,
                    registro
                );

            }

        }

    };


    /* ========================================================
       EXPOR MODULE NO CONTAINER
    ======================================================== */

    container.__module =
        module;


    container.__engine =
        engine;


    container.__form =
        form;


    container.__table =
        table;


    container.__toolbar =
        toolbar;


    /* ========================================================
       RETORNAR MODULE

       A inicialização é responsabilidade do bootstrap app.js.
       Isso evita inicialização dupla quando o módulo é carregado
       dinamicamente pelo APP.
    ======================================================== */

    return module;

}


/* ============================================================
   LOCALIZAR CONTAINER
============================================================ */

function localizarContainer(
    referencia
) {

    if (!referencia) {

        return null;

    }


    /* --------------------------------------------------------
       SELECTOR
    -------------------------------------------------------- */

    if (
        typeof referencia === "string"
    ) {

        return document.querySelector(
            referencia
        );

    }


    /* --------------------------------------------------------
       ELEMENTO DOM
    -------------------------------------------------------- */

    if (
        referencia instanceof HTMLElement
    ) {

        return referencia;

    }


    /* --------------------------------------------------------
       JQUERY / OBJETO COM ELEMENTO
    -------------------------------------------------------- */

    if (
        referencia &&
        referencia.nodeType === 1
    ) {

        return referencia;

    }


    return null;

}


/* ============================================================
   PREPARAR ESTRUTURA
============================================================ */

function prepararEstrutura(
    container
) {

    console.log(
        "MODULE → PREPARAR ESTRUTURA"
    );


    /* ========================================================
       TOOLBAR
    ======================================================== */

    let toolbar =
        container.querySelector(
            ":scope > [data-engine-toolbar]"
        );


    if (!toolbar) {

        toolbar =
            document.createElement(
                "div"
            );


        toolbar.setAttribute(
            "data-engine-toolbar",
            ""
        );


        toolbar.className =
            "engine-toolbar";


        /*
         * Toolbar deve ficar no topo.
         */

        container.prepend(
            toolbar
        );

    }


    /* ========================================================
       FORM
    ======================================================== */

    let form =
        container.querySelector(
            ":scope > [data-engine-form]"
        );


    if (!form) {

        form =
            document.createElement(
                "div"
            );


        form.setAttribute(
            "data-engine-form",
            ""
        );


        form.className =
            "engine-form-container";


        /*
         * Form fica antes da tabela.
         */

        container.appendChild(
            form
        );

    }


    /* ========================================================
       TABLE
    ======================================================== */

    let table =
        container.querySelector(
            ":scope > [data-engine-table]"
        );


    if (!table) {

        table =
            document.createElement(
                "div"
            );


        table.setAttribute(
            "data-engine-table",
            ""
        );


        table.className =
            "engine-table-container";


        container.appendChild(
            table
        );

    }


    /* ========================================================
       GARANTIR ORDEM
       
       Toolbar
       Form
       Table
    ======================================================== */

    container.prepend(
        toolbar
    );


    container.appendChild(
        form
    );


    container.appendChild(
        table
    );


    /* ========================================================
       LOG
    ======================================================== */

    console.log(
        "MODULE → ESTRUTURA PRONTA",
        {
            toolbar,
            form,
            table
        }
    );


    return {

        toolbar,

        form,

        table

    };

}


/* ============================================================
   CONECTAR COMPONENTES
============================================================ */

function conectarComponentes(
    {
        engine,
        form,
        table,
        toolbar
    }
) {

    if (!engine) {

        throw new Error(
            "Module: Engine não informado."
        );

    }


    /* ========================================================
       ENGINE → FORM
    ======================================================== */

    engine.form =
        form;


    /* ========================================================
       ENGINE → TABLE
    ======================================================== */

    engine.table =
        table;


    /* ========================================================
       ENGINE → TOOLBAR
    ======================================================== */

    engine.toolbar =
        toolbar;


    /* ========================================================
       COMPONENTES → ENGINE
    ======================================================== */

    if (
        form &&
        !form.engine
    ) {

        form.engine =
            engine;

    }


    if (
        table &&
        !table.engine
    ) {

        table.engine =
            engine;

    }


    if (
        toolbar &&
        !toolbar.engine
    ) {

        toolbar.engine =
            engine;

    }


    /* ========================================================
       MÉTODO OPCIONAL DO ENGINE
       
       Se uma versão futura do engine possuir:
       
           engine.configurarComponentes(...)
       
       usamos também esse método.
    ======================================================== */

    if (
        typeof engine.configurarComponentes === "function"
    ) {

        engine.configurarComponentes({

            form,

            table,

            toolbar

        });

    }


    /* ========================================================
       LOG
    ======================================================== */

    console.log(
        "MODULE → COMPONENTES CONECTADOS",
        {
            engine,
            form,
            table,
            toolbar
        }
    );

}


/* ============================================================
   EXPORT DEFAULT
============================================================ */

export default {

    createModule

};
