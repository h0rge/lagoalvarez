import axios from "axios";




const API_URL = "http://localhost:3000/api";

//Guardar paciente
export async function savePaciente(paciente) {
    const res = await axios.post(`${API_URL}/pacientes`, paciente); // en doctores cambiamos pacientes por doctores (duh)
    return res.data;
}

//Obtener pacientes (como el de guardar paciente, pero cambias get por post y no le pasas paciente)
export async function getPacientes() {
    const res = await axios.get(`${API_URL}/pacientes`);
    return res.data;
}

export async function getPacienteByDni(dni) {
    const res = await axios.get(`${API_URL}/pacientes/${dni}`);
    return res.data;
}

export async function obtenerPacientes() {
    const res = await axios.get(API_URL);
    return res.data;
}

export async function modifyPaciente(dni, paciente) { 
    const res = await axios.put(`${API_URL}/pacientes/${dni}`, paciente)    
    return res.data;
}

export async function deletePaciente(dni) {
    const res = await axios.delete(`${API_URL}/pacientes/${dni}`);
    return res.data;
}