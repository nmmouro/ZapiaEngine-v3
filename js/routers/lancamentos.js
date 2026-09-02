export const ROUTER_LANCAMENTOS = {
    entity: "lancamentos",
    table: "lancamentos",
    primaryKey: "id",
    endpoint: "lancamentos",
    prefixo: "LAN",
    operations: { listar: true, obter: true, criar: true, atualizar: true, excluir: true },
    options: { permitirNovo: true, permitirEditar: true, permitirExcluir: true, pageSize: 10 }
};

export default ROUTER_LANCAMENTOS;
