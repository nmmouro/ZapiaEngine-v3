/**
 * ============================================================
 * CONFIG
 * Painel Frota
 *
 * Arquivo:
 * js/config/config.js
 *
 * Configurações globais da aplicação.
 *
 * ============================================================
 */


// ============================================================
// CONFIGURAÇÃO PRINCIPAL
// ============================================================

const CONFIG = {

    // ========================================================
    // API
    // ========================================================

    api: {

        /*
         * URL da API REST do Supabase.
         */

        url:
            "https://iomekawabacmuhlltket.supabase.co/rest/v1/",


        /*
         * Chave pública utilizada pelo frontend.
         *
         * IMPORTANTE:
         *
         * Use aqui a sua chave anon/public do Supabase.
         *
         * NÃO coloque service_role.
         */

        key:
            "sb_publishable_KWT8pnUIjfTWVK1hLnP0_w_ljRm2o4-",


        /*
         * Nome do schema PostgreSQL.
         */

        schema:
            "public",


        /*
         * Tempo máximo da requisição.
         */

        timeout:
            15000

    },


    // ========================================================
    // ENGINE
    // ========================================================

    engine: {

        autoRefresh:
            false,

        pageSize:
            10,

        cache:
            false

    },


    // ========================================================
    // UI
    // ========================================================

    ui: {

        animation:
            true,

        locale:
            "pt-BR"

    }

};


// ============================================================
// EXPORT NOMEADO
// ============================================================

export {
    CONFIG
};


// ============================================================
// EXPORT DEFAULT
// ============================================================

export default CONFIG;
