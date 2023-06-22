let socket = io();

socket.on("chats", (mensajes) => {
  render(mensajes);
});

//FUNCION RENDERIZAR LOS MENSAJES
function render(data) {
  const html = data
    .map((elem) => {
      return `
        <div class="col-12" style="padding:5px">
                <div class="card" style="width: 100%;">
                    <div class="card-body">
                        <h3 class="card-title">${elem.usuario}</h3>
                        <p class="card-text">"${elem.mensaje}"</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    })
    .join(" ");
  document.getElementById("caja2").innerHTML = html;
}

//FUNCION ENVIAR MENSAJE
function enviarMensaje(e) {

  //Tomo los datos del mensaje desde el formulario.
  const mensaje = {
    usuario: document.getElementById("usuario").value,
    mensaje: document.getElementById("mensaje").value,
  };

  let mensajeJSON = JSON.stringify(mensaje);


  fetch("http://localhost:8080/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: mensajeJSON,
  })
    .then((respuesta) => {
      return respuesta.json();
    })
    .then((respuesta) => {
      if (respuesta.status == "OK") {
        const html = `<em> Mensaje Enviado correctamente </em>`;
        document.getElementById("estado2").innerHTML = html;
      } else if (respuesta.status == "ERROR") {
        if (respuesta.status == "ERROR") {
          const html = `<em> Error al enviar mensaje </em>`;
          document.getElementById("estado2").innerHTML = html;
        }
      }
    })
    .catch((err) => {
      const html = `<em> Error: ${err} </em>`;
      document.getElementById("estado").innerHTML = html;
    });

  return false;
}
