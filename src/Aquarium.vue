<script setup lang="ts">
import { onMounted, ref } from 'vue';
import FishComponent from './Fish.vue';
import type { Fish } from './models/fish.model';

defineProps<{
    fish: Fish[];
}>();

const aquarium = ref<HTMLDivElement>();
const aquariumBounds = ref<DOMRect | null>(null);

const getAquariumBounds = () =>  aquarium.value?.getBoundingClientRect() ?? null;

onMounted(() => {
    aquariumBounds.value = getAquariumBounds();
    window.addEventListener('resize', () => {
        aquariumBounds.value = getAquariumBounds();
    }, {
        passive: true
    });
});

</script>

<template>
    <section ref="aquarium" class="relative bg-aquarium bg-center bg-cover bg-no-repeat w-[75vw] h-screen">
        <template v-if="aquariumBounds">
            <FishComponent v-for="f, index in fish" :key="`fish-${index}`" :fish="f" :aquarium="aquariumBounds" />
        </template>
    </section>
</template>
