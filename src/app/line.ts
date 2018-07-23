import { Vector2 } from "./vector2";

export class Line {
    public get direction(): Vector2 {
        return this.pt2.subtract(this.pt1).normalize();
    }


    constructor(public pt1: Vector2, public pt2: Vector2) { }

    static getIntersection = (line1: Line, line2: Line) => {
        // Ax + By = C

        // Line1
        let a1 = line1.pt2.y - line1.pt1.y,
            b1 = line1.pt1.x - line1.pt2.x,
            c1 = a1 * line1.pt1.x + b1 * line1.pt1.y,

            // Line2
            a2 = line2.pt2.y - line2.pt1.y,
            b2 = line2.pt1.x - line2.pt1.x,
            c2 = a2 * line2.pt1.x + b2 * line2.pt1.y,

            denominator = a1 * b2 - a2 * b1;

        if (denominator === 0) return null;

        let intersection = new Vector2((b2 * c1 - b1 * c2) / denominator, (a1 * c2 - a2 * c1) / denominator),
            r0 = intersection.subtract(line1.pt1),
            r1 = line1.pt2.subtract(intersection),
            r2 = intersection.subtract(line2.pt1),
            r3 = line2.pt2.subtract(intersection);

        if (Vector2.dot(line1.direction, r0) >= 0 &&
            Vector2.dot(line1.direction, r1) >= 0 &&
            Vector2.dot(line2.direction, r2) >= 0 &&
            Vector2.dot(line2.direction, r3) >= 0) return intersection;

        return null;
    }
}