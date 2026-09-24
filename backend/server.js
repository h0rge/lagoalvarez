import express from "express";
import fs from "fs";
import cors from "cors"; //evita bloqueos entre servidores

//creamos la aplicacion express
const app = express();
app.use(cors());
const PORT = 3000;

//ruta de la api para obtener provincias y municipios
app.get('/api/municipios', (req, res) => {
    console.log("peticion recibida");

    const datos = fs.readFileSync("./backend/data/municipios.json", "utf8");

    const datosJson = JSON.parse(datos);

    res.json(datosJson);

});


app.listen(PORT, () => {
    console.log(`Servidor iniciado en el http://localhost:${PORT}`);
});