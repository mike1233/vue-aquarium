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

const clearGame = () => {
  localStorage.removeItem("fish");
  state.fish = [];
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
          class="text-white px-4 py-2 rounded-md transition-colors"
          :class="
            state.isPaused
              ? 'bg-orange-600 hover:bg-orange-500'
              : 'bg-blue-600 hover:bg-blue-500'
          "
          @click="togglePause"
        >
          {{ pauseButtonText }}
        </button>
        <button
          class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition-colors"
          @click="saveGame"
        >
          Save
        </button>
        <button
          class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md transition-colors"
          @click="clearGame"
        >
          Clear
        </button>
      </div>
    </Aquarium>
  </main>
</template>
