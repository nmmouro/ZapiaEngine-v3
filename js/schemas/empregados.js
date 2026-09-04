/**
 * ============================================================
 * SCHEMA — EMPREGADOS
 * Painel Frota
 * Arquivo: js/schemas/empregados.js
 *
 * Responsabilidade:
 *
 * - Definir os campos da tabela EMPREGADOS
 * - Definir labels
 * - Definir tipos
 * - Definir campos visíveis na tabela
 * - Definir campos editáveis
 * - Definir campos obrigatórios
 * - Definir opções dos campos SELECT
 *
 * Não possui:
 *
 * - CRUD
 * - Supabase
 * - PostgreSQL
 * - HTML
 * - Eventos
 *
 * ============================================================
 */

// ============================================================
// SCHEMA EMPREGADOS
// ============================================================

export const SCHEMA_EMPREGADOS = {

entity:
        "empregados",


    table:
        "empregados",


    title:
        "Cadastro de Empregados",


fields: [

        // ----------------------------------------------------
        // ID
        // ----------------------------------------------------

        {
            name:
                "id",

            label:
                "ID",

            type:
                "text",

            visible:
                false,

            hidden:
                true,

            readonly:
                true,

            required:
                false
        },


        // ----------------------------------------------------
        // DATA DE CADASTRO
        // ----------------------------------------------------

        {
            name:
                "data_cadastro",

            label:
                "Data de Cadastro",

            type:
                "date",

            required:
                true,

            visible:
                true,

            readonly:
                false
        },


        // ----------------------------------------------------
        // FOTO
        // ----------------------------------------------------

        {
            name:
                "foto",

            label:
                "Foto",

            type:
                "text",

            required:
                false,

            visible:
                true
        },



        // ----------------------------------------------------
        // NOME
        // ----------------------------------------------------

        {
            name:
                "empregado",

            label:
                "Empregado",

            type:
                "text",

            required:
                true,

            visible:
                true,

            maxlength:
                10
        },


        // ----------------------------------------------------
        // MATRÍCULA
        // ----------------------------------------------------

        {
            name:
                "matricula",

            label:
                "Matrícula",

            type:
                "text",

            required:
                true,

            visible:
                true
        },


        // ----------------------------------------------------
        // DIRETORIA
        // ----------------------------------------------------

        {
            name:
                "diretoria",

            label:
                "Diretoria",

            type:
                "text",

            required:
                true,

            visible:
                true
        },


        // ----------------------------------------------------
        // SETOR
        // ----------------------------------------------------

        {
            name:
                "setor",

            label:
                "Setor",

            type:
                "text",

            required:
                true,

            visible:
                true
        },


        // ----------------------------------------------------
        // TELEFONE
        // ----------------------------------------------------

        {
            name:
                "tel",

            label:
                "Telefone",

            type:
                "text",

            required:
                true,

            visible:
                true
        },


         // ----------------------------------------------------
        // E-MAIL
        // ----------------------------------------------------

        {
            name:
                "email",

            label:
                "E-mail",

            type:
                "text",

            required:
                false,

            visible:
                true
        },

         // ----------------------------------------------------
        // CLASSIFICAÇÃO
        // ----------------------------------------------------

        {
            name:
                "classificacao",

            label:
                "Classificação",

            type:
                "select",

            required:
                true,

            visible:
                true,

            options: [

                {
                    value:
                        "admin",

                    label:
                        "Admin"
                },

                {
                    value:
                        "supervisor",

                    label:
                        "Supervisor"
                },

                {
                    value:
                        "motorista",

                    label:
                        "Motorista"
                },

                {
                    value:
                        "usuario",

                    label:
                        "Usuário"
                },
                
            ]
        },


        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        {
            name:
                "status",

            label:
                "Status",

            type:
                "select",

            required:
                true,

            visible:
                true,

            options: [

                {
                    value:
                        "ativo",

                    label:
                        "ATIVO"
                },
                
                {
                    value:
                        "inativo",

                    label:
                        "INATIVO"
                },

                {
                    value:
                        "ferias",

                    label:
                        "FÉRIAS"
                },


                {
                    value:
                        "viagem",

                    label:
                        "VIAGEM"
                },
        ]
        },


       // ----------------------------------------------------
        // CRIADO EM
        // ----------------------------------------------------

        {
            name:
                "criado_em",

            label:
                "Criado em",

            type:
                "datetime-local",

            required:
                false,

            visible:
                false,

            hidden:
                true,

            readonly:
                true
        },


        // ----------------------------------------------------
        // ATUALIZADO EM
        // ----------------------------------------------------

        {
            name:
                "atualizado_em",

            label:
                "Atualizado em",

            type:
                "datetime-local",

            required:
                false,

            visible:
                false,

            hidden:
                true,

            readonly:
                true
        }

    ]

};


// ============================================================
// EXPORT DEFAULT
// ============================================================

        
export default SCHEMA_EMPREGADOS;
