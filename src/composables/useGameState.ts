import { computed, reactive } from "vue";
import type { Fish, FishExtended } from "../models/fish.model";

const state = reactive<{ fish: Array<Fish | FishExtended>; isPaused: boolean }>(
  {
    fish: [],
    isPaused: true,
  }
);

export function useGameState() {
  const togglePause = () => (state.isPaused = !state.isPaused);

  const retrieveGame = () => {
    const savedFish = localStorage.getItem("fish");
    if (savedFish) {
      state.isPaused = true;
      state.fish = JSON.parse(savedFish);
    }
  };

  const saveGame = () => {
    localStorage.setItem("fish", JSON.stringify(aquariumFish.value));
  };

  const clearGame = () => {
    localStorage.removeItem("fish");
    state.fish = [];
  };

  const addFish = (newFish: Fish) => {
    state.fish.push(newFish);
  };

  const updateFish = (fish: FishExtended) => {
    let f = state.fish.find((f) => f.name === fish.name);
    f = fish;
  };

  const aquariumFish = computed<FishExtended[]>(() => {
    return state.fish.map((f) => {
      if ("velocityX" in f) return f;

      return {
        velocityX: 0,
        velocityY: 0,
        foodMeter: 100,
        starveRate: 0.5,
        xPos: 0,
        yPos: 0,
        updateInterval: null,
        ...f,
      };
    });
  });

  return {
    state,
    aquariumFish,
    addFish,
    updateFish,
    togglePause,
    retrieveGame,
    saveGame,
    clearGame,
  };
}
