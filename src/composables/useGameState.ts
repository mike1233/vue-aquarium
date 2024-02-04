import { reactive } from "vue";
import type { Fish, FishExtended } from "../models/fish.model";

const state = reactive<{
  fish: FishExtended[];
  isPaused: boolean;
}>({
  fish: [],
  isPaused: true,
});

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
    localStorage.setItem("fish", JSON.stringify(state.fish));
    state.isPaused = true;
  };

  const clearGame = () => {
    localStorage.removeItem("fish");
    state.fish = [];
    state.isPaused = true;
  };

  const addFish = (newFish: Fish) => {
    state.fish.push({
      velocityX: 0,
      velocityY: 0,
      foodMeter: 100,
      starveRate: 0.5,
      xPos: 0,
      yPos: 0,
      updateInterval: null,
      ...newFish,
    });
  };

  const updateFish = (fish: FishExtended) => {
    let f = state.fish.find((f) => f.name === fish.name);
    f = fish;
  };

  return {
    state,
    addFish,
    updateFish,
    togglePause,
    retrieveGame,
    saveGame,
    clearGame,
  };
}
