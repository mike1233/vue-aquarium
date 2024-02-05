export interface Fish {
  name: string;
  img: string;
}

export interface FishExtended extends Fish {
  velocityX: number;
  velocityY: number;
  foodMeter: number;
  fedCounter: number;
  starveRate: number;
  xPos: number;
  yPos: number;
  size: number;
  updateInterval: NodeJS.Timer | null;
}
