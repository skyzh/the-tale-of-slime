import * as PIXI from 'pixi.js'

export class Slime {
    /**
     * @returns {PIXI.Sprite}
     */
    make_slime_sprite() {
        const sprite = new PIXI.Graphics
        sprite.beginFill(0x362C28)
        sprite.drawCircle(0, 0, this.radius, this.radius)
        sprite.endFill()
        sprite.alpha = 0.7
        return sprite
    }

    /**
     * @param {PIXI.Container} stage 
     * @param {Number} radius
     */
    constructor(stage, radius) {
        this.stage = stage
        this.radius = radius
        this.in_stage = false
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
    update(screen_position) {
        if (!this.in_stage) {
            this.in_stage = true
            this.sprite = this.make_slime_sprite()
            this.stage.addChild(this.sprite)
        }
        this.sprite.position = screen_position
    }
}
