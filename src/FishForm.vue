<script setup lang="ts">
import { reactive, ref } from 'vue';
import goldenPurpleFish from './assets/golden-purple-fish.png';
import goldFish from './assets/goldfish.png';
import guppie from './assets/guppie.png';
import tropicalFish from './assets/tropical-fish.png';
import tuna from './assets/tuna.png';

import { type Fish } from './models/fish.model';

const emit = defineEmits<{
    (event: 'addFish', fish: Fish): void;
}>();

const fish = ref<Fish[]>([
    {
        name: 'Mike',
        img: goldFish,
    },
    {
        name: 'Ricky',
        img: goldenPurpleFish,
    },
    {
        name: 'Steven',
        img: guppie,
    },
    {
        name: 'Ian',
        img: tropicalFish,
    },
    {
        name: 'Mikayla',
        img: tuna,
    }
]);

const form  = reactive<Fish>({
    name: '',
    img: ''
})

const selectFish = (fish: Fish) => {
    form.name = fish.name
    form.img = fish.img
};

const submitNewFish = (event: Event) => {
    event.preventDefault();
    emit('addFish', form);
};

</script>
<template>
    <section class="bg-blue-200 w-[25vw] h-screen">
        <form @submit="submitNewFish" class="flex flex-col h-full gap-2 p-4">
            <h2 class="text-2xl font-bold">Add a Fish</h2>
            <label for="species">Species</label>
            <div class="flex flex-wrap gap-2">
                <img @click="selectFish(f)" class="w-16 h-16 object-contain" v-for="f in fish" :key="f.name" :src="f.img" :alt="f.img"/>
            </div>
          
            <label for="name">Name</label>
            <input type="text" id="name" v-model="form.name" />
            
            <button :disabled="!form.name || !form.img" class="bg-blue-500 hover:bg-blue-400 transition-colors mt-auto text-white p-2 rounded-md">Add Fish</button>
        </form>
    </section>
</template>
