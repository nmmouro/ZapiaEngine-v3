/**
 * ============================================================
 * PÁGINA — ABASTECIMENTO
 * Painel Frota
 *
 * Fluxo:
 *     Lançamento → Abastecimento → Salvar → Retornar
 *
 * O ID da ocorrência é recebido pela URL:
 *     abastecimentos.html?lancamento=LAN000001
 * ============================================================
 */

import { createModule } from "../engine/module.js";
import { SCHEMA_ABASTECIMENTO } from "../schemas/abastecimentos.js";
import { listar } from "../services/crudService.js";
import { obterLocalizacao } from "../utils/geolocalizacao.js";

let modulo = null;
let idLancamento = "";
let contextoLancamento = null;

export async function iniciarAbastecimentos() {
    console.log("PÁGINA ABASTECIMENTO → INICIANDO");

    const container = document.querySelector("#app");
    if (!container) throw new Error("PÁGINA ABASTECIMENTO → #app não encontrado.");

    idLancamento = String(
        new URLSearchParams(window.location.search).get("lancamento") || ""
    ).trim();

    if (!idLancamento) {
        throw new Error("Nenhum lançamento foi informado para o Abastecimento.");
    }

    const lancamentos = await listar("lancamentos", { id: idLancamento });
    contextoLancamento = Array.isArray(lancamentos) ? lancamentos[0] || null : null;

    if (!contextoLancamento) {
        throw new Error(`Lançamento ${idLancamento} não encontrado.`);
    }

    modulo = createModule({
        entity: "abastecimento",
        schema: SCHEMA_ABASTECIMENTO,
        container: "#app",
        stateName: "abastecimento",
        options: {
            titulo: "Abastecimento",
            tabela: "Abastecimentos Registrados",
            permitirNovo: false,
            permitirEditar: false,
            permitirExcluir: false,
            pageSize: 10,
            colunas: [
                { name: "data", label: "Data", format: formatarData },
                { name: "hora", label: "Hora", format: formatarHora },
                { name: "empregado_matricula", label: "Empregado / Matrícula" },
                { name: "veiculo", label: "Veículo / Modelo" },
                { name: "odometro", label: "Odômetro" },
                { name: "tipo_combustivel", label: "Combustível" },
                { name: "qtde_l", label: "Litros" },
                { name: "preco_l", label: "Preço/L" },
                { name: "valor_total_nota", label: "Total" }
            ]
        }
    });

    window.abastecimento = modulo;
    window.abastecimentos = modulo;

    await modulo.iniciar();
    garantirCampoOculto("id_lancamento");
    adicionarBotaoVoltar();

    modulo.novo();
    preencherContexto();
    instalarCalculoTotal();
    await capturarGPS();
    instalarRetornoAposSalvar();

    console.log("PÁGINA ABASTECIMENTO → INICIADO");
    return modulo;
}

export async function iniciar() {
    return iniciarAbastecimentos();
}

function preencherContexto() {
    setValor("id_lancamento", idLancamento);
    setValor("data", contextoLancamento.data || dataAtual());
    setValor("hora", formatarHora(contextoLancamento.hora) || horaAtual());
    setValor("empregado_matricula", contextoLancamento.empregado_matricula || "");
    setValor("veiculo", contextoLancamento.veiculo || "");
    setValor("usuario", contextoLancamento.usuario || "");
}

function instalarCalculoTotal() {
    const litros = getCampo("qtde_l");
    const preco = getCampo("preco_l");
    const total = getCampo("valor_total_nota");
    if (!litros || !preco || !total) return;

    const calcular = () => {
        const l = Number(litros.value);
        const p = Number(preco.value);
        if (Number.isFinite(l) && Number.isFinite(p) && l >= 0 && p >= 0) {
            total.value = (l * p).toFixed(2);
        }
    };

    litros.addEventListener("input", calcular);
    preco.addEventListener("input", calcular);
}

async function capturarGPS() {
    const campo = getCampo("localizacao");
    if (!campo) return;

    try {
        const coordenadas = await obterLocalizacao();
        campo.value = coordenadas;
        console.log("ABASTECIMENTO → GPS:", coordenadas);
    } catch (erro) {
        console.warn("ABASTECIMENTO → GPS NÃO OBTIDO:", erro.message);
        // O abastecimento continua disponível; localização é registrada quando autorizada.
    }
}

function instalarRetornoAposSalvar() {
    const container = modulo?.form?.container;
    if (!container || container.dataset.abastecimentoRetorno === "true") return;

    container.dataset.abastecimentoRetorno = "true";
    container.addEventListener("form:salvo", () => voltarAoLancamento(), { once: true });
}

function adicionarBotaoVoltar() {
    const form = modulo?.form?.formulario;
    if (!form || form.querySelector("[data-abastecimento-voltar]")) return;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "btn btn-secondary";
    botao.dataset.abastecimentoVoltar = "true";
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
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

function horaAtual() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
