const mongoose = require("mongoose");

class ManagerMongo {
  constructor(url) {
    this.url = url;
  }

  async connect() {
    mongoose
      .connect(this.url, { useUnifiedTopology: true, useNewUrlParser: true })
      .then((connect) => {
        console.log("Conexion a DB Existosa");
      })
      .catch((err) => console.log(err));
  }
}

module.exports = ManagerMongo;
