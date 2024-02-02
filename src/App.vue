<script setup>
import { ref } from 'vue';
import Aquarium from './Aquarium.vue';
import FishForm from './FishForm.vue';

const fish = ref([]);

const addFish = (newFish) => {
    fish.value.push(newFish);
};

</script>
<template>
    <main class="flex gap-2">
        <FishForm @add-fish="addFish" />
        <Aquarium :fish="fish"/>
    </main>
</template>

