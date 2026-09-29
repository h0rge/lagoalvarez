import axios from "axios";




const API_URL = "http://localhost:3000/api";

//Guardar paciente
export async function savePaciente(paciente) {
    const res = await axios.post(`${API_URL}/pacientes`, paciente); /*en doctores cambiamos pacientes por doctores (duh) */
    return res.data;
}

export async function obtenerPacientes() {
    const res = await axios.get(API_URL);
    return res.data;
}