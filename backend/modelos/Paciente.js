// modelo articulo

import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema(
    {
        dnipac: { type: String, required: true},
        nomepac: { type: String, required: true},
        apelpac: { type: String, required: true},
        nacipac: { type: String, required: false},
        mailpac: { type: String, required: false},
        dirpac: { type: String, required: false},
        movilpac: { type: String, required: true},
        propac: { type: String, required: false},
        munipac: { type: String, required: false},
        lodpac: { type: Boolean, required: true}
    },

    {
        collection: "pacientes"
    }
);

export default mongoose.model("Paciente", pacienteSchema);