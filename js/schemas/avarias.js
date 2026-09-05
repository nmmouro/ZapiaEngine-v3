/**
 * ============================================================
 * SCHEMA — AVARIAS
 * Painel Frota
 *
 * Um registro de avarias pertence a uma ocorrência.
 * As cinco vistas são armazenadas como imagem/Data URL pela
 * camada de formulário atual do Engine.
 * ============================================================
 */

export const SCHEMA_AVARIAS = {
    entity: "avarias",
    table: "avarias",
    title: "Avarias",
    fields: [
        { name: "id" },
        { name: "id_lancamento" },
        { name: "data", label: "Data", type: "date", readonly: true },
        { name: "hora", label: "Hora", type: "time", readonly: true },
        { name: "empregado_matricula", label: "Empregado / Matrícula", type: "text", readonly: true },
        { name: "veiculo", label: "Veículo / Modelo", type: "text", readonly: true },
        { name: "vista_frontal", label: "Vista frontal", type: "file", accept: "image/*", capture: "environment" },
        { name: "vista_traseira", label: "Vista traseira", type: "file", accept: "image/*", capture: "environment" },
        { name: "vista_lateral_direta", label: "Vista lateral direita", type: "file", accept: "image/*", capture: "environment" },
        { name: "vista_lateral_esquerda", label: "Vista lateral esquerda", type: "file", accept: "image/*", capture: "environment" },
        { name: "vista_teto", label: "Vista do teto", type: "file", accept: "image/*", capture: "environment" },
        { name: "relato_avaria", label: "Relato da avaria", type: "textarea" },
        { name: "avarias_registradas", label: "Avarias registradas", type: "textarea" },
        { name: "criado_em" },
        { name: "atualizado_em" }
    ]
};

export default SCHEMA_AVARIAS;
