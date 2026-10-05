import express from "express";
import Paciente from "../modelos/Paciente.js";

const router = express.Router();


// Obtener todos
router.get("/", async (req, res) => {
    try {
        const pacientes = await Paciente.find();

        res.json(pacientes);

    } catch (error) {

        res.status(500).json({
            message: ("Error al obtener pacientes: ", error)
        });
    }
});

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

router.delete("/:dnipac", async (req, res) => {
    try {
        const paciente = await Paciente.findOneAndDelete({
            dnipac: req.params.dnipac
        });

        if (!paciente) {
            return res.status(404).json({
                mensaje: "Paciente no encontrado"
            });
        }

        res.json({mensaje:"paciente eliminado"});


    } catch (error) {
        console.error("Error al eliminar paciente:", error);
        res.status(500).json({
            mensaje: ("Error al eliminar paciente", error)
        });
    }
});

router.put("/:dnipac", async (req, res) => {
    try {
        const paciente = await Paciente.findOneAndUpdate(
            { dnipac: req.params.dnipac },
            req.body,
            { new: true }
        );

        if (!paciente) {
            return res.status(404).json({
                mensaje: "Paciente no encontrado"
            });
        }

        res.json({paciente});


    } catch (error) {
        
        res.status(500).json({
            mensaje: ("Error al eliminar paciente", error)
        });
    }
});
// O export
export default router;