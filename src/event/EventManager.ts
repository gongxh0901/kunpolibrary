/**
 * @Author: Gongxh
 * @Date: 2024-12-21
 * @Description: 
 */

import { Event } from "./Event";
import { EventFactory } from "./EventFactory";

export class EventManager {
    private _idToEvent: Map<number, Event> = new Map<number, Event>();
    private _nameToIds: Map<string, Set<number>> = new Map<string, Set<number>>();
    private _targetToIds: Map<any, Set<number>> = new Map<any, Set<number>>();
    private _factroy: EventFactory = new EventFactory(64, Event);
    /**
     * 添加事件监听器。
     * @param name - 事件名称。
     * @param callback - 回调函数，当事件触发时执行。
     * @param target - 可选参数，指定事件监听的目标对象。
     * 该方法将事件和回调函数注册到事件管理器中，以便在事件触发时执行相应的回调函数。
     */
    public addEvent(name: string, callback: (...args: any[]) => void, target?: any): void {
        this._addEvent(name, callback, false, target);
    }

    /**
     * 添加一个只触发一次的事件监听器。
     * @param name - 事件名称。
     * @param callback - 事件触发时要执行的回调函数。
     * @param target - 可选参数，指定事件监听器的目标对象。
     */
    public addEventOnce(name: string, callback: (...args: any[]) => void, target?: any): void {
        this._addEvent(name, callback, true, target);
    }

    /**
     * 发送事件给所有注册的监听器。
     * @param name - 事件名称。
     * @param target - 可选参数，指定目标对象，只有目标对象匹配时才会触发监听器。 (制定目标对象 效率更高)
     * @param args - 传递给监听器回调函数的参数。
     */
    public send(name: string, target?: any, ...args: any[]): void {
        let nameToIds = this._nameToIds;
        if (!nameToIds.has(name)) {
            return;
        }
        let ids = nameToIds.get(name);
        let listenerMap = this._idToEvent;

        let needRemoveIds: number[] = [];
        let triggerList: Event[] = [];
        for (const id of ids.values()) {
            if (!listenerMap.has(id)) {
                throw new Error(`消息ID:【${id}】不存在`);
            }
            let listener = listenerMap.get(id);
            if (!listener._destroy && (!target || target == listener.target)) {
                triggerList.push(listener);
                if (listener.once) {
                    listener._destroy = true;
                    needRemoveIds.push(listener.id);
                }
            }
        }
        for (const listener of triggerList) {
            listener.callback(...args);
        }
        if (needRemoveIds.length > 0) {
            for (const id of needRemoveIds) {
                this._remove(id);
            }
        }
    }

    /**
     * 移除指定名称的事件监听器。
     * @param name - 事件名称。
     * @param callback - 要移除的回调函数。
     * @param target - 回调函数绑定的目标对象。
     * 该方法会遍历与指定名称关联的所有监听器ID，检查每个监听器的回调函数和目标对象，
     * 如果匹配则将其ID添加到待移除列表中，最后统一移除这些监听器。
     */
    public remove(name: string, callback: () => void, target: any): void {
        let nameToIds = this._nameToIds;
        if (!nameToIds.has(name)) {
            return;
        }
        let ids = nameToIds.get(name);
        if (ids.size == 0) {
            return;
        }

        let needRemoveIds: number[] = [];
        for (const id of ids.values()) {
            let listener = this._idToEvent.get(id);
            let needRemove = true;
            if (callback && listener.callback != callback) {
                needRemove = false;
            }
            if (target && listener.target != target) {
                needRemove = false;
            }
            needRemove && needRemoveIds.push(id);
        }
        if (needRemoveIds.length > 0) {
            for (const id of needRemoveIds) {
                this._remove(id);
            }
        }
    }

    public removeByNameAndTarget(name: string, target: any): void {
        this.remove(name, null, target);
    }

    public removeByNameAndCallback(name: string, callback: () => void): void {
        this.remove(name, callback, null);
    }

    /**
     * 移除与指定目标关联的所有监听器。
     * 如果目标不存在或关联的监听器ID集合为空，则不执行任何操作。
     * 对于每个监听器ID，从_idToEvent映射中删除监听器，并将其回收到工厂中。
     * 同时，更新_nameToIds映射，确保名称到ID集合的映射保持最新。
     * @param target - 要移除监听器的目标对象。
     */
    public removeList(target: any): void {
        let targetToIds = this._targetToIds;
        if (!targetToIds.has(target)) {
            return;
        }
        let ids = targetToIds.get(target);
        if (ids.size == 0) {
            return;
        }
        for (const id of ids.values()) {
            let listener = this._idToEvent.get(id);
            let name = listener.name;

            this._idToEvent.delete(id);
            this._factroy.recycle(listener);

            let nameToIds = this._nameToIds;
            if (nameToIds.has(name)) {
                nameToIds.get(name).delete(id);
            }
        }
        ids.clear();
    }

    public destroyAll(): void {
        let listeners = this._idToEvent;
        for (const listener of listeners.values()) {
            this._factroy.recycle(listener);
        }
        this._idToEvent.clear();
        this._nameToIds.clear();
        this._targetToIds.clear();
    }

    public _addEvent(name: string, callback: (...arg: any[]) => void, once: boolean, target: any): void {
        let listener = this._factroy.allocate<Event>();
        listener.name = name;
        listener.target = target;
        listener.once = once;
        listener.callback = callback;
        this._idToEvent.set(listener.id, listener);

        let nameToIds = this._nameToIds;
        let ids: Set<number>;
        if (nameToIds.has(name)) {
            ids = nameToIds.get(name);
        } else {
            ids = new Set<number>();
            nameToIds.set(name, ids);
        }
        ids.add(listener.id);
        if (target) {
            let targetToIds = this._targetToIds;
            if (!targetToIds.has(target)) {
                let ids = new Set<number>();
                ids.add(listener.id);
                targetToIds.set(target, ids);
            } else {
                let ids = targetToIds.get(target);
                ids.add(listener.id);
            }
        }
    }

    private _remove(id: number): void {
        if (!this._idToEvent.has(id)) {
            return;
        }
        let ids = this._idToEvent.get(id);
        let name = ids.name;
        let target = ids.target;

        this._idToEvent.delete(id);
        this._factroy.recycle(ids);

        let nameToIds = this._nameToIds;
        if (nameToIds.has(name)) {
            nameToIds.get(name).delete(id);
        }
        if (target) {
            let targetToIds = this._targetToIds;
            if (targetToIds.has(target)) {
                targetToIds.get(target).delete(id);
            }
        }
    }
}