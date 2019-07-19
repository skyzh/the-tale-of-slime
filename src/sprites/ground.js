import * as PIXI from 'pixi.js'
import { WIDTH, HEIGHT } from '../common'

const GROUND_BLOCK_WIDTH = 256
const GROUND_BLOCK_HEIGHT = 256

export class Ground {
    /**
     * @returns {PIXI.Sprite}
     */
    make_ground_sprite(color) {
        /*
        const sprite = PIXI.Sprite.from('assets/grass.png')
        */
        const sprite = new PIXI.Graphics
        sprite.beginFill(color)
        sprite.drawRect(0, 0, GROUND_BLOCK_WIDTH, GROUND_BLOCK_HEIGHT)
        sprite.endFill()
        sprite.zIndex = -100
        return sprite
    }

    /**
     * @param {PIXI.Container} stage
     */
    constructor(stage) {
        this.stage = stage
        this.ground_sprites = {}
        this.swap_cnt = 0
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    add_sprite(x, y) {
        const key = this.key_of(x, y)
        const sprite = this.make_ground_sprite((x + y) % 2 == 0 ? 0xD4FCC3 : 0xFFF5B2)
        this.ground_sprites[key] = { sprite, x, y }
        this.stage.addChild(sprite)
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    remove_sprite(x, y) {
        const key = this.key_of(x, y)
        this.stage.removeChild(this.ground_sprites[key].sprite)
        this.ground_sprites[key].sprite.destroy()
        delete this.ground_sprites[key]
    }

    /**
     * @param {Number} x1 
     * @param {Number} x2 
     * @param {Number} y1 
     * @param {Number} y2 
     */
    exit(x1, x2, y1, y2) {
        const sprite_to_be_removed = Object.keys(this.ground_sprites).filter(k => {
            const ground = this.ground_sprites[k]
            return !(x1 <= ground.x && ground.x <= x2 && y1 <= ground.y && ground.y <= y2)
        })
        for (let k of sprite_to_be_removed) {
            const ground = this.ground_sprites[k]
            this.remove_sprite(ground.x, ground.y)
        }
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @returns {String}
     */
    key_of(x, y) {
        return `${x},${y}`
    }

    /**
     * @param {Number} x1 
     * @param {Number} x2 
     * @param {Number} y1 
     * @param {Number} y2 
     */
    enter(x1, x2, y1, y2) {
        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                if (!(this.key_of(x, y) in this.ground_sprites)) this.add_sprite(x, y)
            }
        }
    }

    /**
     * @param {PIXI.Point} screen_position
     */
    update(screen_position) {
        const x_begin = Math.floor((-screen_position.x) / GROUND_BLOCK_WIDTH) - 1
        const x_end = Math.ceil((-screen_position.x + WIDTH) / GROUND_BLOCK_WIDTH) + 1
        const y_begin = Math.floor((-screen_position.y) / GROUND_BLOCK_HEIGHT) - 1
        const y_end = Math.ceil((-screen_position.y + HEIGHT) / GROUND_BLOCK_HEIGHT) + 1
        if (this.swap_cnt % 10 == 0) {
            this.enter(x_begin, x_end, y_begin, y_end)
            this.exit(x_begin, x_end, y_begin, y_end)
        }
        this.swap_cnt += 1
        for (let key in this.ground_sprites) {
            const ground = this.ground_sprites[key]
            const sprite = ground.sprite
            sprite.x = screen_position.x + ground.x * GROUND_BLOCK_WIDTH
            sprite.y = screen_position.y + ground.y * GROUND_BLOCK_HEIGHT
        }
    }
}
