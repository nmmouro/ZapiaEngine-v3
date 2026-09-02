export const ROUTER_EMPREGADOS = {
    entity: "empregados",
    table: "empregados",
    primaryKey: "id",
    endpoint: "empregados",
    prefixo: "EMP",
    operations: { listar: true, obter: true, criar: true, atualizar: true, excluir: true },
    options: { permitirNovo: true, permitirEditar: true, permitirExcluir: true, pageSize: 10 }
};

export default ROUTER_EMPREGADOS;
