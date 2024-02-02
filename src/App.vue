<script setup lang="ts">
import { ref } from 'vue';
import Aquarium from './Aquarium.vue';
import FishForm from './FishForm.vue';
import type { Fish } from './models/fish.model';

const fish = ref<Fish[]>([]);

const addFish = (newFish: Fish) => {
    fish.value.push(newFish);
};

</script>
<template>
    <main class="flex gap-2 overflow-hidden">
        <FishForm @add-fish="addFish" />
        <Aquarium :fish="fish"/>
    </main>
</template>

