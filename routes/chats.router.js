const express = require("express");
const { Router } = express;
const Chat = require("../dao/models/chatModels");

const router = new Router();

//ENDPOINT GET "/chat": Muestra mensajes
router.get("/", (req, res, next) => {
  Chat.find({})
    .lean()
    .then((respuesta) => {
      let messages = {
        messages: respuesta,
      };
      res.status(200);
      res.render("chat");
      next();
    })
    .catch((err) => res.status(500).send({ error: "Server Error" }));
});

//ENDPOINT POST "/chat": Envio de mensajes
router.post("/", (req, res, next) => {
  let data = req.body;
  let mensaje = new Chat(data);
  mensaje
    .save()
    .then((msjs) => {
      res
        .status(201)
        .send({ status: "OK", message: "Mensaje enviado correctamente" });
      next();
    })
    .catch((err) => {
      res.status(200).send({ status: "ERROR", message: err });
      next();
    });
});

module.exports = router;
