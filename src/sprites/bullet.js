import * as PIXI from 'pixi.js'

export class Bullet {
    /**
     * @returns {PIXI.Sprite}
     */
    make_bullet_sprite() {
        const sprite = new PIXI.Graphics
        sprite.beginFill(0x362C28)
        sprite.drawCircle(0, 0, 3, 3)
        sprite.endFill()
        return sprite
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
            this.sprite = this.make_bullet_sprite()
            this.stage.addChild(this.sprite)
        }
        this.current_frame = this.current_frame + 1
        this.sprite.position = screen_position
    }
}
