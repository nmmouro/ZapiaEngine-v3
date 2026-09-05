-- ============================================================
-- TABELA ABASTECIMENTO
-- Vinculada à ocorrência em public.lancamentos.
-- id_lancamento e id são TEXT porque os IDs do projeto são
-- do tipo LAN000001 / ABA000001.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.abastecimento (
    id text PRIMARY KEY,
    id_lancamento text NOT NULL
        REFERENCES public.lancamentos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    data date NOT NULL DEFAULT current_date,
    hora time NOT NULL DEFAULT localtime,
    empregado_matricula text,
    veiculo text,
    odometro numeric(12,1) NOT NULL,
    usuario text,
    imagem text,
    tipo_combustivel text NOT NULL,
    qtde_l numeric(12,3) NOT NULL,
    preco_l numeric(12,3) NOT NULL,
    valor_total_nota numeric(12,2) NOT NULL,
    localizacao text,
    criado_em timestamptz NOT NULL DEFAULT now(),
    atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_abastecimento_lancamento
    ON public.abastecimento(id_lancamento);

CREATE INDEX IF NOT EXISTS idx_abastecimento_data
    ON public.abastecimento(data DESC);

CREATE INDEX IF NOT EXISTS idx_abastecimento_veiculo
    ON public.abastecimento(veiculo);

DROP TRIGGER IF EXISTS trg_abastecimento_auditoria
    ON public.abastecimento;

CREATE TRIGGER trg_abastecimento_auditoria
BEFORE UPDATE ON public.abastecimento
FOR EACH ROW
EXECUTE FUNCTION public.fn_atualizar_auditoria();
