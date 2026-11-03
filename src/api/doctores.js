import axios from "axios"

//en produccion se usa la url del servidor
//const API_URL = "https://servidor.com/api";

const API_URL = "http://localhost:3000/api";

// Guardar doctor
export async function saveDoctor(doctor) {
    const res = await axios.post(`${API_URL}/doctores`, doctor);
    return res.data;
}

// Obtener todos los doctores
export async function getDoctores() {
    const res = await axios.get(`${API_URL}/doctores`);
    res.data.sort((a, b) => 
        a.apeldoc.localeCompare(b.apeldoc, "es", { sensitivity: "base" })); 
    // Ordena por apellido de forma ascendente
    return res.data;
}

// Obtener doctores por especialidad
export async function getDoctorByEspecialidad(especialidad) {
    const res = await axios.get(`${API_URL}/doctores/${especialidad}`);
    return res.data;
} 

// Actualizar doctor
export async function modifyDoctor(id, doctor) {
    const res = await axios.put(`${API_URL}/doctores/${id}`, doctor);
    return res.data;
}   

// Eliminar doctor
export async function deleteDoctor(id) {
    const res = await axios.delete(`${API_URL}/doctores/${id}`);
    return res.data;
}
