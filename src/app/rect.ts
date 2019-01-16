import { Vector2 } from "./vector2";

export class Rect {
    public get xMax(): number {
        return this.x + this.width;
    }
    public set xMax(value) {
        this.width = value - this.x;
    }

    public get yMax(): number {
        return this.y + this.height;
    }

    public set yMax(value) {
        this.height = value - this.y;
    }

    public get center(): Vector2 {
        return new Vector2(this.x + (this.width * 0.5), this.y + (this.height * 0.5));
    }

    constructor(public x: number, public y: number, public width: number, public height: number) {
        if (x !== null) {
            this.x = Math.round(x * 100) / 100;
            this.y = Math.round(y * 100) / 100;
            this.width = Math.round(width * 100) / 100;
            this.height = Math.round(height * 100) / 100;
        }

    }
}