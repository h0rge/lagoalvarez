import express from "express";
import Cita from "../modelos/Cita.js";

const router = express.Router();
    
// Obtener las citas de un paciente
router.get("/paciente/:dni", async (req, res) => {
try {
    const citas = await Cita.find({
        pacienteDNI: req.params.dni.toUpperCase(),
    });

    res.json(citas);
} catch (error) {
    console.error("ERROR AL OBTENER CITAS DEL PACIENTE:", error);

    res.status(500).json({
    mensaje: "Error al obtener las citas del paciente",
    });
}
});

// Obtener todos
router.get("/", async (req, res) => {
try {
    const citas = await Cita.find(); //es el select de sql
    console.log("Citas obtenidas:", citas);

    res.json(citas);
} catch (error) {
    res.status(500).json({
    mensaje: ("Error al obtener citas", error),
    });
}
});

// Crear
router.post("/", async (req, res) => {
try {
    const cita = new Cita(req.body);

    const nuevaCita = await cita.save();

    res.status(201).json(nuevaCita);

} catch (error) {
    console.error("ERROR AL CREAR CITA:", error);

    res.status(500).json({
    mensaje: "Error al crear la cita",
    });
}
});



// Modificar cita
router.put("/:id", async (req, res) => {
try {
    const cita = await Cita.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    );

    if (!cita) {
    return res.status(404).json({
        mensaje: "Cita no encontrada",
    });
    }

    res.json(cita);
} catch (error) {
    res.status(500).json({
    mensaje: ("Error al modificar la cita", error),
    });
}
});

// Eliminar
router.delete("/:id", async (req, res) => {
try {
    const cita = await Cita.findOneAndDelete({
    _id: req.params.id,
    });

    if (!cita) {
    return res.status(404).json({
        mensaje: "Cita no encontrada",
    });
    }

    res.json({
    mensaje: "Cita eliminada",
    });
} catch (error) {
    res.status(500).json({
    mensaje: ("Error al eliminar la cita", error),
    });
}
});

export default router;