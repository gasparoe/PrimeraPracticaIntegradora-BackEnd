let socket = io();

socket.on("productos", (data) => {
  console.log(data);
  render(data);
});

socket.on("carrito", (data) => {
  console.log(data);
  renderCarrito(data);
});

//FUNCION  RENDERIZAR LOS PRODUCTOS
function render(data) {
  const html = data
    .map((elem) => {
      return `
        <div class="col" style="padding:10px">
                <div class="card" style="width: 18rem;">
                    <img src="images/No_Image_Available.jpeg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h3 class="card-title">${elem.title}</h3>
                        <p class="card-text">${elem.description}</p>
                        <h2 class="card-title">$${elem.price}</h2>
                        <div>
                            <em class="card-title">Disponibles: ${elem.stock}</em>
                        </div>
                        <div style="padding:10px">
                        <a  class="btn btn-success" id=${elem._id} onclick={agregarProducto('${elem._id}')}>Agregar Producto</a>
                        </div>
                        <div style="padding:10px">
                        <a  class="btn btn-danger" id=${elem._id} onclick={deleteProduct('${elem._id}')}>Eliminar Producto</a>
                        </div>
                        <div>
                            <em class="card-title">Codigo: ${elem.code}</em>
                        </div>
                        <div>
                            <em class="card-title">ID Producto: ${elem._id}</em>
                        </div>
                    </div>
                </div>
            </div>
        `;
    })
    .join(" ");
  document.getElementById("caja").innerHTML = html;
}

//FUNCION PARA RENDERIZAR EL CARRITO
function renderCarrito(data) {
  if (data == null) {
    const html = `<div style="width:100vw; text-align: center; color:red;">
    <h4> No se ha encontrado ningun carrito para ese usuario </h4>
    </div>`;
    document.getElementById("cajaCarrito").innerHTML = html;
  } else {
    const html = data
      .map((elem) => {
        return `
        <div class="col-12" style="padding:10px">
                <div class="card" style="width: 100%;">
                    <div class="card-body">
                        <p class="card-title">ID de producto: ${elem.pid}</p>
                        <h6 class="card-title">Cantidad: ${elem.cantidad}</h6>
                    </div>
                </div>
            </div>
        `;
      })
      .join(" ");
    document.getElementById("cajaCarrito").innerHTML = html;
  }
}

//FUNCION AGREGAR PRODUCTO
function addProduct(e) {
  //Tomo los datos del producto desde el formulario.
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    code: document.getElementById("code").value,
    price: document.getElementById("price").value,
    status: true,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
  };

  let productJSON = JSON.stringify(product);

  fetch("http://localhost:8080/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: productJSON,
  })
    .then((respuesta) => {
      return respuesta.json();
    })
    .then((respuesta) => {
      if (respuesta.status == "OK") {
        const html = `<em> Producto creado correctamente </em>`;
        document.getElementById("estado").innerHTML = html;
      } else if (respuesta.status == "ERROR") {
        if (respuesta.status == "ERROR") {
          const html = `<em> Error al crear producto </em>`;
          document.getElementById("estado").innerHTML = html;
        }
      }
    })
    .catch((err) => {
      const html = `<em> Error: ${err} </em>`;
      document.getElementById("estado").innerHTML = html;
    });

  return false;
}

//FUNCION ELIMINAR PRODUCTO
function deleteProduct(id) {
  fetch(`http://localhost:8080/products/${id}`, {
    method: "DELETE",
  })
    .then((respuesta) => {
      return respuesta.json();
    })
    .then((respuesta) => {
      if (respuesta.status == "OK") {
        const html = `<em> Producto eliminado correctamente </em>`;
        document.getElementById("estado").innerHTML = html;
      } else if (respuesta.status == "ERROR") {
        if (respuesta.status == "ERROR") {
          const html = `<em> Error al eliminar el producto </em>`;
          document.getElementById("estado").innerHTML = html;
        }
      }
    })
    .catch((err) => {
      const html = `<em> Error: ${err} </em>`;
      document.getElementById("estado").innerHTML = html;
    });
}

//FUNCION BUSCAR PRODUCTO POR ID
function findProductByID(e) {
  let id = document.getElementById("idProducto").value;

  fetch(`http://localhost:8080/products/${id}`, {})
    .then((respuesta) => {
      return respuesta.json();
    })
    .then((respuesta) => {
      if (respuesta.status == "OK") {
        const html = `<em> Producto buscado correctamente </em>`;
        document.getElementById("estado").innerHTML = html;
        render(respuesta.data.productos);
      } else if (respuesta.status == "ERROR") {
        if (respuesta.status == "ERROR") {
          const html = `<em> Error al buscar el producto </em>`;
          document.getElementById("estado").innerHTML = html;
        }
      }
    })
    .catch((err) => {
      const html = `<em> Error: ${err} </em>`;
      document.getElementById("estado").innerHTML = html;
    });

  return false;
}

//FUNCION ACTUALIZAR PRODUCTO
function updateProduct(e) {
  let title = document.getElementById("title2").value;
  let description = document.getElementById("description2").value;
  let code = document.getElementById("code2").value;
  let price = document.getElementById("price2").value;
  let stock = document.getElementById("stock2").value;
  let category = document.getElementById("category2").value;

  const product = {};

  //Solo actualizo las caracteristicas completas en el formulario. Las que estan en blanco no se actualizan.

  if (title != "") {
    product.title = title;
  }
  if (description != "") {
    product.description = description;
  }
  if (code != "") {
    product.code = code;
  }
  if (price != "") {
    product.price = price;
  }
  if (stock != "") {
    product.stock = stock;
  }
  if (category != "") {
    product.category = category;
  }

  let productJSON = JSON.stringify(product);

  let id = document.getElementById("id2").value;

  fetch(`http://localhost:8080/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: productJSON,
  })
    .then((respuesta) => {
      return respuesta.json();
    })
    .then((respuesta) => {
      if (respuesta.status == "OK") {
        const html = `<em> Producto actualizado correctamente </em>`;
        document.getElementById("estado").innerHTML = html;
      } else if (respuesta.status == "ERROR") {
        if (respuesta.status == "ERROR") {
          const html = `<em> Error al actualizar </em>`;
          document.getElementById("estado").innerHTML = html;
        }
      }
    })
    .catch((err) => {
      const html = `<em> Error: ${err} </em>`;
      document.getElementById("estado").innerHTML = html;
    });

  return false;
}

//FUNCION BUSCAR CARRITO POR USUARIO
function findCarritoById(e) {
  let usuario = document.getElementById("idUsuario").value;

  if (usuario == "") {
    usuario = "test";
  }

  fetch(`http://localhost:8080/carts/${usuario}`)
    .then((respuesta) => {
      return respuesta.json();
    })
    .then((respuesta) => {
      console.log(respuesta.data.productos);
      renderCarrito(respuesta.data.productos);
    })
    .catch((err) => {
      renderCarrito(null);
      const html = `<em> Error: ${err} </em>`;
      document.getElementById("estado").innerHTML = html;
    });

  return false;
}

//FUNCION AGREGAR PRODUCTOAL CARRITO POR USUARIO
function agregarProducto(idproducto) {
  let usuario = document.getElementById("idUsuario").value;

  fetch(`http://localhost:8080/carts/${usuario}/${idproducto}`, {
    method: "POST",
  })
    .then((respuesta) => {
      return respuesta.json();
    })
    .then((respuesta) => {
      renderCarrito(respuesta.data.productos);
      if (respuesta.status == "OK") {
      } else if (respuesta.status == "ERROR") {
      }
    })
    .catch((err) => {
      const html = `<em> Error: ${err} </em>`;
      document.getElementById("estado").innerHTML = html;
    });
}
