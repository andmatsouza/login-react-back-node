const express = require("express");
const appRouter = require('./src/api/app');
const userRouter = require('./src/routes/user');
const fabricanteRouter = require('./src/routes/fabricante');
const modeloRouter = require('./src/routes/modelo');
const veiculoRouter = require('./src/routes/veiculo');

const app = express();

const port = parseInt(`${process.env.PORT}`);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}: http://localhost:${port}`);
});

app.use(appRouter([userRouter,fabricanteRouter,modeloRouter,veiculoRouter]));
//module.exports = appRouter([userRouter,fabricanteRouter,modeloRouter,veiculoRouter]);