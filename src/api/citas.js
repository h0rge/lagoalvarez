import axios from "axios";

const API_URL = "http://localhost:3000/api"

//Basicamente metodos post, get, put y delete

export async function saveCita(cita){
    const res = await axios.post(`${API_URL}/citas`, cita);
    return res.data;
}

export async function getCitas(pacienteDNI) {
    const res = await axios.get(`${API_URL}/citas/paciente/${encodeURIComponent(pacienteDNI)}`);
    return res.data;
}

export async function modifyCita(id, cita) {
    const res = await axios.put(`${API_URL}/citas/${id}`, cita);
    return res.data;
}

export async function deleteCita(id) {
    const res = await axios.delete(`${API_URL}/citas/${id}`);
    return res.data;
}