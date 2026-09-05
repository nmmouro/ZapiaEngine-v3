/**
 * ============================================================
 * CRUD SERVICE
 * Painel Frota
 * Arquivo: crudService.js
 *
 * Camada de comunicação com o backend.
 *
 * Backend atual:
 *
 *     PostgreSQL
 *     Supabase REST API
 *
 * Responsabilidade:
 *
 * - Montar URL
 * - Enviar API Key
 * - Executar GET
 * - Executar POST
 * - Executar PATCH
 * - Executar DELETE
 * - Tratar respostas HTTP
 *
 * NÃO conhece:
 *
 * - Engine
 * - Form
 * - Table
 * - Toolbar
 * - HTML
 *
 * ============================================================
 */


// ============================================================
// CONFIGURAÇÃO
// ============================================================

import { CONFIG } from "../config/config.js";


// ============================================================
// CONFIGURAÇÃO DA API
// ============================================================

const API_URL =
    String(
        CONFIG?.api?.url || ""
    )
    .trim()
    .replace(
        /\/+$/,
        ""
    );


const API_KEY =
    String(
        CONFIG?.api?.key || ""
    )
    .trim();


const TOKEN =
    String(
        CONFIG?.api?.token ||
        API_KEY
    )
    .trim();


// ============================================================
// VALIDAÇÃO
// ============================================================

if (!API_URL) {

    console.error(
        "CRUD SERVICE → URL DA API NÃO CONFIGURADA."
    );

}


if (!API_KEY) {

    console.warn(
        "CRUD SERVICE → API KEY NÃO CONFIGURADA."
    );

}


// ============================================================
// HEADERS
// ============================================================

function obterHeaders(
    incluirJSON = false
) {

    const headers = {

        "apikey":
            API_KEY,

        "Authorization":
            `Bearer ${TOKEN}`

    };


    if (
        incluirJSON
    ) {

        headers[
            "Content-Type"
        ] =
            "application/json";


        headers[
            "Prefer"
        ] =
            "return=representation";

    }


    return headers;

}


// ============================================================
// VALIDAR ENTIDADE
// ============================================================

function validarEntidade(
    entity
) {

    const nome =
        String(
            entity || ""
        )
        .trim()
        .toLowerCase();


    if (!nome) {

        throw new Error(
            "CRUD SERVICE: entidade não informada."
        );

    }


    /*
     * Evita que caracteres inválidos
     * sejam inseridos na URL.
     */

    if (
        !/^[a-zA-Z0-9_]+$/.test(
            nome
        )
    ) {

        throw new Error(
            `CRUD SERVICE: entidade inválida: ${nome}`
        );

    }


    return nome;

}


// ============================================================
// VALIDAR API
// ============================================================

function validarAPI() {

    if (!API_URL) {

        throw new Error(
            "CRUD SERVICE: CONFIG.api.url não configurada."
        );

    }


    if (!API_KEY) {

        throw new Error(
            "CRUD SERVICE: CONFIG.api.key não configurada."
        );

    }

}


// ============================================================
// ERRO HTTP
// ============================================================

async function criarErroHTTP(
    resposta
) {

    let detalhe =
        "";


    try {

        const texto =
            await resposta.text();


        if (
            texto
        ) {

            try {

                const json =
                    JSON.parse(
                        texto
                    );


                detalhe =
                    json?.message ||
                    json?.error ||
                    json?.hint ||
                    json?.details ||
                    texto;

            }

            catch {

                detalhe =
                    texto;

            }

        }

    }

    catch {

        detalhe =
            "";

    }


    const mensagem =
        detalhe ||

        `Erro HTTP ${resposta.status}.`;


    const erro =
        new Error(
            mensagem
        );


    erro.status =
        resposta.status;


    erro.statusText =
        resposta.statusText;


    erro.url =
        resposta.url;


    return erro;

}


// ============================================================
// EXECUTAR REQUEST
// ============================================================

async function request(
    url,
    options = {}
) {

    validarAPI();


    console.log(
        "CRUD SERVICE → MÉTODO:",
        options.method || "GET"
    );


    console.log(
        "CRUD SERVICE → URL:",
        url
    );


    console.log(
        "CRUD SERVICE → API KEY:",
        API_KEY
            ? "ENVIADA"
            : "NÃO ENVIADA"
    );


    const resposta =
        await fetch(
            url,
            {

                ...options,

                headers: {

                    ...obterHeaders(
                        Boolean(
                            options.body
                        )
                    ),

                    ...(options.headers || {})

                }

            }
        );


    console.log(
        "CRUD SERVICE → RESPOSTA HTTP:",
        resposta.status
    );


    if (
        !resposta.ok
    ) {

        const erro =
            await criarErroHTTP(
                resposta
            );


        console.error(
            "CRUD SERVICE → ERRO HTTP:",
            erro
        );


        throw erro;

    }


    /*
     * DELETE pode retornar
     * resposta vazia.
     */

    if (
        resposta.status === 204
    ) {

        return null;

    }


    const texto =
        await resposta.text();


    if (
        !texto
    ) {

        return null;

    }


    try {

        return JSON.parse(
            texto
        );

    }

    catch {

        return texto;

    }

}


// ============================================================
// URL DA TABELA
// ============================================================

function tabelaURL(
    entity
) {

    const tabela =
        validarEntidade(
            entity
        );


    return `${API_URL}/${tabela}`;

}


// ============================================================
// ESCAPAR VALOR PARA QUERY
// ============================================================

function queryValue(
    valor
) {

    return encodeURIComponent(
        String(
            valor
        )
    );

}


// ============================================================
// LISTAR
// ============================================================

export async function listar(
    entity,
    filtros = {}
) {

    const tabela =
        tabelaURL(
            entity
        );


    const parametros =
        new URLSearchParams();


    /*
     * Filtros simples:
     *
     * {
     *     status: "ativo",
     *     placa: "ABC1234"
     * }
     */

    Object.entries(
        filtros || {}
    )
    .forEach(

        ([campo, valor]) => {

            if (
                valor === undefined ||
                valor === null ||
                valor === ""
            ) {

                return;

            }


            parametros.set(
                campo,
                `eq.${valor}`
            );

        }

    );


    const url =
        parametros.toString()

            ? `${tabela}?${parametros.toString()}`

            : tabela;


    console.log(
        `CRUD SERVICE: LISTAR ${entity}`
    );


    const resposta =
        await request(
            url,
            {
                method: "GET"
            }
        );


    /*
     * Supabase normalmente retorna:
     *
     * [
     *     {...},
     *     {...}
     * ]
     */

    if (
        Array.isArray(
            resposta
        )
    ) {

        return resposta;

    }


    /*
     * Compatibilidade com
     * possíveis wrappers.
     */

    if (
        resposta &&
        Array.isArray(
            resposta.data
        )
    ) {

        return resposta.data;

    }


    if (
        resposta &&
        Array.isArray(
            resposta.dados
        )
    ) {

        return resposta.dados;

    }


    return [];

}


// ============================================================
// OBTER
// ============================================================

export async function obter(
    entity,
    id
) {

    const identificador =
        String(
            id ?? ""
        )
        .trim();


    if (!identificador) {

        throw new Error(
            "CRUD SERVICE: ID não informado."
        );

    }


    const tabela =
        tabelaURL(
            entity
        );


    /*
     * O banco utiliza:
     *
     * id = VEI000002
     *
     * Portanto:
     *
     * ?id=eq.VEI000002
     */

    const url =
        `${tabela}?id=eq.${queryValue(
            identificador
        )}`;


    console.log(
        `CRUD SERVICE: OBTER ${entity} ${identificador}`
    );


    const resposta =
        await request(
            url,
            {
                method: "GET"
            }
        );


    /*
     * Supabase retorna array.
     */

    if (
        Array.isArray(
            resposta
        )
    ) {

        return (
            resposta[0] ||
            null
        );

    }


    if (
        resposta?.data &&
        Array.isArray(
            resposta.data
        )
    ) {

        return (
            resposta.data[0] ||
            null
        );

    }


    if (
        resposta?.dados &&
        Array.isArray(
            resposta.dados
        )
    ) {

        return (
            resposta.dados[0] ||
            null
        );

    }


    return (
        resposta || null
    );

}


// ============================================================
// CRIAR
// ============================================================

export async function criar(
    entity,
    dados
) {

    if (
        !dados ||
        typeof dados !== "object" ||
        Array.isArray(dados)
    ) {

        throw new Error(
            "CRUD SERVICE: dados inválidos para criação."
        );

    }


    const tabela =
        tabelaURL(
            entity
        );


    console.log(
        `CRUD SERVICE: CRIAR ${entity}`,
        dados
    );


    /*
     * IMPORTANTE:
     *
     * Não enviamos ID automaticamente.
     *
     * O banco pode possuir DEFAULT
     * ou trigger para gerar o ID.
     */

    const payload =
        prepararDados(
            dados
        );


    delete payload.ID;


    const resposta =
        await request(
            tabela,
            {

                method: "POST",

                body:
                    JSON.stringify(
                        payload
                    )

            }
        );


    return resposta;

}


// ============================================================
// ATUALIZAR
// ============================================================

export async function atualizar(
    entity,
    dados
) {

    if (
        !dados ||
        typeof dados !== "object" ||
        Array.isArray(dados)
    ) {

        throw new Error(
            "CRUD SERVICE: dados inválidos para atualização."
        );

    }


    const id =
        String(
            dados.id ??
            dados.ID ??
            ""
        )
        .trim();


    if (!id) {

        throw new Error(
            "CRUD SERVICE: ID não informado para atualização."
        );

    }


    const tabela =
        tabelaURL(
            entity
        );


    const url =
        `${tabela}?id=eq.${queryValue(
            id
        )}`;


    console.log(
        `CRUD SERVICE: ATUALIZAR ${entity} ${id}`,
        dados
    );


    const payload =
        prepararDados(
            dados
        );


    /*
     * O ID identifica o registro.
     *
     * Não precisa ser enviado
     * no corpo do PATCH.
     */

    delete payload.id;

    delete payload.ID;


    const resposta =
        await request(
            url,
            {

                method: "PATCH",

                body:
                    JSON.stringify(
                        payload
                    )

            }
        );


    return resposta;

}


// ============================================================
// EXCLUIR
// ============================================================

export async function excluir(
    entity,
    id
) {

    const identificador =
        String(
            id ?? ""
        )
        .trim();


    if (!identificador) {

        throw new Error(
            "CRUD SERVICE: ID não informado para exclusão."
        );

    }


    const tabela =
        tabelaURL(
            entity
        );


    const url =
        `${tabela}?id=eq.${queryValue(
            identificador
        )}`;


    console.log(
        `CRUD SERVICE: EXCLUIR ${entity} ${identificador}`
    );


    const resposta =
        await request(
            url,
            {

                method: "DELETE"

            }
        );


    return resposta;

}


// ============================================================
// PREPARAR DADOS
// ============================================================

function prepararDados(
    dados
) {

    const resultado =
        {};


    Object.entries(
        dados || {}
    )
    .forEach(

        ([campo, valor]) => {

            /*
             * Campos de auditoria são responsabilidade exclusiva
             * do PostgreSQL. Nunca enviar esses campos pelo cliente.
             *
             * Isso é especialmente importante quando um formulário
             * contém os campos ocultos criado_em/atualizado_em: se
             * chegarem como null, o DEFAULT now() não é aplicado.
             */
            const nomeCampo =
                String(campo).toLowerCase();

            if (
                nomeCampo === "criado_em" ||
                nomeCampo === "atualizado_em"
            ) {
                return;
            }

            /*
             * Ignorar undefined.
             */

            if (
                valor === undefined
            ) {

                return;

            }


            /*
             * Converter strings vazias
             * para null.
             *
             * Isso é importante para
             * campos PostgreSQL opcionais.
             */

            if (
                valor === ""
            ) {

                resultado[campo] =
                    null;

                return;

            }


            // Todos os dados textuais são enviados em CAIXA ALTA.
            // URLs/caminhos de foto permanecem intactos para não quebrar
            // endereços sensíveis a maiúsculas/minúsculas.
            if (typeof valor === "string") {

                const preservar =
                    nomeCampo === "foto" ||
                    nomeCampo.endsWith("_foto") ||
                    nomeCampo.includes("url") ||
                    nomeCampo.includes("caminho");

                resultado[campo] = preservar
                    ? valor.trim()
                    : valor.trim().toLocaleUpperCase("pt-BR");

                return;
            }

            resultado[campo] =
                valor;

        }

    );


    return resultado;

}


// ============================================================
// EXPORTAR API
// ============================================================

export default {

    listar,

    obter,

    criar,

    atualizar,

    excluir

};
