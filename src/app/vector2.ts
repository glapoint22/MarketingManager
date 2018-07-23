export class Vector2 {
    constructor(public x: number, public y: number) { }

    static dot(v1: Vector2, v2: Vector2): number {
        return v1.x * v2.x + v1.y * v2.y;
    }

    distance(other: Vector2): number {
        return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
    }

    getLength() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    normalize() {
        var length = this.getLength();
        return new Vector2(this.x / length, this.y / length);
    }

    subtract(other: Vector2): Vector2{
        return new Vector2(this.x - other.x, this.y - other.y);
    }
}