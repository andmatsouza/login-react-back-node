const express = require("express");
var cors = require("cors");
//const yup = require("yup");
//const nodemailer = require("nodemailer");
//const { Op } = require("sequelize");
//const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");
//require("dotenv").config();
//const fs = require('fs');
const path = require('path');
const userRouter = require('./src/routes/user');
const fabricanteRouter = require('./src/routes/fabricante');
const modeloRouter = require('./src/routes/modelo');

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

app.use([userRouter,fabricanteRouter,modeloRouter]);




const port = parseInt(`${process.env.PORT}`);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}: http://localhost:${port}`);
});