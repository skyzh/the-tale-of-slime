import * as PIXI from 'pixi.js'
import { WIDTH, HEIGHT } from '../common'

export class Background {
    /**
     * @returns {PIXI.Sprite}
     */
    make_background_sprite() {
        const sprite = new PIXI.Graphics
        sprite.beginFill(0xffffff)
        sprite.drawRect(0, 0, WIDTH, HEIGHT)
        sprite.endFill()
        sprite.zIndex = -200
        return sprite
    }

    /**
     * @param {PIXI.Container} stage
     */
    constructor(stage) {
        this.stage = stage
        this.sprite = this.make_background_sprite()
        this.stage.addChild(this.sprite)
    }
}
