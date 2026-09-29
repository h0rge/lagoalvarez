import express from "express";
import Paciente from "../modelos/Paciente.js";

const router = express.Router();

// Crear

router.post ("/", async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);
        const paciente = new Paciente(req.body);
        
        const nuevoPaciente = await paciente.save();

        res.status(201).json(nuevoPaciente); //convierte json en string y lo envia al cliente

    } catch (error) {
        console.error("Error al crear paciente:", error);

        res.status(500).json({
             message: "Error al crear paciente"
            }
        );
    }
});

export default router;