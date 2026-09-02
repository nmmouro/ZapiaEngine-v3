export const ROUTER_ABASTECIMENTOS = {
    entity: "abastecimentos",
    table: "abastecimentos",
    primaryKey: "id",
    endpoint: "abastecimentos",
    prefixo: "ABA",
    operations: { listar: true, obter: true, criar: true, atualizar: true, excluir: true },
    options: { permitirNovo: true, permitirEditar: true, permitirExcluir: true, pageSize: 10 }
};

export default ROUTER_ABASTECIMENTOS;
