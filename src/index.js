import * as PIXI from 'pixi.js'
import { HeroWalker, Background, Ground, Hero, WalkerIndicator } from './sprites'
import { WIDTH, HEIGHT } from './common'

let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}

PIXI.utils.sayHello(type)

let app = new PIXI.Application({ width: WIDTH, height: HEIGHT, backgroundColor: 0xFFFFFF })

document.body.appendChild(app.view)

class Game {

    /**
     * 
     * @param {PIXI.Container} stage
     */
    constructor(stage) {
        this.stage = stage
        this.stage.sortableChildren = true

        // Background
        this.background = new Background(stage)

        // Hero
        this.hero_location = new PIXI.Point(0, 0)
        this.hero = new Hero(stage)
        this.hero_walker = null
        this.walker_indicator = null

        // Ground
        this.ground = new Ground(stage)

        // Camera
        this.camera_center = new PIXI.Point(0, 0)
        this.screen_center = new PIXI.Point(WIDTH / 2, HEIGHT / 2)

        // Events
        stage.interactive = true
        stage.on('mousedown', e => this.on_click(e))
    }

    /**
     * @param {PIXI.Point} map_position
     * @returns {PIXI.Point}
     */
    transform_to_screen_space(map_position) {
        return new PIXI.Point(
            map_position.x - this.camera_center.x + this.screen_center.x,
            map_position.y - this.camera_center.y + this.screen_center.y)
    }

    /**
     * @param {PIXI.Point} screen_position
     * @returns {PIXI.Point}
     */
    transform_to_map_space(screen_position) {
        return new PIXI.Point(
            screen_position.x + this.camera_center.x - this.screen_center.x,
            screen_position.y + this.camera_center.y - this.screen_center.y)
    }

    update_hero() {
        const screen_position = this.transform_to_screen_space(this.hero_location)
        this.hero.update(screen_position)
        if (this.hero_walker) {
            this.hero_location = this.hero_walker.next_position()
            this.camera_center = this.hero_location
            if (this.walker_indicator == null) {
                this.walker_indicator = new WalkerIndicator(this.stage)
            }
            this.walker_indicator.update(this.transform_to_screen_space(this.hero_walker.target_position))
            if (this.hero_walker.end()) {
                this.hero_walker = null
                this.walker_indicator.remove()
                this.walker_indicator = null
            }
        }
    }

    update_ground() {
        const screen_position = this.transform_to_screen_space(new PIXI.Point(0, 0))
        this.ground.update(screen_position)
    }

    update() {
        this.update_hero()
        this.update_ground()
    }

    /**
     * @param {PIXI.interaction.InteractionEvent} e 
     */
    on_click(e) {
        const target_pos = this.transform_to_map_space(e.data.global)
        this.hero_walker = new HeroWalker(this.hero_location, target_pos)
    }
}

const game = new Game(app.stage)

function run() {
    game.update()
    window.requestAnimationFrame(run)
}

run()
