import { BehaviorTree } from "./BehaviorTree";
import { Blackboard } from "./Blackboard";
import { BaseNode } from "./BTNode/BaseNode";

export class Ticker {
    tree: BehaviorTree; // 行为树跟节点
    openNodes: BaseNode[]; // 当前打开的节点
    nodeCount: number; // 当前打开的节点数量
    blackboard: Blackboard; // 数据容器
    debug: any;
    subject: any;
    constructor(subject: any, blackboard: Blackboard, tree: BehaviorTree) {
        this.tree = tree;
        this.openNodes = [];
        this.nodeCount = 0;
        this.debug = null;
        this.subject = subject;
        this.blackboard = blackboard;
    }

    /** 进入节点 */
    enterNode(node: BaseNode): void {
        this.nodeCount++;
        this.openNodes.push(node);
    }

    /** 打开节点 */
    openNode(node: BaseNode): void { }

    /** 更新节点 */
    tickNode(node: BaseNode): void { }

    /** 关闭节点 */
    closeNode(node: BaseNode): void {
        this.openNodes.pop();
    }

    /** 退出节点 */
    exitNode(node: BaseNode): void { }
}