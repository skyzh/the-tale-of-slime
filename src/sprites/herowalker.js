import * as PIXI from 'pixi.js'

export class HeroWalker {
    /**
     * @param {PIXI.Point} current_position 
     * @param {PIXI.Point} target_position 
     */
    constructor(current_position, target_position) {
        this.current_position = current_position
        this.target_position = target_position
        const dx = target_position.x - current_position.x,
            dy = target_position.y - current_position.y
        const speed = 5
        this.frame_required = Math.sqrt(dx * dx + dy * dy) / speed
        this.current_frame = 0
        this.dx = dx / this.frame_required
        this.dy = dy / this.frame_required
    }

    /**
     * @returns {PIXI.Point}
     */
    next_position() {
        if (this.current_frame >= this.frame_required) {
            return this.target_position
        } else this.current_frame += 1
        return new PIXI.Point(
            this.current_position.x + this.dx * this.current_frame,
            this.current_position.y + this.dy * this.current_frame)
    }

    /**
     * @returns {bool}
     */
    end() {
        return this.current_frame >= this.frame_required
    }
}