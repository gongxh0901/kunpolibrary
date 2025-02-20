import { BehaviorTree } from "./BehaviorTree";
import { Blackboard } from "./Blackboard";
import { Ticker } from "./Ticker";

/** 代理 */
export class Agent {
    public tree: BehaviorTree;
    public blackboard: Blackboard;
    public ticker: Ticker;
    /**
     * constructor
     * @param subject // 主体
     * @param tree 行为树
     */
    constructor(subject: any, tree: BehaviorTree) {
        this.tree = tree;
        this.blackboard = new Blackboard();
        this.ticker = new Ticker(subject, this.blackboard, tree);
    }

    public tick(): void {
        this.tree.tick(this, this.blackboard, this.ticker);
        if (this.blackboard.interrupt) {
            this.blackboard.interrupt = false;

            let ticker = this.ticker;
            ticker.openNodes.length = 0;
            ticker.nodeCount = 0;

            this.blackboard.clear();
        }
    }

    /**
     * 打断行为树，重新开始执行（如果当前在节点中，下一帧才会清理）
     */
    public interruptBTree(): void {
        if (!this.blackboard.interruptDefend) {
            this.blackboard.interrupt = true;
        }
    }
}