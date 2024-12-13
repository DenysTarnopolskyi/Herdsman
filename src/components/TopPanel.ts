import { Sprite, Text, TextStyle } from 'pixi.js';
import { TEXT_PANEL_COLOR } from '../consts/CColor';
import { TEXT_SIZE } from '../consts/CGame';
import { SCORE_PANEL_TEXT } from '../consts/CText';

export class TopPanel extends Sprite{
    private counter: number;
    private scoreTextField: Text;

    constructor() {
        super();
        this.counter = 0;
        this.scoreTextField = new Text({ text: "", style: this.getFont() });
        this.addChild(this.scoreTextField);
        this.reset();
    }

    reset(): void {
        this.counter = 0;
        this.updateScoreText();
    }

    update(value:number = 1): void {
        this.counter += value;
        this.updateScoreText();
    }

    updateScoreText(): void {
        this.scoreTextField.text = SCORE_PANEL_TEXT + this.counter;
    }

    getFont():TextStyle {
       return new TextStyle({fill: TEXT_PANEL_COLOR, fontSize: TEXT_SIZE}); 
    } 

    destroy() {
        super.destroy();
        this.removeChild(this.scoreTextField);
        this.scoreTextField.destroy();
        //this.scoreTextField = null;
    }
}