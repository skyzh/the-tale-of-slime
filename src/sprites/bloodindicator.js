import * as PIXI from 'pixi.js'

export const BLOOD_INDICATOR_WIDTH = 30

export class BloodIndicator {

    /**
     * @returns {PIXI.Sprite}
     */
    make_blood_indicator() {
        const blood = new PIXI.Graphics
        blood.beginFill(this.color)
        blood.drawRoundedRect(0, 0, BLOOD_INDICATOR_WIDTH, 3, 1)
        blood.endFill()
        return blood
    }

    update_blood_indicator(blood_percentage) {
        this.sprite.clear()
        this.sprite.beginFill(this.color)
        this.sprite.drawRoundedRect(0, 0, BLOOD_INDICATOR_WIDTH * blood_percentage, 3, 1)
        this.sprite.endFill()
    }

    /**
     * @param {PIXI.Container} stage 
     * @param {Number} color
     */
    constructor(stage, color) {
        this.stage = stage
        this.in_stage = false
        this.blood_indicator = null
        this.color = color
    }

    remove() {
        if (this.in_stage) {
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
            this.sprite = this.make_blood_indicator()
            this.stage.addChild(this.sprite)
        }
        this.update_blood_indicator(hp_percentage)
        this.sprite.position = screen_position
    }
}
