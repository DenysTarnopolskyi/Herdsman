import { YARD_COLOR } from '../consts/CColor';
import { YARD_HEIGHT, YARD_WIDTH } from '../consts/CGame';
import { BaseElement } from './BaseElement';

export class Yard extends BaseElement {
    constructor() {
        super();
    }

    draw(): void {
        this.background.rect(0, 0, YARD_WIDTH, YARD_HEIGHT);
        this.background.fill(YARD_COLOR);
        this.addChild(this.background);
    }
}