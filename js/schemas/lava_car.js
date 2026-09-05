export const SCHEMA_LAVA_CAR = {
    entity: "lava_car",
    table: "lava_car",
    title: "Lava-car",
    fields: [
        { name: "id_lancamento", label: "Lançamento", type: "text", readonly: true, hidden: true },
        { name: "data", label: "Data", type: "date", readonly: true },
        { name: "hora", label: "Hora", type: "time", readonly: true },

        { name: "empregado_matricula", label: "Empregado / Matrícula", type: "text", readonly: true },
        { name: "veiculo", label: "Veículo / Modelo", type: "text", readonly: true },

        {
            name: "opcao",
            label: "Serviço",
            type: "select",
            required: true,
            options: [
                { value: "aparencia_creta", label: "Aparência Creta" },
                { value: "aparencia_trail", label: "Aparência Trail" },
                { value: "completa_creta", label: "Completa Creta" },
                { value: "completa_cera_creta", label: "Completa + Cera Creta" },
                { value: "completa_trail", label: "Completa Trail" },
                { value: "completa_cera_trail", label: "Completa + Cera Trail" }
            ]
        },

        { name: "valor", label: "Valor (R$)", type: "number", readonly: true, required: true },
        { name: "usuario", label: "Usuário", type: "text", readonly: true },
        { name: "localizacao", label: "Localização", type: "text", readonly: true },

        { name: "criado_em", label: "Criado em", type: "datetime", readonly: true, hidden: true },
        { name: "atualizado_em", label: "Atualizado em", type: "datetime", readonly: true, hidden: true }
    ]
};

export default SCHEMA_LAVA_CAR;
