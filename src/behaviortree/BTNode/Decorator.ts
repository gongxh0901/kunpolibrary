import { Status } from "../header";
import { Ticker } from "../Ticker";
import { BaseNode } from "./BaseNode";

/**
 * 修饰节点基类
 * 只能包含一个子节点
 */
export abstract class Decorator extends BaseNode {
    constructor(child: BaseNode) {
        super([child]);
    }
}

/**
 * 失败节点
 * 必须且只能包含一个子节点
 * 直接返回 FAILURE
 * @extends Decorator
 */
export class Failer extends Decorator {
    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        if (this.children.length !== 1) {
            throw new Error("(Failer)节点必须包含一个子节点");
        }
        let child = this.children[0];
        child._execute(ticker);
        return Status.FAILURE;
    }
}

/**
 * 结果反转节点
 * 必须且只能包含一个子节点
 * 第一个Child Node节点, 返回 FAILURE, 本Node向自己的Parent Node也返回 SUCCESS
 * 第一个Child Node节点, 返回 SUCCESS, 本Node向自己的Parent Node也返回 FAILURE
 */
export class Inverter extends Decorator {
    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        if (this.children.length !== 1) {
            throw new Error("(Inverter)节点必须包含一个子节点");
        }
        let child = this.children[0];
        let status = child._execute(ticker);
        if (status === Status.SUCCESS) {
            status = Status.FAILURE;
        } else if (status === Status.FAILURE) {
            status = Status.SUCCESS;
        }
        return status;
    }
}

/**
 * 次数限制节点
 * 必须且只能包含一个子节点
 * 次数限制内, 根据Child Node的结果, 本Node向自己的Parent Node也返回相同的结果
 * 次数超过后, 直接返回 FAILURE
 */
export class LimiterTicks extends Decorator {
    /** 最大次数 @internal */
    private _maxTicks: number;
    /** 当前执行过的次数 @internal */
    private _elapsedTicks: number;

    /**
     * 创建
     * @param maxTicks 最大次数
     * @param child 子节点
     */
    constructor(maxTicks: number, child: BaseNode) {
        super(child);
        this._maxTicks = maxTicks;
        this._elapsedTicks = 0;
    }

    /**
     * 打开
     * @param {Ticker} ticker 
     */
    public open(ticker: Ticker): void {
        super.open(ticker);
        this._elapsedTicks = 0;
    }

    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        if (this.children.length !== 1) {
            throw new Error("(LimiterTicks)节点必须包含一个子节点");
        }
        let child = this.children[0];
        if (++this._elapsedTicks > this._maxTicks) {
            this._elapsedTicks = 0;
            return Status.FAILURE;
        }
        return child._execute(ticker);
    }
}

/**
 * 时间限制节点
 * 只能包含一个子节点
 * 规定时间内, 根据Child Node的结果, 本Node向自己的Parent Node也返回相同的结果
 * 超时后, 直接返回 FAILURE
 */
export class LimiterTime extends Decorator {
    /** 最大时间 (毫秒 ms) @internal */
    private _maxTime: number;

    /**
     * 时间限制节点
     * @param maxTime 最大时间 (微秒ms)
     * @param child 子节点
     */
    constructor(maxTime: number, child: BaseNode) {
        super(child);
        this._maxTime = maxTime * 1000;
    }

    /**
     * 打开
     * @param {Ticker} ticker 
     */
    public open(ticker: Ticker): void {
        super.open(ticker);
        let startTime = new Date().getTime();
        ticker.blackboard.set("startTime", startTime, ticker.tree.id, this.id);
    }

    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        if (this.children.length !== 1) {
            throw new Error("(LimiterTime)节点必须包含一个子节点");
        }

        let child = this.children[0];
        let currTime = new Date().getTime();
        let startTime = ticker.blackboard.get("startTime", ticker.tree.id, this.id);

        if (currTime - startTime > this._maxTime) {
            return Status.FAILURE;
        }

        return child._execute(ticker);
    }
}

/**
 * 循环节点
 * 必须且只能包含一个子节点
 * 如果maxLoop < 0, 直接返回成功
 * 否则等待次数超过之后, 返回Child Node的结果（RUNING的次数不计算在内）
 */
export class Repeater extends Decorator {
    /** 最大循环次数 @internal */
    private _maxLoop: number;

    /**
     * 创建
     * @param child 子节点
     * @param maxLoop 最大循环次数
     */
    constructor(child: BaseNode, maxLoop: number = -1) {
        super(child);
        this._maxLoop = maxLoop;
    }

    /**
     * 打开
     * @param {Ticker} ticker 
     */
    public open(ticker: Ticker): void {
        ticker.blackboard.set("i", 0, ticker.tree.id, this.id);
    }

    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        if (this.children.length !== 1) {
            throw new Error("(Repeater)节点必须包含一个子节点");
        }

        let child = this.children[0];
        let i = ticker.blackboard.get("i", ticker.tree.id, this.id);
        let status = Status.SUCCESS;

        while (this._maxLoop < 0 || i < this._maxLoop) {
            status = child._execute(ticker);

            if (status === Status.SUCCESS || status === Status.FAILURE) {
                i++;
            } else {
                break;
            }
        }

        ticker.blackboard.set("i", i, ticker.tree.id, this.id);
        return status;
    }
}

/**
 * 循环节点
 * 只能包含一个子节点
 * 如果maxLoop < 0, 直接返回成功
 * 当Child Node返回 FAILURE, 本Node向自己的Parent Node返回 FAILURE
 * 循环次数大于等于maxLoop时, 返回Child Node的结果
 */
export class RepeatUntilFailure extends Decorator {
    /** 最大循环次数 @internal */
    private _maxLoop: number;

    constructor(child: BaseNode, maxLoop: number = -1) {
        super(child);
        this._maxLoop = maxLoop;
    }

    /**
     * 打开
     * @param {Ticker} ticker 
     */
    public open(ticker: Ticker): void {
        ticker.blackboard.set("i", 0, ticker.tree.id, this.id);
    }

    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        if (this.children.length !== 1) {
            throw new Error("(RepeatUntilFailure)节点必须包含一个子节点");
        }

        let child = this.children[0];
        let i = ticker.blackboard.get("i", ticker.tree.id, this.id);
        let status = Status.SUCCESS;

        while (this._maxLoop < 0 || i < this._maxLoop) {
            status = child._execute(ticker);

            if (status === Status.SUCCESS) {
                i++;
            } else {
                break;
            }
        }

        ticker.blackboard.set("i", i, ticker.tree.id, this.id);
        return status;
    }
}

/**
 * 循环节点(只能包含一个子节点)
 * 如果maxLoop < 0, 直接返回失败
 * 当Child Node返回 SUCCESS, 本Node向自己的Parent Node返回 SUCCESS
 * 循环次数大于等于maxLoop时, 返回Child Node的结果
 */
export class RepeatUntilSuccess extends Decorator {
    /** 最大循环次数 @internal */
    private _maxLoop: number;

    /**
     * 创建
     * @param child 子节点
     * @param maxLoop 最大循环次数
     */
    constructor(child: BaseNode, maxLoop: number = -1) {
        super(child);
        this._maxLoop = maxLoop;
    }

    /**
     * 打开
     * @param {Ticker} ticker 
     */
    public open(ticker: Ticker): void {
        ticker.blackboard.set("i", 0, ticker.tree.id, this.id);
    }

    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        if (this.children.length !== 1) {
            throw new Error("(RepeatUntilSuccess)节点必须包含一个子节点");
        }
        let child = this.children[0];
        let i = ticker.blackboard.get("i", ticker.tree.id, this.id);
        let status = Status.FAILURE;
        while (this._maxLoop < 0 || i < this._maxLoop) {
            status = child._execute(ticker);
            if (status === Status.FAILURE) {
                i++;
            } else {
                break;
            }
        }
        ticker.blackboard.set("i", i, ticker.tree.id, this.id);
        return status;
    }
}

/**
 * 逻辑节点, 一直执行(只能包含一个子节点)
 * 直接返回 RUNING
 */
export class Runner extends Decorator {
    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        if (this.children.length !== 1) {
            throw new Error("(Runner)节点必须包含一个子节点");
        }
        let child = this.children[0];
        child._execute(ticker);
        return Status.RUNNING;
    }
}

/**
 * 成功节点(包含一个子节点)
 * 直接返回 SUCCESS
 */
export class Succeeder extends Decorator {
    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        if (this.children.length !== 1) {
            throw new Error("(Succeeder)节点必须包含一个子节点");
        }
        let child = this.children[0];
        child._execute(ticker);
        return Status.SUCCESS;
    }
}