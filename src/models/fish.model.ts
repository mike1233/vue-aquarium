export interface Fish{
    name: string;
    img: string;
}

export interface FishExtended {
    fish: Fish
    aquarium: DOMRect
    velocityX: number
    velocityY: number
    foodMeter: number
    starveRate: number
    xPos: number
    yPos: number
    updateInterval: NodeJS.Timer | null
}