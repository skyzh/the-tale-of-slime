import * as PIXI from 'pixi.js'

export class Slime {
    /**
     * @returns {PIXI.Sprite}
     */
    make_slime_sprite() {
        const sprite = new PIXI.Graphics
        sprite.beginFill(0x362C28)
        sprite.drawCircle(0, 0, 20, 20)
        sprite.endFill()
        return sprite
    }

    /**
     * @param {PIXI.Container} stage 
     */
    constructor(stage) {
        this.stage = stage
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
