import { createUUID, Status } from "../header";
import { Ticker } from "../Ticker";

/**
 * 基础节点
 * 所有节点全部继承自 BaseNode
 */
export abstract class BaseNode {
    /** 唯一标识 */
    public id: string;
    /** 子节点 */
    public children: BaseNode[];

    /**
     * 创建
     * @param children 子节点列表
     */
    constructor(children?: BaseNode[]) {
        this.id = createUUID();
        this.children = [];
        if (!children) {
            return;
        }
        for (let i = 0; i < children.length; i++) {
            this.children.push(children[i]);
        }
    }

    /**
     * 执行节点
     * @param ticker 更新器
     * @returns {Status} 状态
     */
    public _execute(ticker: Ticker): Status {
        /* ENTER */
        this._enter(ticker);
        if (!ticker.blackboard.get("isOpen", ticker.tree.id, this.id)) {
            this._open(ticker);
        }
        let status = this._tick(ticker);
        if (status !== Status.RUNNING) {
            this._close(ticker);
        }
        this._exit(ticker);
        return status;
    }

    /**
     * 进入节点
     * @param ticker 更新器
     * @internal
     */
    public _enter(ticker: Ticker): void {
        ticker.enterNode(this);
        this.enter(ticker);
    }

    /**
     * 打开节点
     * @param ticker 更新器
     * @internal
     */
    public _open(ticker: Ticker): void {
        ticker.openNode(this);
        ticker.blackboard.set("isOpen", true, ticker.tree.id, this.id);
        this.open(ticker);
    }

    /**
     * 更新节点
     * @param ticker 更新器
     * @internal
     */
    public _tick(ticker: Ticker): Status {
        ticker.tickNode(this);
        return this.tick(ticker);
    }

    /**
     * 关闭节点
     * @param ticker 更新器
     * @internal
     */
    public _close(ticker: Ticker): void {
        ticker.closeNode(this);
        ticker.blackboard.set("isOpen", false, ticker.tree.id, this.id);
        this.close(ticker);
    }

    /**
     * 退出节点
     * @param ticker 更新器
     * @internal
     */
    public _exit(ticker: Ticker): void {
        ticker.exitNode(this);
        this.exit(ticker);
    }

    enter(ticker: Ticker): void {

    }
    open(ticker: Ticker): void {

    }
    close(ticker: Ticker): void {

    }
    exit(ticker: Ticker): void {

    }
    abstract tick(ticker: Ticker): Status;
}