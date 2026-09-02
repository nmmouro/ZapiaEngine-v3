-- PAINEL FROTA - SUPABASE / POSTGRESQL
-- Execute este arquivo no SQL Editor do Supabase.

create table if not exists public.veiculos (
    id text primary key,
    data_cadastro date not null default current_date,
    foto text,
    placa text not null,
    modelo text not null,
    marca text,
    ano integer,
    cor text,
    combustivel text,
    km_inicial numeric,
    km_atual numeric,
    status text not null default 'ATIVO',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.empregados (
    id text primary key,
    data_cadastro date not null default current_date,
    foto text,
    empregado text not null,
    matricula text,
    diretoria text,
    setor text,
    usuario text,
    condicao text,
    status text not null default 'ATIVO',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.abastecimentos (
    id text primary key,
    data date not null default current_date,
    hora time not null default localtime,
    id_veiculo text not null references public.veiculos(id),
    veiculo text,
    combustivel text not null,
    km numeric not null,
    litros numeric(12,3) not null,
    valor_litro numeric(12,3),
    valor_total numeric(12,2),
    posto text,
    nota_fiscal text,
    observacoes text,
    usuario text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.lancamentos (
    id text primary key,
    id_empregado text not null references public.empregados(id),
    id_veiculo text not null references public.veiculos(id),
    data date not null default current_date,
    hora time not null default localtime,
    empregado_matricula text,
    veiculo text,
    passageiro_setor_motivo text not null,
    itinerario text not null,
    horario_inicial time,
    horario_final time,
    km_inicial numeric,
    km_final numeric,
    distancia_percorrida numeric,
    combustivel numeric(12,3),
    media_consumo_combustivel numeric(12,3),
    checklist boolean not null default false,
    avaliacao_visual text,
    registro_avarias boolean not null default false,
    avarias_registradas text,
    lava_car boolean not null default false,
    valor_higienizacao numeric(12,2),
    notas_abastecimento text,
    notas_manutencao text,
    status text not null default 'AGENDADO',
    horas_extras numeric(12,2),
    revisao text,
    usuario text,
    classificacao text,
    localizacao text,
    duracao_atendimento time,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_abastecimentos_veiculo on public.abastecimentos(id_veiculo);
create index if not exists idx_abastecimentos_data on public.abastecimentos(data desc);
create index if not exists idx_lancamentos_veiculo on public.lancamentos(id_veiculo);
create index if not exists idx_lancamentos_empregado on public.lancamentos(id_empregado);
create index if not exists idx_lancamentos_data on public.lancamentos(data desc);

create or replace function public.atualizar_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_veiculos_updated_at on public.veiculos;
create trigger trg_veiculos_updated_at before update on public.veiculos
for each row execute function public.atualizar_updated_at();

drop trigger if exists trg_empregados_updated_at on public.empregados;
create trigger trg_empregados_updated_at before update on public.empregados
for each row execute function public.atualizar_updated_at();

drop trigger if exists trg_abastecimentos_updated_at on public.abastecimentos;
create trigger trg_abastecimentos_updated_at before update on public.abastecimentos
for each row execute function public.atualizar_updated_at();

drop trigger if exists trg_lancamentos_updated_at on public.lancamentos;
create trigger trg_lancamentos_updated_at before update on public.lancamentos
for each row execute function public.atualizar_updated_at();
