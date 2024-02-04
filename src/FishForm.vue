<script setup lang="ts">
import { reactive, ref } from "vue";
import goldenPurpleFish from "./assets/golden-purple-fish.png";
import goldFish from "./assets/goldfish.png";
import guppie from "./assets/guppie.png";
import tropicalFish from "./assets/tropical-fish.png";
import tuna from "./assets/tuna.png";

import { type Fish } from "./models/fish.model";

const props = defineProps<{
  fish: Fish[];
}>();

const emit = defineEmits<{
  (event: "addFish", fish: Fish): void;
}>();

const fish = ref<Fish[]>([
  {
    name: "Mike",
    img: goldFish,
  },
  {
    name: "Ricky",
    img: goldenPurpleFish,
  },
  {
    name: "Steven",
    img: guppie,
  },
  {
    name: "Ian",
    img: tropicalFish,
  },
  {
    name: "Mikayla",
    img: tuna,
  },
]);

const form = reactive<Fish>({
  name: "",
  img: "",
});

const selectFish = (fish: Fish) => {
  form.img = fish.img;

  const existingSimilarFish = props.fish.filter((f) => f.img === fish.img);
  if (existingSimilarFish.length) {
    form.name = `${fish.name} #${existingSimilarFish.length + 1}`;
    return;
  }

  form.name = fish.name;
};

const submitNewFish = (event: Event) => {
  event.preventDefault();
  const newFish = { ...form };
  emit("addFish", newFish);
  form.name = "";
  form.img = "";
};
</script>
<template>
  <section class="bg-blue-200 w-[25vw] lg:w-[15vw] h-screen">
    <form
      @submit="submitNewFish"
      class="flex flex-col h-full gap-2 p-2 lg:p-4 text-center"
    >
      <h2 class="text-2xl font-bold">Add a Fish</h2>
      <label for="species">Species</label>
      <div class="flex flex-wrap items-center justify-center gap-2">
        <img
          @click="selectFish(f)"
          class="w-16 h-16 object-contain rounded-md hover:cursor-pointer border-2 hover:border-blue-400 transition-all"
          :class="form.img === f.img ? 'border-blue-600' : 'border-transparent'"
          v-for="f in fish"
          :key="f.name"
          :src="f.img"
          :alt="f.img"
        />
      </div>

      <label for="name">Name</label>
      <input type="text" id="name" v-model="form.name" />

      <button
        :disabled="!form.name || !form.img"
        class="bg-blue-600 hover:bg-blue-500 transition-colors mt-auto text-white p-2 rounded-md"
      >
        Add Fish
      </button>
    </form>
  </section>
</template>
