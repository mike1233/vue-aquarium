import { reactive } from "vue";
import type { Fish, FishExtended } from "../models/fish.model";
import { isValidFish } from "../utils";

const state = reactive<{
  score: number;
  fish: FishExtended[];
  isPaused: boolean;
}>({
  score: 0,
  fish: [],
  isPaused: true,
});

export function useGameState() {
  const togglePause = () => (state.isPaused = !state.isPaused);

  const retrieveGame = () => {
    const savedFish = localStorage.getItem("fish");
    if (savedFish) {
      state.isPaused = true;
      const fishFromStorage = JSON.parse(savedFish) as FishExtended[];
      state.fish = fishFromStorage.filter((fish) => isValidFish(fish));
      state.score = parseInt(localStorage.getItem("score") || "0");
    }
  };

  const saveGame = () => {
    localStorage.setItem("fish", JSON.stringify(state.fish));
    localStorage.setItem("score", state.score.toString());
    state.isPaused = true;
  };

  const clearGame = () => {
    localStorage.removeItem("fish");
    localStorage.removeItem("score");
    state.fish = [];
    state.score = 0;
    state.isPaused = true;
  };

  const addFish = (newFish: Fish) => {
    state.fish.push({
      velocityX: 0,
      velocityY: 0,
      foodMeter: 100,
      fedCounter: 0,
      starveRate: 0.25,
      xPos: 0,
      yPos: 0,
      size: 32,
      updateInterval: null,
      ...newFish,
    });
  };

  const updateFish = (fish: FishExtended) => {
    const fishIndex = state.fish.findIndex((f) => f.name === fish.name);
    state.fish[fishIndex] = fish;
  };

  const updateScore = (score: number) => {
    state.score += score;
  };

  return {
    state,
    addFish,
    updateFish,
    togglePause,
    retrieveGame,
    saveGame,
    clearGame,
    updateScore,
  };
}
