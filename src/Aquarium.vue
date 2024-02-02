<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import FishComponent from "./Fish.vue";
import type { Fish, FishExtended } from "./models/fish.model";
import { getRandomInt } from "./utils";

const props = defineProps<{
  fish: Fish[];
}>();

const aquarium = ref<HTMLDivElement>();
const aquariumBounds = ref<DOMRect | null>(null);
const isPaused = ref(false);

const aquariumState = reactive<{ fish: FishExtended[] }>({
  fish: [],
});

const getAquariumBounds = () => aquarium.value?.getBoundingClientRect() ?? null;

const togglePause = () => (isPaused.value = !isPaused.value);

const retrieveGame = () => {
  const savedFish = localStorage.getItem("fish");
  if (savedFish) {
    isPaused.value = true;
    aquariumState.fish = JSON.parse(savedFish);
  }
};

const saveGame = () => {
  localStorage.setItem("fish", JSON.stringify(aquariumState.fish));
};

const pauseButtonText = computed(() => (isPaused.value ? "Resume" : "Pause"));

onMounted(() => {
  aquariumBounds.value = getAquariumBounds();
  retrieveGame();

  window.addEventListener(
    "resize",
    () => {
      aquariumBounds.value = getAquariumBounds();
    },
    {
      passive: true,
    }
  );

  watch(
    () => props.fish,
    (fish) => {
      aquariumState.fish = fish.map((f) => ({
        ...f,
        aquarium: aquariumBounds.value!,
        velocityX: 0,
        velocityY: 0,
        foodMeter: 100,
        starveRate: getRandomInt(0.1, 1),
        xPos: 0,
        yPos: 0,
        updateInterval: null,
      }));
    },
    {
      deep: true,
    }
  );
});
</script>

<template>
  <section
    ref="aquarium"
    class="relative bg-aquarium bg-center bg-cover bg-no-repeat w-[75vw] h-screen"
  >
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
    <template v-if="aquariumBounds">
      <FishComponent
        v-for="(fish, index) in aquariumState.fish"
        :key="`fish-${index}`"
        :fish="fish"
        :aquarium="aquariumBounds"
        :paused="isPaused"
        @update-fish="($event) => (aquariumState.fish[index] = $event)"
      />
    </template>
  </section>
</template>
