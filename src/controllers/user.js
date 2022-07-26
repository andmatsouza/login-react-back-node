const express = require("express");
const app = express();
const yup = require("yup");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require('fs');
const path = require('path');
app.use('/files', express.static(path.resolve(__dirname,"public", "upload")));
//const { eAdmin } = require("../middlewares/auth");
//const upload = require("../middlewares/uploadImgProfile");
const repository = require("../models/UserRepository");


async function getUsers(req, res) {
  const { page = 1 } = req.params;
  const limit = 7;
  let lastPage = 1;  

  const countUser = await repository.countUser();
  if (countUser === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum usuário encontrado!",
    });
  } else {
    lastPage = Math.ceil(countUser / limit);
  }

  await repository.findAll(page   
  )
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

async function getUser(req, res) {
  const { id } = req.params;
  
  await repository.findById(id)
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
};

async function AddUser(req, res) {
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

  const user = await repository.findOneUser(req.body.email);

  if (user) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este e-mail já está cadastrado!",
    });
  }

  dados.password = await bcrypt.hash(dados.password, 8);

  await repository.add(dados)
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
};

async function setUser(req, res) {
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
  
  const user = await repository.findOneUserId(req.body.email, id);  

  if (user) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este e-mail já está cadastrado!",
    });
  }

  await repository.set(dados, id)
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
};

async function setUserPassword(req, res) {
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

  await repository.setPassword(passwordCrypt, id)
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
};

async function deleteUser(req, res) {
  const { id } = req.params;

  await repository.remove(id)
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
};

async function loginUser(req, res) {
  /*await sleep(3000);

   function sleep(ms) {
       return new Promise((resolve) => {
           setTimeout(resolve, ms);
       })
   }*/

 const user = await repository.findOneUser(req.body.email);
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
};

async function addLoginUser(req, res) {
  var dados = req.body;

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

  const user = await repository.findOneUser(req.body.email);  

  if (user) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este e-mail já está cadastrado!",
    });
  }

  dados.password = await bcrypt.hash(dados.password, 8);

  await repository.add(dados)  
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
};

async function validateToken(req, res) {
  await repository.findById(req.userId)
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
};

async function getViewProfile(req, res) {
  //recuperando o id do usuário que está no token
  const id = req.userId;

  await repository.findById(id)
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
};

async function setEditProfile(req, res) {
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

  const user = await repository.findOneUserId(req.body.email, id);  

  if (user) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este e-mail já está cadastrado!",
    });
  }

  await repository.set(dados, id)
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
};

async function setProfilePassword(req, res) {
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

  await repository.setPassword(passwordCrypt, id)
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
};


async function recoverPassword(req, res) {
  let dados = req.body;

  const user = await repository.findOneUser(dados.email);
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

  await repository.set(dados, user.id)
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
};

async function valKeyRecoverPassword(req, res) {
  const { key } = req.params;

  const user = await repository.findOneUserRecoverKey(key);
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
};

async function setRecoverUpdatePassword(req, res) {
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

  await repository.setPasswordRecover(passwordCrypt, key)
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
};

async function setEditProfileImage(req, res) {
  if (req.file) {

      await repository.findById(req.userId)
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

      await repository.setProfileImage(req.file.filename, req.userId)
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
};

async function setEditUserImage(req, res) {
  if (req.file) {
    const { id } = req.params;
    
    await repository.findById(id)
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
   
    await repository.setProfileImage(req.file.filename, id)
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
};


module.exports = {getUsers, 
                  getUser, 
                  AddUser, 
                  setUser, 
                  setUserPassword, 
                  deleteUser, 
                  loginUser, 
                  addLoginUser, 
                  validateToken, 
                  getViewProfile, 
                  setEditProfile,
                  setProfilePassword,
                  recoverPassword,
                  valKeyRecoverPassword,
                  setRecoverUpdatePassword,
                  setEditProfileImage,
                  setEditUserImage};