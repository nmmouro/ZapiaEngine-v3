/**
 * ============================================================
 * PÁGINA — CHECKLIST
 * Painel Frota
 *
 * Fluxo:
 *     Lançamento → Checklist → Salvar → Retornar ao lançamento
 *
 * O ID do lançamento é recebido pela URL:
 *     checklist.html?lancamento=LAN000001
 * ============================================================
 */

import { createModule } from "../engine/module.js";
import { SCHEMA_CHECKLIST } from "../schemas/checklist.js";
import {
    listar,
    obter
} from "../services/crudService.js";


let moduloChecklist = null;
let idLancamento = "";
let contextoLancamento = null;


/* ============================================================
   INICIAR
============================================================ */

async function iniciarChecklist() {

    console.log("PÁGINA CHECKLIST → INICIANDO");

    const container = document.querySelector("#app");

    if (!container) {
        throw new Error("PÁGINA CHECKLIST → #app não encontrado.");
    }

    idLancamento =
        new URLSearchParams(window.location.search)
            .get("lancamento") || "";

    idLancamento = String(idLancamento).trim();

    if (!idLancamento) {
        throw new Error(
            "Nenhum lançamento foi informado para o Checklist."
        );
    }

    console.log(
        "CHECKLIST → ID DO LANÇAMENTO:",
        idLancamento
    );

    contextoLancamento =
        await obter("lancamentos", idLancamento);

    if (!contextoLancamento) {
        throw new Error(
            `Lançamento ${idLancamento} não encontrado.`
        );
    }

    moduloChecklist = createModule({

        entity: "checklist",

        schema: SCHEMA_CHECKLIST,

        container: "#app",

        stateName: "checklist",

        options: {

            titulo: "Checklist",

            tabela: "Checklists",

            permitirNovo: false,

            permitirEditar: false,

            permitirExcluir: false,

            pageSize: 10,

            colunas: [
                { name: "data", label: "Data" },
                { name: "hora", label: "Hora" },
                { name: "empregado_matricula", label: "Empregado / Matrícula" },
                { name: "veiculo", label: "Veículo / Modelo" },
                { name: "observacoes", label: "Observações" }
            ]
        }
    });

    window.checklist = moduloChecklist;

    await moduloChecklist.iniciar();

    garantirCampoOculto("id_lancamento");
    adicionarBotaoVoltar();

    const registros =
        await listar(
            "checklist",
            { id_lancamento: idLancamento }
        );

    const existente =
        Array.isArray(registros) && registros.length
            ? registros[0]
            : null;

    if (existente?.id) {

        console.log(
            "CHECKLIST → REGISTRO EXISTENTE:",
            existente.id
        );

        await moduloChecklist.editar(existente.id);

        preencherContextoSeNecessario(existente);

    } else {

        console.log(
            "CHECKLIST → NOVO CHECKLIST"
        );

        moduloChecklist.novo();

        preencherNovoChecklist();

    }

    instalarRetornoAposSalvar();

    console.log(
        "PÁGINA CHECKLIST → INICIADO"
    );

    return moduloChecklist;
}


/* ============================================================
   PREENCHER NOVO
============================================================ */

function preencherNovoChecklist() {

    setValor("id_lancamento", idLancamento);

    setValor(
        "data",
        contextoLancamento.data ||
        new Date().toISOString().slice(0, 10)
    );

    setValor(
        "hora",
        formatarHora(contextoLancamento.hora) ||
        horaAtual()
    );

    setValor(
        "empregado_matricula",
        contextoLancamento.empregado_matricula || ""
    );

    setValor(
        "veiculo",
        contextoLancamento.veiculo || ""
    );

    console.log(
        "CHECKLIST → CONTEXTO PREENCHIDO"
    );
}


/* ============================================================
   PREENCHER CONTEXTO
============================================================ */

function preencherContextoSeNecessario(registro) {

    setValor(
        "id_lancamento",
        registro.id_lancamento || idLancamento
    );

    if (!getValor("empregado_matricula")) {
        setValor(
            "empregado_matricula",
            contextoLancamento.empregado_matricula || ""
        );
    }

    if (!getValor("veiculo")) {
        setValor(
            "veiculo",
            contextoLancamento.veiculo || ""
        );
    }
}


/* ============================================================
   BOTÃO VOLTAR
============================================================ */

function adicionarBotaoVoltar() {

    const form = moduloChecklist?.form?.formulario;

    if (!form) return;

    if (form.querySelector("[data-checklist-voltar]")) {
        return;
    }

    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "btn btn-secondary";
    botao.dataset.checklistVoltar = "true";
    botao.textContent = "Voltar ao Lançamento";

    botao.addEventListener("click", () => {
        voltarAoLancamento();
    });

    const actions =
        form.querySelector(".engine-form-actions");

    (actions || form).appendChild(botao);
}


/* ============================================================
   RETORNO APÓS SALVAR
============================================================ */

function instalarRetornoAposSalvar() {

    const container = moduloChecklist?.form?.container;

    if (!container) return;

    if (container.dataset.checklistRetorno === "true") {
        return;
    }

    container.dataset.checklistRetorno = "true";

    container.addEventListener(
        "form:salvo",
        () => {
            console.log(
                "CHECKLIST → SALVO → RETORNANDO AO LANÇAMENTO"
            );

            voltarAoLancamento();
        },
        { once: true }
    );
}


/* ============================================================
   VOLTAR
============================================================ */

function voltarAoLancamento() {

    window.location.href =
        `lancamentos.html?editar=${encodeURIComponent(idLancamento)}`;
}


/* ============================================================
   CAMPO OCULTO
============================================================ */

function garantirCampoOculto(nome) {

    const form = moduloChecklist?.form?.formulario;

    if (!form || form.elements.namedItem(nome)) {
        return;
    }

    const input = document.createElement("input");

    input.type = "hidden";
    input.name = nome;

    form.appendChild(input);
}


/* ============================================================
   VALORES
============================================================ */

function getCampo(nome) {
    return moduloChecklist?.form?.formulario
        ?.elements?.namedItem(nome) || null;
}


function getValor(nome) {
    const campo = getCampo(nome);
    return campo ? campo.value : "";
}


function setValor(nome, valor) {
    const campo = getCampo(nome);
    if (campo) {
        campo.value = valor ?? "";
    }
}


function formatarHora(valor) {

    const texto = String(valor ?? "").trim();

    const match = texto.match(/^(\d{2}):(\d{2})/);

    return match
        ? `${match[1]}:${match[2]}`
        : "";
}


function horaAtual() {

    const agora = new Date();

    return `${String(agora.getHours()).padStart(2, "0")}:${String(
        agora.getMinutes()
    ).padStart(2, "0")}`;
}


/* ============================================================
   EXPORT
============================================================ */

export {
    iniciarChecklist,
    iniciarChecklist as iniciar
};
