/**
 * ============================================================
 * SCHEMA — CHECKLIST
 * Painel Frota
 * ============================================================
 */

export const SCHEMA_CHECKLIST = {

    entity: "checklist",

    table: "checklist",

    title: "Checklist",

    fields: [

        {
            name: "id"
        },

        {
            name: "id_lancamento"
        },

        {
            name: "data",
            label: "Data",
            type: "date"
        },

        {
            name: "hora",
            label: "Hora",
            type: "time"
        },

        {
            name: "empregado_matricula",
            label: "Empregado / Matrícula",
            type: "text",
            readonly: true
        },

        {
            name: "veiculo",
            label: "Veículo / Modelo",
            type: "text",
            readonly: true
        },

        {
            name: "oleo_motor",
            label: "Óleo do motor",
            type: "checkbox"
        },

        {
            name: "agua_radiador",
            label: "Água do radiador",
            type: "checkbox"
        },

        {
            name: "pneus",
            label: "Pneus",
            type: "checkbox"
        },

        {
            name: "estepe",
            label: "Estepe",
            type: "checkbox"
        },

        {
            name: "freios",
            label: "Freios",
            type: "checkbox"
        },

        {
            name: "farois",
            label: "Faróis",
            type: "checkbox"
        },

        {
            name: "lanternas",
            label: "Lanternas",
            type: "checkbox"
        },

        {
            name: "setas",
            label: "Setas",
            type: "checkbox"
        },

        {
            name: "limpadores",
            label: "Limpadores",
            type: "checkbox"
        },

        {
            name: "extintor",
            label: "Extintor (opcional)",
            type: "checkbox"
        },

        {
            name: "triangulo",
            label: "Triângulo",
            type: "checkbox"
        },

        {
            name: "macaco",
            label: "Macaco",
            type: "checkbox"
        },

        {
            name: "chave_roda",
            label: "Chave de roda",
            type: "checkbox"
        },

        {
            name: "cintos_seguranca",
            label: "Cintos de segurança",
            type: "checkbox"
        },

        {
            name: "cartao_neofacilidades",
            label: "Cartão NeoFacilidades",
            type: "checkbox"
        },

        {
            name: "observacoes",
            label: "Observações",
            type: "textarea"
        },

        {
            name: "criado_em"
        },

        {
            name: "atualizado_em"
        }

    ]

};
