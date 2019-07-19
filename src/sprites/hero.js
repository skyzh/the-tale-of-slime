import * as PIXI from 'pixi.js'

export class Hero {
    /**
     * @returns {PIXI.Sprite}
     */
    make_hero_sprite() {
        const sprite = new PIXI.Graphics
        sprite.beginFill(0xE9C46A)
        sprite.drawCircle(0, 0, 20, 20)
        sprite.endFill()
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
            this.hero_sprite = this.make_hero_sprite()
            this.stage.addChild(this.hero_sprite)
            this.in_stage = true
        }
        this.hero_sprite.position = screen_position
    }
}
