/**
 * @Author: Gongxh
 * @Date: 2024-12-21
 * @Description: 多边形
 */

import { Rect, v2, Vec2 } from "cc";
import { Shape } from "./Shape";


const vec2 = new Vec2();
/** 点绕原点旋转 radians 弧度后的新点 */
function rotate(radians: number, x: number, y: number): Vec2 {
    let sin = Math.sin(radians);
    let cos = Math.cos(radians);
    vec2.x = x * cos - y * sin;
    vec2.y = y * cos + x * sin;
    return vec2;
}

// /** 点绕点旋转 radians 弧度后的新点 */
// export function rotateByPoint(radians: number, x: number, y: number, cx: number, cy: number): Vec2 {
//     let sin = Math.sin(radians);
//     let cos = Math.cos(radians);
//     vec2.x = (x - cx) * cos - (y - cy) * sin + cx;
//     vec2.y = (y - cy) * cos + (x - cx) * sin + cy;
//     return vec2;
// }

export class Polygon extends Shape {
    protected _points: Vec2[] = []; // 多边形
    protected _realPoints: Vec2[];
    constructor(points: Vec2[], tag: number = -1) {
        super(tag);
        this._points = points;
        this._realPoints = new Array(points.length);
        for (let i = 0, len = points.length; i < len; i++) {
            this._realPoints[i] = v2(points[i].x, points[i].y);
        }
        this.getBoundingBox();
    }

    public getBoundingBox(): Rect {
        if (this.isDirty) {
            let minX = Number.MAX_VALUE;
            let maxX = Number.MIN_VALUE;
            let minY = Number.MAX_VALUE;
            let maxY = Number.MIN_VALUE;
            for (const point of this._points) {
                let a = rotate(Math.PI / 180 * this._rotation, point.x, point.y);
                minX = Math.min(minX, a.x);
                minY = Math.min(minY, a.y);
                maxX = Math.max(maxX, a.x);
                maxY = Math.max(maxY, a.y);
            }
            this.boundingBox.x = minX;
            this.boundingBox.y = minY;
            this.boundingBox.width = maxX - minX;
            this.boundingBox.height = maxY - minY;
            this.isDirty = false;
        }
        return this.boundingBox;
    }

    public get points(): Vec2[] {
        let points = this._points;
        let len = points.length;
        for (let i = 0; i < len; i++) {
            let m = points[i];
            this._realPoints[i] = m.rotate(Math.PI / 180 * this.rotation);
            let a = this._realPoints[i];
            a.x = a.x * this.scale + this.position.x;
            a.y = a.y * this.scale + this.position.y;
        }
        return this._realPoints;
    }

    public set points(pts: Vec2[]) {
        this._points = pts;
        this._realPoints = new Array(pts.length);
        for (let i = 0, len = pts.length; i < len; i++) {
            this._realPoints[i] = v2(pts[i].x, pts[i].y);
        }
    }
}