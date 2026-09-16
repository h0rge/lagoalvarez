<template>
  <button class ="button" @click="aumentar">+</button>
  <button class ="button" @click="restar">-</button>
  <p>Valor: {{ contador }}</p>
  <h5>Paciente</h5>
  <p>Nombre: {{ paciente.nombre }}</p>
  <p>Puntuación: {{ paciente.puntuacion }}</p>
  <p>Estado: {{ estadoPaciente }}</p>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const contador = ref(0);
const paciente = reactive
({
  nombre: 'Xosé',
  puntuacion: 0
})

const aumentar = () => {
  contador.value++
  paciente.puntuacion++
}

const restar = () => {
  contador.value--
  paciente.puntuacion--
}

const estadoPaciente = computed(() => {
  if (paciente.puntuacion >= 5) return "Paciente estado grave"
  if (paciente.puntuacion < 5) return "Paciente estado leve"
  else return "Paciente estado desconocido"
})
</script>