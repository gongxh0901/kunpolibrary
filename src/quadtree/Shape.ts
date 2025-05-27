/**
 * @Author: Gongxh
 * @Date: 2024-12-21
 * @Description: 四叉树的 形状基类
 */

import { Rect, Vec2 } from "cc";
import { IShape, ShapeType } from "./IShape";

export abstract class Shape implements IShape {
    /**
     * 形状的掩码 用来过滤不需要检测的形状 通过&来匹配形状是否需要被检测 -1表示和所有物体碰撞
     */
    private _mask: number = -1;
    protected _scale: number;

    /** 脏标记 用来重置包围盒 @internal */
    protected _isDirty: boolean;

    /** 包围盒 @internal */
    protected _boundingBox: Rect;

    /** 位置 @internal */
    protected _position: Vec2;

    /** 旋转角度 @internal */
    protected _rotation: number;

    /** 是否有效 下次更新时删除 @internal */
    private _valid: boolean = true;

    public abstract get shapeType(): ShapeType;

    public get mask(): number { return this._mask; }
    public get position(): Vec2 { return this._position; }
    public get scale(): number { return this._scale; }
    public get rotation(): number { return this._rotation; }
    public get isValid(): boolean { return this._valid; }

    constructor(mask: number) {
        this._mask = mask;
        this._scale = 1.0;
        this._rotation = 0;
        this._isDirty = true;
        this._boundingBox = new Rect();
        this._position = new Vec2();
    }

    public setPosition(x: number, y: number) {
        this._position.x = x;
        this._position.y = y;
    }

    public setRotation(angle: number) {
        if (this._rotation !== angle) {
            this._rotation = angle;
            this._isDirty = true;
        }
    }

    public setScale(value: number) {
        if (this._scale !== value) {
            this._scale = value;
            this._isDirty = true;
        }
    }

    /** 包围盒 子类重写 */
    public abstract getBoundingBox(): Rect;


    public destroy(): void {
        this._valid = false;
    }
}