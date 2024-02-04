<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import Aquarium from "./Aquarium.vue";
import FishForm from "./FishForm.vue";
import type { Fish } from "./models/fish.model";

const state = reactive<{ fish: Fish[]; isPaused: boolean }>({
  fish: [],
  isPaused: false,
});

const addFish = (newFish: Fish) => {
  state.fish.push(newFish);
};

const togglePause = () => (state.isPaused = !state.isPaused);

const retrieveGame = () => {
  const savedFish = localStorage.getItem("fish");
  if (savedFish) {
    state.isPaused = true;
    state.fish = JSON.parse(savedFish);
  }
};

const saveGame = () => {
  localStorage.setItem("fish", JSON.stringify(state.fish));
};

const pauseButtonText = computed(() => (state.isPaused ? "Resume" : "Pause"));

onMounted(() => {
  retrieveGame();
});
</script>
<template>
  <main class="flex gap-2 overflow-hidden">
    <FishForm @add-fish="addFish" />
    <Aquarium v-bind="state">
      <div class="game-buttons mt-2 mr-2 flex justify-end gap-2">
        <button
          class="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors"
          @click="togglePause"
        >
          {{ pauseButtonText }}
        </button>
        <button
          class="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors"
          @click="saveGame"
        >
          Save
        </button>
      </div>
    </Aquarium>
  </main>
</template>
