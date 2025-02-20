import { Status } from "../header";
import { Ticker } from "../Ticker";
import { BaseNode } from "./BaseNode";

/**
 * 动作节点
 * 没有子节点
 */
export abstract class Action extends BaseNode {
    constructor() {
        super();
    }
}

/**
 * 失败节点(无子节点)
 * 直接返回FAILURE
 */
export class Failure extends Action {
    private _func: () => void;
    constructor(func: () => void) {
        super();
        this._func = func;
    }

    public tick(ticker: Ticker): Status {
        this._func();
        return Status.FAILURE;
    }
}

/**
 * 逻辑节点，一直执行 (无子节点)
 * 直接返回RUNING
 */
export class Running extends Action {
    private _func: () => void;
    constructor(func: () => void) {
        super();
        this._func = func;
    }

    public tick(ticker: Ticker): Status {
        this._func();
        return Status.RUNNING;
    }
}

/**
 * 成功节点 无子节点
 * 直接返回SUCCESS
 */
export class Success extends Action {
    private _func: () => void;
    constructor(func: () => void) {
        super();
        this._func = func;
    }

    public tick(ticker: Ticker): Status {
        this._func();
        return Status.SUCCESS;
    }
}
/**
 * 次数等待节点(无子节点)
 * 次数内，返回RUNING
 * 超次，返回SUCCESS
 */
export class WaitTicks extends Action {
    /** 最大次数 */
    private _maxTicks: number;
    /** 经过的次数 */
    private _elapsedTicks: number;
    constructor(maxTicks: number = 0) {
        super();
        this._maxTicks = maxTicks;
        this._elapsedTicks = 0;
    }

    public open(ticker: Ticker): void {
        this._elapsedTicks = 0;
    }

    public tick(ticker: Ticker): Status {
        if (++this._elapsedTicks >= this._maxTicks) {
            this._elapsedTicks = 0;
            return Status.SUCCESS;
        }
        return Status.RUNNING;
    }
}

/**
 * 时间等待节点(无子节点)
 * 时间到后返回SUCCESS，否则返回RUNING
 */
export class WaitTime extends Action {
    /** 等待时间(毫秒 ms) */
    private _duration: number;
    constructor(duration: number = 0) {
        super();
        this._duration = duration * 1000;
    }

    public open(ticker: Ticker): void {
        let startTime = new Date().getTime();
        ticker.blackboard.set("startTime", startTime, ticker.tree.id, this.id);
    }

    public tick(ticker: Ticker): Status {
        let currTime = new Date().getTime();
        let startTime = ticker.blackboard.get("startTime", ticker.tree.id, this.id);
        if (currTime - startTime >= this._duration) {
            return Status.SUCCESS;
        }
        return Status.RUNNING;
    }
}

/**
 * 行为树防止被打断节点
 * 直接返回 SUCCESS
 * 和 InterruptDefendCancel 必须成对出现
 */
export class InterruptDefend extends Action {
    public tick(ticker: Ticker): Status {
        ticker.blackboard.interruptDefend = true;
        return Status.SUCCESS;
    }
}

/**
 * 行为树被打断取消节点
 * 直接返回 SUCCESS
 * 和 InterruptDefend 必须成对出现
 */
export class InterruptDefendCancel extends Action {
    public tick(ticker: Ticker): Status {
        ticker.blackboard.interruptDefend = false;
        return Status.SUCCESS;
    }
}