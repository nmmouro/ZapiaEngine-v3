import { createModule } from "../engine/module.js";
import { SCHEMA_LANCAMENTOS } from "../engine/schema.js";

export function iniciar() {
    return iniciarLancamentos();
}

export function iniciarLancamentos() {
    const modulo = createModule({
        entity: "lancamentos",
        schema: SCHEMA_LANCAMENTOS,
        container: "#app",
        stateName: "lancamentos",
        options: {
            titulo: "Lançamentos",
            tabela: "Lançamentos Registrados",
            permitirNovo: true,
            permitirEditar: true,
            permitirExcluir: true,
            pageSize: 10
        }
    });
    window.lancamentos = modulo;
    return modulo;
}

