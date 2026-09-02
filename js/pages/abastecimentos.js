import { createModule } from "../engine/module.js";
import { SCHEMA_ABASTECIMENTOS } from "../engine/schema.js";

export function iniciar() {
    return iniciarAbastecimentos();
}

export async function iniciarAbastecimentos() {
    const modulo = createModule({
        entity: "abastecimentos",
        schema: SCHEMA_ABASTECIMENTOS,
        container: "#app",
        stateName: "abastecimentos",
        options: {
            titulo: "Controle de Abastecimentos",
            tabela: "Abastecimentos Registrados",
            permitirNovo: true,
            permitirEditar: true,
            permitirExcluir: true,
            pageSize: 10
        }
    });
    window.abastecimentos = modulo;

    await modulo.iniciar();

    return modulo;
}

