<script setup lang="ts">
import { onMounted, ref } from "vue";
import FishComponent from "./Fish.vue";
import type { FishExtended } from "./models/fish.model";

defineProps<{
  fish: Array<FishExtended>;
  isPaused: boolean;
}>();

const emit = defineEmits<{
  (event: "updateFish", fish: FishExtended): void;
}>();

const aquarium = ref<HTMLDivElement>();
const aquariumBounds = ref<DOMRect | null>(null);

const getAquariumBounds = () => aquarium.value?.getBoundingClientRect() ?? null;

const onUpdateFish = (updatedFish: FishExtended) => {
  emit("updateFish", updatedFish);
};

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
});
</script>

<template>
  <section
    ref="aquarium"
    class="relative bg-aquarium bg-center bg-cover bg-no-repeat w-[75vw] lg:w-[85vw] h-screen"
  >
    <slot></slot>

    <template v-if="aquariumBounds">
      <FishComponent
        v-for="(f, index) in fish"
        :key="`fish-${index}`"
        :fish="f"
        :aquarium="aquariumBounds"
        :paused="isPaused"
        @update-fish="onUpdateFish"
      />
    </template>
  </section>
</template>
