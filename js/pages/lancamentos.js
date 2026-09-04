/**
 * ============================================================
 * PÁGINA — LANÇAMENTOS
 * Painel Frota
 *
 * Ciclo:
 *     NOVO → ABERTURA → EM ANDAMENTO → CONCLUSÃO → CONCLUÍDA
 *
 * O Engine continua genérico.
 * As regras específicas do ciclo ficam nesta página e em
 * services/lancamentosService.js.
 * ============================================================
 */
import { createModule } from "../engine/module.js";
import { SCHEMA_LANCAMENTOS } from "../schemas/lancamentos.js";
import { obterLocalizacao } from "../utils/geolocalizacao.js";
import {
    obterUltimoKmVeiculo,
    veiculoEmAndamento,
    extrairIdRegistro
} from "../services/lancamentosService.js";

let modulo = null;
let modo = "abertura";
let preparando = false;
let vehicleListenerRegistrado = false;

const CAMPOS_ABERTURA = [
    "data", "hora", "id_empregado", "id_veiculo",
    "passageiro_setor_motivo", "itinerario",
    "horario_inicial", "km_inicial"
];

const CAMPOS_CONCLUSAO = [
    "horario_final", "km_final", "combustivel",
    "media_consumo_combustivel", "checklist",
    "avaliacao_visual", "registro_avarias",
    "avarias_registradas", "lava_car",
    "valor_higienizacao", "notas_abastecimento",
    "notas_manutencao", "horas_extras", "revisao"
];

async function iniciarLancamentos() {
    console.log("PÁGINA LANÇAMENTOS → INICIANDO");

    const container = document.querySelector("#app");
    if (!container) {
        console.error("PÁGINA LANÇAMENTOS → #app não encontrado.");
        return;
    }

    modulo = createModule({
        entity: "lancamentos",
        schema: SCHEMA_LANCAMENTOS,
        container: "#app",
        stateName: "lancamentos",
        options: {
            titulo: "Cadastro de Lançamentos",
            tabela: "Lançamentos Cadastrados",
            permitirNovo: true,
            permitirEditar: true,
            permitirExcluir: true,
            pageSize: 10,
            colunas: [
                { name: "data", label: "Data", type: "date",
                  format: formatarData },
                { name: "hora", label: "Hora", type: "time",
                  format: formatarHora },
                { name: "empregado_matricula", label: "Empregado / Matrícula" },
                { name: "veiculo", label: "Veículo / Modelo" },
                { name: "passageiro_setor_motivo", label: "Passageiro / Setor / Motivo" },
                { name: "itinerario", label: "Itinerário" },
                
                { name: "status", label: "Status" }
            ]
        }
    });







// =================================================================================================================================
// FORMULÁRIOS RELACIONADOS
// ============================================================

function obterLancamentoAtual() {

    const estado =
        modulo.engine?.state;

    if (!estado) {
        return null;
    }

    return estado.registroEditando || null;
}


function obterContextoLancamento() {

    const lancamento =
        obterLancamentoAtual();

    if (!lancamento) {

        throw new Error(
            "Nenhum lançamento está selecionado."
        );

    }

    if (!lancamento.id) {

        throw new Error(
            "O lançamento ainda não possui ID."
        );

    }

    return {

        id_lancamento:
            lancamento.id,

        id_empregado:
            lancamento.id_empregado || "",

        id_veiculo:
            lancamento.id_veiculo || "",

        empregado_matricula:
            lancamento.empregado_matricula || "",

        veiculo:
            lancamento.veiculo || ""

    };

}


function abrirFormularioRelacionado(
    entidade
) {

    try {

        const contexto =
            obterContextoLancamento();

        console.log(
            "LANÇAMENTOS → ABRIR FORMULÁRIO RELACIONADO:",
            entidade,
            contexto
        );


        /*
         * Guarda o contexto da ocorrência.
         *
         * Os módulos específicos utilizarão
         * esses dados para preencher
         * id_lancamento, empregado e veículo.
         */

        window.lancamentoRelacionado = {

            entidade,

            contexto

        };


        /*
         * Aqui será feita a navegação/abertura
         * do formulário específico.
         */

        const evento =
            new CustomEvent(
                "lancamento:abrir-relacionado",
                {
                    detail: {
                        entidade,
                        contexto
                    }
                }
            );


        document.dispatchEvent(
            evento
        );


    } catch (erro) {

        console.error(
            "LANÇAMENTOS → ERRO AO ABRIR FORMULÁRIO:",
            erro
        );

        alert(
            erro.message ||
            "Não foi possível abrir o formulário."
        );

    }

}


function abrirChecklist() {

    abrirFormularioRelacionado(
        "checklist"
    );

}


function abrirAbastecimento() {

    abrirFormularioRelacionado(
        "abastecimento"
    );

}


function abrirAvarias() {

    abrirFormularioRelacionado(
        "avarias"
    );

}


function abrirLavaCar() {

    abrirFormularioRelacionado(
        "lava_car"
    );

}


modulo.abrirChecklist =
    abrirChecklist;

modulo.abrirAbastecimento =
    abrirAbastecimento;

modulo.abrirAvarias =
    abrirAvarias;

modulo.abrirLavaCar =
    abrirLavaCar;











    

    window.lancamentos = modulo;
    await modulo.iniciar();
    instalarControlesDoCiclo();

    console.log("PÁGINA LANÇAMENTOS → MÓDULO CRIADO:", modulo);
    return modulo;
}

function instalarControlesDoCiclo() {
    const container = modulo?.form?.container;
    if (!container) return;

    garantirCampoOculto("status");
    garantirCampoOculto("localizacao");
    garantirCampoOculto("localizacao_final");

    const formulario = modulo.form.formulario;
    if (!formulario) return;

    formulario.addEventListener("submit", validarAntesDeSalvar, true);

    container.addEventListener("form:novo", async () => {
        modo = "abertura";
        configurarAbertura();
        adicionarBotoesAuxiliares();
        setValor("status", "EM ANDAMENTO");
        await capturarGPS("localizacao");
        instalarListenerVeiculo();
    });

    container.addEventListener("form:editar", async evento => {
        const registro = evento.detail || {};
        const status = normalizarStatus(registro.status);

        if (status === "EM ANDAMENTO") {
            modo = "conclusao";
            configurarConclusao(registro);
            adicionarBotoesAuxiliares();
            setValor("status", "CONCLUÍDA");
            await capturarGPS("localizacao_final");
        } else {
            modo = "edicao";
            configurarEdicao(registro);
        }
    });

    container.addEventListener("form:salvo", async evento => {
        if (modo !== "abertura") return;

        const id =
            extrairIdRegistro(evento.detail) ||
            modulo?.engine?.state?.registros?.at(-1)?.id;

        if (!id) {
            console.warn("LANÇAMENTOS → não foi possível obter o ID da ocorrência aberta.");
            return;
        }

        console.log("LANÇAMENTOS → ABERTURA SALVA:", id);
        modo = "conclusao-pendente";
        await modulo.editar(id);
    });

    // Botões auxiliares são preparados agora, mas os formulários
    // específicos serão conectados na próxima etapa.
    container.addEventListener("click", evento => {
        const botao = evento.target.closest("[data-lancamento-aux]");
        if (!botao) return;
        const acao = botao.dataset.lancamentoAux;
        alert(`Formulário de ${acao} será conectado na próxima etapa.`);
    });
}

function configurarAbertura() {
    const form = modulo.form.formulario;
    if (!form) return;

    [...CAMPOS_ABERTURA].forEach(n => {
        mostrarCampo(n, true);
        setRequired(n, true);
    });

    [...CAMPOS_CONCLUSAO].forEach(n => {
        mostrarCampo(n, false);
        setRequired(n, false);
    });

    mostrarCampo("id_empregado", true);
    mostrarCampo("id_veiculo", true);
    mostrarCampo("data", true);
    mostrarCampo("hora", true);
    mostrarCampo("horario_inicial", true);
    mostrarCampo("km_inicial", true);

    setReadonly("data", true);
    setReadonly("hora", true);
    setReadonly("horario_inicial", true);
    setReadonly("km_inicial", true);

    setTextoBotaoSalvar("INICIAR OCORRÊNCIA");
    removerBotaoConcluir();

    setValor("status", "EM ANDAMENTO");
    setValor("localizacao_final", "");
}

function configurarConclusao(registro = {}) {
    [...CAMPOS_ABERTURA].forEach(n => mostrarCampo(n, true));
    [...CAMPOS_CONCLUSAO].forEach(n => {
        mostrarCampo(n, true);
        setRequired(n, false);
    });

    setRequired("horario_final", true);
    setRequired("km_final", true);

    ["data", "hora", "id_empregado", "id_veiculo",
     "passageiro_setor_motivo", "itinerario",
     "horario_inicial", "km_inicial"].forEach(n => setReadonly(n, true));

    setTextoBotaoSalvar("CONCLUIR OCORRÊNCIA");
    setValor("status", "CONCLUÍDA");
    adicionarBotoesAuxiliares();
}

function configurarEdicao() {
    [...CAMPOS_ABERTURA, ...CAMPOS_CONCLUSAO].forEach(n => mostrarCampo(n, true));
    [...CAMPOS_CONCLUSAO].forEach(n => setRequired(n, false));
    setTextoBotaoSalvar("ATUALIZAR");
    adicionarBotoesAuxiliares();
}

async function validarAntesDeSalvar(evento) {
    if (preparando) {
        evento.preventDefault();
        evento.stopImmediatePropagation();
        return;
    }

    if (modo !== "abertura") return;

    const idVeiculo = getValor("id_veiculo");
    if (!idVeiculo) return;

    try {
        const ocupado = await veiculoEmAndamento(idVeiculo);
        if (ocupado) {
            evento.preventDefault();
            evento.stopImmediatePropagation();
            alert("Este veículo já possui uma ocorrência EM ANDAMENTO.");
            return;
        }
    } catch (erro) {
        console.error("LANÇAMENTOS → erro ao verificar veículo:", erro);
        // A proteção definitiva deve permanecer no Supabase.
    }
}

function instalarListenerVeiculo() {
    if (vehicleListenerRegistrado) return;

    const select = getCampo("id_veiculo");
    if (!select) return;

    vehicleListenerRegistrado = true;
    select.addEventListener("change", async () => {
        if (modo !== "abertura") return;

        const idVeiculo = select.value;
        if (!idVeiculo) {
            setValor("km_inicial", "");
            return;
        }

        try {
            const ocupado = await veiculoEmAndamento(idVeiculo);
            if (ocupado) {
                setReadonly("km_inicial", true);
                setTextoBotaoSalvar("VEÍCULO EM ANDAMENTO");
                alert("Este veículo já possui uma ocorrência EM ANDAMENTO. Selecione outro veículo.");
                return;
            }

            const km = await obterUltimoKmVeiculo(idVeiculo);
            setValor("km_inicial", String(km));
            setReadonly("km_inicial", true);
            setTextoBotaoSalvar("INICIAR OCORRÊNCIA");
            console.log("LANÇAMENTOS → KM INICIAL:", km);
        } catch (erro) {
            console.error("LANÇAMENTOS → erro ao obter Km Inicial:", erro);
            setValor("km_inicial", "");
        }
    });
}

async function capturarGPS(nomeCampo) {
    const campo = getCampo(nomeCampo);
    if (!campo) return;

    preparando = true;
    const botao = getBotaoSalvar();
    if (botao) botao.disabled = true;

    try {
        const coordenadas = await obterLocalizacao();
        setValor(nomeCampo, coordenadas);
        console.log(`LANÇAMENTOS → ${nomeCampo}:`, coordenadas);
    } catch (erro) {
        console.error(`LANÇAMENTOS → GPS ${nomeCampo}:`, erro);
        alert(`Não foi possível obter a localização GPS.\n\n${erro.message}\n\nAutorize a localização e tente novamente.`);
    } finally {
        preparando = false;
        if (botao) botao.disabled = false;
    }
}

function adicionarBotoesAuxiliares() {
    const form = modulo?.form?.formulario;
    if (!form) return;

    let grupo = form.querySelector("[data-lancamento-auxiliares]");
    if (!grupo) {
        grupo = document.createElement("div");
        grupo.dataset.lancamentoAuxiliares = "true";
        grupo.className = "lancamento-auxiliares";
        grupo.innerHTML = `
            <div class="lancamento-auxiliares-titulo">Dados complementares</div>
            <div class="lancamento-auxiliares-botoes">
                <button type="button" class="btn btn-secondary" data-lancamento-aux="Checklist">Checklist</button>
                <button type="button" class="btn btn-secondary" data-lancamento-aux="Abastecimento">Abastecimento</button>
                <button type="button" class="btn btn-secondary" data-lancamento-aux="Avarias">Avarias</button>
                <button type="button" class="btn btn-secondary" data-lancamento-aux="Lava-car">Lava-car</button>
            </div>
        `;
        const actions = form.querySelector(".engine-form-actions");
        (actions || form).before(grupo);
    }
    grupo.hidden = false;
}

function removerBotaoConcluir() {
    // Mantido como ponto de extensão para a UI futura.
}

function garantirCampoOculto(nome) {
    const form = modulo?.form?.formulario;
    if (!form || form.elements.namedItem(nome)) return;

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = nome;
    form.appendChild(input);
}

function getCampo(nome) {
    return modulo?.form?.formulario?.elements?.namedItem(nome) || null;
}

function getValor(nome) {
    const campo = getCampo(nome);
    return campo ? campo.value : "";
}

function setValor(nome, valor) {
    const campo = getCampo(nome);
    if (campo) campo.value = valor ?? "";
}

function mostrarCampo(nome, visivel) {
    const campo = getCampo(nome);
    if (!campo) return;
    const wrapper = campo.closest("[data-engine-field]");
    if (wrapper) wrapper.style.display = visivel ? "" : "none";
}

function setRequired(nome, requerido) {
    const campo = getCampo(nome);
    if (!campo) return;
    campo.required = requerido;
}

function setReadonly(nome, readonly) {
    const campo = getCampo(nome);
    if (!campo) return;
    if (campo.type === "checkbox" || campo.tagName === "SELECT") {
        campo.disabled = false;
        campo.dataset.lifecycleReadonly = readonly ? "true" : "false";
        return;
    }
    campo.readOnly = readonly;
}

function getBotaoSalvar() {
    return modulo?.form?.formulario?.querySelector("[data-engine-salvar]") || null;
}

function setTextoBotaoSalvar(texto) {
    const botao = getBotaoSalvar();
    if (botao) botao.textContent = texto;
}

function normalizarStatus(valor) {
    return String(valor ?? "").trim().toUpperCase().replace(/_/g, " ");
}

function formatarData(valor) {
    const texto = String(valor ?? "").trim();
    if (!texto) return "";
    const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
    return texto;
}

function formatarHora(valor) {
    const texto = String(valor ?? "").trim();
    const m = texto.match(/^(\d{2}):(\d{2})/);
    return m ? `${m[1]}:${m[2]}` : texto;
}

export {
    iniciarLancamentos,
    iniciarLancamentos as iniciar
};
