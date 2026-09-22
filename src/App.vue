<template>
  <div id="app">

    <main class="container">
      <NavBar />
      <router-view />
      <FooTer />
    </main>
  </div>
</template>

  <script setup>
  import HelloWorld from './components/HelloWorld.vue'
  import NavBar from './components/NavBar.vue';
  import FooTer from './components/FooTer.vue';
  </script>


<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  max-width: 1400px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 1rem;
  padding-bottom: 0;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .container {
    width: 90vw;
  }
}

</style>