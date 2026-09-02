/**
 * ============================================================
 * ID SERVICE
 * Painel Frota
 *
 * Arquivo:
 * js/engine/idService.js
 *
 * Responsabilidade:
 *
 * Gerar IDs sequenciais para as entidades.
 *
 * Exemplos:
 *
 * VEI000001
 * VEI000002
 * VEI000003
 *
 * EMP000001
 * EMP000002
 *
 * LAN000001
 *
 * ============================================================
 */

import {
    listar
} from "./crud.js";


// ============================================================
// PREFIXOS
// ============================================================

const PREFIXOS = {

    veiculos: "VEI",

    empregados: "EMP",

    lancamentos: "LAN",

    abastecimentos: "ABA"

};


// ============================================================
// GERAR ID
// ============================================================

export async function gerarId(
    entity
) {

    if (!entity) {

        throw new Error(
            "ID SERVICE: entidade não informada."
        );

    }


    const entidade =
        String(entity)
            .trim()
            .toLowerCase();


    const prefixo =
        obterPrefixo(
            entidade
        );


    console.log(
        "ID SERVICE → GERAR",
        {
            entity: entidade,
            prefixo
        }
    );


    /*
     * Buscar registros existentes.
     */

    const registros =
        await listar(
            entidade
        );


    if (
        !Array.isArray(registros)
    ) {

        throw new Error(
            `ID SERVICE: resposta inválida ao listar ${entidade}.`
        );

    }


    /*
     * Encontrar o maior número existente.
     */

    let maiorNumero = 0;


    registros.forEach(
        registro => {

            if (!registro) {

                return;

            }


            const id =
                registro.id ??
                registro.ID ??
                registro.Id;


            if (!id) {

                return;

            }


            const texto =
                String(id)
                    .trim()
                    .toUpperCase();


            /*
             * Aceita somente IDs do
             * prefixo correspondente.
             *
             * Exemplo:
             *
             * VEI000012
             */

            if (
                !texto.startsWith(
                    prefixo
                )
            ) {

                return;

            }


            const numeroTexto =
                texto.substring(
                    prefixo.length
                );


            const numero =
                Number(
                    numeroTexto
                );


            if (
                Number.isInteger(numero) &&
                numero > maiorNumero
            ) {

                maiorNumero =
                    numero;

            }

        }
    );


    /*
     * Próximo número.
     */

    const proximoNumero =
        maiorNumero + 1;


    /*
     * Formatar com 6 dígitos.
     *
     * 1     → 000001
     * 12    → 000012
     * 123   → 000123
     */

    const numeroFormatado =
        String(
            proximoNumero
        )
        .padStart(
            6,
            "0"
        );


    const novoId =
        `${prefixo}${numeroFormatado}`;


    console.log(
        "ID SERVICE → ID GERADO",
        novoId
    );


    return novoId;

}


// ============================================================
// OBTER PREFIXO
// ============================================================

function obterPrefixo(
    entity
) {

    /*
     * Primeiro tenta o mapa.
     */

    if (
        PREFIXOS[entity]
    ) {

        return PREFIXOS[entity];

    }


    /*
     * Fallback:
     *
     * primeira palavra da entidade.
     *
     * Exemplo:
     *
     * abastecimentos
     * →
     * ABA
     */

    return entity
        .replace(
            /[^a-zA-Z0-9]/g,
            ""
        )
        .substring(
            0,
            3
        )
        .toUpperCase();

}


// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {

    gerarId

};
