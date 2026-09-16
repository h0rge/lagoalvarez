<template>
  <main class="container">
    <xestionusuarios />
  </main>
</template>

  <script setup>
  import HelloWorld from './components/HelloWorld.vue'
import Xestionusuarios from './components/xestionusuarios.vue';
  </script>


<style>
.container {
  width: 75vw;
  max-width: 1400px;
  height: 100vh;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .container {
    width: 90vw;
  }
}

</style>