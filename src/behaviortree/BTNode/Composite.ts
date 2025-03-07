import { Status } from "../header";
import { Ticker } from "../Ticker";
import { BaseNode } from "./BaseNode";

/**
 * 可以包含多个节点的集合装饰器基类
 *
 */
export abstract class Composite extends BaseNode {
    constructor(...children: BaseNode[]) {
        super(children);
    }
}

/**
 * 记忆选择节点
 * 选择不为 FAILURE 的节点
 * 任意一个Child Node返回不为 FAILURE, 本Node向自己的Parent Node也返回Child Node状态
 */
export class MemSelector extends Composite {
    /**
     * 打开
     * @param {Ticker} ticker 
     */
    public open(ticker: Ticker): void {
        super.open(ticker);
        ticker.blackboard.set("runningChild", 0, ticker.tree.id, this.id);
    }

    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        let childIndex = ticker.blackboard.get("runningChild", ticker.tree.id, this.id) as number;

        for (let i = childIndex; i < this.children.length; i++) {
            let status = this.children[i]._execute(ticker);

            if (status !== Status.FAILURE) {
                if (status === Status.RUNNING) {
                    ticker.blackboard.set("runningChild", i, ticker.tree.id, this.id);
                }
                return status;
            }
        }

        return Status.FAILURE;
    }
}

/**
 * 记忆顺序节点
 * 如果上次执行到 RUNING 的节点, 下次进入节点后, 直接从 RUNING 节点开始
 * 遇到 RUNING 或者 FAILURE 停止迭代
 * 任意一个Child Node返回不为 SUCCESS, 本Node向自己的Parent Node也返回Child Node状态
 * 所有节点都返回 SUCCESS, 本节点才返回 SUCCESS
 */
export class MemSequence extends Composite {
    /**
     * 打开
     * @param {Ticker} ticker 
     */
    public open(ticker: Ticker): void {
        super.open(ticker);
        ticker.blackboard.set("runningChild", 0, ticker.tree.id, this.id);
    }

    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        let childIndex = ticker.blackboard.get("runningChild", ticker.tree.id, this.id) as number;
        for (let i = childIndex; i < this.children.length; i++) {
            let status = this.children[i]._execute(ticker);
            if (status !== Status.SUCCESS) {
                if (status === Status.RUNNING) {
                    ticker.blackboard.set("runningChild", i, ticker.tree.id, this.id);
                }
                return status;
            }
        }
        return Status.SUCCESS;
    }
}

/**
 * 随机选择节点
 * 从Child Node中随机选择一个执行
 */
export class RandomSelector extends Composite {
    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        let childIndex = (Math.random() * this.children.length) | 0;
        let child = this.children[childIndex];
        let status = child._execute(ticker);

        return status;
    }
}

/**
 * 选择节点，选择不为 FAILURE 的节点
 * 当执行本类型Node时，它将从begin到end迭代执行自己的Child Node：
 * 如遇到一个Child Node执行后返回 SUCCESS 或者 RUNING，那停止迭代，本Node向自己的Parent Node也返回 SUCCESS 或 RUNING
 */
export class Selector extends Composite {
    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        for (let i = 0; i < this.children.length; i++) {
            let status = this.children[i]._execute(ticker);
            if (status !== Status.FAILURE) {
                return status;
            }
        }
        return Status.FAILURE;
    }
}

/**
 * 顺序节点
 * 当执行本类型Node时，它将从begin到end迭代执行自己的Child Node：
 * 遇到 FAILURE 或 RUNING, 那停止迭代，返回FAILURE 或 RUNING
 * 所有节点都返回 SUCCESS, 本节点才返回 SUCCESS
 */
export class Sequence extends Composite {
    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        for (let i = 0; i < this.children.length; i++) {
            let status = this.children[i]._execute(ticker);
            if (status !== Status.SUCCESS) {
                return status;
            }
        }
        return Status.SUCCESS;
    }
}

/**
 * 并行节点 每次进入全部重新执行一遍
 * 当执行本类型Node时，它将从begin到end迭代执行自己的Child Node：
 * 1. 当存在Child Node执行后返回 FAILURE, 本节点返回 FAILURE
 * 2. 当存在Child Node执行后返回 RUNING, 本节点返回 RUNING
 * 所有节点都返回 SUCCESS, 本节点才返回 SUCCESS
 */
export class Parallel extends Composite {
    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        let result = Status.SUCCESS;
        for (let i = 0; i < this.children.length; i++) {
            let status = this.children[i]._execute(ticker);
            if (status == Status.FAILURE) {
                result = Status.FAILURE;
            } else if (result == Status.SUCCESS && status == Status.RUNNING) {
                result = Status.RUNNING;
            }
        }
        return result;
    }
}

/**
 * 并行节点 每次进入全部重新执行一遍
 * 当执行本类型Node时，它将从begin到end迭代执行自己的Child Node：
 * 1. 当存在Child Node执行后返回 FAILURE, 本节点返回 FAILURE
 * 2. 任意 Child Node 返回 SUCCESS, 本节点返回 SUCCESS
 * 否则返回 RUNNING
 */
export class ParallelAnySuccess extends Composite {
    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        let result = Status.RUNNING;
        for (let i = 0; i < this.children.length; i++) {
            let status = this.children[i]._execute(ticker);
            if (status == Status.FAILURE) {
                result = Status.FAILURE;
            } else if (result == Status.RUNNING && status == Status.SUCCESS) {
                result = Status.SUCCESS;
            }
        }
        return result;
    }
}