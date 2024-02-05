<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive } from "vue";
import deadFish from "./assets/dead.png";
import type { FishExtended } from "./models/fish.model";
import { getRandomInt, upgradeFishSize } from "./utils";

const props = defineProps<{
  fish: FishExtended;
  aquarium: DOMRect;
  paused: boolean;
}>();

const emit = defineEmits<{
  (event: "updateFish", fish: FishExtended): void;
  (event: "updateScore", score: number): void;
}>();

const fish = reactive<FishExtended>(props.fish);

const decideVelocity = () => {
  if (fish.velocityX && fish.velocityY) return;

  fish.velocityX = Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 5;

  fish.velocityY = Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 5;
};

const decideStartingPosition = () => {
  if (fish.xPos && fish.yPos) return;

  fish.xPos = getRandomInt(
    props.fish.size * 2,
    props.aquarium.width - props.fish.size * 2
  );

  fish.yPos = getRandomInt(
    props.fish.size * 2,
    props.aquarium.height - props.fish.size * 2
  );
};

const moveFish = () => {
  if (isDead.value) {
    fish.yPos += 10;
    return;
  }

  const previousX = fish.xPos;
  const previousY = fish.yPos;

  fish.xPos += fish.velocityX;
  fish.yPos += fish.velocityY;

  const isOutsideXStart = fish.xPos < 0;
  const isMovingToXStart = fish.xPos > previousX;
  const isOutsideXEnd = fish.xPos > xBoundary.value;
  const isMovingToXEnd = fish.xPos < previousX;

  if (
    (isOutsideXStart && !isMovingToXStart) ||
    (isOutsideXEnd && !isMovingToXEnd)
  ) {
    fish.velocityX *= -1;
  }

  const isOutsideYStart = fish.yPos < 0;
  const isMovingToYStart = fish.yPos > previousY;
  const isOutsideYEnd = fish.yPos > yBoundary.value;
  const isMovingToYEnd = fish.yPos < previousY;

  if (
    (isOutsideYStart && !isMovingToYStart) ||
    (isOutsideYEnd && !isMovingToYEnd)
  ) {
    fish.velocityY *= -1;
  }
};

const eatFood = () => {
  if (isDead.value || props.paused) {
    return;
  }
  fish.foodMeter = 100;
  fish.fedCounter++;

  if (fish.fedCounter % 10 === 0) {
    fish.size = upgradeFishSize(fish.size, 32);
    fish.starveRate += 0.25;
  }

  emit("updateScore", fish.size + fish.fedCounter);
};

const starve = () => {
  if (isDead.value) {
    return;
  }
  fish.foodMeter -= fish.starveRate;
};

const xBoundary = computed(() => {
  return props.aquarium.width - props.fish.size - 24;
});

const yBoundary = computed(() => {
  return props.aquarium.height - props.fish.size - 24;
});

const isDead = computed(() => {
  return fish.foodMeter <= 0;
});

const fishImage = computed(() => {
  if (isDead.value) {
    return deadFish;
  }
  return fish.img;
});

const fishStyle = computed(() => ({
  transform: fish.velocityX > 0 ? "scaleX(1)" : "scaleX(-1)",
  width: `${fish.size}px`,
  height: `${fish.size}px`,
}));

const fishPositionStyle = computed(() => ({
  left: `${fish.xPos}px`,
  top: `${fish.yPos}px`,
}));

const fishHealthStyle = computed(() => ({
  width: `${fish.foodMeter}%`,
}));

const setFishInterval = () => {
  fish.updateInterval = setInterval(() => {
    if (props.paused) {
      return;
    }
    starve();
    if (isDead.value && fish.yPos >= yBoundary.value) {
      clearInterval(fish.updateInterval as NodeJS.Timer);
    }
    moveFish();
    emit("updateFish", fish);
  }, 100);
};

onMounted(() => {
  decideStartingPosition();
  decideVelocity();
  setFishInterval();

  emit("updateFish", fish);
});

onBeforeUnmount(() => {
  clearInterval(fish.updateInterval as NodeJS.Timer);
});
</script>

<template>
  <div
    class="fish absolute flex flex-col items-center transition-all will-change-transform ease-in"
    :style="fishPositionStyle"
  >
    <div
      class="flex flex-col items-center pointer-events-none rounded-md border-white border-2 overflow-hidden"
    >
      <div class="bg-red-500 h-2 w-full">
        <div :style="fishHealthStyle" class="bg-green-500 h-2"></div>
      </div>
      <div
        class="text-black bg-white flex justify-center w-full pointer-events-none"
      >
        {{ fish.name }}
      </div>
    </div>
    <img
      class="object-contain transition-all"
      :style="fishStyle"
      :src="fishImage"
      :alt="fish.name"
      @click="eatFood"
    />
  </div>
</template>
