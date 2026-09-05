/**
 * SCHEMA — ABASTECIMENTO
 *
 * Registro vinculado a uma ocorrência (lancamentos).
 * Os dados de empregado e veículo são herdados da ocorrência.
 */

const SCHEMA_ABASTECIMENTO = {
    entity: "abastecimento",
    fields: [
        { name: "id", hidden: true },
        { name: "id_lancamento", hidden: true },
        { name: "data", label: "Data", type: "date", required: true, readonly: true },
        { name: "hora", label: "Hora", type: "time", required: true, readonly: true },
        { name: "empregado_matricula", label: "Empregado / Matrícula", type: "text", readonly: true },
        { name: "veiculo", label: "Veículo / Modelo", type: "text", readonly: true },
        { name: "odometro", label: "Odômetro", type: "number", required: true, min: 0, step: "0.1" },
        { name: "usuario", label: "Usuário", type: "text", readonly: true },
        { name: "imagem", label: "Imagem da Nota / Abastecimento", type: "file", accept: "image/*", capture: "environment" },
        { name: "tipo_combustivel", label: "Tipo de Combustível", type: "select", required: true,
          options: ["GASOLINA", "ETANOL", "FLEX", "DIESEL", "ELÉTRICO"] },
        { name: "qtde_l", label: "Quantidade (L)", type: "number", required: true, min: 0, step: "0.001" },
        { name: "preco_l", label: "Preço por Litro (R$)", type: "number", required: true, min: 0, step: "0.001" },
        { name: "valor_total_nota", label: "Valor Total da Nota (R$)", type: "number", required: true, min: 0, step: "0.01" },
        { name: "localizacao", label: "Localização GPS", type: "text", readonly: true }
    ]
};

// Compatibilidade com imports existentes.
const SCHEMA_ABASTECIMENTOS = SCHEMA_ABASTECIMENTO;

export { SCHEMA_ABASTECIMENTO, SCHEMA_ABASTECIMENTOS };
export default SCHEMA_ABASTECIMENTO;
