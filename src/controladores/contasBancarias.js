const express = require("express");
const app = express();
const validarSenha = require("../intermediário");

let = {
  banco,
  identificador,
  contas,
  saques,
  depositos,
  transferencias,
} = require("../bancodedados");

const listarContas = (req, res) => {
  app.use(validarSenha);
  return res.status(200).json(contas);
};

const criarConta = (req, res) => {
  const { saldo, nome, cpf, data_nascimento, telefone, email, senha } =
    req.body;

  if (!nome) {
    return res.status(400).json({ mensagem: "O nome é obrigatório" });
  }
  if (!cpf) {
    return res.status(400).json({ mensagem: "O CPF é obrigatório" });
  }
  if (!data_nascimento) {
    return res
      .status(400)
      .json({ mensagem: "A data de nascimento é obrigatória" });
  }
  if (!telefone) {
    return res.status(400).json({ mensagem: "O telefone é obrigatório" });
  }
  if (!email) {
    return res.status(400).json({ mensagem: "O email é obrigatório" });
  }
  if (!senha) {
    return res.status(400).json({ mensagem: "A senha é obrigatória" });
  }

  const cpfExistente = contas.some((outraConta) => {
    return outraConta.cpf === cpf;
  });

  if (cpfExistente) {
    return res.status(400).json({ mensagem: "Este CPF já está cadastrado" });
  }

  const emailExistente = contas.some((outraConta) => {
    return outraConta.email === email;
  });

  if (emailExistente) {
    return res.status(400).json({ mensagem: "Este email já está cadastrado" });
  }

  const contaNova = {
    numero_conta: identificador++,
    saldo,
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha,
  };

  contas.push(contaNova);

  return res.status(201).json();
};

const atualizarConta = (req, res) => {
  const { numero_conta } = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  if (!nome) {
    return res.status(400).json({ mensagem: "O nome é obrigatório" });
  }
  if (!cpf) {
    return res.status(400).json({ mensagem: "O CPF é obrigatório" });
  }
  if (!data_nascimento) {
    return res
      .status(400)
      .json({ mensagem: "A data de nascimento é obrigatória" });
  }
  if (!telefone) {
    return res.status(400).json({ mensagem: "O telefone é obrigatório" });
  }
  if (!email) {
    return res.status(400).json({ mensagem: "O email é obrigatório" });
  }
  if (!senha) {
    return res.status(400).json({ mensagem: "A senha é obrigatória" });
  }

  const usuario = contas.find((usuario) => {
    return usuario.numero_conta === Number(numero_conta);
  });

  if (!usuario) {
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  }

  const cpfExistente = contas.some((outraConta) => {
    return (
      outraConta.numero_conta !== usuario.numero_conta && outraConta.cpf === cpf
    );
  });

  if (cpfExistente) {
    return res.status(400).json({ mensagem: "Este CPF já está cadastrado" });
  }

  const emailExistente = contas.some((outraConta) => {
    return (
      outraConta.numero_conta !== usuario.numero_conta &&
      outraConta.email === email
    );
  });

  if (emailExistente) {
    return res.status(400).json({ mensagem: "Este email já está cadastrado" });
  }

  usuario.nome = nome;
  usuario.cpf = cpf;
  usuario.data_nascimento = data_nascimento;
  usuario.telefone = telefone;
  usuario.email = email;
  usuario.senha = senha;

  return res.status(204).send();
};

const deletarConta = (req, res) => {
  const { numero_conta } = req.params;
  const usuario = contas.find((usuario) => {
    return usuario.numero_conta === Number(numero_conta);
  });
  if (!usuario) {
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  }
  if (usuario.saldo > 0) {
    return res.status(400).json({
      mensagem:
        "Não é possível deletar sua conta pois ela contém saldo positivo",
    });
  }

  contas = contas.filter((usuario) => {
    return usuario.numero_conta !== Number(numero_conta);
  });

  return res.status(204).send();
};

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;

  if (!numero_conta) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta é obrigatório" });
  }
  if (!valor) {
    return res
      .status(400)
      .json({ mensagem: "O valor a ser depositado é obrigatório" });
  }

  if (valor <= 0) {
    return res.status(400).json({ mensagem: "O valor deve ser acima de R$0" });
  }

  const usuario = contas.find((usuario) => {
    return usuario.numero_conta === Number(numero_conta);
  });

  if (!usuario) {
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  }

  usuario.saldo += valor;

  const deposito = {
    numero_conta,
    valor,
  };

  depositos.push(deposito);

  return res.status(204).json();
};

const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body;

  if (!numero_conta) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta é obrigatório" });
  }
  if (!valor) {
    return res
      .status(400)
      .json({ mensagem: "O valor a ser sacado é obrigatório" });
  }
  if (!senha) {
    return res.status(401).json({ mensagem: "Por favor, insira sua senha" });
  }

  const conta = contas.find((conta) => {
    return conta.numero_conta === Number(numero_conta);
  });

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta não existente" });
  }

  if (senha !== conta.senha) {
    return res.status(401).json({ mensagem: "A senha está incorreta" });
  }

  if (conta.saldo < valor) {
    return res.status(400).json({ mensagem: "Saldo insuficiente" });
  }

  conta.saldo -= valor;

  const saque = {
    numero_conta,
    valor,
  };

  saques.push(saque);

  return res.status(204).json();
};

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  if (!numero_conta_origem) {
    return res
      .status(400)
      .json({ mensagem: "O número do remetente é obrigatório" });
  }
  if (!numero_conta_destino) {
    return res
      .status(400)
      .json({ mensagem: "O número do destinatário é obrigatório" });
  }
  if (!valor) {
    return res.status(400).json({ mensagem: "É necessário informar um valor" });
  }
  if (!senha) {
    return res.status(401).json({ mensagem: "Por favor, insira sua senha" });
  }

  const contaOrigem = contas.find((conta) => {
    return conta.numero_conta === Number(numero_conta_origem);
  });

  const contaDestino = contas.find((conta) => {
    return conta.numero_conta === Number(numero_conta_destino);
  });

  if (!contaOrigem) {
    return res
      .status(404)
      .json({ mensagem: "A conta de origem inserida não existe" });
  }
  if (!contaDestino) {
    return res
      .status(404)
      .json({ mensagem: "A conta destinatária inserida não existe" });
  }
  if (senha !== contaOrigem.senha) {
    return res.status(401).json({ mensagem: "A senha está incorreta" });
  }
  if (contaOrigem.saldo < valor) {
    return res.status(400).json({ mensagem: "Saldo insuficiente" });
  }

  contaOrigem.saldo -= valor;
  contaDestino.saldo += valor;

  const transferencia = {
    numero_conta_origem,
    numero_conta_destino,
    valor,
  };

  transferencias.push(transferencia);

  return res.status(204).json();
};

const verSaldo = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta) {
    return res
      .status(401)
      .json({ mensagem: "Necessário informar o número da conta" });
  }
  if (!senha) {
    return res
      .status(401)
      .json({ mensagem: "Necessário informar a senha da conta" });
  }

  const conta = contas.find((conta) => {
    return conta.numero_conta === Number(numero_conta);
  });

  if (!conta) {
    return res.status(404).json({ mensagem: "A conta inserida não existe" });
  }
  if (Number(senha) !== conta.senha) {
    return res.status(401).json({ mensagem: "A senha está incorreta" });
  }

  return res.status(200).json({ saldo: conta.saldo });
};

const extrato = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta) {
    return res
      .status(401)
      .json({ mensagem: "Necessário informar o número da conta" });
  }
  if (!senha) {
    return res
      .status(401)
      .json({ mensagem: "Necessário informar a senha da conta" });
  }
  const conta = contas.find((conta) => {
    return conta.numero_conta === Number(numero_conta);
  });

  if (!conta) {
    return res.status(404).json({ mensagem: "A conta inserida não existe" });
  }
  if (Number(senha) !== conta.senha) {
    return res.status(401).json({ mensagem: "A senha está incorreta" });
  }

  const historico = {
    saques,
    depositos,
    transferencias,
  };
  return res.status(200).json(historico);
};

module.exports = {
  listarContas,
  criarConta,
  atualizarConta,
  deletarConta,
  depositar,
  sacar,
  transferir,
  verSaldo,
  extrato,
};
