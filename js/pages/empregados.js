import { createModule } from "../engine/module.js";
import { SCHEMA_EMPREGADOS } from "../engine/schema.js";

export function iniciar() {
    return iniciarEmpregados();
}

export function iniciarEmpregados() {
    const modulo = createModule({
        entity: "empregados",
        schema: SCHEMA_EMPREGADOS,
        container: "#app",
        stateName: "empregados",
        options: {
            titulo: "Cadastro de Empregados",
            tabela: "Empregados Cadastrados",
            permitirNovo: true,
            permitirEditar: true,
            permitirExcluir: true,
            pageSize: 10
        }
    });
    window.empregados = modulo;
    return modulo;
}

