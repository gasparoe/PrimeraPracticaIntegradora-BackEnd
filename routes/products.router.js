const express = require("express");
const { Router } = express;
const Product = require("../dao/models/productModels");

const router = new Router();

//ENDPOINT POST "/products/:pid" muestra el producto con el id ingresado
router.get("/:pid", (req, res) => {
  let pid = req.params.pid;
  Product.findById({ _id: pid })
    .lean()
    .lean()
    .then((pr) => {
      let productos = [];
      productos.push(pr);
      let data = {
        productos: productos,
      };
      res.status(200).send({
        status: "OK",
        data: data,
      });
    })
    .catch((err) => res.status(200).send({ status: "ERROR", message: err }));
});

//ENDPOINT POST: "/products" Creo un producto nuevo
router.post("/", (req, res, next) => {
  let data = req.body;
  let product = new Product(data);
  product
    .save()
    .then((pr) => {
      res
        .status(201)
        .send({ status: "OK", message: "Producto creado correctamente" });
      next();
    })
    .catch((err) => {
      res.status(200).send({ status: "ERROR", message: err });
      next();
    });
});

//ENDPOINT DELETE "/products/:pid: Creo el carrito para el usuario si no existe o acutalizo el carrito ya existente para ese usuario
router.delete("/:pid", (req, res, next) => {
  let pid = req.params.pid;
  Product.deleteOne({ _id: pid })
    .then((pr) => {
      res
        .status(201)
        .send({ status: "OK", message: "Producto eliminado correctamente" });
      next();
    })
    .catch((err) => {
      res.status(200).send({ status: "ERROR", message: err });
      next();
    });
});

//ENDPOINT PUT "/products/:pid": Actualizar producto con id ingresado
router.put("/:pid", (req, res, next) => {
  let pid = req.params.pid;
  let data = req.body;
  Product.updateOne({ _id: pid }, data)
    .then((pr) => {
      res
        .status(201)
        .send({ status: "OK", message: "Producto actualizado correctamente" });
      next();
    })
    .catch((err) => {
      res.status(200).send({ status: "ERROR", message: err });
      next();
    });
});

module.exports = router;
