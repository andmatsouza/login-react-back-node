const { eAdmin } = require("../middlewares/auth");
const User = require("../models/User");


async function getUsers(req, res) {
  const { page = 1 } = req.params;
  const limit = 7;
  let lastPage = 1;

  const countUser = await User.count();
  if (countUser === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum usuário encontrado!",
    });
  } else {
    lastPage = Math.ceil(countUser / limit);
  }

  await User.findAll({
    attributes: ["id", "name", "email"],
    order: [["id", "DESC"]],
    offset: Number(page * limit - limit),
    limit: limit,
  })
    .then((users) => {
      return res.json({
        erro: false,
        users,
        countUser,
        lastPage,
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum usuário encontrado!",
      });
    });
};


module.exports = {getUsers};