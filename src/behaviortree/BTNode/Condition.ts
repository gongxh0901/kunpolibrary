import { Status } from "../header";
import { Ticker } from "../Ticker";
import { Action } from "./Action";

/**
 * 条件节点
 */
export class Condition extends Action {
    /** 执行函数 @internal */
    private _func: (subject: any) => boolean = null;
    constructor(func: (subject: any) => boolean) {
        super();
        this._func = func;
    }

    /**
     * 执行
     * @param {Ticker} ticker 
     * @returns {Status} 
     */
    public tick(ticker: Ticker): Status {
        return this._func(ticker.subject) ? Status.SUCCESS : Status.FAILURE;
    }
}