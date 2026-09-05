/**
 * ============================================================
 * PÁGINA — AVARIAS
 * Painel Frota
 *
 * Fluxo:
 *     Lançamento → Avarias → Salvar → Retornar
 *
 * URL:
 *     avarias.html?lancamento=LAN000001
 * ============================================================
 */

import { createModule } from "../engine/module.js";
import { SCHEMA_AVARIAS } from "../schemas/avarias.js";
import { listar } from "../services/crudService.js";

let modulo = null;
let idLancamento = "";
let contextoLancamento = null;

export async function iniciarAvarias() {
    console.log("PÁGINA AVARIAS → INICIANDO");

    const container = document.querySelector("#app");
    if (!container) throw new Error("PÁGINA AVARIAS → #app não encontrado.");

    idLancamento = String(
        new URLSearchParams(window.location.search).get("lancamento") || ""
    ).trim();

    if (!idLancamento) {
        throw new Error("Nenhum lançamento foi informado para Avarias.");
    }

    const lancamentos = await listar("lancamentos", { id: idLancamento });
    contextoLancamento = Array.isArray(lancamentos)
        ? lancamentos[0] || null
        : null;

    if (!contextoLancamento) {
        throw new Error(`Lançamento ${idLancamento} não encontrado.`);
    }

    modulo = createModule({
        entity: "avarias",
        schema: SCHEMA_AVARIAS,
        container: "#app",
        stateName: "avarias",
        options: {
            titulo: "Avarias",
            tabela: "Avarias Registradas",
            permitirNovo: false,
            permitirEditar: false,
            permitirExcluir: false,
            pageSize: 10,
            colunas: [
                { name: "data", label: "Data", format: formatarData },
                { name: "hora", label: "Hora", format: formatarHora },
                { name: "empregado_matricula", label: "Empregado / Matrícula" },
                { name: "veiculo", label: "Veículo / Modelo" },
                { name: "relato_avaria", label: "Relato da avaria" },
                { name: "avarias_registradas", label: "Avarias registradas" }
            ]
        }
    });

    window.avarias = modulo;

    await modulo.iniciar();
    garantirCampoOculto("id_lancamento");
    adicionarBotaoVoltar();

    const registros = await listar("avarias", { id_lancamento: idLancamento });
    const existente = Array.isArray(registros) && registros.length
        ? registros[0]
        : null;

    modulo.novo();
    preencherContexto();

    // Se já existir uma inspeção, reaproveita o registro para evitar
    // múltiplas inspeções de avarias para a mesma ocorrência.
    if (existente?.id) {
        modulo.editar(existente.id);
        console.log("AVARIAS → REGISTRO EXISTENTE:", existente.id);
    }

    instalarRetornoAposSalvar();

    console.log("PÁGINA AVARIAS → INICIADO");
    return modulo;
}

export async function iniciar() {
    return iniciarAvarias();
}

function preencherContexto() {
    setValor("id_lancamento", idLancamento);
    setValor("data", contextoLancamento.data || dataAtual());
    setValor("hora", formatarHora(contextoLancamento.hora) || horaAtual());
    setValor("empregado_matricula", contextoLancamento.empregado_matricula || "");
    setValor("veiculo", contextoLancamento.veiculo || "");
}

function instalarRetornoAposSalvar() {
    const container = modulo?.form?.container;
    if (!container || container.dataset.avariasRetorno === "true") return;

    container.dataset.avariasRetorno = "true";
    container.addEventListener(
        "form:salvo",
        () => voltarAoLancamento(),
        { once: true }
    );
}

function adicionarBotaoVoltar() {
    const form = modulo?.form?.formulario;
    if (!form || form.querySelector("[data-avarias-voltar]")) return;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "btn btn-secondary";
    botao.dataset.avariasVoltar = "true";
    botao.textContent = "Voltar ao Lançamento";
    botao.addEventListener("click", voltarAoLancamento);

    const actions = form.querySelector(".engine-form-actions");
    (actions || form).appendChild(botao);
}

function voltarAoLancamento() {
    window.location.href = `lancamentos.html?editar=${encodeURIComponent(idLancamento)}`;
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

function setValor(nome, valor) {
    const campo = getCampo(nome);
    if (campo) campo.value = valor ?? "";
}

function formatarData(valor) {
    const texto = String(valor ?? "").trim();
    const m = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : texto;
}

function formatarHora(valor) {
    const texto = String(valor ?? "").trim();
    const m = texto.match(/^(\d{2}):(\d{2})/);
    return m ? `${m[1]}:${m[2]}` : texto;
}

function dataAtual() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function horaAtual() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
