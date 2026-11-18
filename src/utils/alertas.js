
// GUARDAR EN CARPETA src/utils/alertas.js
// INSTALAR LIBRERÍA CON  ==>  npm install sweetalert2

import Swal from 'sweetalert2'

// Alerta de éxito
export const alertaExito = (mensaje, titulo = 'Correcto') => {
    return Swal.fire({
        icon: 'success',
        title: titulo,
        text: mensaje,
        confirmButtonText: 'Aceptar'
    })
}

// Alerta de error
export const alertaError = (mensaje, titulo = 'Error') => {
    return Swal.fire({
        icon: 'error',
        title: titulo,
        text: mensaje,
        confirmButtonText: 'Aceptar'
    })
}

// Alerta informativa
export const alertaInfo = (mensaje, titulo = 'Información') => {
    return Swal.fire({
        icon: 'info',
        title: titulo,
        text: mensaje,
        confirmButtonText: 'Aceptar'
    })
}

// Confirmación de una acción
export const alertaConfirmacion = (mensaje, titulo = '¿Estás seguro?') => {
    return Swal.fire({
        icon: 'question',
        title: titulo,
        text: mensaje,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    })
}
