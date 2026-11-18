//Importamos defineStore d Pinia para crear un almacén de datos (store)
import { defineStore } from 'pinia'

// Creamos el store de doctor
// doctor es el identificador único de este store.
export const usedoctorStore = defineStore('doctor', {

    //STATE: contiene los datos que queremos compartir
    //entre los diferentes componenets de Vue.
    state: () => ({
        doctores: [],
        id:null,
        nombre: [],
        apellido: null,
        especialidad: null
    }),

    actions: {
        // Recibe un objeto doctor como parámetro
        // Guarda sus datos en el store de Pinia.
        seleccionarDoctor(doctor) {

            this.id = doctor._id; // Guardamos el dni
            this.nombre = doctor.nomedoc; // Guardamos el nombre.
            this.apellido = doctor.apeldoc; // Guardamos apellidos
            this.especialidad = doctor.espedoc;  // Guardamos especialidad
        },

        limpiarDoctor() {

            this.id = null;
            this.nombre = null;
            this.apellido = null;
            this.especialidad = null;

        }
    }
});