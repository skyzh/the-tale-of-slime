import * as PIXI from 'pixi.js'
import { HeroWalker, Background, Ground, Hero, WalkerIndicator, Bullet, Slime, BulletIndicator } from './sprites'
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
        
        // Skills
        this.skill_zen_mode = false

        // Slimes
        this.slimes = []

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

        // Animations
        this.animations = []

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
    get_vector(from, to, speed, fix) {
        const dx = to.x - from.x
        const dy = to.y - from.y
        const r = Math.sqrt(dx * dx + dy * dy)
        if (fix && r < speed) return new PIXI.Point(to.x, to.y)
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

    generate_bullet_of_type_2() {
        this.__bullet_2_fi = this.__bullet_2_fi || 0
        this.__bullet_2_fi = (this.__bullet_2_fi + 15) % 360
        const angles_deg = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324]
        const mouse_pos = this.transform_to_map_space(this.mouse_pos)
        const zero_angle = Math.atan2(mouse_pos.y - this.hero_location.y, mouse_pos.x - this.hero_location.x)
        const speed = 20
        for (let angle of angles_deg) {
            const target_angle = zero_angle + (angle + this.__bullet_2_fi) / 180 * Math.PI
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
                if (this.current_frame % 5 == 0) this.generate_bullet_of_type_1()
            } else if (this.weapon_type == 2) {
                if (this.current_frame % 10 == 0) this.generate_bullet_of_type_2()
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

    generate_slime() {
        const map_box = this.get_map_box(20)
        const location = Math.floor(Math.random() * 4)
        let position = null
        if (location == 0) {
            position = new PIXI.Point(map_box.left, map_box.top + Math.random() * map_box.height)
        } else if (location == 1) {
            position = new PIXI.Point(map_box.right, map_box.top + Math.random() * map_box.height)
        } else if (location == 2) {
            position = new PIXI.Point(map_box.left + Math.random() * map_box.width, map_box.top)
        } else if (location == 3) {
            position = new PIXI.Point(map_box.left + Math.random() * map_box.width, map_box.bottom)
        }
        const sprite = new Slime(this.stage)
        const slime = {
            position,
            sprite,
            acc: new PIXI.Point(0, 0),
            hp: 10
        }
        this.slimes.push(slime)
    }

    /**
     * @param {PIXI.Point} individual 
     * @param {[PIXI.Point]} others 
     * @returns {Number}
     */
    collision(individual, others) {
        for (let i = 0; i < others.length; i++) {
            const dx = others[i].x - individual.x
            const dy = others[i].y - individual.y
            const dist_squared = dx * dx + dy * dy
            if (dist_squared < 20 * 20) return i
        }
        return -1
    }

    /**
     * @param {PIXI.Point} position 
     */
    make_bullet_bomb_animation(position) {
        const begin_frame = this.current_frame
        const animation = {
            sprite: new BulletIndicator(this.stage),
            end: () => this.current_frame - begin_frame >= 10,
            position
        }
        this.animations.push(animation)
    }

    update_slimes() {
        if (this.current_frame % 30 == 0) this.generate_slime()

        const map_box = this.get_map_box(50)
        for (let i = 0; i < this.slimes.length; i++) {
            if (map_box.contains(this.slimes[i].position.x, this.slimes[i].position.y)) {
                this.slimes[i].sprite.update(this.transform_to_screen_space(this.slimes[i].position))
            } else {
                this.slimes[i].sprite.remove()
            }
            const velocity = this.get_vector(this.slimes[i].position, this.hero_location, 2)
            
            velocity.x += this.slimes[i].acc.x
            velocity.y += this.slimes[i].acc.y

            const acc_reduction = this.get_vector(this.slimes[i].acc, new PIXI.Point(0, 0), 0.3, true)
            this.slimes[i].acc.x += acc_reduction.x
            this.slimes[i].acc.y += acc_reduction.y

            
            this.slimes[i].position.x += velocity.x
            this.slimes[i].position.y += velocity.y
        }
        const bullets_position = this.bullets.map(b => b.position)
        this.slimes = this.slimes.filter(slime => {
            const collision_id = this.collision(slime.position, bullets_position)
            if (collision_id != -1) {
                const ACC_RATE = 0.3
                slime.hp -= 1
                this.make_bullet_bomb_animation(this.bullets[collision_id].position)
                slime.acc.x += this.bullets[collision_id].velocity.x * ACC_RATE
                slime.acc.y += this.bullets[collision_id].velocity.y * ACC_RATE
                this.bullets[collision_id].sprite.remove()
                this.bullets.splice(collision_id, 1)
                bullets_position.splice(collision_id, 1)
            }
            if (slime.hp <= 0) {
                slime.sprite.remove()
                return false
            }
            return true
        })
    }

    update_skills() {
        if (this.skill_zen_mode) {
            if (this.current_frame - this.__zen_mode_begin >= 180) {
                this.skill_zen_mode = false
                return
            }
            this.generate_bullet_of_type_2()
        }
    }

    update_animation() {
        this.animations = this.animations.filter(animation => {
            if (animation.end()) {
                animation.sprite.remove()
                return false
            }
            return true
        })
        for (let animation of this.animations) {
            animation.sprite.update(this.transform_to_screen_space(animation.position))
        }
    }

    update() {
        this.update_hero()
        this.update_ground()
        this.update_bullets()
        this.update_slimes()
        this.update_skills()
        this.update_animation()
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
            this.weapon_type = (this.weapon_type + 1) % 3
        }
        if (e.code == "KeyX") {
            this.skill_zen_mode = true
            this.__zen_mode_begin = this.current_frame
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
