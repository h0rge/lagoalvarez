import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
    {
        iddoc: { type: String, required: true, unique: true },
        nomedoc: { type: String, required: true },
        apeldoc: { type: String, required: true },
        coledoc: { type: String, required: true },
        amildoc: { type: String, required: true },
        movildoc: { type: String, required: false },
        espedoc: { type: String, required: true },
    },

    {
        collection:"doctores"
    }
);

export default mongoose.model("Doctor", DoctorSchema);