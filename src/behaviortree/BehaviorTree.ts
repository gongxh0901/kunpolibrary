import { Blackboard } from "./Blackboard";
import { BaseNode } from "./BTNode/BaseNode";
import { createUUID } from "./header";
import { Ticker } from "./Ticker";

/**
 * 行为树
 * 所有节点全部添加到树中
 */
export class BehaviorTree {
    /** 行为树ID @internal */
    private _id: string;
    /** 行为树跟节点 @internal */
    private _root: BaseNode;
    /**
     * constructor
     * @param root 根节点
     */
    constructor(root: BaseNode) {
        this._id = createUUID();
        this._root = root;
    }

    /**
     * 执行
     * @param subject 主体
     * @param blackboard 黑板
     * @param ticker 更新器
     */
    public tick(subject: any, blackboard: Blackboard, ticker?: Ticker): void {
        ticker = ticker || new Ticker(subject, blackboard, this);
        ticker.openNodes.length = 0;
        this._root._execute(ticker);
        // 上次打开的节点
        let lastOpenNodes = blackboard.get("openNodes", this._id) as BaseNode[];
        // 当前打开的节点
        let currOpenNodes = ticker.openNodes;
        let start = 0;
        for (let i = 0; i < Math.min(lastOpenNodes.length, currOpenNodes.length); i++) {
            start = i + 1;
            if (lastOpenNodes[i] !== currOpenNodes[i]) {
                break;
            }
        }
        // 关闭不需要的节点
        for (let i = lastOpenNodes.length - 1; i >= start; i--) {
            lastOpenNodes[i]._close(ticker);
        }
        /* POPULATE BLACKBOARD */
        blackboard.set("openNodes", currOpenNodes, this._id);
        blackboard.set("nodeCount", ticker.nodeCount, this._id);
    }

    get id(): string {
        return this._id;
    }

    get root(): BaseNode {
        return this._root;
    }
}