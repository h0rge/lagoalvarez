import express from "express";
import Doctor from "../modelos/Doctor.js";

const router = express.Router();

// Obtener todos
router.get("/", async (req, res) => {
  try {
    const doctores = await Doctor.find();

    res.json(doctores);
  } catch (error) {
    res.status(500).json({
      message: ("Error al obtener doctores: ", error),
    });
  }
});

// Obtener por id!! (no por DNI)
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      dnipac: req.params.dni,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor no encontrado",
      });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({
      message: ("Error al obtener doctor: ", error),
    });
  }
});

// Crear

router.post("/", async (req, res) => {
  try {
    const pacienteExistente = await Doctor.findOne({
      dnipac: req.body.dnipac,
    });

    if (pacienteExistente) {
      return res.status(400).json({
        message: "El doctor con este DNI ya existe",
      });
    }

    // si no existe, se crea el doctor nuevo
    console.log("Datos recibidos:", req.body);
    const doctor = new Doctor(req.body);

    const nuevoPaciente = await doctor.save();

    res.status(201).json(nuevoPaciente); //convierte json en string y lo envia al cliente
  } catch (error) {
    console.error("Error al crear doctor:", error);

    res.status(500).json({
      message: "Error al crear doctor",
    });
  }
});

router.delete("/:dnipac", async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndDelete({
      dnipac: req.params.dnipac,
    });

    if (!doctor) {
      return res.status(404).json({
        mensaje: "Doctor no encontrado",
      });
    }

    res.json({ mensaje: "doctor eliminado" });
  } catch (error) {
    console.error("Error al eliminar doctor:", error);
    res.status(500).json({
      mensaje: ("Error al eliminar doctor", error),
    });
  }
});

router.put("/:dnipac", async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { dnipac: req.params.dnipac },
      req.body,
      { new: true },
    );

    if (!doctor) {
      return res.status(404).json({
        mensaje: "Doctor no encontrado",
      });
    }

    res.json({ doctor });
  } catch (error) {
    res.status(500).json({
      mensaje: ("Error al actualizar doctor", error),
    });
  }
});
// O export
export default router;
