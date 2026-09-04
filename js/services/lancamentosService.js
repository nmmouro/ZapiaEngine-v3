/**
 * ============================================================
 * SERVIÇO — LANÇAMENTOS
 * Regras auxiliares do ciclo ABERTURA → CONCLUSÃO.
 *
 * O Supabase continua sendo a autoridade final das regras.
 * Este serviço apenas antecipa validações e busca dados.
 * ============================================================
 */
import { listar } from "./crudService.js";

export async function obterUltimoKmVeiculo(idVeiculo) {
    if (!idVeiculo) return 0;
    const registros = await listar("lancamentos", { id_veiculo: idVeiculo });
    let maior = 0;
    (Array.isArray(registros) ? registros : []).forEach(r => {
        const n = Number(r?.km_final);
        if (Number.isFinite(n) && n > maior) maior = n;
    });
    return maior;
}

export async function veiculoEmAndamento(idVeiculo, ignorarId = "") {
    if (!idVeiculo) return false;
    const registros = await listar("lancamentos", { id_veiculo: idVeiculo });
    return (Array.isArray(registros) ? registros : []).some(r => {
        if (ignorarId && String(r?.id) === String(ignorarId)) return false;
        const status = String(r?.status ?? "").trim().toUpperCase();
        return status === "EM ANDAMENTO" || status === "EM_ANDAMENTO";
    });
}

export function extrairIdRegistro(resposta) {
    const r = Array.isArray(resposta) ? resposta[0] : (resposta?.data ?? resposta?.dados ?? resposta);
    if (Array.isArray(r)) return r[0]?.id ?? "";
    return r?.id ?? "";
}
