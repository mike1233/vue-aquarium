import type { FishExtended } from "../models/fish.model";

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const upgradeFishSize = (size: number, upgrade: number) => {
  if (size >= 160) {
    return 160;
  }
  return size + upgrade;
};

export const isValidFish = (fish: FishExtended) => {
  if (
    typeof fish.name === "string" &&
    typeof fish.img === "string" &&
    typeof fish.velocityX === "number" &&
    typeof fish.velocityY === "number" &&
    typeof fish.foodMeter === "number" &&
    typeof fish.fedCounter === "number" &&
    typeof fish.starveRate === "number" &&
    typeof fish.xPos === "number" &&
    typeof fish.yPos === "number" &&
    typeof fish.size === "number"
  ) {
    return true;
  }
  return false;
};
