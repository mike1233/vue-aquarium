<script setup lang="ts">
import { computed, onMounted } from "vue";
import Aquarium from "./Aquarium.vue";
import FishForm from "./FishForm.vue";
import { useGameState } from "./composables/useGameState";

const {
  state,
  retrieveGame,
  togglePause,
  saveGame,
  clearGame,
  addFish,
  updateFish,
  updateScore,
} = useGameState();

const pauseButtonText = computed(() => (state.isPaused ? "Resume" : "Pause"));

onMounted(() => {
  retrieveGame();
});
</script>
<template>
  <main class="flex gap-2 overflow-hidden">
    <FishForm @add-fish="addFish" :fish="state.fish" />
    <Aquarium
      :is-paused="state.isPaused"
      :fish="state.fish"
      @update-fish="updateFish"
      @update-score="updateScore"
    >
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
      <div
        class="game-score relative flex justify-center mt-2 w-full pointer-events-none"
      >
        <span
          class="text-white font-bold bg-opacity-30 bg-blue-950 p-2 rounded-md"
          >Score: {{ state.score }}
        </span>
      </div>
    </Aquarium>
  </main>
</template>
