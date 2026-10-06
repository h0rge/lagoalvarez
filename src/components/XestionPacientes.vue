<template>
  <div class="xestion-paciente">
    <h4>👥 Xestión de paciente</h4>
    <form @submit.prevent="guardarPaciente">
      <div class="fila">
        <div class="campo campo-dni">
          <label>DNI/CIF:</label>
          <input v-model="novoPaciente.dnipac" v-on:input="novoPaciente.dnipac = novoPaciente.dnipac.toUpperCase()"
            type="text" required style="text-align: center;" />
        </div>
        <div v-if="novoPaciente.dnipac !== '' && (!validarDni() || !validarDni2())" class="error-message">
          <p class="error">O DNI/CIF non é válido</p>
        </div>
        <button type="button" @click="limpiaFormpac">Limpar</button>
        <button type="button" @click="buscarPaciente">Buscar</button>
        <div class="campo campo-nome">
          <label>Nome:</label>
          <input v-model="novoPaciente.nomepac" type="text" @keyup.enter="corrixirNome()" @blur="corrixirNome()"
            required />
        </div>
        <div class="campo campo-apelido">
          <label>Apelido:</label>
          <input v-model="novoPaciente.apelpac" type="text" @keyup.enter="corrixirApelido()" @blur="corrixirApelido()"
            required />
        </div>
      </div>
      <div class="fila">
        <div class="campo campo-data-nacimiento">
          <label>Data de nacemento:</label>
          <input v-model="novoPaciente.nacipac" type="date" required />
        </div>
        <div class="campo campo-correo">
          <label>Correo:</label>
          <input v-model="novoPaciente.mailpac" type="email" required />
        </div>
        <div class="campo campo-dirección">
          <label>Dirección:</label>
          <input v-model="novoPaciente.dirpac" type="text" required />
        </div>
      </div>
      <div class="fila">
        <div class="campo campo-telefono">
          <label>Telefono:</label>
          <input v-model="novoPaciente.movilpac" type="text" required />
        </div>
        <div v-if="novoPaciente.movilpac !== '' && (!validarTelf())" class="error-message">
          <p class="error">O teléfono non é válido</p>
        </div>
        <div class="campo campo-provincia">
          <label>Provincia:</label>
          <select id="provincia" v-model="novoPaciente.propac" @change="cargarMunicipios()" required>
            <option value="">Selecciona unha provincia</option>
            <option v-for="provincia in provincias" :key="provincia.id" :value="provincia.nm">
              {{ provincia.nm }}
            </option>
          </select>
        </div>
        <div class="campo campo-municipio">
          <label>Municipio:</label>
          <select id="municipio" v-model="novoPaciente.munipac" required>
            <option value="">Selecciona un municipio</option>
            <option v-for="municipio in municipios" :key="municipio.id" :value="municipio.nm">
              {{ municipio.nm }}
            </option>
          </select>
        </div>
      </div>
      <div class="campo-condicions">
        <label>
          <input v-model="novoPaciente.lodpac" type="checkbox" /> Aceptar a
          <a :href="$router.resolve({ name: 'PoliticaPrivacidad' }).href" target="_blank" rel="noopener noreferrer">
            Política de privacidade e confidencialidade
          </a>
        </label>
      </div>
      <button type="submit" class="btn-guardar" :disabled="
        novoPaciente.dnipac === '' ||
        novoPaciente.nomepac === '' ||
        novoPaciente.apelpac === '' ||
        novoPaciente.movilpac === '' ||
        !novoPaciente.lodpac
        ">
        Gardar
      </button>
    </form>
    <h4>📋 Listaxe de pacientes</h4>
    <table v-if="pacientes.length > 0">
      <thead>
        <tr>
          <th>#</th>
          <th>DNI/CIF</th>
          <th>Apelidos</th>
          <th>Nome</th>
          <th>Correo</th>
          <th>Provincia</th>
          <th>Accións</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, index) in pacientes" :key="index">
          <td style="text-align: center;">{{ index + 1 }}</td>
          <td style="text-align: center;">{{ u.dnipac }}</td>
          <td>{{ u.apelpac }}</td>
          <td>{{ u.nomepac }}</td>
          <td>{{ u.mailpac }}</td>
          <td>{{ u.propac }}</td>
          <td style="text-align: center;">
            <button @click="editarUsuario(index)" title="Editar">✏️</button>
            <button @click="eliminarPaciente(index)" title="Eliminar">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Non hai paciente cargados.</p>
  </div>
</template>

<script setup>
/// Zona de declaracións
import { ref, reactive, onMounted } from 'vue'
import { obtenerMunicipios, obtenerProvincias } from "../api/municipios.js"
import {
  savePaciente,
  getPacientes,
  deletePaciente,
  modifyPaciente,
  getPacienteByDni
} from "../api/pacientes.js"

const provincias = ref([])
const municipios = ref([])

const pacientes = ref([])  //almacena la lista de paciente e os seus cambios
const editando = ref(false);

const novoPaciente = reactive({
  dnipac: "",
  nomepac: "",
  apelpac: "",
  nacipac: "",
  mailpac: "",
  movilpac: "",
  dirpac: "",
  propac: "",
  munipac: "",
  lodpac: false //campo para acaptacion de lod
});



/// Zona de ciclo de vida

onMounted(async () => {
  provincias.value = await obtenerProvincias();
  pacientes.value = await getPacientes(); //carga os pacientes desde o backend
})

async function cargarMunicipios() {
  if (novoPaciente.propac === "") {
    municipios.value = [];
    return;
  }

  const provincia = provincias.value.find(
    p => p.nm === novoPaciente.propac
  );

  municipios.value = await obtenerMunicipios(provincia.id)

}

/// Zona de métodos ou funcións

async function clear() {
  Object.assign(novoPaciente, {
    dnipac: "",
    nomepac: "",
    apelpac: "",
    mailpac: "",
    propac: "",
    munipac: "",
    movilpac: "",
    dirpac: "",
    nacipac: "",
    lodpac: false
  });
  municipios.value = [];
}


async function guardarPaciente() {
  if (!validarDni() || !validarDni2()) {
    return;
  } else if (!validarTelf()) {
    return;
  }
  try {
    if (editando.value) {
      const pacienteModificado = await modifyPaciente(
        novoPaciente.dnipac,
        novoPaciente
      );

      const index = pacientes.value.findIndex(
        (p) => p.dnipac === novoPaciente.dnipac
      );

      if (index !== -1) {
        pacientes.value[index] = pacienteModificado;
      }

      console.log("Paciente modificado correctamente");
      await clear();
    } else {
      const pacienteGuardado = await savePaciente(novoPaciente);
      pacientes.value.push(pacienteGuardado);
      
      console.log("Paciente gardado con éxito");
      
      await clear();
      
    }
    
    editando.value = false;

    /*
    const pacienteGuardado = await savePaciente(novoPaciente);
    pacientes.value.push(pacienteGuardado);
    console.log("Paciente gardado correctamente");
    getPacientes();
    Object.assign(novoPaciente, { dnipac: "", nomepac: "", apelpac: "", mailpac: "", propac: "", munipac: "", movilpac: "", dirpac: "", nacipac: "" })
    cargarMunicipios(); // Reinicia a lista de municipios ao gardar un paciente
    */
  } catch (error) {
    console.error("Erro ao gardar o paciente:", error);
  }
}



/*
function gardarPaciente() {
  if (!validarDni() || !validarDni2()) {
    return;
    } else if (!validarTelf()) {
      return;
      }
      paciente.value.push({ ...novoPaciente })  //engade o novo paciente á lista (copia do obxecto)
      // Object.assign(novoPaciente, { dnipac: "", nomepac: "", mailpac: "", propac: "", munipac: "", movilpac: "", dirpac: "", nacipac: "" }) //reinicia o formulario
      }
      */
     async function eliminarPaciente(index) {
       try {
         await deletePaciente(pacientes.value[index].dnipac);
         pacientes.value.splice(index, 1)
    console.log("Paciente eliminado correctamente");
    getPacientes();
  } catch (error) {
    console.error("Erro ao eliminar o paciente:", error);
  }
  pacientes.value.splice(index, 1);   //elimina o paciente da lista
}

async function editarUsuario(index) {
  const paciente = pacientes.value[index];   //carga os datos do paciente elixido no formulario
  Object.assign(novoPaciente, paciente);  // carga os datos do paciente no formulario recorda v-model do formulario é novoPaciente
  //evitar que se cargue el _id de mongoDB en el formulario
  delete novoPaciente._id;
  editando.value = true;
  //cargar los municipios
  await cargarMunicipios();
}

async function buscarPaciente() {
  try {
    const dni = novoPaciente.dnipac.trim();

    if (!dni) {
      console.log("Introduce un DNI");
      return;
    }

    const paciente = await getPacienteByDni(dni);

    Object.assign(novoPaciente, paciente);
    await cargarMunicipios();

    console.log("Paciente encontrado:", paciente);

  } catch (error) {
    if (error.response?.status === 404) {
      console.log("Paciente no encontrado");      
    } else {
      console.error("Error al buscar paciente: ", error)
    }
  }
}

//===================================================================================
// Funciones auxiliares

function validarDni() {
  const dniregex = /^[0-9]{8}[A-Z]$/; // Expresión regular para validar el formato del DNI
  return dniregex.test(novoPaciente.dnipac.toUpperCase());
}

function validarDni2() {
  const dniarray = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'];
  const numerosDni = novoPaciente.dnipac.slice(0, 8);
  const letraDni = novoPaciente.dnipac.slice(8, 9);
  return dniarray[numerosDni % 23] === letraDni.toUpperCase();
}

function corrixirNome() {
  if (novoPaciente.nomepac.length > 0) {
    novoPaciente.nomepac = novoPaciente.nomepac
    .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

function corrixirApelido() {
  if (novoPaciente.apelpac.length > 0) {
    novoPaciente.apelpac = novoPaciente.apelpac
    .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    }
  }
  
  function validarTelf() {
    const telfRegex = /^[6|7]\d{8}$/;
    if (novoPaciente.movilpac != "") {
      return telfRegex.test(novoPaciente.movilpac.trim());
  }
}

const limpiaFormpac = () => {
  Object.assign(novoPaciente, {
    dnipac: "",
    nomepac: "",
    apelpac: "",
    nacipac: "",
    mailpac: "",
    movilpac: "",
    dirpac: "",
    propac: "",
    munipac: "",
    lodpac: false
  });
  municipios.value = [];
  editando.value = false;
}


</script>

<style scoped>
.error {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

.xestion-paciente {
  width: 100%;
  /* opcional para que no crezca demasiado en pantallas muy grandes */
  background: white;
  padding: 2rem;
  overflow: visible;
  border-radius: 2px;
  flex-wrap: wrap;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

form {
  display: flex;
  padding: 2rem;
  align-self: center;
  width: 100%;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.fila {
  flex-wrap: wrap;
  display: flex;
  gap: 1rem;
  width: 100%;
}

.fila-centrada {
  justify-content: center;
}

.campo {
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  /* label e input en la misma línea */
  gap: 0.5rem;
  border-radius: 0px;
}

.campo-dni {
  flex: 3;
  /* ocupa menos espacio */
  border-radius: 0px;
}

.campo-nome {
  flex: 3;
  /* ocupa más espacio */
  border-radius: 0px;
}

.campo-data-nacemento {
  flex: 0.5;
  /* ocupa menos espacio */
}

.campo-correo {
  flex: 2;
  /* ocupa más espacio */
  border-radius: 0px;
}

.campo select {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 0px;
  width: 100%;
}

.campo-provincia {
  flex: 1;
  /* ocupa menos espacio */
  border-radius: 0px;
}

.campo label {
  max-width: 100px;
  /* ancho fijo para alinear */
  font-weight: 500;
  font: bold
}

.campo input {
  flex: 1;
  /* ocupa todo el espacio restante */
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0px;
  box-sizing: border-box;
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
  border-collapse: separate;
  align-self: center;
  margin-top: 1rem;
  font-size: 0.8rem;
  border: 1px solid #ddd;
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
  .xestion-paciente {
    padding: 1rem;
    /* reducir el padding en pantallas pequeñas */
  }

  .fila {
    flex-direction: column;
    /* apila los campos verticalmente en móviles */
    gap: 0.5rem;
    /* opcional: un pequeño espacio entre ellos */
  }

  .campo-dni {
    background-color: red;
  }
}
</style>
