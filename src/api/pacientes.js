import axios from "axios";
/* const API_URL = "http://localhost:3000/api"; */
export async function guardarPaciente(formData) {
    const res = await axios.post(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return res.data;
}

export async function obtenerPacientes() {
    const res = await axios.get(API_URL);
    return res.data;
}