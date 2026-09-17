<template>
  <div class="xestion-paciente">
    <h4>👥 Xestión de paciente</h4>
    <form @submit.prevent="gardarPaciente">
      <div class="fila">
        <div class="campo campo-dni">
          <label>DNI/CIF:</label>
          <input v-model="novoPaciente.dni" type="text" required style="text-align: center;" />
        </div>
        <div v-if="validarDni">
          <p class="error">O DNI/CIF non é válido</p>
        </div>
        <div class="campo campo-nome">
          <label>Nome:</label>
          <input v-model="novoPaciente.nome" type="text" required />
        </div>
        <div class="campo campo-apelido">
          <label>Apelido:</label>
          <input v-model="novoPaciente.apelido" type="text" required />
        </div>
      </div>
      <div class="fila">
        <div class="campo campo-fecha-nacimiento">
          <label>Fecha de nacemento:</label>
          <input v-model="novoPaciente.fechaNacimiento" type="date" required />
        </div>
        <div class="campo campo-correo">
          <label>Correo:</label>
          <input v-model="novoPaciente.correo" type="email" required />
        </div>
        <div class="campo campo-provincia">
          <label>Provincia:</label>
          <select v-model="novoPaciente.provincia">
            <option value="">-- Escolle unha provincia --</option>
            <option>A Coruña</option>
            <option>Lugo</option>
            <option>Ourense</option>
            <option>Pontevedra</option>
          </select>
        </div>
      </div>
      <div class="fila fila-centrada">
        <div class="campo inline-activo">
          <label>Activo:</label>
          <div class="inline-control">
            <input v-model="novoPaciente.activo" type="checkbox" />
            <span>Activo</span>
          </div>
        </div>
        <div class="campo inline-cuenta">
          <label>Tipo de conta:</label>
          <div class="inline-control radios">
            <label>
              <input v-model="novoPaciente.tipoCuenta" type="radio" value="particular" />
              <span>Particular</span>
            </label>
            <label>
              <input v-model="novoPaciente.tipoCuenta" type="radio" value="empresa" />
              <span>Empresa</span>
            </label>
          </div>
        </div>
      </div>
      <button type="submit" class="btn-guardar" :disabled="novoPaciente.dni === '' || novoPaciente.nome === ''">
        Gardar
      </button>
    </form>
    <h4>📋 Listaxe de paciente</h4>
    <table v-if="paciente.length > 0">
      <thead>
        <tr>
          <th>#</th>
          <th>DNI/CIF</th>
          <th>Nome</th>
          <th>Apelido</th>
          <th>Fecha de nacemento</th>
          <th>Correo</th>
          <th>Provincia</th>
          <th>Activo</th>
          <th>Tipo de conta</th>
          <th>Accións</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, index) in paciente" :key="index">
          <td>{{ index + 1 }}</td>
          <td style="text-align: center;">{{ u.dni }}</td>
          <td>{{ u.nome }}</td>
          <td>{{ u.apelido }}</td>
          <td>{{ u.fechaNacemento }}</td>
          <td>{{ u.correo }}</td>
          <td>{{ u.provincia }}</td>
          <td style="text-align: center;">{{ u.activo ? "✅" : "❌" }}</td>
          <td>{{ u.tipoCuenta }}</td>
          <td style="text-align: center;">
            <button @click="editarPaciente(index)" title="Editar">✏️</button>
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

const paciente = ref([])  //almacena la lista de paciente e os seus cambios

const novoPaciente = reactive({
  dni: "",
  nome: "",
  apelido: "",
  correo: "",
  provincia: "",
  activo: false,
  tipoCuenta: ""
})

/// Zona de ciclo de vida

onMounted(() => {       //sempre se cargan estos paciente de exemplo ao iniciar o componente
  paciente.value = [
    { dni: "A000000C", nome: "Soldaduras SL", correo: "soldadura@email.com", provincia: "A Coruña", activo: true, tipoCuenta: "empresa" },
    { dni: "0000000C", nome: "María Pérez", correo: "maria@email.com", provincia: "Lugo", activo: false, tipoCuenta: "particular" },
    { dni: "B1234567D", nome: "Xosé López", correo: "xose@email.com", provincia: "Ourense", activo: true, tipoCuenta: "particular" },
    { dni: "C9876543E", nome: "Construcións Modernas", correo: "construcion@email.com", provincia: "Pontevedra", activo: true, tipoCuenta: "empresa" }
  ]
})

/// Zona de métodos ou funcións

function gardarPaciente() {
  paciente.value.push({ ...novoPaciente })  //engade o novo paciente á lista (copia do obxecto)
  Object.assign(novoPaciente, { dni: "", nome: "", correo: "", provincia: "", activo: false, tipoCuenta: "" }) //reinicia o formulario
}

function eliminarPaciente(index) {
  paciente.value.splice(index, 1);   //elimina o paciente da lista
}

function editarPaciente(index) {
  const paciente = paciente.value[index];   //carga os datos do paciente elixido no formulario
  Object.assign(novoPaciente, paciente);  // carga os datos do paciente no formulario recorda v-model do formulario é novoPaciente
}

//===================================================================================
// Funciones auxiliares

function validarDni() {
  const dniregex = /^[0-9]{8}[A-Z]$/; // Expresión regular para validar el formato del DNI
  return dniregex.test(novoPaciente.dni);
}

function validarDni2() {
  const dniarray = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'];
  const numerosDni = novoPaciente.dni.slice(0, 8);
  const letraDni = novoPaciente.dni.slice(8, 9);
  return 
}

</script>

<style scoped>
.xestion-paciente {
  width: 100%;
  /* opcional para que no crezca demasiado en pantallas muy grandes */
  background: white;
  padding: 2rem;
  overflow: visible;
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.fila {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.fila-centrada {
  justify-content: center;
}

.campo {
  display: flex;
  align-items: center;
  /* label e input en la misma línea */
  gap: 0.5rem;
  border-radius: 0px;
}

.campo-dni {
  flex: 1;
  /* ocupa menos espacio */
  border-radius: 0px;
}

.campo-nome {
  flex: 3;
  /* ocupa más espacio */
  border-radius: 0px;
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
  min-width: 80px;
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
  border-image: linear-gradient(45deg, #00aa1c, #0000ff) 1; /* Define los dos colores y el ángulo */
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
}
</style>
