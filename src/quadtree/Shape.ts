/**
 * @Author: Gongxh
 * @Date: 2024-12-21
 * @Description: 四叉树的 形状基类
 */

import { Graphics, Rect, Vec2 } from "cc";

export abstract class Shape {
    /**
     * 形状的标记 用来过滤不需要检测的形状
     * 通过 & 来匹配形状是否需要被检测
     * -1 表示和所有物体碰撞
     */
    public tag: number = -1;

    /** 被标记为无效 下次更新时删除 */
    public invalid: boolean = false;

    /** 缩放 */
    public scale: number; // 缩放

    /** 脏标记 用来重置包围盒 @internal */
    protected isDirty: boolean;

    /** 包围盒 @internal */
    protected boundingBox: Rect;

    /** 位置 @internal */
    protected _position: Vec2;

    /** 旋转角度 @internal */
    protected _rotation: number;

    constructor(tag: number) {
        this.tag = tag;
        this.scale = 1.0;
        this._rotation = 0;
        this.isDirty = true;
        this.boundingBox = new Rect();
        this._position = new Vec2();
    }

    set position(pos: Vec2) {
        this._position.x = pos.x;
        this._position.y = pos.y;
    }

    get position(): Vec2 {
        return this._position;
    }

    set rotation(angle: number) {
        if (this._rotation !== angle) {
            this._rotation = angle;
            this.isDirty = true;
        }
    }

    get rotation(): number {
        return this._rotation;
    }

    /** 包围盒 子类重写 */
    public abstract getBoundingBox(): Rect;

    /** @internal */
    public drawShape(draw: Graphics): void {

    }
}

