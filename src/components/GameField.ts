import { GAME_FIELD_BG_COLOR } from '../consts/CColor';
import { GAME_HEIGHT, GAME_WIDTH } from '../consts/CGame';
import { BaseElement } from './BaseElement';

export class GameField extends BaseElement {
    constructor() {
        super();
        this.interactive = true;
    }

    draw(): void {
        this.background.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.background.fill(GAME_FIELD_BG_COLOR);
        this.addChild(this.background);
    }
}