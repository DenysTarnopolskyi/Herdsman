import { Bounds, Graphics, Sprite } from 'pixi.js';

export class BaseElement extends Sprite {
    protected background:Graphics = new Graphics();

    constructor() {
        super();
        this.draw();
    }

    protected draw(): void {
       this.addChild(this.background);
    }

    public getBounds():Bounds {
        return this.background.getBounds();
    }

    public destroy(): void {
        this.removeChild(this.background);
        this.background.destroy();
        //this.background = null;
    }
}