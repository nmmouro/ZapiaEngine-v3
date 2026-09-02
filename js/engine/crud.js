/**
 * ============================================================
 * CRUD
 * Painel Frota
 *
 * Arquivo:
 * js/engine/crud.js
 *
 * Ponte entre:
 *
 *     Engine
 *       ↓
 *     crudService.js
 *       ↓
 *     Supabase
 *
 * ============================================================
 */

import {
    listar as serviceListar,
    obter as serviceObter,
    criar as serviceCriar,
    atualizar as serviceAtualizar,
    excluir as serviceExcluir
} from "../services/crudService.js";


// ============================================================
// LISTAR
// ============================================================

async function listar(entidade) {

    console.log(
        "CRUD → LISTAR →",
        entidade
    );

    return serviceListar(entidade);
}


// ============================================================
// OBTER
// ============================================================

async function obter(entidade, id) {

    if (
        id === undefined ||
        id === null ||
        String(id).trim() === ""
    ) {
        throw new Error(
            "CRUD: ID não informado."
        );
    }

    const identificador =
        String(id).trim();

    console.log(
        "CRUD → OBTER →",
        entidade,
        identificador
    );

    return serviceObter(
        entidade,
        identificador
    );
}


// ============================================================
// CRIAR
// ============================================================

async function criar(entidade, dados) {

    if (
        !dados ||
        typeof dados !== "object"
    ) {
        throw new Error(
            "CRUD: dados para criação não informados."
        );
    }

    console.log(
        "CRUD → CRIAR →",
        entidade,
        dados
    );

    return serviceCriar(
        entidade,
        dados
    );
}


// ============================================================
// ATUALIZAR
// ============================================================

async function atualizar(entidade, dados) {



                                                                            console.log(
        "DEBUG CRUD → ATUALIZAR RECEBEU:",
        {
            entidade,
            dados,
            tipoDados: typeof dados
        }
    );
    

    if (
        !dados ||
        typeof dados !== "object"
    ) {
        throw new Error(
            "CRUD: dados para atualização não informados."
        );
    }

    const id =
        dados.id ??
        dados.ID ??
        dados.Id;

    if (
        id === undefined ||
        id === null ||
        String(id).trim() === ""
    ) {
        throw new Error(
            "CRUD: ID não informado para atualização."
        );
    }

    console.log(
        "CRUD → ATUALIZAR →",
        entidade,
        String(id).trim()
    );

    return serviceAtualizar(
        entidade,
        dados
    );
}


// ============================================================
// EXCLUIR
// ============================================================

async function excluir(entidade, id) {

    if (
        id === undefined ||
        id === null ||
        String(id).trim() === ""
    ) {
        throw new Error(
            "CRUD: ID não informado para exclusão."
        );
    }

    const identificador =
        String(id).trim();

    console.log(
        "CRUD → EXCLUIR →",
        entidade,
        identificador
    );

    return serviceExcluir(
        entidade,
        identificador
    );
}


// ============================================================
// EXPORTS
// ============================================================

export {
    listar,
    obter,
    criar,
    atualizar,
    excluir
};


// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {

    listar,
    obter,
    criar,
    atualizar,
    excluir

};
