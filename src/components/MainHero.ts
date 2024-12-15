import { Point, Text, TextStyle } from 'pixi.js';
import { HERO_COLOR, HERO_SPAN_COUNTER_COLOR } from '../consts/CColor';
import { HERO_RADIUS, HERO_SPEED, TEXT_SIZE, TEXT_SPACE } from '../consts/CGame';
import { BaseElement } from './BaseElement';
import { Yard } from './Yard';

export class MainHero extends BaseElement {
    private speed: number;
    private targetPosition: Point;
    private followCounterText: Text;
    private spawnCounter: number;

    constructor(position:Point) {
        super();
        this.x = position.x;
        this.y = position.y;
        this.targetPosition = new Point(0, 0);
        this.speed = HERO_SPEED;
        this.spawnCounter = -1;

        this.followCounterText = new Text({ text: "", style: this.getFont() });
        this.followCounterText.x = - this.followCounterText.height * 0.5 + TEXT_SPACE;
        this.followCounterText.y = - this.followCounterText.height * 0.5;
        this.addChild(this.followCounterText);
        this.updateSpawnCounter();
    }

    protected draw() {
        this.background.circle(0, 0, HERO_RADIUS);
        this.background.fill(HERO_COLOR);
        this.addChild(this.background);
    }

    public moveToPoint(position:Point): void {
        this.targetPosition = position;
    }

    public update(delta: number): void {
        const dx = this.targetPosition.x - this.x;
        const dy = this.targetPosition.y - this.y;
        const distanceToTarget = Math.sqrt(dx * dx + dy * dy);

        if (distanceToTarget > 1) {
            const moveDistance = Math.min(distanceToTarget, this.speed * delta);
            this.x += (dx / distanceToTarget) * moveDistance;
            this.y += (dy / distanceToTarget) * moveDistance;
        }
    }

    public isHeroInsideYard(yard: Yard): boolean {
        const heroBounds = this.getBounds();
        const yardBounds = yard.getBounds();
        return ( heroBounds.x + heroBounds.width > yardBounds.x &&
                heroBounds.x < yardBounds.x + yardBounds.width &&
                heroBounds.y + heroBounds.height > yardBounds.y &&
                heroBounds.y < yardBounds.y + yardBounds.height );
    }

    public updateSpawnCounter(counter:number = 0):void {
        if(this.spawnCounter != counter) {
            this.spawnCounter = counter;
            this.followCounterText.text = this.spawnCounter.toString();
        }
    } 

    private getFont():TextStyle {
        return new TextStyle({fill: HERO_SPAN_COUNTER_COLOR, fontSize: TEXT_SIZE}); 
    } 

    public destroy() {
        super.destroy();
        this.removeChild(this.followCounterText);
        this.followCounterText.destroy();
        //this.followCounterText = null;
        //this.targetPosition = null;
    }
}