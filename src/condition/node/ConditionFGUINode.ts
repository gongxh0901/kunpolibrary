/**
 * @Author: Gongxh
 * @Date: 2025-02-17
 * @Description: 
 */

import { GObject } from "fairygui-cc";
import { ConditionManager } from "../ConditionManager";
import { ConditionMode } from "../ConditionMode";
import { ConditionNode } from "./ConditionNode";
export class ConditionFGUINode extends ConditionNode {
    /**
     * 红点节点
     * @protected
     * @type {GObject | Node} fgui节点 或 node节点
     * @memberof NotityFGUINode
     */
    protected node: GObject;

    private _oldRemoveFromParent: () => void;

    /**
     * 构建红点节点
     * @param {GObject} node 关联节点
     * @param {...number[]} conditionTypes 条件类型
     */
    public constructor(node: GObject, modeType: ConditionMode, ...conditionTypes: number[]) {
        super(modeType, ...conditionTypes);
        this.node = node;
        const oldRemoveFromParent = (this._oldRemoveFromParent = node.removeFromParent);
        node.removeFromParent = (): void => {
            super.destroy();
            oldRemoveFromParent.call(node);
            this.node.removeFromParent = this._oldRemoveFromParent;
            this.node = null;
        };
        // 立即更新一次
        ConditionManager._nowUpdateConditionNode(this);
    }

    public destroy(): void {
        super.destroy();
        if (this.node) {
            this.node.removeFromParent = this._oldRemoveFromParent;
            this.node = null;
        }
    }

    public notify(visible: boolean): void {
        this.node.visible = visible;
    }
}