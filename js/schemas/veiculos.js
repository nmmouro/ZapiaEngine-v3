/**
 * ============================================================
 * SCHEMA — VEÍCULOS
 * Painel Frota
 * Arquivo: js/schemas/veiculos.js
 *
 * Responsabilidade:
 *
 * - Definir os campos da tabela VEÍCULOS
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
// SCHEMA VEÍCULOS
// ============================================================

export const SCHEMA_VEICULOS = {

    // ========================================================
    // IDENTIFICAÇÃO
    // ========================================================

    entity:
        "veiculos",


    table:
        "veiculos",


    title:
        "Cadastro de Veículos",


    // ========================================================
    // CAMPOS
    // ========================================================

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
        // PLACA
        // ----------------------------------------------------

        {
            name:
                "placa",

            label:
                "Placa",

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
        // MODELO
        // ----------------------------------------------------

        {
            name:
                "modelo",

            label:
                "Modelo",

            type:
                "text",

            required:
                true,

            visible:
                true
        },


        // ----------------------------------------------------
        // MARCA
        // ----------------------------------------------------

        {
            name:
                "marca",

            label:
                "Marca",

            type:
                "text",

            required:
                true,

            visible:
                true
        },


        // ----------------------------------------------------
        // ANO
        // ----------------------------------------------------

        {
            name:
                "ano",

            label:
                "Ano",

            type:
                "number",

            required:
                true,

            visible:
                true,

            min:
                1900,

            max:
                2100
        },


        // ----------------------------------------------------
        // COMBUSTÍVEL
        // ----------------------------------------------------

        {
            name:
                "combustivel",

            label:
                "Combustível",

            type:
                "select",

            required:
                true,

            visible:
                true,

            options: [

                {
                    value:
                        "gasolina",

                    label:
                        "Gasolina"
                },

                {
                    value:
                        "etanol",

                    label:
                        "Etanol"
                },

                {
                    value:
                        "flex",

                    label:
                        "Flex"
                },

                {
                    value:
                        "diesel",

                    label:
                        "Diesel"
                },

                {
                    value:
                        "eletrico",

                    label:
                        "Elétrico"
                }

            ]
        },


        // ----------------------------------------------------
        // COR
        // ----------------------------------------------------

        {
            name:
                "cor",

            label:
                "Cor",

            type:
                "text",

            required:
                false,

            visible:
                true
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
                        "Ativo"
                },

                {
                    value:
                        "manutencao",

                    label:
                        "Manutenção"
                },

                {
                    value:
                        "inativo",

                    label:
                        "Inativo"
                }

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

export default SCHEMA_VEICULOS;
