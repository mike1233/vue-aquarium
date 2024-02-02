<script setup>
import { computed, onBeforeUnmount, onMounted, reactive } from "vue";
import deadFish from '../public/dead.png';

const props = defineProps({
  fish: {
    type: Object,
    required: true,
  },
  aquarium: {
    type: DOMRect,
    required: true,
  },
});

const FISH_WIDTH = 64;
const FISH_HEIGHT = 64 + 8;

const fishState = reactive({
  fish: props.fish,
  aquarium: props.aquarium,
  velocityX: null,
  velocityY: null,
  foodMeter: 100,
  xPos: null,
  yPos: null,
  updateInterval: null,
});

const decideVelocity = () => {
  fishState.velocityX = Math.random() * 3;
  fishState.velocityY = Math.random() * 3;
};

const decideStartingPosition = () => {
  fishState.xPos = Math.random() * (fishState.aquarium.width - FISH_WIDTH);
  fishState.yPos = Math.random() * (fishState.aquarium.height - FISH_HEIGHT);
};

const moveFish = () => {
  if (isDead.value) {
    fishState.yPos += 10;
    return;
  }

  fishState.xPos += fishState.velocityX;
  fishState.yPos += fishState.velocityY;

  if (fishState.xPos > xBoundary.value || fishState.xPos < 0) {
    fishState.velocityX *= -1;
  }
  if (fishState.yPos > yBoundary.value || fishState.yPos < 0) {
    fishState.velocityY *= -1;
  }
};

const eatFood = () => {
  if (isDead.value) {
    return;
  }
  fishState.foodMeter = 100;
};

const starve = () => {
  fishState.foodMeter -= 0.5;
};

const xBoundary = computed(() => {
  return fishState.aquarium.width - FISH_WIDTH - 24;
});

const yBoundary = computed(() => {
  return fishState.aquarium.height - FISH_HEIGHT - 24;
});

const isDead = computed(() => {
  return fishState.foodMeter <= 0;
});

const fishImage = computed(() => {
  if (isDead.value) {
    return deadFish;
  }
  return fishState.fish.img;
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
    starve();
    if (isDead.value && fishState.yPos >= yBoundary.value) {
      clearInterval(fishState.updateInterval);
    }
    moveFish();
  }, 100);
};

onMounted(() => {
  decideStartingPosition();
  decideVelocity();
  setFishInterval();
});

onBeforeUnmount(() => {
  clearInterval(fishState.updateInterval);
});
</script>

<template>
  <div @click="eatFood" class="fish absolute transition-all ease-in" :style="fishPositionStyle">
    <div class="bg-red-500 h-2 w-16">
      <div :style="fishHealthStyle" class="bg-green-500 h-2"></div>
    </div>
    <img
      class="w-16 h-16 object-contain"
      :style="fishStyle"
      :src="fishImage"
      :alt="fish.name"
    />
  </div>
</template>
