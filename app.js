const express = require("express");
var cors = require("cors");
const path = require('path');
const userRouter = require('./src/routes/user');
const fabricanteRouter = require('./src/routes/fabricante');
const modeloRouter = require('./src/routes/modelo');
const veiculoRouter = require('./src/routes/veiculo');
const postoRouter = require('./src/routes/posto');
const combustivelRouter = require('./src/routes/combustivel');
const abastecimentoRouter = require('./src/routes/abastecimento');
const oficinaRouter = require('./src/routes/oficina');
const servicoRouter = require('./src/routes/servico');
const manutencaoRouter = require('./src/routes/manutencao');
const oleoRouter = require('./src/routes/oleo');
const trocaOleoRouter = require('./src/routes/trocaOleo');

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

app.use([userRouter,fabricanteRouter,modeloRouter,veiculoRouter, postoRouter, combustivelRouter,abastecimentoRouter, oficinaRouter, servicoRouter, manutencaoRouter, oleoRouter, trocaOleoRouter]);




const port = parseInt(`${process.env.PORT}`);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}: http://localhost:${port}`);
});