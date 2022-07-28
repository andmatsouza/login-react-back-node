//import app from "./app";
const app = require('./app');
//import database from 'ms-commons/data/db';

(async () => {
  try {
    const port = parseInt(`${process.env.PORT}`);
    //console.log(`Running database ${process.env.DB_NAME}`);

    //await database.sync();

    app.listen(port);
    //console.log(`Running ${process.env.MS_NAME} on port ${port}`);
    console.log(`Servidor iniciado na porta ${port}: http://localhost:${port}`);
    
  } catch (error) {
    console.log(`${error}`);
  }
})();