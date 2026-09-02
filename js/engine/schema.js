/**
 * SCHEMAS CENTRAIS — PAINEL FROTA
 * Veículos, Empregados, Abastecimentos e Lançamentos.
 */

const SCHEMA_VEICULOS = {
    entity: "veiculos",
    fields: [
        { name: "id", label: "ID", type: "text", hidden: true },
        { name: "data_cadastro", label: "Data de Cadastro", type: "date", required: true, defaultValue: () => new Date().toISOString().slice(0,10) },
        { name: "foto", label: "Foto / URL", type: "text" },
        { name: "placa", label: "Placa", type: "text", required: true },
        { name: "modelo", label: "Modelo", type: "text", required: true },
        { name: "marca", label: "Marca", type: "text" },
        { name: "ano", label: "Ano", type: "number" },
        { name: "cor", label: "Cor", type: "text" },
        { name: "combustivel", label: "Combustível", type: "select", options: ["GASOLINA", "ETANOL", "FLEX", "DIESEL", "ELÉTRICO"] },
        { name: "km_inicial", label: "Km Inicial", type: "number" },
        { name: "km_atual", label: "Km Atual", type: "number" },
        { name: "status", label: "Status", type: "select", options: ["ATIVO", "MANUTENÇÃO", "INATIVO"] },
        { name: "created_at", label: "Criado em", type: "datetime-local", hidden: true },
        { name: "updated_at", label: "Atualizado em", type: "datetime-local", hidden: true }
    ]
};

const SCHEMA_EMPREGADOS = {
    entity: "empregados",
    fields: [
        { name: "id", label: "ID", type: "text", hidden: true },
        { name: "data_cadastro", label: "Data de Cadastro", type: "date", required: true, defaultValue: () => new Date().toISOString().slice(0,10) },
        { name: "foto", label: "Foto / URL", type: "text" },
        { name: "empregado", label: "Empregado", type: "text", required: true },
        { name: "matricula", label: "Matrícula", type: "text" },
        { name: "diretoria", label: "Diretoria", type: "text" },
        { name: "setor", label: "Setor", type: "text" },
        { name: "usuario", label: "Usuário", type: "text" },
        { name: "condicao", label: "Condição", type: "text" },
        { name: "status", label: "Status", type: "select", options: ["ATIVO", "FÉRIAS", "AFASTADO", "INATIVO"] },
        { name: "created_at", label: "Criado em", type: "datetime-local", hidden: true },
        { name: "updated_at", label: "Atualizado em", type: "datetime-local", hidden: true }
    ]
};

const SCHEMA_ABASTECIMENTOS = {
    entity: "abastecimentos",
    fields: [
        { name: "id", label: "ID", type: "text", hidden: true },
        { name: "data", label: "Data", type: "date", required: true, defaultValue: () => new Date().toISOString().slice(0,10) },
        { name: "hora", label: "Hora", type: "time", required: true },
        {
            name: "veiculo", label: "Veículo", type: "select", required: true,
            source: "veiculos", valueField: "id", labelFields: ["placa", "modelo"], idField: "id_veiculo", separator: " - "
        },
        { name: "id_veiculo", label: "ID Veículo", type: "text", hidden: true },
        { name: "combustivel", label: "Combustível", type: "select", required: true, options: ["GASOLINA", "ETANOL", "FLEX", "DIESEL"] },
        { name: "km", label: "Km", type: "number", required: true },
        { name: "litros", label: "Litros", type: "number", required: true, min: 0, step: "0.01" },
        { name: "valor_litro", label: "Valor por Litro", type: "number", min: 0, step: "0.001" },
        { name: "valor_total", label: "Valor Total", type: "number", min: 0, step: "0.01" },
        { name: "posto", label: "Posto", type: "text" },
        { name: "nota_fiscal", label: "Nota Fiscal", type: "text" },
        { name: "observacoes", label: "Observações", type: "textarea" },
        { name: "usuario", label: "Usuário", type: "text" },
        { name: "created_at", label: "Criado em", type: "datetime-local", hidden: true },
        { name: "updated_at", label: "Atualizado em", type: "datetime-local", hidden: true }
    ]
};

const SCHEMA_LANCAMENTOS = {
    entity: "lancamentos",
    fields: [
        { name: "id", label: "ID", type: "text", hidden: true },
        { name: "id_empregado", label: "ID Empregado", type: "text", hidden: true },
        { name: "id_veiculo", label: "ID Veículo", type: "text", hidden: true },
        { name: "data", label: "Data", type: "date", required: true, defaultValue: () => new Date().toISOString().slice(0,10) },
        { name: "hora", label: "Hora", type: "time", required: true },
        {
            name: "empregado_matricula", label: "Empregado / Matrícula", type: "select", required: true,
            source: "empregados", valueField: "id", labelFields: ["empregado"], idField: "id_empregado", separator: " / "
        },
        {
            name: "veiculo", label: "Veículo", type: "select", required: true,
            source: "veiculos", valueField: "id", labelFields: ["placa", "modelo"], idField: "id_veiculo", separator: " - "
        },
        { name: "passageiro_setor_motivo", label: "Passageiro / Setor / Motivo", type: "text", required: true },
        { name: "itinerario", label: "Itinerário", type: "text", required: true },
        { name: "horario_inicial", label: "Horário Inicial", type: "time" },
        { name: "horario_final", label: "Horário Final", type: "time" },
        { name: "km_inicial", label: "Km Inicial", type: "number" },
        { name: "km_final", label: "Km Final", type: "number" },
        { name: "distancia_percorrida", label: "Distância Percorrida", type: "number" },
        { name: "combustivel", label: "Combustível / Litros", type: "number", min: 0, step: "0.01" },
        { name: "media_consumo_combustivel", label: "Média de Consumo", type: "number", min: 0, step: "0.01" },
        { name: "checklist", label: "Checklist", type: "checkbox" },
        { name: "avaliacao_visual", label: "Avaliação Visual", type: "text" },
        { name: "registro_avarias", label: "Registro de Avarias", type: "checkbox" },
        { name: "avarias_registradas", label: "Avarias Registradas", type: "textarea" },
        { name: "lava_car", label: "Lava-Car", type: "checkbox" },
        { name: "valor_higienizacao", label: "Valor Higienização", type: "number", min: 0, step: "0.01" },
        { name: "notas_abastecimento", label: "Notas de Abastecimento", type: "textarea" },
        { name: "notas_manutencao", label: "Notas de Manutenção", type: "textarea" },
        { name: "status", label: "Status", type: "select", required: true, options: ["AGENDADO", "EM ANDAMENTO", "FINALIZADO", "CANCELADO"] },
        { name: "horas_extras", label: "Horas Extras", type: "number", min: 0, step: "0.01" },
        { name: "revisao", label: "Revisão", type: "text" },
        { name: "usuario", label: "Usuário", type: "text" },
        { name: "classificacao", label: "Classificação", type: "text" },
        { name: "localizacao", label: "Localização", type: "text" },
        { name: "duracao_atendimento", label: "Duração Atendimento / HH:MM", type: "time" },
        { name: "created_at", label: "Criado em", type: "datetime-local", hidden: true },
        { name: "updated_at", label: "Atualizado em", type: "datetime-local", hidden: true }
    ]
};

export {
    SCHEMA_VEICULOS,
    SCHEMA_EMPREGADOS,
    SCHEMA_ABASTECIMENTOS,
    SCHEMA_LANCAMENTOS
};

export default {
    SCHEMA_VEICULOS,
    SCHEMA_EMPREGADOS,
    SCHEMA_ABASTECIMENTOS,
    SCHEMA_LANCAMENTOS
};
