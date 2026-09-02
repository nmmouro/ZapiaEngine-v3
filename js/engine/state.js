/**
 * ============================================================
 * STATE
 * Painel Frota
 * Arquivo: state.js
 *
 * Responsabilidade:
 *
 * - Criar o estado de cada módulo
 * - Armazenar registros em memória
 * - Controlar registro em edição
 * - Controlar carregamento
 * - Controlar salvamento
 * - Controlar filtro
 * - Controlar paginação
 *
 * Este arquivo NÃO conhece:
 *
 * - PostgreSQL
 * - Supabase
 * - Google Sheets
 * - DOM
 * - HTML
 *
 * ============================================================
 */


// ============================================================
// CREATE STATE
// ============================================================

export function createState(options = {}) {

    // ========================================================
    // CONFIGURAÇÃO
    // ========================================================

    const pageSize =
        Number(
            options.pageSize
        ) > 0

            ? Number(
                options.pageSize
            )

            : 10;


    // ========================================================
    // ESTADO
    // ========================================================

    const state = {

        // ----------------------------------------------------
        // REGISTROS
        // ----------------------------------------------------

        registros: [],


        // ----------------------------------------------------
        // REGISTRO EM EDIÇÃO
        // ----------------------------------------------------

        registroEditando: null,


        // ----------------------------------------------------
        // CARREGAMENTO
        // ----------------------------------------------------

        carregando: false,


        // ----------------------------------------------------
        // SALVAMENTO
        // ----------------------------------------------------

        salvando: false,


        // ----------------------------------------------------
        // FILTRO
        // ----------------------------------------------------

        filtro: "",


        // ----------------------------------------------------
        // PAGINAÇÃO
        // ----------------------------------------------------

        paginaAtual: 1,

        paginaTamanho:
            pageSize,


        // ----------------------------------------------------
        // TOTAL
        // ----------------------------------------------------

        totalRegistros: 0,


        // ----------------------------------------------------
        // ERRO
        // ----------------------------------------------------

        erro: null

    };


    // ========================================================
    // MÉTODOS DO STATE
    // ========================================================

    return {

        ...state,


        // ====================================================
        // RESET
        // ====================================================

        reset() {

            this.registros = [];

            this.registroEditando = null;

            this.carregando = false;

            this.salvando = false;

            this.filtro = "";

            this.paginaAtual = 1;

            this.totalRegistros = 0;

            this.erro = null;

        },


        // ====================================================
        // DEFINIR REGISTROS
        // ====================================================

        definirRegistros(registros) {

            this.registros =
                Array.isArray(registros)

                    ? registros

                    : [];

            this.totalRegistros =
                this.registros.length;

            this.paginaAtual = 1;

        },


        // ====================================================
        // ADICIONAR REGISTRO
        // ====================================================

        adicionarRegistro(registro) {

            if (!registro) {
                return;
            }

            this.registros.push(
                registro
            );

            this.totalRegistros =
                this.registros.length;

        },


        // ====================================================
        // ATUALIZAR REGISTRO
        // ====================================================

        atualizarRegistro(registro) {

            if (!registro) {
                return false;
            }


            const id =
                obterIdRegistro(
                    registro
                );


            if (!id) {
                return false;
            }


            const indice =
                this.registros.findIndex(

                    item =>

                        String(
                            obterIdRegistro(
                                item
                            )
                        ) ===

                        String(id)

                );


            if (indice < 0) {
                return false;
            }


            this.registros[indice] =
                registro;


            return true;

        },


        // ====================================================
        // REMOVER REGISTRO
        // ====================================================

        removerRegistro(id) {

            if (
                id === undefined ||
                id === null ||
                String(id).trim() === ""
            ) {

                return false;

            }


            const tamanhoAnterior =
                this.registros.length;


            this.registros =
                this.registros.filter(

                    registro =>

                        String(
                            obterIdRegistro(
                                registro
                            )
                        ) !==
                        String(id)

                );


            this.totalRegistros =
                this.registros.length;


            return (
                this.registros.length !==
                tamanhoAnterior
            );

        },


        // ====================================================
        // DEFINIR EDIÇÃO
        // ====================================================

        definirEdicao(registro) {

            this.registroEditando =
                registro || null;

        },


        // ====================================================
        // LIMPAR EDIÇÃO
        // ====================================================

        limparEdicao() {

            this.registroEditando =
                null;

        },


        // ====================================================
        // DEFINIR FILTRO
        // ====================================================

        definirFiltro(valor) {

            this.filtro =
                String(
                    valor ?? ""
                )
                .trim()
                .toLowerCase();

            this.paginaAtual = 1;

        },


        // ====================================================
        // DEFINIR PÁGINA
        // ====================================================

        definirPagina(numero) {

            const pagina =
                Number(numero);


            this.paginaAtual =
                Number.isFinite(pagina) &&
                pagina > 0

                    ? Math.floor(pagina)

                    : 1;

        },


        // ====================================================
        // PRÓXIMA PÁGINA
        // ====================================================

        proximaPagina(totalPaginas) {

            const total =
                Math.max(
                    1,
                    Number(totalPaginas) || 1
                );


            if (
                this.paginaAtual <
                total
            ) {

                this.paginaAtual++;

            }

        },


        // ====================================================
        // PÁGINA ANTERIOR
        // ====================================================

        paginaAnterior() {

            if (
                this.paginaAtual > 1
            ) {

                this.paginaAtual--;

            }

        },


        // ====================================================
        // DEFINIR CARREGAMENTO
        // ====================================================

        definirCarregando(valor) {

            this.carregando =
                Boolean(valor);

        },


        // ====================================================
        // DEFINIR SALVAMENTO
        // ====================================================

        definirSalvando(valor) {

            this.salvando =
                Boolean(valor);

        },


        // ====================================================
        // DEFINIR ERRO
        // ====================================================

        definirErro(erro) {

            this.erro =
                erro || null;

        },


        // ====================================================
        // LIMPAR ERRO
        // ====================================================

        limparErro() {

            this.erro =
                null;

        }

    };

}


// ============================================================
// OBTER ID DO REGISTRO
// ============================================================

function obterIdRegistro(registro) {

    if (!registro) {
        return null;
    }


    /*
     * PostgreSQL / Supabase
     *
     * Padrão atual:
     *
     *     id
     *
     * Mantemos compatibilidade com
     * formatos antigos.
     */

    return (

        registro.id ??

        registro.ID ??

        registro.Id ??

        registro.id_registro ??

        registro.ID_REGISTRO ??

        null

    );

}
