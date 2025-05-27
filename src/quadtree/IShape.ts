/**
 * @Author: Gongxh
 * @Date: 2025-05-27
 * @Description: 
 */

import { Rect, Vec2 } from "cc";

export enum ShapeType {
    CIRCLE = 1,
    BOX = 2,
    POLYGON = 3,
}

export interface IShape {
    /** 形状类型 */
    get shapeType(): ShapeType;
    /** 形状掩码 @internal */
    get mask(): number;
    /** 是否有效 @internal */

    get isValid(): boolean;
    get position(): Vec2;
    get scale(): number;
    get rotation(): number;
    /** 获取包围盒 */
    getBoundingBox(): Rect;
    setPosition(x: number, y: number): void;
    setScale(value: number): void;
    setRotation(angle: number): void;
    destroy(): void;
}