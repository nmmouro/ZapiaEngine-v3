// ============================================================================
// SERVER
// Painel Frota
// Arquivo: server.js
//
// Backend principal da aplicação.
//
// Arquitetura:
//
//   Frontend
//      ↓
//   Engine
//      ↓
//   crudService.js
//      ↓
//   server.js
//      ↓
//   db.js
//      ↓
//   Supabase / PostgreSQL
//
// ============================================================================


import "dotenv/config";

import express from "express";

import cors from "cors";

import { supabase } from "./db.js";


// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const app =
    express();


const PORT =
    process.env.PORT || 3000;


// ============================================================================
// MIDDLEWARES
// ============================================================================

app.use(

    cors({

        origin: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]

    })

);


app.use(
    express.json()
);


app.use(
    express.urlencoded({
        extended: true
    })
);


// ============================================================================
// LOG DE REQUISIÇÕES
// ============================================================================

app.use(

    (req, res, next) => {

        console.log(
            `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
        );

        next();

    }

);


// ============================================================================
// ROTA PRINCIPAL
// ============================================================================

app.get(

    "/",

    (req, res) => {

        res.json({

            sucesso:
                true,

            status:
                200,

            message:
                "API Painel Frota funcionando.",

            sistema:
                "Painel Frota",

            banco:
                "Supabase / PostgreSQL"

        });

    }

);


// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get(

    "/health",

    async (req, res) => {

        try {

            const {
                error
            } = await supabase

                .from("veiculos")

                .select("id")

                .limit(1);


            if (error) {

                throw error;

            }


            res.json({

                sucesso:
                    true,

                status:
                    200,

                api:
                    "online",

                banco:
                    "online"

            });


        } catch (erro) {

            console.error(
                "Health Check:",
                erro
            );


            res.status(500).json({

                sucesso:
                    false,

                status:
                    500,

                api:
                    "online",

                banco:
                    "offline",

                erro:
                    erro.message

            });

        }

    }

);


// ============================================================================
// NORMALIZAÇÃO DE DADOS
// ============================================================================
// Todo texto digitado pelo usuário que será gravado em VEÍCULOS
// é convertido para CAIXA ALTA antes de chegar ao banco.
//
// Campos numéricos e datas não são alterados.
// O campo foto é preservado porque pode conter URL/caminho de arquivo,
// cujo uso de maiúsculas pode alterar o endereço.
// ============================================================================

function caixaAlta(valor) {

    if (valor === null || valor === undefined) {
        return valor;
    }

    return String(valor)
        .trim()
        .toLocaleUpperCase("pt-BR");

}


function normalizarVeiculo(dados = {}) {

    return {

        data: dados.data || null,

        foto: dados.foto || null,

        placa: caixaAlta(dados.placa) || null,

        modelo: caixaAlta(dados.modelo) || null,

        marca: caixaAlta(dados.marca) || null,

        ano: dados.ano !== undefined && dados.ano !== ""
            ? Number(dados.ano)
            : null,

        cor: caixaAlta(dados.cor) || null,

        combustivel: caixaAlta(dados.combustivel) || null,

        km_inicial: dados.km_inicial !== undefined && dados.km_inicial !== ""
            ? Number(dados.km_inicial)
            : null,

        km_atual: dados.km_atual !== undefined && dados.km_atual !== ""
            ? Number(dados.km_atual)
            : null,

        status: caixaAlta(dados.status || "ATIVO")

    };

}


// ============================================================================
// CRUD — VEÍCULOS
// ============================================================================


// ============================================================================
// LISTAR VEÍCULOS
// ============================================================================

app.get(

    "/api/veiculos",

    async (req, res) => {

        try {

            const {

                data,

                error

            } = await supabase

                .from("veiculos")

                .select("*")

                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


            if (error) {

                throw error;

            }


            res.json({

                sucesso:
                    true,

                status:
                    200,

                message:
                    "Veículos carregados com sucesso.",

                dados:
                    data || []

            });


        } catch (erro) {

            console.error(
                "GET /api/veiculos:",
                erro
            );


            res.status(500).json({

                sucesso:
                    false,

                status:
                    500,

                message:
                    "Erro ao listar veículos.",

                erro:
                    erro.message,

                dados:
                    []

            });

        }

    }

);


// ============================================================================
// OBTER VEÍCULO
// ============================================================================

app.get(

    "/api/veiculos/:id",

    async (req, res) => {

        try {

            const id =
                req.params.id;


            const {

                data,

                error

            } = await supabase

                .from("veiculos")

                .select("*")

                .eq(
                    "id",
                    id
                )

                .maybeSingle();


            if (error) {

                throw error;

            }


            if (!data) {

                return res.status(404).json({

                    sucesso:
                        false,

                    status:
                        404,

                    message:
                        "Veículo não encontrado.",

                    dados:
                        null

                });

            }


            res.json({

                sucesso:
                    true,

                status:
                    200,

                message:
                    "Veículo encontrado.",

                dados:
                    data

            });


        } catch (erro) {

            console.error(
                "GET /api/veiculos/:id:",
                erro
            );


            res.status(500).json({

                sucesso:
                    false,

                status:
                    500,

                message:
                    "Erro ao obter veículo.",

                erro:
                    erro.message,

                dados:
                    null

            });

        }

    }

);


// ============================================================================
// CRIAR VEÍCULO
// ============================================================================

app.post(

    "/api/veiculos",

    async (req, res) => {

        try {

            const dados =
                req.body;


            if (!dados) {

                return res.status(400).json({

                    sucesso:
                        false,

                    status:
                        400,

                    message:
                        "Dados do veículo não informados."

                });

            }


            const registro = normalizarVeiculo(dados);


            const {

                data,

                error

            } = await supabase

                .from("veiculos")

                .insert(
                    [registro]
                )

                .select()

                .single();


            if (error) {

                throw error;

            }


            res.status(201).json({

                sucesso:
                    true,

                status:
                    201,

                message:
                    "Veículo criado com sucesso.",

                dados:
                    data

            });


        } catch (erro) {

            console.error(
                "POST /api/veiculos:",
                erro
            );


            res.status(500).json({

                sucesso:
                    false,

                status:
                    500,

                message:
                    "Erro ao criar veículo.",

                erro:
                    erro.message,

                dados:
                    null

            });

        }

    }

);


// ============================================================================
// ATUALIZAR VEÍCULO
// ============================================================================

app.put(

    "/api/veiculos/:id",

    async (req, res) => {

        try {

            const id =
                req.params.id;


            const dados =
                req.body;


            const registro = normalizarVeiculo(dados);


            const {

                data,

                error

            } = await supabase

                .from("veiculos")

                .update(
                    registro
                )

                .eq(
                    "id",
                    id
                )

                .select()

                .maybeSingle();


            if (error) {

                throw error;

            }


            if (!data) {

                return res.status(404).json({

                    sucesso:
                        false,

                    status:
                        404,

                    message:
                        "Veículo não encontrado.",

                    dados:
                        null

                });

            }


            res.json({

                sucesso:
                    true,

                status:
                    200,

                message:
                    "Veículo atualizado com sucesso.",

                dados:
                    data

            });


        } catch (erro) {

            console.error(
                "PUT /api/veiculos/:id:",
                erro
            );


            res.status(500).json({

                sucesso:
                    false,

                status:
                    500,

                message:
                    "Erro ao atualizar veículo.",

                erro:
                    erro.message,

                dados:
                    null

            });

        }

    }

);


// ============================================================================
// EXCLUIR VEÍCULO
// ============================================================================

app.delete(

    "/api/veiculos/:id",

    async (req, res) => {

        try {

            const id =
                req.params.id;


            const {

                data,

                error

            } = await supabase

                .from("veiculos")

                .delete()

                .eq(
                    "id",
                    id
                )

                .select();


            if (error) {

                throw error;

            }


            if (
                !data ||
                data.length === 0
            ) {

                return res.status(404).json({

                    sucesso:
                        false,

                    status:
                        404,

                    message:
                        "Veículo não encontrado."

                });

            }


            res.json({

                sucesso:
                    true,

                status:
                    200,

                message:
                    "Veículo excluído com sucesso.",

                dados:
                    data[0]

            });


        } catch (erro) {

            console.error(
                "DELETE /api/veiculos/:id:",
                erro
            );


            res.status(500).json({

                sucesso:
                    false,

                status:
                    500,

                message:
                    "Erro ao excluir veículo.",

                erro:
                    erro.message

            });

        }

    }

);


// ============================================================================
// ROTA NÃO ENCONTRADA
// ============================================================================

app.use(

    (req, res) => {

        res.status(404).json({

            sucesso:
                false,

            status:
                404,

            message:
                "Rota não encontrada.",

            rota:
                req.originalUrl

        });

    }

);


// ============================================================================
// TRATAMENTO GLOBAL DE ERROS
// ============================================================================

app.use(

    (erro, req, res, next) => {

        console.error(
            "Erro interno:",
            erro
        );


        res.status(500).json({

            sucesso:
                false,

            status:
                500,

            message:
                "Erro interno do servidor.",

            erro:
                erro.message

        });

    }

);


// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

app.listen(

    PORT,

    () => {

        console.log("");
        console.log(
            "============================================"
        );
        console.log(
            "       PAINEL FROTA — API"
        );
        console.log(
            "============================================"
        );
        console.log(
            `Servidor: http://localhost:${PORT}`
        );
        console.log(
            `API:      http://localhost:${PORT}/api`
        );
        console.log(
            `Health:   http://localhost:${PORT}/health`
        );
        console.log(
            "Banco:    Supabase / PostgreSQL"
        );
        console.log(
            "============================================"
        );
        console.log("");

    }
);
