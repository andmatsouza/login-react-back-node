const { Op } = require("sequelize");
const User = require("../models/User");

function countUser() { return User.count(); };

function findAll(pages) {
  const { page = 1 } = pages;
  const limit = 7;
  let lastPage = 1; 

  return User.findAll({
    attributes: ["id", "name", "email"],
    order: [["id", "DESC"]],
    offset: Number(page * limit - limit),
    limit: limit,
  });    
};

function findById(id) {
  return User.findByPk(id, { attributes: ["id", "name", "email", "image"] });
}

function findOneUser(email) {
  return User.findOne({
    attributes: ["id", "name", "email", "password", "image"],
    where: {
      email: email,
    },
  });
}

function findOneUserId(email, id) {
  return User.findOne({
    where: {
      email: email,
      id: {
        [Op.ne]: id,
      },
    },
  });
}

function findOneUserRecoverKey(key) {
  return User.findOne({
    attributes: ["id"],
    where: {
      recover_password: key,
    },
  });
}

function add(user) {
  return User.create(user);
}

function set(user, id) {
  return User.update(user, { where: { id } });  
}

function setPassword(passwordCrypt, id) {
  return User.update({ password: passwordCrypt }, { where: { id } }); 
}

function setPasswordRecover(passwordCrypt, key) {
  return User.update(
    { password: passwordCrypt, recover_password: null },
    { where: { recover_password: key } }
  )
}

function setProfileImage(filename, id) {
  return User.update({image: filename}, { where: { id: id } }); 
}

function remove(id) {
  return User.destroy({ where: { id } });
   
}



module.exports = {countUser, findAll, findById, findOneUser, findOneUserId, findOneUserRecoverKey, add, set, setPassword, remove, setPasswordRecover, setProfileImage};