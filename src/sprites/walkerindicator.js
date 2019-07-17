import * as PIXI from 'pixi.js'

export class WalkerIndicator {
    /**
     * @returns {PIXI.Graphics}
     */
    make_indicator_sprite() {
        const sprite = new PIXI.Graphics
        sprite.beginFill(0xcc0000)
        sprite.drawCircle(0, 0, 5, 5)
        sprite.endFill()
        sprite.zIndex = -20
        return sprite
    }

    update_indicator_sprite() {
        const radius = (this.current_frame / 3) % 7
        this.sprite.clear()
        this.sprite.beginFill(0xcc0000)
        this.sprite.drawCircle(0, 0, radius, radius)
        this.sprite.endFill()
    }

    /**
     * @param {PIXI.Container} stage 
     */
    constructor(stage) {
        this.stage = stage
        this.in_stage = false
        this.current_frame = 0
    }

    remove() {
        this.stage.removeChild(this.sprite)
        this.sprite.destroy()
        this.in_stage = false
    }

    /**
     * @param {PIXI.Point} screen_position
     */
    update(screen_position) {
        if (!this.in_stage) {
            this.in_stage = true
            this.sprite = this.make_indicator_sprite()
            this.stage.addChild(this.sprite)
        }
        this.update_indicator_sprite()
        this.current_frame = this.current_frame + 1
        this.sprite.position = screen_position
    }
}
