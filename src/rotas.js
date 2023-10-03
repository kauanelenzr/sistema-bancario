const express = require("express");
const app = express();
const {
  listarContas,
  criarConta,
  atualizarConta,
  deletarConta,
  depositar,
  sacar,
  transferir,
  verSaldo,
  extrato,
} = require("./controladores/contasBancarias");

//LISTAR CONTA
app.get("/contas", listarContas);
//VER SALDO
app.get("/contas/saldo", verSaldo);
//VER EXTRATO
app.get("/contas/extrato", extrato);
//CRIAR CONTA
app.post("/contas", criarConta);
//TRANSFERIR
app.post("/transacoes/transferir", transferir);
//DEPOSITAR
app.post("/transacoes/depositar", depositar);
//SACAR
app.post("/transacoes/sacar", sacar);
//ATUALIZAR CONTA
app.put("/contas/:numero_conta/usuario", atualizarConta);
//EXCLUIR CONTA
app.delete("/contas/:numero_conta", deletarConta);

module.exports = app;
