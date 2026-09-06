/**
 * ============================================================
 * PÁGINA — LAVA-CAR
 * Painel Frota
 *
 * Fluxo:
 *     Lançamento → Lava-Car → Salvar → Retornar
 *
 * URL:
 *     lava_car.html?lancamento=LAN000001
 * ============================================================
 */

import { createModule } from "../engine/module.js";
import { SCHEMA_LAVA_CAR } from "../schemas/lava_car.js";
import { listar } from "../services/crudService.js";


const VALORES = {
    aparencia_creta: 60.00,
    aparencia_trail: 70.00,
    completa_creta: 80.00,
    completa_cera_creta: 110.00,
    completa_trail: 90.00,
    completa_cera_trail: 120.00
};

let modulo = null;
let idLancamento = "";
let contextoLancamento = null;

export async function iniciarLavaCar() {
    console.log("PÁGINA LAVA-CAR → INICIANDO");

    const container = document.querySelector("#app");
    if (!container) {
        throw new Error("PÁGINA LAVA-CAR → #app não encontrado.");
    }

    idLancamento = String(
        new URLSearchParams(window.location.search).get("lancamento") || ""
    ).trim();

    if (!idLancamento) {
        throw new Error("Nenhum lançamento foi informado para o Lava-Car.");
    }

    const lancamentos = await listar("lancamentos", { id: idLancamento });
    contextoLancamento = Array.isArray(lancamentos)
        ? lancamentos[0] || null
        : null;

    if (!contextoLancamento) {
        throw new Error(`Lançamento ${idLancamento} não encontrado.`);
    }

    modulo = createModule({
        entity: "lava_car",
        schema: SCHEMA_LAVA_CAR,
        container: "#app",
        stateName: "lava_car",
        options: {
            titulo: "Lava-Car",
            tabela: "Lava-Car Registrados",
            permitirNovo: false,
            permitirEditar: false,
            permitirExcluir: false,
            pageSize: 10,
            colunas: [
                { name: "data", label: "Data", format: formatarData },
                { name: "hora", label: "Hora", format: formatarHora },
                { name: "empregado_matricula", label: "Empregado / Matrícula" },
                { name: "veiculo", label: "Veículo / Modelo" },
                { name: "opcao", label: "Serviço" },
                { name: "valor", label: "Valor (R$)" }
            ]
        }
    });

    window.lavaCar = modulo;

    await modulo.iniciar();
    garantirCampoOculto("id_lancamento");
    adicionarBotaoVoltar();

    const registros = await listar("lava_car", { id_lancamento: idLancamento });
    const existente = Array.isArray(registros) && registros.length
        ? registros[0]
        : null;

    if (existente?.id) {
        console.log("LAVA-CAR → REGISTRO EXISTENTE:", existente.id);
        await modulo.editar(existente.id);
        preencherContexto(existente);
    } else {
        console.log("LAVA-CAR → NOVO REGISTRO");
        modulo.novo();
        preencherContexto();
    }

    instalarSelecaoServico();
    
    instalarRetornoAposSalvar();

    console.log("PÁGINA LAVA-CAR → INICIADO");
    return modulo;
}

export async function iniciar() {
    try {
        return await iniciarLavaCar();
    } catch (erro) {
        mostrarErro(erro);
        return null;
    }
}

function preencherContexto(registro = {}) {
    setValor("id_lancamento", registro.id_lancamento || idLancamento);
    setValor("data", registro.data || contextoLancamento.data || dataAtual());
    setValor("hora", formatarHora(registro.hora) || formatarHora(contextoLancamento.hora) || horaAtual());
    setValor("empregado_matricula",
        registro.empregado_matricula || contextoLancamento.empregado_matricula || "");
    setValor("veiculo",
        registro.veiculo || contextoLancamento.veiculo || "");
    setValor("usuario",
        registro.usuario || contextoLancamento.usuario || "");
}

function instalarSelecaoServico() {
    const opcao = getCampo("opcao");
    const valor = getCampo("valor");
    if (!opcao || !valor) return;

    const atualizar = () => {

        console.log(
        "LAVA-CAR → OPÇÃO SELECIONADA:",
        opcao.value
    );
        
        const preco = VALORES[opcao.value];
        valor.value = preco == null ? "" : preco.toFixed(2);
    };

    opcao.addEventListener("change", atualizar);
    atualizar();
}


function instalarRetornoAposSalvar() {
    const container = modulo?.form?.container;
    if (!container || container.dataset.lavaCarRetorno === "true") return;

    container.dataset.lavaCarRetorno = "true";
    container.addEventListener(
        "form:salvo",
        () => voltarAoLancamento(),
        { once: true }
    );
}

function adicionarBotaoVoltar() {
    const form = modulo?.form?.formulario;
    if (!form || form.querySelector("[data-lava-car-voltar]")) return;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "btn btn-secondary";
    botao.dataset.lavaCarVoltar = "true";
    botao.textContent = "Voltar ao Lançamento";
    botao.addEventListener("click", voltarAoLancamento);

    const actions = form.querySelector(".engine-form-actions");
    (actions || form).appendChild(botao);
}

function voltarAoLancamento() {
    window.location.href =
        `lancamentos.html?editar=${encodeURIComponent(idLancamento)}`;
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
    return m ? `${m[1]}:${m[2]}` : "";
}

function dataAtual() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function horaAtual() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function mostrarErro(erro) {
    console.error("PÁGINA LAVA-CAR → ERRO:", erro);
    const app = document.querySelector("#app");
    if (!app) return;

    app.innerHTML = `
        <div class="engine-form-wrapper">
            <div class="engine-form-header">
                <h2>Lava-Car</h2>
            </div>
            <div class="engine-form-empty" style="padding:20px;">
                <strong>Não foi possível abrir o Lava-Car.</strong>
                <p style="margin-top:10px;">${escapar(erro?.message || erro)}</p>
                <button type="button" class="btn btn-secondary" data-lava-car-erro-voltar>
                    Voltar ao Lançamento
                </button>
            </div>
        </div>
    `;

    const botao = app.querySelector("[data-lava-car-erro-voltar]");
    if (botao) botao.addEventListener("click", () => {
        if (idLancamento) voltarAoLancamento();
        else window.history.back();
    });
}

function escapar(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
