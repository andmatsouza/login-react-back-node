const express = require("express");
var cors = require("cors");
const yup = require("yup");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require('fs');
const path = require('path');

const { eAdmin } = require("./middlewares/auth");
const User = require("./models/User");
const upload = require("./middlewares/uploadImgProfile");
const Fabricante = require("./models/Fabricante");
const Modelo = require("./models/Modelo");
const Veiculo = require("./models/Veiculo");

const app = express();

app.use(express.json());

app.use('/files', express.static(path.resolve(__dirname,"public", "upload")));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-PINGOTHER, Content-Type, Authorization"
  );
  app.use(cors());
  next();
});

app.get("/users/:page", eAdmin, async (req, res) => {
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
});

app.get("/user/:id", eAdmin, async (req, res) => {
  const { id } = req.params;

  //await User.findAll({ where: { id: id }
  await User.findByPk(id)
    .then((user) => {
       // let endImage = process.env.URL_IMG + "/files/users/";
        if(user.image){
            var endImage = process.env.URL_IMG + "/files/users/" + user.image;
        }else{
            var endImage = process.env.URL_IMG + "/files/users/icone_usuario.png";
        }        
      return res.json({
        erro: false,
        user: user,
        endImage
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum usuário encontrado!",
      });
    });
});

app.post("/user", eAdmin, async (req, res) => {
  var dados = req.body;

  const schema = yup.object().shape({
    /*password: yup.string("Erro: Necessário preencher o campo senha!")
        .required("Erro: Necessário preencher o campo senha!")
        .min(6,"Erro: A senha deve ter no mínimo 6 caracteres!"),*/
    email: yup
      .string("Erro: Necessário preencher o campo e-mail!")
      .email("Erro: Necessário preencher o campo e-mail!")
      .required("Erro: Necessário preencher o campo e-mail!"),
    name: yup
      .string("Erro: Necessário preencher o campo nome!")
      .required("Erro: Necessário preencher o campo nome!"),
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }

  /*if(!(await schema.isValid(dados))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Necessário preencher todos os campos!"
        });
    }*/

  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (user) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este e-mail já está cadastrado!",
    });
  }

  dados.password = await bcrypt.hash(dados.password, 8);

  await User.create(dados)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Usuário cadastrado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Usuário não cadastrado com sucesso!",
      });
    });
});

app.put("/user", eAdmin, async (req, res) => {
  const { id } = req.body;
  const dados = req.body;

  const schema = yup.object().shape({
    email: yup
      .string("Erro: Necessário preencher o campo e-mail!")
      .email("Erro: Necessário preencher o campo e-mail!")
      .required("Erro: Necessário preencher o campo e-mail!"),
    name: yup
      .string("Erro: Necessário preencher o campo nome!")
      .required("Erro: Necessário preencher o campo nome!"),
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }

  /*const schema = yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Necessário preencher todos os campos!"
        });
    }*/

  const user = await User.findOne({
    where: {
      email: req.body.email,
      id: {
        [Op.ne]: id,
      },
    },
  });

  if (user) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este e-mail já está cadastrado!",
    });
  }

  await User.update(dados, { where: { id } })
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Usuário editado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Usuário não editado com sucesso!",
      });
    });
});

app.put("/user-senha", eAdmin, async (req, res) => {
  const { id, password } = req.body;

  const schema = yup.object().shape({
    password: yup
      .string("Erro: Necessário preencher o campo senha!")
      .required("Erro: Necessário preencher o campo senha!")
      .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }

  var passwordCrypt = await bcrypt.hash(password, 8);

  await User.update({ password: passwordCrypt }, { where: { id } })
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Senha editada com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Senha não editada com sucesso!",
      });
    });
});

app.delete("/user/:id", eAdmin, async (req, res) => {
  const { id } = req.params;

  await User.destroy({ where: { id } })
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Usuário apagado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Usuário não apagado com sucesso!",
      });
    });
});

app.post("/login", async (req, res) => {
   /*await sleep(3000);

    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        })
    }*/

  const user = await User.findOne({
    attributes: ["id", "name", "email", "password", "image"],
    where: {
      email: req.body.email,
    },
  });
  if (user === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Usuário ou senha incorreta!",
    });
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Usuário ou senha incorreta!",
    });
  }

  var token = jwt.sign({ id: user.id }, process.env.SECRET, {
    //expiresIn: 600 //10
    expiresIn: "7d", //7 dias
  });

  const {name, image} = user;

  if(image){
    var endImage = process.env.URL_IMG + "/files/users/" + image;
}else{
    var endImage = process.env.URL_IMG + "/files/users/icone_usuario.png";
}  

  return res.json({
    erro: false,
    mensagem: "Login realizado com sucesso!",
    user: {name, image: endImage},
    token,
  });
});

app.get("/val-token", eAdmin, async (req, res) => {
  await User.findByPk(req.userId, { attributes: ["id", "name", "email"] })
    .then((user) => {
      return res.json({
        erro: false,
        user,
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Necessário realizar o login para acessar a página!",
      });
    });
});

app.post("/add-user-login", async (req, res) => {
  var dados = req.body;

  const schema = yup.object().shape({
    /*password: yup.string("Erro: Necessário preencher o campo senha!")
        .required("Erro: Necessário preencher o campo senha!")
        .min(6,"Erro: A senha deve ter no mínimo 6 caracteres!"),*/
    email: yup
      .string("Erro: Necessário preencher o campo e-mail!")
      .email("Erro: Necessário preencher o campo e-mail!")
      .required("Erro: Necessário preencher o campo e-mail!"),
    name: yup
      .string("Erro: Necessário preencher o campo nome!")
      .required("Erro: Necessário preencher o campo nome!"),
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }

  /*if(!(await schema.isValid(dados))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Necessário preencher todos os campos!"
        });
    }*/

  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (user) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este e-mail já está cadastrado!",
    });
  }

  dados.password = await bcrypt.hash(dados.password, 8);

  await User.create(dados)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Usuário cadastrado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Usuário não cadastrado com sucesso!",
      });
    });
});

app.get("/view-profile", eAdmin, async (req, res) => {
  //recuperando o id do usuário que está no token
  const id = req.userId;

  await User.findByPk(id)
    .then((user) => { 
        
        if(user.image){
            var endImage = process.env.URL_IMG + "/files/users/" + user.image;
        }else{
            var endImage = process.env.URL_IMG + "/files/users/icone_usuario.png";
        }        

      return res.json({
        erro: false,
        user: user,
        endImage
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum usuário encontrado!",
      });
    });
});

app.put("/edit-profile", eAdmin, async (req, res) => {
  //recuperando o id do usuário que está no token
  const id = req.userId;
  const dados = req.body;

  const schema = yup.object().shape({
    email: yup
      .string("Erro: Necessário preencher o campo e-mail!")
      .email("Erro: Necessário preencher o campo e-mail!")
      .required("Erro: Necessário preencher o campo e-mail!"),
    name: yup
      .string("Erro: Necessário preencher o campo nome!")
      .required("Erro: Necessário preencher o campo nome!"),
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }

  const user = await User.findOne({
    where: {
      email: req.body.email,
      id: {
        [Op.ne]: id,
      },
    },
  });

  if (user) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este e-mail já está cadastrado!",
    });
  }

  await User.update(dados, { where: { id } })
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Perfil editado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Perfil não editado com sucesso!",
      });
    });
});

app.put("/edit-profile-password", eAdmin, async (req, res) => {
  const id = req.userId;
  const { password } = req.body;

  const schema = yup.object().shape({
    password: yup
      .string("Erro: Necessário preencher o campo senha!")
      .required("Erro: Necessário preencher o campo senha!")
      .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }

  var passwordCrypt = await bcrypt.hash(password, 8);

  await User.update({ password: passwordCrypt }, { where: { id } })
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Senha editada com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Senha não editada com sucesso!",
      });
    });
});

app.post("/recover-password", async (req, res) => {
  let dados = req.body;

  const user = await User.findOne({
    attributes: ["id", "name", "email"],
    where: {
      email: dados.email,
    },
  });
  if (user === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Usuário não encontrado!",
    });
  }

  dados.recover_password = (
    await bcrypt.hash(user.id + user.name + user.email, 8)
  )
    .replace(/\./g, "")
    .replace(/\//g, "");

  await User.update(dados, { where: { id: user.id } })
    .then(() => {
      var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      var message = {
        from: process.env.EMAIL_FROM_PASS,
        to: dados.email,
        subject: "Instrução para recuperar a senha",
        text:
          "Prezado(a), Cesar.\n\n Você solicitou alteração de senha.\n\nPara continuar o processo de recuperação de sua senha, clique no link abaixo ou cole o endereço no seu navegador:  " +
          dados.url +
          dados.recover_password +
          " \n\nSe você não solicitou essa alteração, nenhuma ação é necessária. Sua senha permanecerá a mesma até que você ative este código.\n\n",
        html:
          "Prezado(a), Cesar.<br><br> Você solicitou alteração de senha.<br><br>Para continuar o processo de recuperação de sua senha, clique no link abaixo ou cole o endereço no seu navegador: <a href='" +
          dados.url +
          dados.recover_password +
          "'>" +
          dados.url +
          dados.recover_password +
          "</a> <br><br>Se você não solicitou essa alteração, nenhuma ação é necessária. Sua senha permanecerá a mesma até que você ative este código.<br><br>",
      };

      transport.sendMail(message, function (err) {
        if (err)
          return res.status(400).json({
            erro: true,
            mensagem:
              "Erro: E-mail com as intruções para recuperar a senha não enviado, tente novamente!",
          });

        return res.json({
          erro: false,
          mensagem:
            "Erro: E-mail enviado com instruções para recuperar a senha. Acesse a sua caixa de e-mail para recuperar a senha!",
        });
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem:
          "Erro: E-mail com as intruções para recuperar a senha não enviado, tente novamente!",
      });
    });
});

app.get("/val-key-recover-pass/:key", async (req, res) => {
  const { key } = req.params;

  const user = await User.findOne({
    attributes: ["id"],
    where: {
      recover_password: key,
    },
  });
  if (user === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Link inválido!",
    });
  }

  return res.json({
    erro: false,
    mensagem: "Chave é válida!",
  });
});

app.put("/update-password/:key", async (req, res) => {
  const { key } = req.params;

  const { password } = req.body;

  const schema = yup.object().shape({
    password: yup
      .string("Erro: Necessário preencher o campo senha!")
      .required("Erro: Necessário preencher o campo senha!")
      .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }

  var passwordCrypt = await bcrypt.hash(password, 8);

  await User.update(
    { password: passwordCrypt, recover_password: null },
    { where: { recover_password: key } }
  )
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Senha editada com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Senha não editada com sucesso!",
      });
    });
});

app.put("/edit-profile-image", eAdmin, upload.single("image"), async (req, res) => {
    if (req.file) {

        await User.findByPk(req.userId)
        .then(user => {
            const imgOld = './public/upload/users/'+ user.dataValues.image;

            fs.access(imgOld, (err) => {
                if(!err){
                    fs.unlink(imgOld, () => {});
                }
            });

        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Perfil não encontrado!",
              }); 
        });

        await User.update({image: req.file.filename}, { where: { id: req.userId } })
        .then(() => {
          return res.json({
            erro: false,
            mensagem: "Imagem do perfil editado com sucesso!",
            image: process.env.URL_IMG + "/files/users/" + req.file.filename
          });
        })
        .catch(() => {
          return res.status(400).json({
            erro: true,
            mensagem: "Erro: Imagem do perfil não editado com sucesso!",
          });
        });     
    } else {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Selecione uma imagem válida JPEG ou PNG!",
          });
    }
  }
);

app.put("/edit-user-image/:id", eAdmin, upload.single("image"), async (req, res) => {
  if (req.file) {
    const { id } = req.params;
    console.log("Aquiiiiiii: " + id);

    await User.findByPk(id)
    .then(user => {
        const imgOld = './public/upload/users/'+ user.dataValues.image;

        fs.access(imgOld, (err) => {
            if(!err){
                fs.unlink(imgOld, () => {});
            }
        });

    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário não encontrado!",
          }); 
    });

    await User.update({image: req.file.filename}, { where: { id: id } })
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Imagem do usuário editado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Imagem do usuário não editado com sucesso!",
      });
    });     
} else {
    return res.status(400).json({
        erro: true,
        mensagem: "Erro: Selecione uma imagem válida JPEG ou PNG!",
      });
}
  }
);
//#######################Fim do módulo User #################################


//#######################Início do módulo Fabricante #########################
app.post("/fabricante", eAdmin, async (req, res) => {
  var dados = req.body;

  const schema = yup.object().shape({   
    
    nome_fabricante: yup
      .string("Erro: Necessário preencher o campo nome do fabricante!")
      .required("Erro: Necessário preencher o campo nome do fabricante!"),
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }  

  const fabricante = await Fabricante.findOne({
    where: {
      nome_fabricante: req.body.nome_fabricante,
    },
  });

  if (fabricante) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este fabricante já está cadastrado!",
    });
  }  

  await Fabricante.create(dados)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Fabricante cadastrado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Fabricante não cadastrado com sucesso!",
      });
    });
});

app.get("/fabricantes/:page", eAdmin, async (req, res) => {
  const { page = 1 } = req.params;
  const limit = 7;
  let lastPage = 1;

  const countFabricante = await Fabricante.count();
  if (countFabricante === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum fabricante encontrado!",
    });
  } else {
    lastPage = Math.ceil(countFabricante / limit);
  }

  await Fabricante.findAll({
    attributes: ["id", "nome_fabricante"],
    order: [["id", "DESC"]],
    offset: Number(page * limit - limit),
    limit: limit,
  })
    .then((fabricantes) => {
      return res.json({
        erro: false,
        fabricantes,
        countFabricante,
        lastPage,
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum fabricante encontrado!",
      });
    });
});
//#######################Fim do módulo Fabricante ############################

//#######################Início do módulo Modelo #########################
app.post("/modelo", eAdmin, async (req, res) => {
  var dados = req.body;

  const schema = yup.object().shape({   
    
    nome_modelo: yup
      .string("Erro: Necessário preencher o campo nome do modelo!")
      .required("Erro: Necessário preencher o campo nome do modelo!"),
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }  

  const modelo = await Modelo.findOne({
    where: {
      nome_modelo: req.body.nome_modelo,
    },
  });

  if (modelo) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este modelo já está cadastrado!",
    });
  }  

  await Modelo.create(dados)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Modelo cadastrado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Modelo não cadastrado com sucesso!",
      });
    });
});
//#######################Fim do módulo Modelo ############################

//#######################Início do módulo Veiculo #########################
app.post("/veiculo", eAdmin, async (req, res) => {
  var dados = req.body;

  const schema = yup.object().shape({   
    
    placa: yup
      .string("Erro: Necessário preencher o campo placa!")
      .required("Erro: Necessário preencher o campo placa!"),
    renavam: yup
      .string("Erro: Necessário preencher o campo renavam!")
      .required("Erro: Necessário preencher o campo renavam!"),
    ano_fabricacao: yup
      .string("Erro: Necessário preencher o campo ano de fabricação!")
      .required("Erro: Necessário preencher o campo ano de fabricação!"),
    fabricante_id: yup
      .string("Erro: Necessário preencher o campo nome do fabricante!")
      .required("Erro: Necessário preencher o campo nome do fabricante!"),
    modelo_id: yup
      .string("Erro: Necessário preencher o campo modelo do fabricante!")
      .required("Erro: Necessário preencher o campo modelo do fabricante!"),
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }  

  const veiculo = await Veiculo.findOne({
    where: {
      placa: req.body.placa,
    },
  });

  if (veiculo) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este veículo já está cadastrado!",
    });
  }  

  await Veiculo.create(dados)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Veículo cadastrado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Veículo não cadastrado com sucesso!",
      });
    });
});
//#######################Fim do módulo Veiculo ############################

app.listen(8080, () => {
  console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});
