import * as PIXI from 'pixi.js'
import { WIDTH, HEIGHT } from '../common'

export class Ground {
    /**
     * @returns {PIXI.Sprite}
     */
    make_ground_sprite() {
        const sprite = new PIXI.Graphics
        sprite.beginFill(0x66CCFF)
        sprite.drawRect(0, 0, WIDTH, HEIGHT)
        sprite.endFill()
        sprite.zIndex = -100
        return sprite
    }

    /**
     * @param {PIXI.Container} stage
     */
    constructor(stage) {
        this.in_stage = false
        this.stage = stage
    }

    /**
     * @param {PIXI.Point} screen_position
     */
    update(screen_position) {
        if (!this.in_stage) {
            this.ground_sprite = this.make_ground_sprite()
            this.stage.addChild(this.ground_sprite)
            this.in_stage = true
        }
        this.ground_sprite.position = screen_position
    }
}
