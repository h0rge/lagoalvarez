import axios from 'axios';

// Dirección de nuestra API
const URL ='http://localhost:3000/api/especialidades ';

// Obtener todas las especialidades
export async function obtenerEspecialidades() {
    const respuesta =  await axios.get(URL);

    return respuesta.data.especialidades;
}