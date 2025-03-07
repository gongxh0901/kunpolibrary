/**
 * @Author: Gongxh
 * @Date: 2024-12-22
 * @Description: 全局事件
 */

import { EventManager } from "../event/EventManager";

export class GlobalEvent {
    /** @internal */
    private static _globalEvent: EventManager = null;
    public static add(eventName: string, callback: (...args: any[]) => void, target: any): void {
        this._globalEvent.addEvent(eventName, callback, target);
    }

    public static addOnce(eventName: string, callback: (...args: any[]) => void, target: any): void {
        this._globalEvent.addEventOnce(eventName, callback, target);
    }

    public static send(eventName: string, ...args: any[]): void {
        this._globalEvent.send(eventName, null, ...args);
    }

    public static sendToTarget(eventName: string, target: any, ...args: any[]) {
        this._globalEvent.send(eventName, target, ...args);
    }

    public static remove(eventName: string, callback: (...args: any[]) => void, target?: any): void {
        this._globalEvent.remove(eventName, callback, target);
    }

    public static removeByNameAndTarget(eventName: string, target: any) {
        this._globalEvent.removeByNameAndTarget(eventName, target);
    }

    public static removeByTarget(target: any): void {
        this._globalEvent.removeList(target);
    }

    /** @internal */
    public static _initGlobalEvent(): void {
        if (!this._globalEvent) {
            this._globalEvent = new EventManager();
        }
    }
}