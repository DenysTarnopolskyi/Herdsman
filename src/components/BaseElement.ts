import { Bounds, Graphics, Sprite } from 'pixi.js';

export class BaseElement extends Sprite {
    protected background:Graphics = new Graphics();

    constructor() {
        super();
        this.draw();
    }

    draw(): void {
       this.addChild(this.background);
    }

    getBounds():Bounds {
        return this.background.getBounds();
    }

    destroy(): void {
        this.removeChild(this.background);
        this.background.destroy();
    }
}