
const express = require('express');
const cors = require('cors')

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = '/api/users';

    // Middlewares
    this.middlewares();

    // Rutas de la aplicación
    this.routes();
  }

  middlewares() {
    // Directorio público
    this.app.use(express.static('public'));

    // Parseo del body
    this.app.use(express.json());

    // CORS
    this.app.use(cors());
  }

  routes() {
    this.app.use(this.usersPath, require('../routes/user'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server escuchando en el puerto ${this.port}`);
    });
  }
}

module.exports = Server;