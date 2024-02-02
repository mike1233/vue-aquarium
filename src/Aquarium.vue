<script setup>
import { ref } from 'vue';
import Fish from './Fish.vue';

defineProps({
    fish: {
        type: Array,
        required: true
    }
});

const aquarium = ref(null);

const getAquariumBounds = () => {
    return aquarium.value.getBoundingClientRect();
};

</script>

<template>
    <section ref="aquarium" class="relative bg-[url('/bg.jpg')] bg-cover bg-no-repeat w-[75vw] h-screen">
        <Fish v-for="f, index in fish" :key="`fish-${index}`" :fish="f" :aquarium="getAquariumBounds()" />
    </section>
</template>
