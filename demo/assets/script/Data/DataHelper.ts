/**
 * @Author: Gongxh
 * @Date: 2025-02-17
 * @Description: 准备一个数据类
 */

import { GlobalEvent } from "kunpocc-event";

export class DataHelper {
    private static _data: Map<string, any> = new Map();

    public static getValue<T>(key: string, defaultValue: T): T {
        if (this._data.has(key)) {
            return this._data.get(key) as T;
        }
        return defaultValue;
    }

    public static setValue(key: string, value: any): void {
        this._data.set(key, value);
        /** 数据改变后发送事件 */
        GlobalEvent.send(key);
    }
}
