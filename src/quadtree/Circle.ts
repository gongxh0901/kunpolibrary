/**
 * @Author: Gongxh
 * @Date: 2024-12-21
 * @Description: 原型
 */

import { Rect } from "cc";
import { ShapeType } from "./IShape";
import { Shape } from "./Shape";

export class Circle extends Shape {
    public radius: number; // 半径

    public get shapeType(): ShapeType {
        return ShapeType.CIRCLE;
    }

    constructor(radius: number, tag: number = -1) {
        super(tag);
        this.radius = radius;
        this._boundingBox.x = -this.radius;
        this._boundingBox.y = -this.radius;
        this._boundingBox.width = this.radius * 2;
        this._boundingBox.height = this.radius * 2;
    }

    public getBoundingBox(): Rect {
        return this._boundingBox;
    }
}