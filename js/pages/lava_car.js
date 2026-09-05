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

const params = new URLSearchParams(window.location.search);
const idLancamento = params.get("lancamento") || params.get("id_lancamento");

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function obterContexto() {
    try {
        const raw = sessionStorage.getItem("lancamento_contexto");
        if (raw) return JSON.parse(raw);
    } catch (_) {}
    return null;
}

async function obterGPS() {
    if (!navigator.geolocation) return "";
    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
            pos => resolve(`${pos.coords.latitude},${pos.coords.longitude}`),
            () => resolve(""),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    });
}

function preencherContexto(modulo) {
    const contexto = obterContexto() || {};
    const dados = {
        id_lancamento: idLancamento || contexto.id_lancamento || contexto.id || "",
        data: contexto.data || new Date().toISOString().slice(0, 10),
        hora: contexto.hora || new Date().toTimeString().slice(0, 5),
        empregado_matricula: contexto.empregado_matricula || contexto["empregado / matricula"] || "",
        veiculo: contexto.veiculo || contexto["veículo / modelo"] || ""
    };

    const form = modulo.form?.container || document;
    Object.entries(dados).forEach(([name, value]) => {
        const el = form.querySelector?.(`[name="${name}"]`);
        if (el) el.value = value;
    });

    const opcao = form.querySelector?.('[name="opcao"]');
    const valor = form.querySelector?.('[name="valor"]');

    opcao?.addEventListener("change", () => {
        const v = VALORES[opcao.value];
        if (valor) valor.value = v == null ? "" : v.toFixed(2);
    });
}

async function iniciar() {
    const container = document.querySelector("#app");
    if (!container) return;

    const modulo = createModule({
        entity: "lava_car",
        schema: SCHEMA_LAVA_CAR,
        container,
        options: {
            titulo: "Lava-car",
            tabela: "Lava-car",
            permitirNovo: true,
            permitirEditar: true,
            permitirExcluir: true
        }
    });

    window.lavaCar = modulo;
    await modulo.iniciar();
    modulo.novo();
    preencherContexto(modulo);

    const localizacao = await obterGPS();
    const loc = (modulo.form?.container || document).querySelector?.('[name="localizacao"]');
    if (loc) loc.value = localizacao;

    const voltar = document.querySelector("#btnVoltarLancamento");
    voltar?.addEventListener("click", () => {
        if (idLancamento) {
            window.location.href = `lancamentos.html?editar=${encodeURIComponent(idLancamento)}`;
        } else {
            window.history.back();
        }
    });
}

document.addEventListener("DOMContentLoaded", iniciar);
