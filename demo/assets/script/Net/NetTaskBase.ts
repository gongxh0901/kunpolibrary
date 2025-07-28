/**
 * @Author: Gongxh
 * @Date: 2024-05-20
 * @Description: 网络基类
 */

import { HttpTask, IHttpResponse } from "kunpocc-net";
import { INetResponse } from "./header";

export abstract class NetTaskBase extends HttpTask {
    protected url: string = '';
    private _succeed: (data: any) => void;
    private _httpError: (data: any) => void;
    private _taskError: (data: any) => void;

    /**
     * 设置回调
     * @param {object} res 回调函数
     * @param {function} res.succeed 任务成功回调
     * @param {function} res.taskError 任务错误回调 (一般是服务端返回错误码)
     * @param {function} res.httpError http错误回调 (一般是网络错误)
     */
    public setTaskCallback(res: { succeed: (response: any) => void, taskError?: (response: any) => void, httpError?: (response: any) => void }) {
        this._succeed = res?.succeed;
        this._httpError = res?.httpError;
        this._taskError = res?.taskError;
    }

    public onComplete(response: IHttpResponse): void {
        try {
            let data = response.data as INetResponse;
            if (data.responseStatus == 0) {
                console.log(`http response\n   name:${this.name}\n   url=${this.url}\n   data=${JSON.stringify(data)}`);
                this.onTaskComplete(data);
                this._succeed?.(data);
            } else {
                throw new Error("任务错误");
            }
        } catch (error) {
            let data = response.data as INetResponse;
            console.log(`http response task error\n   name:${this.name}\n   url:${this.url}\n   responseStatus:${data.responseStatus}\n   data:${JSON.stringify(data)}`);
            this.onTaskError(data.responseStatus, response.data);
            this._taskError?.(response.data);
        }
    }

    public onError(response: IHttpResponse): void {
        let message = response.message;
        let statusCode = response.statusCode;
        console.log(`http response error\n   name:${this.name}\n   url:${this.url}\n   message:${message}\n   statusCode:${statusCode}`);
        this.onHttpError(message);
        this._httpError?.(response.data);
    }

    /** 任务完成 子类必须实现 */
    protected abstract onTaskComplete(data: any): void;
    /** 任务错误 子类实现 */
    protected onTaskError(errcode: number, data: any): void {

    };
    /** http错误 子类实现 */
    protected onHttpError(message: string): void {

    };
}