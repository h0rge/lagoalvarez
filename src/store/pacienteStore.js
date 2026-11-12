//Importamos defineStore d Pinia para crear un almacén de datos (store)
import { defineStore } from 'pinia'


// Creamos el store de pacientes
// paciente es el identificador único de este store.
export const usepacienteStore = defineStore('paciente', {

    //STATE: contiene los datos que queremos compartir
    //entre los diferentes componenets de Vue.
    state: () => ({
        pacientes: [],
        dnipac: null,
        nomepac: null,
        apelpac: null
    }),

    actions: {
        // Recibe un objeto paciente como parámetro
        // Guarda sus datos en el store de Pinia.
        seleccionarPaciente(paciente) {
            this.dnipac = paciente.dnipac; // Guardamos el dni
            this.nomepac = paciente.nomepac; // Guardamos el nombre
            this.apelpac = paciente.apelpac;  // Guardamos el apellido
        },

        limpiarPaciente() {
            this.dnipac = null;
            this.nomepac = null;
            this.apelpac = null;
        }
    }
});