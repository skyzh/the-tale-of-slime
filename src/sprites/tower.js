import * as PIXI from 'pixi.js'
import { BLOOD_INDICATOR_WIDTH, BloodIndicator } from './bloodindicator';

export class Tower {
    /**
     * @returns {PIXI.Sprite}
     */
    make_tower_sprite() {
        const sprite = new PIXI.Graphics
        sprite.beginFill(0x362C28)
        sprite.drawRoundedRect(-20, -20, 40, 40, 10)
        sprite.endFill()
        return sprite
    }

    /**
     * @param {PIXI.Container} stage 
     */
    constructor(stage) {
        this.stage = stage
        this.in_stage = false
        this.blood = new BloodIndicator(stage, 0x2A9D8F)
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
     * @param {Number} cooldown_percentage
     */
    update(screen_position, cooldown_percentage) {
        if (!this.in_stage) {
            this.in_stage = true
            this.sprite = this.make_tower_sprite()
            this.stage.addChild(this.sprite)
        }
        this.blood.update(new PIXI.Point(screen_position.x - BLOOD_INDICATOR_WIDTH / 2, screen_position.y - 25), cooldown_percentage)
        this.sprite.position = screen_position
    }
}
