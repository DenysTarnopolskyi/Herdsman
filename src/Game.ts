import { Application, FederatedPointerEvent, Point, Ticker } from 'pixi.js';
import { Animal } from './components/Animal';
import { GameField } from './components/GameField';
import { MainHero } from './components/MainHero';
import { TopPanel } from './components/TopPanel';
import { Yard } from './components/Yard';
import { ANIMAL_SPAWN_INTERVAL, GAME_HEIGHT, GAME_WIDTH, MAX_ANIMALS_COUNT_IN_GROUP, MAX_ANIMALS_COUNT_ON_SCREEN, YARD_WIDTH } from './consts/CGame';

export class Game {
    private app: Application;
    private gameField!: GameField;
    private mainHero!: MainHero;
    private animals: Animal[];
    private yard!: Yard;
    private topPanel!: TopPanel;
    private spawnIntervalId: number;

    constructor(app:Application) {
        this.app = app;
        this.spawnIntervalId = -1;
        this.animals = [];
        this.initGameComponents();
        this.startSpawnAnimals();
    }

    private initGameComponents(): void {
        this.gameField = new GameField();
        this.gameField.x = YARD_WIDTH;
        this.app.stage.addChild(this.gameField);

        this.yard = new Yard();
        this.app.stage.addChild(this.yard);

        this.topPanel = new TopPanel();
        this.app.stage.addChild(this.topPanel);

        this.mainHero = new MainHero(this.getHeroStartPosition());
        this.mainHero.moveToPoint(this.getHeroStartPosition());
        this.app.stage.addChild(this.mainHero);

        this.app.ticker.add((delta: Ticker) => this.update(delta));
        this.gameField.on('pointerdown', this.onGameFieldClicked.bind(this));
    }

    private startSpawnAnimals(): void {
        this.spawnIntervalId = setInterval(() => {
            this.spawnAnimals();
        }, ANIMAL_SPAWN_INTERVAL);
    }

    private spawnAnimals(): void {
        if(this.animals.length >= MAX_ANIMALS_COUNT_ON_SCREEN) {
            this.clearSpawnIntervalId();
            return;
        }
        const animal = new Animal(this.getRandomPosition());
        this.animals.push(animal);
        this.app.stage.addChild(animal);
    }

    private update(delta: Ticker): void {
        let deltaTime:number = parseFloat(delta.deltaTime.toFixed(4));
        this.mainHero.update(deltaTime);
        const followingAnimals = this.animals.filter(animal => animal.getFollowing());

        if (followingAnimals.length < MAX_ANIMALS_COUNT_IN_GROUP) {
            const animal = this.animals.find(animal => animal.checkIfCanFollowForHero(this.mainHero));
            if (animal) {
                animal.setFollowing(true);
            }
        }

        const heroInYard = this.mainHero.isHeroInsideYard(this.yard);

        this.animals.forEach((animal, index) => {
            animal.update(deltaTime, this.mainHero, this.yard, heroInYard, followingAnimals);
            if (heroInYard && animal.isAnimalInsideYard(this.yard)) {
                this.topPanel.update();
                this.app.stage.removeChild(animal);
                this.animals.splice(index, 1);
            }
        });

        this.mainHero.updateSpawnCounter(followingAnimals.length);
    }

    private onGameFieldClicked(event: FederatedPointerEvent): void {
        this.mainHero.moveToPoint(event.global);
    }

    private getRandomPosition(): Point {
        return new Point(Math.random() * GAME_WIDTH + YARD_WIDTH, Math.random() * GAME_HEIGHT);
    }

    private getHeroStartPosition(): Point {
        return new Point(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5);
    }

    public destroy() {
        this.app.ticker.remove(this.update);
        this.clearSpawnIntervalId();
        this.removeAnimals();

        this.topPanel.destroy();
        this.yard.destroy();
        this.mainHero.destroy();
        this.gameField.off('pointerdown');
        this.gameField.removeAllListeners();
        this.gameField.destroy();
        this.app.destroy();
    }

    private removeAnimals(): void {
        if(!this.animals.length) {
            return;
        }
        for (var i = this.animals.length-1; i >= 0; i--) {
            this.removeAnimal(this.animals[i], i);
        }
        this.animals = [];
    }

    private removeAnimal(animal: Animal, index:number): void {
        this.app.stage.removeChild(animal);
        this.animals.splice(index, 1);
        animal.destroy();
        //animal = null;
    }

    private clearSpawnIntervalId(): void {
        if(this.spawnIntervalId != -1) {
            clearInterval(this.spawnIntervalId)
            this.spawnIntervalId = -1;
        }
    }
}