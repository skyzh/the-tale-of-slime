import * as PIXI from 'pixi.js'

const BLOOD_INDICATOR_WIDTH = 30

export class Slime {

    /**
     * @returns {PIXI.Sprite}
     */
    make_blood_indicator() {
        const blood = new PIXI.Graphics
        blood.beginFill(0xF7B05B)
        blood.drawRoundedRect(0, 0, BLOOD_INDICATOR_WIDTH, 3, 1)
        blood.endFill()
        return blood
    }

    update_blood_indicator(blood_percentage) {
        this.blood_indicator.clear()
        this.blood_indicator.beginFill(0xF7B05B)
        this.blood_indicator.drawRoundedRect(0, 0, BLOOD_INDICATOR_WIDTH * blood_percentage, 3, 1)
        this.blood_indicator.endFill()
    }

    /**
     * @returns {PIXI.Sprite}
     */
    make_slime_sprite() {
        const slime = new PIXI.Container
        const sprite = new PIXI.Graphics
        sprite.beginFill(0x362C28)
        sprite.drawCircle(0, 0, this.radius, this.radius)
        sprite.endFill()
        sprite.alpha = 0.7
        const blood = this.make_blood_indicator()
        this.blood_indicator = blood
        slime.addChild(blood)
        blood.y = -this.radius - 5
        blood.x = -BLOOD_INDICATOR_WIDTH / 2
        slime.addChild(sprite)
        return slime
    }

    /**
     * @param {PIXI.Container} stage 
     * @param {Number} radius
     */
    constructor(stage, radius) {
        this.stage = stage
        this.radius = radius
        this.in_stage = false
        this.blood_indicator = null
    }

    remove() {
        if (this.in_stage) {
            this.stage.removeChild(this.sprite)
            this.sprite.destroy(true)
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
        this.update_blood_indicator(hp_percentage)
        this.sprite.position = screen_position
    }
}
