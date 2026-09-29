import express from "express";
import fs from "fs";
import cors from "cors"; //evita bloqueos entre servidores
import "dotenv/config"  //para poder usar variables de entorno
/* import {MongoClient} from "mongodb"; //importa módulo de conexion a MongoDB */
import mongoose from "mongoose"; //importa módulo de conexion a MongoDB

import pacientesRutas from './rutas/pacientes.rutas.js';
//importa el modelo de paciente y las funciones de la api de pacientes

//creamos la aplicacion express
const app = express();
app.use(cors());
app.use(express.json()); //para poder recibir json en el body de las peticiones
app.use(`/api/pacientes`, pacientesRutas); //usa las rutas de pacientes
// USA EL PUERTO DEFINIDO EN LAS VARIABLES DE ENTORNO, SI NO COGE 3000
const PORT = process.env.PORT || 3000;

//URL conexion con MongoDB

const MONGO_URI = process.env.MONGO_URI;

//NO CREAMOS EL CLIENTE MONGODB O LA CADENA DE CONEXION, usamos mongoose para conectarnos a la base de datos
/* const client = new MongoClient(MONGO_URI); */

//ruta de la api para obtener provincias y municipios
app.get('/api/municipios', (req, res) => {
    console.log("peticion recibida");

    // Leer el fichero JSON
    const datos = fs.readFileSync("./backend/data/municipios.json", "utf8");

    const datosJson = JSON.parse(datos);

    res.json(datosJson);

});


async function iniciaServer() {
    try {
        //conectamos con la base de datos
        // await client.connect(); SI QUISIESEMOS USAR MONGODB
        await mongoose.connect(MONGO_URI);
        console.log("Conectado a MongoDB");
        //iniciamos el servidor
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en el http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error);
    }
}

iniciaServer();