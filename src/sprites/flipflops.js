import * as PIXI from 'pixi.js'

export class Flipflops {
    /**
     * @returns {PIXI.Sprite}
     */
    make_flipflop_sprite() {
        const sprite = PIXI.Sprite.from('assets/flip-flops.png')
        sprite.zIndex = -2
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
            this.sprite = this.make_flipflop_sprite()
            this.stage.addChild(this.sprite)
            this.in_stage = true
        }
        this.sprite.position = screen_position
    }
}
