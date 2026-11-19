<template>
    <div class="xestion-citas">
        <h4>📅Xestión de citas</h4>
        <form @submit.prevent="guardarCita">
            <div class="fila">
                <div class="campo campo-id">
                    <label>ID cita:</label>
                    <input v-model="novaCita._id" readonly
                        type="text" class="inputdisabled" required style="text-align: center;"/>
                </div>
                <button type="button" @click="limpiaFormdoc">✨</button>
                <button type="button" @click="buscarDoctor">🔍</button>
                <div class="campo campo-dnipac">
                    <label>DNI do Paciente:</label>
                    <input v-model="novaCita.pacienteDNI" readonly
                        type="text" 
                        v-on:input="novaCita.pacienteDNI = novaCita.pacienteDNI.toUpperCase()"
                        required />
                </div>
                <div class="campo campo-doc">
                    <label>Doctor:</label>
                    <input v-model="doctorStore.apellido"
                        readonly    
                        type="text"
                        required/>
                </div>
                <div class="campo campo-doc">
                    <label>Id Doctor:</label>
                    <input v-model="novaCita.doctorId" 
                    type="text"
                    required
                    readonly/>
                </div>
            </div>
            <div class="fila">
                <div class="campo campo-fecha">
                    <label>Data da cita:</label>
                    <input  
                        v-model="novaCita.fecha"
                        type="date" 
                        required />
                </div>

                <div class="campo campo-hora">
                    <label>Hora:</label>
                    <input 
                    v-model="novaCita.hora" 
                    type="time" 
                    required />
                </div>
                
                <div class="campo campo-motivo">
                    <label for="motivoCita">Motivo da cita</label>
                    <input 
                        v-model="novaCita.motivo"
                        type="text" 
                        id="motivoCita" 
                        required>
                </div>

                <div class="campo campo-estado">
                    <select 
                        v-model="novaCita.estado"
                        name="estado" 
                        id="estado">
                        <option value="Pendente">Pendente</option>
                        <option value="Confirmada">Confirmada</option>
                        <option value="Cancealada">Cancelada</option>
                    </select>
                </div>
            </div>
            <div class="fila fila-observacions">
                <div class="campo campo-observacions">
                    <textarea v-model="novaCita.observacions" rows="3">
                </textarea>
                </div>
            </div>
            <button 
                type="submit" 
                class="btn-guardar" 
                :disabled="novaCita.fecha === '' || 
                novaCita.pacienteDNI === '' || 
                novaCita.doctorId === '' || 
                novaCita.hora === '' || 
                novaCita.estado === ''">
                Gardar
            </button>
        </form>
        <!--A: Se verá este comentario?-->
        <!--B: No, no se verá-->
        <h4><span>📋 Listaxe de Citas Paciente: {{ pacienteStore.apelpac }}</span></h4>
        <table v-if="novaCita.pacienteDNI && citas.length > 0">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>DNI do Paciente</th>
                    <th>Nome Doctor</th>
                    <th>ID do Doctor</th>
                    <th>Hora</th>
                    <th>Motivo da Cita</th>
                    <th>Estado</th>
                    <th>Accións</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(c, index) in citas" :key="index">
                    <td style="text-align: center;">{{ index + 1 }}</td>
                    <td style="text-align: center;">{{ c.fecha }}</td>
                    <td>{{ c.pacienteDNI }}</td>
                    <td>{{ buscarNombreDoctor(c) }}</td>
                    <td>{{ c.doctorId }}</td>
                    <td>{{ c.hora }}</td>
                    <td>{{ c.motivo }}</td>
                    <td>{{ c.estado }}</td>
                    <td style="text-align: center;">
                        <button title="Editar" @click="editarCita(index)">
                            ✏️
                        </button>
                        <button title="Eliminar" @click="eliminarCita(index)">
                            🗑️
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <p v-else>Ningún pacientes seleccionado.</p>
    </div>
</template>

<script setup>
//Zona de Declaracións
  import { ref, reactive, onMounted } from "vue";
  import { usepacienteStore } from "../store/pacienteStore.js"
  import { usedoctorStore } from "../store/doctorStore.js"
  import { saveCita, getCitas, modifyCita, deleteCita } from "../api/citas.js";
  import { getDoctores } from "../api/doctores.js";
  import { alertaConfirmacion, alertaExito } from "../utils/alertas.js";
    

const citas = ref([])  //almacena la lista de doctores e os seus cambios
const doctores = ref([])
const editando = ref(false)

const pacienteStore = usepacienteStore();
const doctorStore = usedoctorStore();

const novaCita = reactive({
    pacienteDNI: '',
    doctorId: '',
    fecha: '',
    hora: '',
    motivo: '',
    observacions: '',
    estado: 'Pendente'
  });

/// Zona de ciclo de vida

onMounted(async () => {
    novaCita.pacienteDNI = pacienteStore.dnipac || '';
    novaCita.doctorId = doctorStore.id || '';
    await buscarPaciente();
    doctores.value = await getDoctores();
  });

// Zona de métodos ou funcións

const limpiarFormcita = () => {
    delete novaCita._id;
    Object.assign(novaCita, {
      fecha: '',
      pacienteDNI: '',
      doctorId: '',
      hora: '',
      motivo: '',
      estado: 'Pendente'
    });
    // pacienteStore.limpiarPaciente();
    // doctorStore.limpiarDoctor();
    editando.value = false;
  };

  const limpiarCasiTodo = () => {
    delete novaCita._id;
    Object.assign(novaCita, {
      fecha: '',
      hora: '',
      motivo: '',
      estado: 'Pendente',
      observacions: '',
    });
    // pacienteStore.limpiarPaciente();
    // doctorStore.limpiarDoctor();
    editando.value = false;
  }
//CRUD
//Read
async function buscarPaciente() {
    const dni = novaCita.pacienteDNI.trim().toUpperCase();
    if (!dni) {
      citas.value = [];
      return;
    }

    try {
      citas.value = await getCitas(dni);
    } catch (error) {
      citas.value = [];
      console.error('Error ao recuperar as citas do paciente:', error);
      alertaError('Error al recuperar las citas del paciente');
    }
  }

  function buscarNombreDoctor(cita) {
    const citaPaciente = citas.value.find(item => item.pacienteDNI === novaCita.pacienteDNI && item._id === cita._id);
    const doctor = doctores.value.find(item => String(item._id) === String(citaPaciente?.doctorId)
    );
    return doctor?.apeldoc || '';
  }

//Create
async function guardarCita() {
    try {
        const novasCitas = {
            ...novaCita
        };
        if (editando.value) {
                const citaModificada = await modifyCita(novasCitas._id, novasCitas);
                const index = citas.value.findIndex((cita) => cita._id === citaModificada._id);

                if (index !== -1) {
                    citas.value[index] = citaModificada;
                    alertaExito("Cita modificada")
                }
        } else {
            
            const citaGuardada = await saveCita(novasCitas);
            citas.value.push(citaGuardada);
            console.log("Cita gardada con éxito");
            alertaExito("Cita gardada")
        }
        limpiarCasiTodo();
        await buscarPaciente();
        editando.value = false;
        
    } catch (error) {
        console.error('Error ao gardar cita: ', error);
    }
}
//Read
async function buscarDoctor() {
    try {
        const especialidad = novoDoctor.espedoc.trim();

        if(!especialidad) {
            console.log("Selecciona unha especialidade");
            return;
        }

        const todosDoctores = await getDoctores();
        doctores.value = todosDoctores.filter(doctor => doctor.espedoc === especialidad)
    } catch (error) {
        if (error.response?.status === 404) {
            console.log("Doctor no encontrado");
        } else {
            console.error("Error: ", error)
        }
    }
}

//Update
async function editarCita(index) {
  const cita = citas.value[index];   //carga os datos da cita elixida no formulario
  
  Object.assign(novaCita, {
    ...cita
  });  // carga os datos da cita no formulario recorda v-model do formulario é novaCita

  const doctor = doctores.value.find(
    item => String(item._id) === String(cita.doctorId)
  )

  if (doctor) {
    doctorStore.seleccionarDoctor(doctor);
  } else {
    doctorStore.limpiarDoctor();
  }

  editando.value = true;
  
}

//Delete
async function eliminarCita(index) {
    try {
        const confirmacion = alertaConfirmacion("Eliminar la cita?")
        if (!(await confirmacion).isConfirmed) {
            return
        }
        await deleteCita(citas.value[index]._id)
        limpiarCasiTodo()
        await buscarPaciente();
        console.log("Cita eliminada correctamente");
        getCitas();
    } catch (error) {
        console.error("Erro ao eliminar a cita ", error);
    }
    citas.value.splice(index, 1);
}

// Funciones auxiliares

</script>


<style scoped>
.error {
    color: red;
    font-size: 0.9rem;
    margin-top: 0.2rem;
}

.xestion-cita {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    background: white;
    padding: clamp(1rem, 3vw, 2rem);
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

form {
    display: flex;
    padding: 0;
    width: 100%;
    flex-direction: column;
    gap: 1.25rem;
    margin-bottom: 2rem;
    box-sizing: border-box;
}

.fila {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
}

.campo {
    display: flex;
    flex: 1 1 220px;
    min-width: min(100%, 220px);
    flex-direction: row;
    align-items: stretch;
    gap: 0.35rem;
    min-width: 0;
}

.campo label {
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    justify-content: center;

}

.campo input,
.campo select {
    width: 100%;
    min-height: 2.5rem;
    padding: 0.55rem 0.7rem;
    border: 1px solid #d1d5db;
    border-radius: 3px;
    box-sizing: border-box;
    background: #fff;
}

.campo input:focus,
.campo select:focus {
    outline: 2px solid rgba(5, 117, 89, 0.25);
    border-color: #057559;
}

.fila > .error-message {
    flex: 1 1 100%;
    margin: 0;
}

.fila > button:not(.btn-guardar) {
    min-height: 2.5rem;
    align-self: flex-end;
}

.btn-guardar {
    background-color: #057559;
    color: white;
    border: 3px solid #00aa1c;
    border-image: linear-gradient(45deg, #00aa1c, #0000ff) 1;
    /* Define los dos colores y el ángulo */
    padding: 20px;
    padding: 0.4rem 1.5rem;
    border-radius: 0px;
    cursor: pointer;
    margin: 0 auto;
    display: block;
}

.campo input[readonly] {
    background-color: rgb(224, 224, 224);
}

.btn-guardar:hover {
    background-color: #637a76;
    border-radius: 0px;
}

.btn-guardar:disabled {
    background-color: #e0e0e0;
    color: #999;
    border-color: #ccc;
    cursor: not-allowed;
    opacity: 0.7
}

.btn-guardar:disabled:hover {
    background-color: #e0e0e0;
}

.button {
    background: none;
    border: 2px solid #ddd;
    cursor: pointer;
    font-size: 1rem;
}

.inline-control {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding-right: 5rem;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    font-size: 0.8rem;
    border: 1px solid #ddd;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
}

th,
td {
    border: 1px solid #ddd;
    padding: 0.7rem;
    text-align: left;
}

th {
    text-align: center;
    background-color: #f8f9fa;
}

h4 {
    width: 100%;
    text-align: center;
    margin-bottom: 1rem;
    font-weight: 600;
    background-color: #07c751;
    color: white;
}

@media (max-width: 768px) {
    .xestion-cita {
        padding: 1rem;
    }

    .fila {
        flex-direction: column;
        gap: 0.5rem;
        align-items: stretch;
    }

    .campo,
    .fila > button:not(.btn-guardar) {
        width: 100%;
    }
}
</style>