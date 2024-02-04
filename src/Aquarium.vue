<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import FishComponent from "./Fish.vue";
import type { Fish, FishExtended } from "./models/fish.model";
import { getRandomInt } from "./utils";

const props = defineProps<{
  fish: Fish[];
  isPaused: boolean;
}>();

const aquarium = ref<HTMLDivElement>();
const aquariumBounds = ref<DOMRect | null>(null);

const aquariumState = reactive<{ fish: FishExtended[] }>({
  fish: [],
});

const getAquariumBounds = () => aquarium.value?.getBoundingClientRect() ?? null;

onMounted(() => {
  aquariumBounds.value = getAquariumBounds();

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
    <slot></slot>

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
