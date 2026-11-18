<template>
<h1>Inicio</h1>
<video controls="true" muted autoplay loop>
    <source :src="Video" type="video/mp4">
</video>
</template>
<script setup>
import Video from '../assets/hospital-stock.mp4';

</script>
<style scoped></style>