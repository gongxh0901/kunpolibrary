/**
 * @Author: Gongxh
 * @Date: 2024-12-21
 * @Description: 
 */

export class Event {
    public id: number;
    public name: string;
    public target: any;
    public once: boolean = false;
    public callback: (...arg: any[]) => void;
    public _destroy: boolean = false;
    public _reset(): void {
        this._destroy = false;
    }
    public _recycle(): void {
        this._destroy = true;
    }
}