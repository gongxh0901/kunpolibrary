/**
 * @Author: Gongxh
 * @Date: 2024-12-21
 * @Description: 矩形
 */
import { v2, Vec2 } from "cc";
import { ShapeType } from "./IShape";
import { Polygon } from "./Polygon";

// 3|2
// --
// 0|1
// 矩形的四个点

export class Box extends Polygon {

    public get shapeType(): ShapeType {
        return ShapeType.BOX;
    }

    constructor(x: number, y: number, width: number, height: number, tag: number = -1) {
        let points: Vec2[] = new Array(4);
        points[0] = v2(x, y);
        points[1] = v2(x + width, y);
        points[2] = v2(x + width, y + height);
        points[3] = v2(x, y + height);
        super(points, tag);
    }

    public resetPoints(x: number, y: number, width: number, height: number): void {
        let points: Vec2[] = new Array(4);
        points[0] = v2(x, y);
        points[1] = v2(x + width, y);
        points[2] = v2(x + width, y + height);
        points[3] = v2(x, y + height);
        this.points = points;
    }
}