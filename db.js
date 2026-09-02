// ============================================================================
// DATABASE
// Painel Frota
// Arquivo: db.js
//
// Conexão com o Supabase.
//
// IMPORTANTE:
// Este arquivo roda SOMENTE no servidor (Node.js).
//
// Nunca importe db.js dentro de arquivos:
//   - HTML
//   - frontend
//   - Engine
//   - pages
//
// As credenciais devem estar no arquivo .env.
// ============================================================================

import "dotenv/config";

import {
    createClient
} from "@supabase/supabase-js";


// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const SUPABASE_URL =
    process.env.SUPABASE_URL;


const SUPABASE_SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY;


// ============================================================================
// VALIDAR CONFIGURAÇÃO
// ============================================================================

if (!SUPABASE_URL) {

    throw new Error(
        "DB: SUPABASE_URL não configurada no arquivo .env."
    );

}


if (!SUPABASE_SERVICE_ROLE_KEY) {

    throw new Error(
        "DB: SUPABASE_SERVICE_ROLE_KEY não configurada no arquivo .env."
    );

}


// ============================================================================
// CLIENTE SUPABASE
// ============================================================================
//
// A Service Role Key permite que o backend execute operações administrativas
// no banco.
//
// Ela NUNCA deve ser enviada para o navegador.
//
// ============================================================================

export const supabase =
    createClient(

        SUPABASE_URL,

        SUPABASE_SERVICE_ROLE_KEY,

        {
            auth: {

                autoRefreshToken:
                    false,

                persistSession:
                    false

            }

        }

    );


// ============================================================================
// TESTAR CONEXÃO
// ============================================================================

export async function testarConexao() {

    try {

        const {
            error
        } = await supabase

            .from("veiculos")

            .select("id")

            .limit(1);


        if (error) {

            throw error;

        }


        console.log(
            "DB: conexão com Supabase estabelecida."
        );


        return true;

    } catch (erro) {

        console.error(
            "DB: erro ao conectar ao Supabase:",
            erro.message
        );


        return false;

    }

}


// ============================================================================
// EXPORTAÇÃO
// ============================================================================

export default supabase;
