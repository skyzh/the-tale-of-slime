import * as PIXI from 'pixi.js'

import { BloodIndicator } from './bloodindicator'

const BLOOD_INDICATOR_WIDTH = 30
const BLOOD_INDICATOR_COLOR = 0xE76F51

export class Slime {
    /**
     * @returns {PIXI.Sprite}
     */
    make_slime_sprite() {
        const slime = new PIXI.Container
        const sprite = new PIXI.Graphics
        sprite.beginFill(this.giant ? 0x9CAAB0 : 0x264653)
        sprite.drawCircle(0, 0, this.radius, this.radius)
        sprite.endFill()
        sprite.alpha = 0.7
        slime.addChild(sprite)
        return slime
    }

    /**
     * @param {PIXI.Container} stage 
     * @param {Number} radius
     * @param {Boolean} giant
     */
    constructor(stage, radius, giant) {
        this.stage = stage
        this.radius = radius
        this.in_stage = false
        this.giant = giant
        this.blood = new BloodIndicator(stage, 0xE76F51)
    }

    remove() {
        if (this.in_stage) {
            this.blood.remove()
            this.stage.removeChild(this.sprite)
            this.sprite.destroy()
            this.in_stage = false
        }
    }

    /**
     * @param {PIXI.Point} screen_position
     */
    update(screen_position, hp_percentage) {
        if (!this.in_stage) {
            this.in_stage = true
            this.sprite = this.make_slime_sprite()
            this.stage.addChild(this.sprite)
        }
        this.blood.update(new PIXI.Point(
            screen_position.x - BLOOD_INDICATOR_WIDTH / 2,
            screen_position.y - this.radius - 5), hp_percentage)
        this.sprite.position = screen_position
    }
}
