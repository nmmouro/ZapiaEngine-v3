-- ============================================================
-- TABELA AVARIAS
-- Uma inspeção de avarias vinculada a uma ocorrência.
-- IDs do projeto são TEXT (LAN000001 / AVA000001).
-- As imagens são armazenadas como texto/Data URL pela camada
-- atual do Engine. Para produção, recomenda-se Supabase Storage.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.avarias (
    id text PRIMARY KEY,
    id_lancamento text NOT NULL
        REFERENCES public.lancamentos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    data date NOT NULL DEFAULT current_date,
    hora time NOT NULL DEFAULT localtime,
    empregado_matricula text,
    veiculo text,
    vista_frontal text,
    vista_traseira text,
    vista_lateral_direta text,
    vista_lateral_esquerda text,
    vista_teto text,
    relato_avaria text,
    avarias_registradas text,
    criado_em timestamptz NOT NULL DEFAULT now(),
    atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_avarias_lancamento
    ON public.avarias(id_lancamento);

CREATE INDEX IF NOT EXISTS idx_avarias_data
    ON public.avarias(data DESC);

CREATE INDEX IF NOT EXISTS idx_avarias_veiculo
    ON public.avarias(veiculo);

-- Garante no máximo um registro de avarias por ocorrência.
CREATE UNIQUE INDEX IF NOT EXISTS uq_avarias_lancamento
    ON public.avarias(id_lancamento);

DROP TRIGGER IF EXISTS trg_avarias_auditoria
    ON public.avarias;

CREATE TRIGGER trg_avarias_auditoria
BEFORE UPDATE ON public.avarias
FOR EACH ROW
EXECUTE FUNCTION public.fn_atualizar_auditoria();
