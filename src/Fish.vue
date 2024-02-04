<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive } from "vue";
import deadFish from "./assets/dead.png";
import type { FishExtended } from "./models/fish.model";
import { getRandomInt } from "./utils";

const props = defineProps<{
  fish: FishExtended;
  aquarium: DOMRect;
  paused: boolean;
}>();

const emit = defineEmits<{
  (event: "updateFish", fish: FishExtended): void;
}>();

const FISH_WIDTH = 64;
const FISH_HEIGHT = 64 + 8;

const fishState = reactive<FishExtended>(props.fish);

const decideVelocity = () => {
  if (fishState.velocityX && fishState.velocityY) {
    return;
  }
  fishState.velocityX = Math.random() * 5;
  fishState.velocityY = Math.random() * 5;
};

const decideStartingPosition = () => {
  if (fishState.xPos && fishState.yPos) {
    return;
  }

  fishState.xPos = getRandomInt(
    FISH_WIDTH * 2,
    props.aquarium.width - FISH_WIDTH * 2
  );
  fishState.yPos = getRandomInt(
    FISH_HEIGHT * 2,
    props.aquarium.height - FISH_HEIGHT * 2
  );
};

const moveFish = () => {
  if (isDead.value) {
    fishState.yPos += 10;
    return;
  }

  const previousX = fishState.xPos;
  const previousY = fishState.yPos;

  fishState.xPos += fishState.velocityX;
  fishState.yPos += fishState.velocityY;

  const isOutsideXStart = fishState.xPos < 0;
  const isMovingToXStart = fishState.xPos > previousX;
  const isOutsideXEnd = fishState.xPos > xBoundary.value;
  const isMovingToXEnd = fishState.xPos < previousX;

  if (
    (isOutsideXStart && !isMovingToXStart) ||
    (isOutsideXEnd && !isMovingToXEnd)
  ) {
    fishState.velocityX *= -1;
  }

  const isOutsideYStart = fishState.yPos < 0;
  const isMovingToYStart = fishState.yPos > previousY;
  const isOutsideYEnd = fishState.yPos > yBoundary.value;
  const isMovingToYEnd = fishState.yPos < previousY;

  if (
    (isOutsideYStart && !isMovingToYStart) ||
    (isOutsideYEnd && !isMovingToYEnd)
  ) {
    fishState.velocityY *= -1;
  }
};

const eatFood = () => {
  if (isDead.value || props.paused) {
    return;
  }
  fishState.foodMeter = 100;
};

const starve = () => {
  if (isDead.value) {
    return;
  }
  fishState.foodMeter -= fishState.starveRate;
};

const xBoundary = computed(() => {
  return props.aquarium.width - FISH_WIDTH - 24;
});

const yBoundary = computed(() => {
  return props.aquarium.height - FISH_HEIGHT - 24;
});

const isDead = computed(() => {
  return fishState.foodMeter <= 0;
});

const fishImage = computed(() => {
  if (isDead.value) {
    return deadFish;
  }
  return fishState.img;
});

const fishPositionStyle = computed(() => ({
  left: `${fishState.xPos}px`,
  top: `${fishState.yPos}px`,
}));

const fishStyle = computed(() => {
  if (fishState.velocityX > 0) {
    return {
      transform: "scaleX(1)",
    };
  }
  return {
    transform: "scaleX(-1)",
  };
});

const fishHealthStyle = computed(() => ({
  width: `${fishState.foodMeter}%`,
}));

const setFishInterval = () => {
  fishState.updateInterval = setInterval(() => {
    if (props.paused) {
      return;
    }
    starve();
    if (isDead.value && fishState.yPos >= yBoundary.value) {
      clearInterval(fishState.updateInterval as NodeJS.Timer);
    }
    moveFish();
    emit("updateFish", fishState);
  }, 100);
};

onMounted(() => {
  decideStartingPosition();
  decideVelocity();
  setFishInterval();

  emit("updateFish", fishState);
});

onBeforeUnmount(() => {
  clearInterval(fishState.updateInterval as NodeJS.Timer);
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
      class="w-16 h-16 object-contain"
      :style="fishStyle"
      :src="fishImage"
      :alt="fish.name"
      @click="eatFood"
    />
  </div>
</template>
