<template>
    <div class="xestion-doctor">
        <h4>🧑‍⚕️ Xestión de doctores</h4>
        <form @submit.prevent="guardarDoctor">
            <div class="fila">
                <div class="campo campo-id">
                    <label>ID</label>
                    <input v-model="novoDoctor._id" 
                        type="text" class="inputdisabled" required style="text-align: center;" readonly/>
                </div>
                <button type="button" @click="limpiaFormdoc">✨</button>
                <button type="button" @click="buscarDoctor">🔍</button>
                <div class="campo campo-nome">
                    <label>Nome:</label>
                    <input v-model="novoDoctor.nomedoc" type="text" @keyup.enter="corrixirNome()" @blur="corrixirNome()"
                        required />
                </div>
                <div class="campo campo-apelido">
                    <label>Apelido:</label>
                    <input v-model="novoDoctor.apeldoc" type="text" @keyup.enter="corrixirApelido()"
                        @blur="corrixirApelido()" required />
                </div>
            </div>
            <div class="fila">
                <div class="campo campo-colegiado">
                    <label>Colegiado</label>
                    <input  v-model="novoDoctor.coledoc"
                        type="radio" 
                        :value="false"
                        name="colegiado" 
                        id="si-radio" 
                        required />
                    <label for="si-radio">Si</label>
                            <input 
                            v-model="novoDoctor.coledoc" 
                            type="radio" 
                            :value="true"
                            name="colegiado" 
                            id="no-radio"
                            required>
                    <label for="no-radio">No</label>
                </div>

                <div class="campo campo-correo">
                    <label>Correo:</label>
                    <input v-model="novoDoctor.maildoc" type="email" required />
                </div>

            </div>
            <div class="fila">
                <div class="campo campo-telefono">
                    <label>Telefono:</label>
                    <input v-model="novoDoctor.movildoc" 
                    type="text" 
                    pattern="[679][0-9]{8}"
                    required />
                </div>

                <div v-if="novoDoctor.movildoc !== '' && (!validarTelf())" class="error-message">
                    <p class="error">O teléfono non é válido</p>
                </div>

                <div class="campo campo-especialidad">
                    <label>Especialidad:</label>
                    <select id="especialidad" v-model="novoDoctor.espedoc" required>
                        <option value="">Selecciona unha especialidad</option>
                        <option v-for="especialidad in especialidades" :key="especialidad.id" :value="especialidad.nm">
                            {{ especialidad.nm }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="campo-condicions">
                <label>
                    <input v-model="novoDoctor.loddoc" type="checkbox" /> Aceptar a
                    <a :href="$router.resolve({ name: 'PoliticaPrivacidad' }).href" target="_blank"
                        rel="noopener noreferrer">
                        Política de privacidade e confidencialidade
                    </a>
                </label>
            </div>
            <button 
                type="submit" 
                class="btn-guardar" 
                :disabled="novoDoctor.nomedoc === '' ||
                           novoDoctor.apeldoc === '' ||
                           !novoDoctor.espedoc ||
                           !novoDoctor.loddoc
                ">
                Gardar
            </button>
        </form>
        <h4>📋 Listaxe de doctores</h4>
        <table v-if="doctores.length > 0">
            <thead>
                <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Apelidos</th>
                    <th>Nome</th>
                    <th>Móvil</th>
                    <th>Especialidad</th>
                    <th>Accións</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(u, index) in doctores" :key="index">
                    <td style="text-align: center;">{{ index + 1 }}</td>
                    <td style="text-align: center;">{{ u._id }}</td>
                    <td>{{ u.apeldoc }}</td>
                    <td>{{ u.nomedoc }}</td>
                    <td>{{ u.movildoc }}</td>
                    <td style="text-align: center;">{{ u.espedoc }}</td>
                    <td style="text-align: center;">
                        <button @click="editarUsuario(index)" title="Editar">
                            ✏️
                        </button>
                        <button @click="eliminarUsuario(index)" title="Eliminar">
                            🗑️
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <p v-else>Non hai doctores cargados.</p>
    </div>
</template>

<script setup>
//Zona de Declaracións
    import { ref, reactive, onMounted } from 'vue'
    import { obtenerEspecialidades } from "../api/especialidades.js"
    import { usedoctorStore } from "../store/doctorStore.js"
    import {
        saveDoctor,
        getDoctores,
        getDoctorByEspecialidad,
        modifyDoctor,
        deleteDoctor
    } from "../api/doctores.js"
import { getPacientes } from '../api/pacientes.js'
    
    
const especialidades = ref([])

const doctores = ref([])  //almacena la lista de doctores e os seus cambios
const editando = ref(false)

const novoDoctor = reactive({
  nomedoc: "",
  apeldoc: "",
  maildoc: "",
  movildoc: "",
  coledoc: "",
  espedoc: "",
  loddoc: false //aceptación politica privacidade
});

/// Zona de ciclo de vida

onMounted(async () => {
    especialidades.value = await obtenerEspecialidades();
    doctores.value = await getDoctores();
})


const especialidad = especialidades.value.find(
    e => e.nm === novoDoctor.espedoc
)


// Zona de métodos ou funcións

async function clear() {
    Object.assign(novoDoctor, {
        _id: "",
        nomedoc: "",
        apeldoc: "",
        maildoc: "",
        movildoc: "",
        coledoc: "",
        espedoc: "",
        loddoc: false
    })
}
//CRUD
//Create
async function guardarDoctor() {
    if (!validarTelf()) {
        console.log('telefono inválido');        
        return;
    }
    try {
        if (editando.value) {
            const doctorModificado = await modifyDoctor(
                novoDoctor._id,
                novoDoctor
            );

            const index = doctores.value.findIndex(
                (d) => d._id === novoDoctor._id
            );

            if (index !== -1) {
                doctores.value[index] = doctorModificado;
            }
        } else {
            const doctorGuardado = await saveDoctor(novoDoctor);
            doctores.value.push(doctorGuardado);

            console.log("Doctor gardado con éxito");
        }
        await clear();

        editando.value = false;
        
    } catch (error) {
        console.error('Error ao gardar doctor: ', error);
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
async function editarUsuario(index) {
  const doctor = doctores.value[index];   //carga os datos do paciente elixido no formulario
  
  Object.assign(novoDoctor, doctor);  // carga os datos do paciente no formulario recorda v-model do formulario é novoPaciente

  editando.value = true;
  //usedoctorStore.seleccionarDoctor(novoDoctor);
}

//Delete
async function eliminarUsuario(index) {
    try {
        await deleteDoctor(doctores.value[index]._id)
        doctores.value.splice(index, 1)
        console.log("Doctor eliminado correctamente");
        getDoctores();
    } catch (error) {
        console.error("Erro ao eliminar o doctor", error);
    }
    doctores.value.splice(index, 1);
}

// Funciones auxiliares
function corrixirNome() {
  if (novoDoctor.nomedoc.length > 0) {
    novoDoctor.nomedoc = novoDoctor.nomedoc
    .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

function corrixirApelido() {
  if (novoDoctor.apeldoc.length > 0) {
    novoDoctor.apeldoc = novoDoctor.apeldoc
    .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    }
  }

  function validarTelf() {
    const telfRegex = /^[6|7]\d{8}$/;
    if (novoDoctor.movildoc != "") {
      return telfRegex.test(novoDoctor.movildoc.trim());
  }
}

const limpiaFormdoc = () => {
  Object.assign(novoDoctor, {
    nomedoc: "",
    apeldoc: "",
    maildoc: "",
    movildoc: "",
    coledoc: "",
    espedoc: "",
    loddoc: false
  });
  editando.value = false;
  //validarTelf.value = false;
}



</script>


<style scoped>
.error {
    color: red;
    font-size: 0.9rem;
    margin-top: 0.2rem;
}

.xestion-doctor {
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
    .xestion-doctor {
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