const http = require("http");
const url = require("url");
const fs = require("fs");
var _ = require("lodash");

http
  .createServer((req, res) => {
    const { nombre, precio } = url.parse(req.url, true).query;

    if (req.url == "/") {
      res.writeHead(200, { "Content-Type": "text:html" });
      fs.readFile("index.html", "utf8", (err, html) => {
        res.end(html);
      });
    }

    let deporte = {
      nombre,
      precio,
    };

    // 1. Crear una ruta que reciba el nombre y precio de un nuevo deporte, lo persista en un
    // archivo JSON.
    if (req.url.startsWith("/agregar")) {
      let data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
      let deportes = data.deportes;
      deportes.push(deporte);
      fs.writeFileSync("deportes.json", JSON.stringify(data, null, 1));
      res.end();
    }

    // 2. Crear una ruta que al consultarse devuelva en formato JSON todos los deportes
    // registrados.
    if (req.url.includes("/deportes")) {
      fs.readFile("deportes.json", (err, data) => {
        res.write(data);
        res.end();
      });
    }

    // 3. Crear una ruta que edite el precio de un deporte registrado utilizando los parámetros
    // de la consulta y persista este cambio.
    if (req.url.includes("/editar")) {
      let data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
      let deportes = data.deportes;
      _.map(deportes, (d) => {
        if (d.nombre == nombre) {
          d.precio = precio;
        } else {
          return d;
        }
      });
      fs.writeFileSync("deportes.json", JSON.stringify(data, null, 1));
      res.end();
    }

    //   4. Crear una ruta que elimine un deporte solicitado desde el cliente y persista este
    //   cambio
    if (req.url.startsWith("/eliminar")) {
      let data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
      let deportes = data.deportes;
      data.deportes = _.filter(deportes, (d) => {
        return d.nombre !== nombre;
      });
      fs.writeFileSync("deportes.json", JSON.stringify(data, null, 1));
      res.end();
    }
  })
  .listen(3000, console.log("Servidor ON"));
