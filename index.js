const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const ManagerMongo = require("./dao/mongoDao/db");
const Product = require("./dao/models/productModels");
const Chat = require("./dao/models/chatModels");

//SOCKET
const { Server } = require("socket.io");
const io = new Server(server);

//MIDDELWARE PARA JSON
app.use(express.json());

let productos = [];
let mensajes = [];

//CONEXION A BASE DE DATOS
const databaseConnect = new ManagerMongo(
  "mongodb+srv://usuarioprueba:pruebausuario@cluster.4fnlo6h.mongodb.net/ecommerce"
);

//INICIALIZAR SOCKET EN EL SERVIDOR
io.on("connection", (socket) => {
  console.log("Usuario conectado");

  Product.find({})
    .lean()
    .then((pr) => {
      productos = pr;
      socket.emit("productos", productos);
    })
    .catch((err) => socket.emit("estado", err));

  Chat.find({})
  .lean()
  .then((respuesta) => {
    messages = respuesta;
    io.sockets.emit("chats", messages);
  })
  .catch((err) => socket.emit("estado", err));

});

//Middleware para mostrar productos actualizados
const middlewareMuestraProductos = async () => {
  console.log("UTILIZO EL MIDDLEWARE");
  Product.find({})
    .lean()
    .then((pr) => {
      productos = pr;
      io.emit("productos", productos);
    })
    .catch((err) => io.emit("estado", err));
};

//Middleware para mostrar chats actualizados
const middlewareMuestraChats = async () => {
  console.log("UTILIZO EL MIDDLEWARE DE MSJS");
  Chat.find({})
    .lean()
    .then((msjs) => {
      mensajes = msjs;
      io.emit("chats", mensajes);
    })
    .catch((err) => io.emit("estado", err));
};


const handlebars = require("express-handlebars");
const routerProducts = require("./routes/products.router");
const routerCarts = require("./routes/carts.router");
const routerChats = require("./routes/chats.router");
//const messages = require("./dao/models/chatModels");

//ROUTES
app.use("/products", routerProducts, middlewareMuestraProductos);
app.use("/carts", routerCarts);
app.use("/chat", routerChats, middlewareMuestraChats);

//CARPETA PUBLICA ARCHIVOS ESTATICOS
app.use(express.static(__dirname + "/public"));

//CONFIGURACION HANDLEBARS VIEWS Y IMAGES
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("images", __dirname + "/images");
app.set("view engine", "handlebars");

//Endpoint a raiz
app.get("/", (req, res) => {
  Product.find({})
    .lean()
    .then((pr) => {
      let data = {
        productos: pr,
      };
      res.status(200);
      res.render("products");
    })
    .catch((err) => res.status(500).send({ error: "Server Error" }));
});

//INICIO SERVIDOR Y CONECTO A DATABASE
server.listen(8080, () => {
  console.log("Server running on port 8080");
  databaseConnect.connect();
});
