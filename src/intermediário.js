const { banco } = require("./bancodedados");

const validarSenha = (req, res, next) => {
  const { senha_banco } = req.query;

  if (senha_banco !== banco.senha) {
    return res
      .status(403)
      .json({ mensagem: "A senha do banco está incorreta!" });
  }
  next();
};

module.exports = validarSenha;
