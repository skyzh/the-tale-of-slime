import * as PIXI from 'pixi.js'
import { HeroWalker, Background, Ground, Hero, WalkerIndicator, Bullet } from './sprites'
import { WIDTH, HEIGHT } from './common'
import $ from 'jquery'

let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}

PIXI.utils.sayHello(type)

let app = new PIXI.Application({ width: WIDTH, height: HEIGHT, backgroundColor: 0xFFFFFF })

document.body.appendChild(app.view)

class Game {

    /**
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

        // Bullets
        this.bullets = []
        this.shoot = false
        this.weapon_type = 0
        this.mouse_pos = new PIXI.Point(0, 0)

        // Ground
        this.ground = new Ground(stage)

        // Camera
        this.camera_center = new PIXI.Point(0, 0)
        this.screen_center = new PIXI.Point(WIDTH / 2, HEIGHT / 2)

        // Events
        stage.interactive = true
        stage.on('mousedown', e => this.on_click(e))
        stage.on('mousemove', e => this.on_mousemove(e))
        $(document).on('keydown', e => this.on_keydown(e))
        $(document).on('keyup', e => this.on_keyup(e))

        // Basics
        this.current_frame = 0
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

    /**
     * @param {PIXI.Point} from 
     * @param {PIXI.Point} to 
     * @param {Number} speed 
     * @returns {PIXI.Point}
     */
    get_vector(from, to, speed) {
        const dx = to.x - from.x
        const dy = to.y - from.y
        const r = Math.sqrt(dx * dx + dy * dy)
        return new PIXI.Point(dx / r * speed, dy / r * speed)
    }

    /**
     * @returns {PIXI.Rectangle}
     */
    get_map_box(margin) {
        margin = margin || 0
        const left_top_corner = this.transform_to_map_space(new PIXI.Point(0, 0))
        return new PIXI.Rectangle(left_top_corner.x - margin, left_top_corner.y - margin,
                                  WIDTH + margin * 2, HEIGHT + margin * 2)
    }

    generate_bullet_of_type_0() {
        const sprite = new Bullet(this.stage)
        const bullet = {
            position: new PIXI.Point(this.hero_location.x, this.hero_location.y),
            velocity: this.get_vector(this.hero_location, this.transform_to_map_space(this.mouse_pos), 20),
            sprite
        }
        this.bullets.push(bullet)
    }

    generate_bullet_of_type_1() {
        if (this.current_frame % 5 != 0) return
        const angles_deg = [-30, -15, 0, 15, 30]
        const mouse_pos = this.transform_to_map_space(this.mouse_pos)
        const zero_angle = Math.atan2(mouse_pos.y - this.hero_location.y, mouse_pos.x - this.hero_location.x)
        const speed = 20
        for (let angle of angles_deg) {
            const target_angle = zero_angle + angle / 180 * Math.PI
            const sprite = new Bullet(this.stage)
            const bullet = {
                position: new PIXI.Point(this.hero_location.x, this.hero_location.y),
                velocity: new PIXI.Point(Math.cos(target_angle) * speed, Math.sin(target_angle) * speed),
                sprite
            }
            this.bullets.push(bullet)
        }
    }

    update_bullets() {
        if (this.shoot) {
            if (this.weapon_type == 0) {
                this.generate_bullet_of_type_0()
            } else if (this.weapon_type == 1) {
                this.generate_bullet_of_type_1()
            }
        }
        const map_box = this.get_map_box(20)
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].sprite.update(this.transform_to_screen_space(this.bullets[i].position))
            this.bullets[i].position.x += this.bullets[i].velocity.x
            this.bullets[i].position.y += this.bullets[i].velocity.y
        }
        this.bullets = this.bullets.filter(bullet => {
            if (!map_box.contains(bullet.position.x, bullet.position.y)) {
                bullet.sprite.remove()
                return false
            }
            return true
        })
    }

    update() {
        this.update_hero()
        this.update_ground()
        this.update_bullets()
        this.current_frame += 1
    }

    /**
     * @param {PIXI.interaction.InteractionEvent} e 
     */
    on_click(e) {
        const target_pos = this.transform_to_map_space(e.data.global)
        this.hero_walker = new HeroWalker(this.hero_location, target_pos)
    }

    /**
     * @param {PIXI.interaction.InteractionEvent} e 
     */
    on_mousemove(e) {
        this.mouse_pos = e.data.global
    }

    /**
     * @param {KeyboardEvent} e 
     */
    on_keydown(e) {
        if (e.code == "ShiftLeft") {
            this.shoot = true
        }
        if (e.code == "KeyZ") {
            this.weapon_type = (this.weapon_type + 1) % 2
        }
    }

    /**
     * @param {KeyboardEvent} e 
     */
    on_keyup(e) {
        if (e.code == "ShiftLeft") {
            this.shoot = false
        }
    }
}

const game = new Game(app.stage)

function run() {
    game.update()
    window.requestAnimationFrame(run)
}

run()
