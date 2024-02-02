<script setup>
import { onMounted, ref } from 'vue';
import Fish from './Fish.vue';

defineProps({
    fish: {
        type: Array,
        required: true
    }
});

const aquarium = ref(null);
const aquariumBounds = ref(null);

const getAquariumBounds = () =>  aquarium.value.getBoundingClientRect();

onMounted(() => {
    aquariumBounds.value = getAquariumBounds();
    window.addEventListener('resize', () => {
        aquariumBounds.value = getAquariumBounds();
    });
});

</script>

<template>
    <section ref="aquarium" class="relative bg-aquarium bg-center bg-cover bg-no-repeat w-[75vw] h-screen">
        <Fish v-for="f, index in fish" :key="`fish-${index}`" :fish="f" :aquarium="aquariumBounds" />
    </section>
</template>
