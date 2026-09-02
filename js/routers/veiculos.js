/**
 * ============================================================
 * ROUTER — VEÍCULOS
 * Painel Frota
 * Arquivo: js/routers/veiculos.js
 *
 * Responsabilidade:
 *
 * - Definir a configuração da entidade VEÍCULOS
 * - Centralizar informações da rota
 * - Definir o nome da tabela
 * - Definir o campo identificador
 * - Fornecer configuração ao módulo
 *
 * Não possui:
 *
 * - HTML
 * - Formulário
 * - Tabela
 * - DOM
 * - Supabase diretamente
 * - Fetch diretamente
 *
 * A comunicação com o backend permanece em:
 *
 *     services/crudService.js
 *
 * ============================================================
 */


// ============================================================
// CONFIGURAÇÃO DA ROTA
// ============================================================

export const ROUTER_VEICULOS = {

    // ========================================================
    // IDENTIFICAÇÃO
    // ========================================================

    entity:
        "veiculos",


    table:
        "veiculos",


    // ========================================================
    // IDENTIFICADOR
    // ========================================================

    primaryKey:
        "id",


    // ========================================================
    // ENDPOINT
    // ========================================================

    endpoint:
        "veiculos",


    // ========================================================
    // OPERAÇÕES PERMITIDAS
    // ========================================================

    operations: {

        listar:
            true,

        obter:
            true,

        criar:
            true,

        atualizar:
            true,

        excluir:
            true

    },


    // ========================================================
    // CONFIGURAÇÕES
    // ========================================================

    options: {

        permitirNovo:
            true,

        permitirEditar:
            true,

        permitirExcluir:
            true,

        pageSize:
            10

    }

};


// ============================================================
// FUNÇÃO — OBTER CONFIGURAÇÃO
// ============================================================

export function obterRouterVeiculos() {

    return {
        ...ROUTER_VEICULOS
    };

}


// ============================================================
// VALIDAR ID
// ============================================================

export function validarIdVeiculo(
    id
) {

    if (
        id === undefined ||
        id === null
    ) {

        return false;

    }


    const identificador =
        String(
            id
        )
        .trim();


    return (
        identificador.length > 0
    );

}


// ============================================================
// NORMALIZAR ID
// ============================================================

export function normalizarIdVeiculo(
    id
) {

    if (
        id === undefined ||
        id === null
    ) {

        return "";

    }


    return String(
        id
    )
    .trim();

}


// ============================================================
// NORMALIZAR VEÍCULO
// ============================================================

export function normalizarVeiculo(
    dados = {}
) {

    return {

        id:
            dados.id ??
            dados.ID ??
            "",


        data_cadastro:
            dados.data_cadastro ??
            "",


        foto:
            dados.foto ??
            "",


        placa:
            dados.placa ??
            "",


        modelo:
            dados.modelo ??
            "",


        marca:
            dados.marca ??
            "",


        ano:
            dados.ano ??
            null,


        combustivel:
            dados.combustivel ??
            "",


        cor:
            dados.cor ??
            "",


        status:
            dados.status ??
            "",


        criado_em:
            dados.criado_em ??
            null,


        atualizado_em:
            dados.atualizado_em ??
            null

    };

}


// ============================================================
// PREPARAR PARA CRIAÇÃO
// ============================================================

export function prepararVeiculoParaCriar(
    dados = {}
) {

    const veiculo =
        normalizarVeiculo(
            dados
        );


    /*
     * O ID é gerado pelo banco.
     *
     * Portanto não enviamos
     * id na criação.
     */

    delete veiculo.id;


    /*
     * Campos controlados pelo banco.
     */

    delete veiculo.criado_em;

    delete veiculo.atualizado_em;


    return veiculo;

}


// ============================================================
// PREPARAR PARA ATUALIZAÇÃO
// ============================================================

export function prepararVeiculoParaAtualizar(
    dados = {}
) {

    const veiculo =
        normalizarVeiculo(
            dados
        );


    const id =
        normalizarIdVeiculo(
            veiculo.id
        );


    if (!id) {

        throw new Error(
            "ROUTER VEÍCULOS: ID não informado para atualização."
        );

    }


    /*
     * O ID é utilizado apenas
     * para localizar o registro.
     */

    delete veiculo.id;


    /*
     * Campos controlados pelo banco.
     */

    delete veiculo.criado_em;

    delete veiculo.atualizado_em;


    return {

        id,

        dados:
            veiculo

    };

}


// ============================================================
// PREPARAR PARA EXCLUSÃO
// ============================================================

export function prepararVeiculoParaExcluir(
    id
) {

    const identificador =
        normalizarIdVeiculo(
            id
        );


    if (!identificador) {

        throw new Error(
            "ROUTER VEÍCULOS: ID não informado para exclusão."
        );

    }


    return identificador;

}


// ============================================================
// EXPORT DEFAULT
// ============================================================

export default ROUTER_VEICULOS;
