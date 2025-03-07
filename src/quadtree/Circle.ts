/**
 * @Author: Gongxh
 * @Date: 2024-12-21
 * @Description: 原型
 */

import { Graphics, Rect } from "cc";
import { Shape } from "./Shape";

export class Circle extends Shape {
    public radius: number; // 半径
    constructor(radius: number, tag: number = -1) {
        super(tag);
        this.radius = radius;
        this.boundingBox.x = -this.radius;
        this.boundingBox.y = -this.radius;
        this.boundingBox.width = this.radius * 2;
        this.boundingBox.height = this.radius * 2;
    }

    public getBoundingBox(): Rect {
        return this.boundingBox;
    }

    /** @internal */
    public drawShape(draw: Graphics): void {
        draw && draw.circle(this.position.x, this.position.y, this.radius * this.scale);
    }
}