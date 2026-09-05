-- ============================================================
-- LAVA-CAR
-- ============================================================

CREATE TABLE IF NOT EXISTS public.lava_car (
    id text PRIMARY KEY,
    id_lancamento text NOT NULL,
    data date NOT NULL,
    hora time without time zone NOT NULL,
    empregado_matricula text,
    veiculo text,
    opcao text NOT NULL,
    valor numeric(10,2) NOT NULL,
    usuario text,
    localizacao text,
    criado_em timestamptz NOT NULL DEFAULT now(),
    atualizado_em timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT lava_car_id_lancamento_fkey
        FOREIGN KEY (id_lancamento)
        REFERENCES public.lancamentos(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT lava_car_opcao_check
        CHECK (
            opcao IN (
                'aparencia_creta',
                'aparencia_trail',
                'completa_creta',
                'completa_cera_creta',
                'completa_trail',
                'completa_cera_trail'
            )
        ),

    CONSTRAINT lava_car_valor_check
        CHECK (
            valor = CASE opcao
                WHEN 'aparencia_creta' THEN 60.00
                WHEN 'aparencia_trail' THEN 70.00
                WHEN 'completa_creta' THEN 80.00
                WHEN 'completa_cera_creta' THEN 110.00
                WHEN 'completa_trail' THEN 90.00
                WHEN 'completa_cera_trail' THEN 120.00
                ELSE -1
            END
        )
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_lava_car_id_lancamento
    ON public.lava_car (id_lancamento);

ALTER TABLE public.lava_car
    ALTER COLUMN criado_em SET DEFAULT now();

ALTER TABLE public.lava_car
    ALTER COLUMN atualizado_em SET DEFAULT now();

DROP TRIGGER IF EXISTS trg_lava_car_auditoria
ON public.lava_car;

CREATE TRIGGER trg_lava_car_auditoria
BEFORE UPDATE ON public.lava_car
FOR EACH ROW
EXECUTE FUNCTION public.fn_atualizar_auditoria();
