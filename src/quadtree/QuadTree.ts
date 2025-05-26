/**
 * @Author: Gongxh
 * @Date: 2024-12-21
 * @Description: 树节点
 */

import { Graphics, Intersection2D, rect, Rect } from "cc";
import { Box } from "./Box";
import { Circle } from "./Circle";
import { Polygon } from "./Polygon";
import { Shape } from "./Shape";

// 1|0
// ---
// 2|3
const enum Quadrant {
    ONE = 0,
    TWO,
    THREE,
    FOUR,
    MORE, // 多个象限
}

const circleCircle = Intersection2D.circleCircle;
const polygonCircle = Intersection2D.polygonCircle;
const polygonPolygon = Intersection2D.polygonPolygon;
/** 两个形状是否碰撞 */
function isCollide(shape1: Shape, shape2: Shape): boolean {
    if (shape1 instanceof Circle) {
        if (shape2 instanceof Circle) {
            return circleCircle(shape1.position, shape1.radius * shape1.scale, shape2.position, shape2.radius * shape2.scale);
        } else if (shape2 instanceof Box || shape2 instanceof Polygon) {
            return polygonCircle(shape2.points, shape1.position, shape1.radius * shape1.scale);
        }
    } else if (shape1 instanceof Box || shape1 instanceof Polygon) {
        if (shape2 instanceof Circle) {
            return polygonCircle(shape1.points, shape2.position, shape2.radius * shape2.scale);
        } else if (shape2 instanceof Box || shape2 instanceof Polygon) {
            return polygonPolygon(shape2.points, shape1.points);
        }
    }
    return false;
}

export const QTConfig = {
    /** 每个节点（象限）所能包含物体的最大数量 */
    MAX_SHAPES: 12,
    /** 四叉树的最大深度 */
    MAX_LEVELS: 5,
}

export class QuadTree {
    /** @internal */
    private _graphics: Graphics;
    /** @internal */
    private _shapes_map: Map<number, Shape[]>; // 根据类型存储形状对象
    /** @internal */
    private _trees: QuadTree[] = []; // 存储四个子节点
    /** @internal */
    private _level: number; // 树的深度
    /** @internal */
    private _bounds: Rect; // 树的外框
    /** @internal */
    private _ignore_shapes: Shape[] = []; // 不在树中的形状
    /**
     * 创建一个四叉树
     * @param rect 该节点对应的象限在屏幕上的范围
     * @param level 该节点的深度，根节点的默认深度为0
     * @param graphics cc中用于绘制树的绘制组件
     */
    constructor(rect: Rect, level: number = 0, graphics: Graphics = undefined) {
        this._shapes_map = new Map();
        this._trees = [];
        this._level = level || 0;
        this._bounds = rect;
        this._graphics = graphics;
    }

    /**
     * 插入形状
     * @param shape 形状数据
     * 如果当前节点存在子节点，则检查物体到底属于哪个子节点，如果能匹配到子节点，则将该物体插入到该子节点中
     * 如果当前节点不存在子节点，将该物体存储在当前节点。随后，检查当前节点的存储数量，如果超过了最大存储数量，则对当前节点进行划分，划分完成后，将当前节点存储的物体重新分配到四个子节点中。
     */
    public insert(shape: Shape): void {
        // 如果该节点下存在子节点
        if (this._trees.length > 0) {
            let quadrant = this._getQuadrant(shape);
            if (quadrant !== Quadrant.MORE) {
                this._trees[quadrant].insert(shape);
                return;
            }
        }
        if (this._level == 0 && !this._isInner(shape, this._bounds)) {
            // 插入跟节点并且形状不在根节点的框内，则把形状放入忽略列表中
            this._ignore_shapes.push(shape);
        } else {
            // 存储在当前节点下
            this._insert(shape);
            // 如果当前节点存储的数量超过了 MAX_OBJECTS，并且深度没超过 MAX_LEVELS，则继续拆分
            if (!this._trees.length && this._size() > QTConfig.MAX_SHAPES && this._level < QTConfig.MAX_LEVELS) {
                this._split();
                for (const shapes of this._shapes_map.values()) {
                    let length = shapes.length - 1;
                    for (let i = length; i >= 0; i--) {
                        let quadrant = this._getQuadrant(shapes[i]);
                        if (quadrant !== Quadrant.MORE) {
                            this._trees[quadrant].insert(shapes.splice(i, 1)[0]);
                        }
                    }
                }
            }
        }
    }

    /** @internal */
    private _insert(shape: Shape): void {
        if (!this._shapes_map.has(shape.tag)) {
            this._shapes_map.set(shape.tag, []);
        }
        this._shapes_map.get(shape.tag).push(shape);
    }

    /**
     * 检索功能：
     * 给出一个物体对象，该函数负责将该物体可能发生碰撞的所有物体选取出来。该函数先查找物体所属的象限，该象限下的物体都是有可能发生碰撞的，然后再递归地查找子象限...
     */
    public collide(shape: Shape, tag: number = -1): Shape[] {
        let result: any[] = [];
        if (this._trees.length > 0) {
            let quadrant = this._getQuadrant(shape);
            if (quadrant === Quadrant.MORE) {
                let len = this._trees.length - 1;
                for (let i = len; i >= 0; i--) {
                    result = result.concat(this._trees[i].collide(shape, tag));
                }
            } else {
                result = result.concat(this._trees[quadrant].collide(shape, tag));
            }
        }

        for (const key of this._shapes_map.keys()) {
            if (!(tag & key)) {
                continue;
            }
            let shapes = this._shapes_map.get(key);
            for (const other_shape of shapes) {
                if (other_shape.valid && shape !== other_shape && isCollide(shape, other_shape)) {
                    result.push(other_shape);
                }
            }
        }
        return result;
    }

    /**
     * 动态更新
     */
    public update(root?: QuadTree): void {
        root = root || this;
        let isRoot = (root === this);
        isRoot && this.graphicsClear();
        this._updateIgnoreShapes(root);
        this._updateShapes(root);
        // 递归刷新子象限
        for (const tree of this._trees) {
            tree.update(root);
        }
        this._removeChildTree();
        this.graphicsTreeBound(root);

        if (isRoot && this._graphics) {
            this._graphics.stroke();
        }
    }

    public clear(): void {
        this._level = 0;
        this._ignore_shapes.length = 0;
        this._shapes_map.clear();
        for (const tree of this._trees) {
            tree.clear();
        }
        this._trees.length = 0;
    }

    /** 当前形状是否包含在象限内 @internal */
    private _isInner(shape: Shape, bounds: Rect): boolean {
        let rect = shape.getBoundingBox();
        return (
            rect.xMin * shape.scale + shape.position.x > bounds.xMin &&
            rect.xMax * shape.scale + shape.position.x < bounds.xMax &&
            rect.yMin * shape.scale + shape.position.y > bounds.yMin &&
            rect.yMax * shape.scale + shape.position.y < bounds.yMax
        );
    }

    /**
     * 获取形状对应的象限序号，以中心为界限切割:
     * @param {Shape} shape 形状
     * 右上：象限一
     * 左上：象限二
     * 左下：象限三
     * 右下：象限四
     * @internal
     */
    private _getQuadrant(shape: Shape): Quadrant {
        let bounds = this._bounds;
        let rect = shape.getBoundingBox();
        let center = bounds.center;

        let onTop = rect.yMin * shape.scale + shape.position.y > center.y;
        let onBottom = rect.yMax * shape.scale + shape.position.y < center.y;
        let onLeft = rect.xMax * shape.scale + shape.position.x < center.x;
        let onRight = rect.xMin * shape.scale + shape.position.x > center.x;
        if (onTop) {
            if (onRight) {
                return Quadrant.ONE;
            } else if (onLeft) {
                return Quadrant.TWO;
            }
        } else if (onBottom) {
            if (onLeft) {
                return Quadrant.THREE;
            } else if (onRight) {
                return Quadrant.FOUR;
            }
        }
        return Quadrant.MORE; // 跨越多个象限
    }

    /**
     * 划分函数
     * 如果某一个象限（节点）内存储的物体数量超过了MAX_OBJECTS最大数量
     * 则需要对这个节点进行划分
     * 它的工作就是将一个象限看作一个屏幕，将其划分为四个子象限
     * @internal
     */
    private _split(): void {
        let bounds = this._bounds;
        let x = bounds.x;
        let y = bounds.y;
        let halfwidth = bounds.width * 0.5;
        let halfheight = bounds.height * 0.5;
        let nextLevel = this._level + 1;
        this._trees.push(
            new QuadTree(rect(bounds.center.x, bounds.center.y, halfwidth, halfheight), nextLevel, this._graphics),
            new QuadTree(rect(x, bounds.center.y, halfwidth, halfheight), nextLevel, this._graphics),
            new QuadTree(rect(x, y, halfwidth, halfheight), nextLevel, this._graphics),
            new QuadTree(rect(bounds.center.x, y, halfwidth, halfheight), nextLevel, this._graphics)
        );
    }

    /** 删除子树 @internal */
    private _removeChildTree(): void {
        if (this._trees.length > 0) {
            if (this._totalSize() <= 0) {
                this._trees.length = 0;
            }
        }
    }

    /** 更新忽略掉的形状 @internal */
    private _updateIgnoreShapes(root: QuadTree): void {
        let len = this._ignore_shapes.length;
        if (len <= 0) {
            return;
        }
        for (let i = len - 1; i >= 0; i--) {
            let shape = this._ignore_shapes[i];
            if (!shape.valid) {
                this._ignore_shapes.splice(i, 1);
                continue;
            }
            if (!this._isInner(shape, this._bounds)) {
                continue;
            }
            root.insert(this._ignore_shapes.splice(i, 1)[0]);
        }
    }

    /** 更新有效的形状 @internal */
    private _updateShapes(root: QuadTree): void {
        for (const shapes of this._shapes_map.values()) {
            let len = shapes.length;
            for (let i = len - 1; i >= 0; i--) {
                let shape = shapes[i];
                if (!shape.valid) {
                    shapes.splice(i, 1);
                    continue;
                }
                if (!this._isInner(shape, this._bounds)) {
                    // 如果矩形不属于该象限，则将该矩形重新插入根节点
                    root.insert(shapes.splice(i, 1)[0]);
                } else if (this._trees.length > 0) {
                    // 如果矩形属于该象限且该象限具有子象限，则将该矩形安插到子象限中
                    let quadrant = this._getQuadrant(shape);
                    if (quadrant !== Quadrant.MORE) {
                        this._trees[quadrant].insert(shapes.splice(i, 1)[0]);
                    }
                }
                shape.drawShape(this._graphics);
            }
        }
    }

    /** 当前树以及子树中所有的形状数量 @internal */
    private _totalSize(): number {
        let size = this._size();
        for (const tree of this._trees) {
            size += tree._totalSize();
        }
        return size;
    }

    /** 当前树中所有的形状数量 @internal */
    private _size(): number {
        let size = 0;
        for (const shapes of this._shapes_map.values()) {
            size += shapes.length;
        }
        return size + this._ignore_shapes.length;
    }

    /** 画出当前树的边界 @internal */
    private graphicsTreeBound(root: QuadTree): void {
        if (!this._graphics) {
            return;
        }
        if (this._trees.length > 0) {
            this._graphics.moveTo(this._bounds.x, this._bounds.center.y);
            this._graphics.lineTo(this._bounds.x + this._bounds.width, this._bounds.center.y);

            this._graphics.moveTo(this._bounds.center.x, this._bounds.y);
            this._graphics.lineTo(this._bounds.center.x, this._bounds.y + this._bounds.height);
        }
        if (this == root) {
            this._graphics.moveTo(this._bounds.xMin, this._bounds.yMin);
            this._graphics.lineTo(this._bounds.xMax, this._bounds.yMin);
            this._graphics.lineTo(this._bounds.xMax, this._bounds.yMax);
            this._graphics.lineTo(this._bounds.xMin, this._bounds.yMax);
            this._graphics.lineTo(this._bounds.xMin, this._bounds.yMin);
        }
    }

    /** 清除绘制 @internal */
    private graphicsClear(): void {
        this._graphics && this._graphics.clear();
    }
}