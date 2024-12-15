import { Point } from 'pixi.js';
import { ANIMAL_COLOR } from '../consts/CColor';
import { ANIMAL_RADIUS, ANIMAL_SPEED, DISTANCE_BETWEEN_HERO_AND_ANIMAL_TO_FOLLOW, FOLLOW_RADIUS, GAME_HEIGHT, GAME_WIDTH, YARD_WIDTH } from '../consts/CGame';
import { BaseElement } from './BaseElement';
import { MainHero } from './MainHero';
import { Yard } from './Yard';

export class Animal extends BaseElement {
    private following: boolean = false;
    private speed: number;
    private patrolTarget: Point;

    constructor(position: Point) {
        super();
        this.x = position.x;
        this.y = position.y;
        this.speed = ANIMAL_SPEED;
        this.patrolTarget = new Point(0, 0);
        this.setPatrolTarget();
    }

    protected draw() {
        this.background.circle(0, 0, ANIMAL_RADIUS);
        this.background.fill(ANIMAL_COLOR);
        this.addChild(this.background);
    }

    public update(delta: number, mainHero: MainHero, yard: Yard, heroInYard: boolean, followingAnimals: Animal[]): void {
        if (this.following) {
            this.followMainHero(delta, mainHero, followingAnimals);
        } else {
            this.startPatrol(delta);
        }
    
        if (heroInYard && this.isAnimalInsideYard(yard)) {
            this.setFollowing(false);
            this.setPatrolTarget(); 
        }
    }

    private followMainHero(delta: number, mainHero: MainHero, followingAnimals: Animal[]): void {
        let followIndex = followingAnimals.indexOf(this);
        const angle = (Math.PI) / followingAnimals.length * followIndex;
        
        const targetX = mainHero.x + Math.cos(angle) * FOLLOW_RADIUS;
        const targetY = mainHero.y + Math.sin(angle) * FOLLOW_RADIUS;

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            this.x += (dx / dist) * this.speed * delta;
            this.y += (dy / dist) * this.speed * delta;
        }
    }

    public checkIfCanFollowForHero(mainHero: MainHero): boolean {
        const dx = mainHero.x - this.x;
        const dy = mainHero.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < DISTANCE_BETWEEN_HERO_AND_ANIMAL_TO_FOLLOW;
    }

    private startPatrol(delta: number): void {
        if (!this.patrolTarget) {
            this.setPatrolTarget();
        }

        const dx = this.patrolTarget.x - this.x;
        const dy = this.patrolTarget.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > ANIMAL_RADIUS) {
            this.x += (dx / distance) * this.speed * delta;
            this.y += (dy / distance) * this.speed * delta;
        } else {
            this.setPatrolTarget();
        }
    }

    private setPatrolTarget(): void {
        this.patrolTarget = new Point(Math.random() * GAME_WIDTH + YARD_WIDTH, Math.random() * GAME_HEIGHT);
    }

    public isAnimalInsideYard(yard: Yard): boolean {
        const yardBounds = yard.getBounds();
        const animalBounds = this.getBounds();
        return (animalBounds.x + animalBounds.width > yardBounds.x &&
                animalBounds.x < yardBounds.x + yardBounds.width &&
                animalBounds.y + animalBounds.height > yardBounds.y &&
                animalBounds.y < yardBounds.y + yardBounds.height);
    }

    public getFollowing() {
        return this.following; 
    }

    public setFollowing(value: boolean) {
        this.following = value;
    }

    public destroy() {
        super.destroy();
        //this.patrolTarget = null;
    }
}