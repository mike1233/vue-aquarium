<script setup>
import { reactive, ref } from 'vue';

const emit = defineEmits(['addFish']);

const fish = ref([
    {
        type: 'Mike',
        img: '/goldfish.png',
    },
    {
        type: 'Ricky',
        img: '/golden-purple-fish.png',
    },
    {
        type: 'Guppie',
        img: '/guppie.png',
    },
    {
        type: 'Fish',
        img: '/tropical-fish.png',
    },
    {
        type: 'Tuna',
        img: '/tuna.png',
    }

]);

const form  = reactive({
    name: '',
    fishType: ''
})

const selectFish = (fish) => {
    form.name = fish.type
    form.fishType = fish.img
};

const submitNewFish = (event) => {
    event.preventDefault();
    emit('addFish', {
        name: form.name,
        img: form.fishType
    });
};

</script>
<template>
    <section class="bg-red-200 w-[25vw] h-screen">
        <form @submit="submitNewFish" class="flex flex-col gap-2 p-4">
            <h2 class="text-2xl font-bold">Add a Fish</h2>
            <label for="species">Species</label>
            <div class="flex flex-wrap gap-2">
                <img @click="selectFish(f)" class="w-16 h-16 object-contain" v-for="f in fish" :key="f.type" :src="f.img" :alt="f.type"/>
            </div>
          
            <label for="name">Name</label>
            <input type="text" id="name" v-model="form.name" />
            
            <button :disabled="!form.name || !form.fishType" class="bg-blue-500 text-white p-2 rounded-md">Add Fish</button>
        </form>
    </section>
</template>
