<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, watch } from "vue";
import deadFish from './assets/dead.png';

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

const getRandomInt = (min, max) => { 
  min = Math.ceil(min); 
  max = Math.floor(max); 
  return Math.floor(Math.random() * (max - min + 1)) + min; 
} 

const decideVelocity = () => {
  fishState.velocityX = Math.random() * 5;
  fishState.velocityY = Math.random() * 5;
};

const decideStartingPosition = () => {
  fishState.xPos = getRandomInt(FISH_WIDTH * 2, fishState.aquarium.width - FISH_WIDTH * 2);
  fishState.yPos = getRandomInt(FISH_HEIGHT * 2, fishState.aquarium.height - FISH_HEIGHT * 2);
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
  

  if ((isOutsideXStart && !isMovingToXStart) || (isOutsideXEnd && !isMovingToXEnd)) {
    fishState.velocityX *= -1;
  }  
  
  const isOutsideYStart = fishState.yPos < 0;
  const isMovingToYStart = fishState.yPos > previousY;
  const isOutsideYEnd = fishState.yPos > yBoundary.value;
  const isMovingToYEnd = fishState.yPos < previousY;
  
  if ((isOutsideYStart && !isMovingToYStart) || (isOutsideYEnd && !isMovingToYEnd)){
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

watch(
  () => props.aquarium,
  () => {
    fishState.aquarium = props.aquarium;
  }
)

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
  <div @click="eatFood" class="fish absolute transition-all will-change-transform ease-in" :style="fishPositionStyle">
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
