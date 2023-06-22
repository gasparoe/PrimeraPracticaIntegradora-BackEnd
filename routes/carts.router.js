const express = require("express");
const { Router } = express;
const Cart = require("../dao/models/cartModels");

const router = new Router();

//ENDPOINT GET "/carts/:usuario": Muestra el carrito del usuario logueado
router.get("/:usuario", (req, res) => {
  let usuario = req.params.usuario;
  Cart.findOne({ usuario: usuario })
    .lean()
    .then((carr) => {
      let data = carr;
      res.status(200).send({
        message: "Logueado correctamente",
        data: data,
      });
    })
    .catch((err) => res.status(500).send({ error: "Server Error" }));
});

//ENDPOINT POST "/carts/:usuario/:pid": Creo el carrito para el usuario si no existe o acutalizo el carrito ya existente para ese usuario
router.post("/:usuario/:pid", (req, res) => {
  let usuario = req.params.usuario;
  let pid = req.params.pid;

  let productos = [];
  let existeProducto = false;

  Cart.findOne({ usuario: usuario })
    .lean()
    .then((cart) => {
      if (!cart) {
        productos.push({
          pid: pid,
          cantidad: 1,
        });
        const newCart = new Cart({
          usuario: usuario,
          productos: productos,
        });
        newCart
          .save()
          .then((cart) => {
            res.status(200).send({
              message: "Se ha creado el carrito",
              data: cart,
            });
          })
          .catch((err) => res.status(500).send({ error: "Server Error" }));
      } else {
        cart.productos.forEach((producto, index) => {
          if (producto.pid == pid) {
            existeProducto = true;

            let productoNuevo = producto;
            productoNuevo.cantidad = productoNuevo.cantidad + 1;
            cart.productos[index] = productoNuevo;

            Cart.findOneAndUpdate(
              { usuario: usuario },
              { productos: cart.productos },
              { new: true }
            ).then((cart) => {
              res.status(200).send({
                message: "Se ha actualizado el carrito",
                data: cart,
              });
            });
          }
        });
        if (!existeProducto) {
          cart.productos.push({
            pid: pid,
            cantidad: 1,
          });
          Cart.findOneAndUpdate(
            { usuario: usuario },
            { productos: cart.productos },
            { new: true }
          )
            .then((cart) => {
              res.status(200).send({
                message: "Se ha actualizado el carrito",
                data: cart,
              });
            })
            .catch((err) => res.status(500).send({ error: "Server Error" }));
        }
      }
    })
    .catch((err) => res.status(500).send({ error: "Server Error" }));
});

module.exports = router;
