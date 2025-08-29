/**
 * @Author: Gongxh
 * @Date: 2025-08-26
 * @Description: 
 */

import { BatchUpdater } from "./BatchUpdater";
import { IDataEvent } from "./types";

// 全局唯一ID生成器
let nextId = 1;

function notifyChange(path: string, dataInstance: any, value?: any, isProp: boolean = false) {
    const event: IDataEvent = {
        path,
        target: dataInstance,
        value,
        isProp
    };
    // console.log('发出的通知路径', path);
    BatchUpdater.notifyBindings(event);
}

/**
 * 处理属性设置的拦截逻辑
 */
function handlePropertySet(dataInstance: any, target: any, prop: string | symbol, value: any): boolean {
    let oldValue = Reflect.get(target, prop);
    if (oldValue === value) {
        // 数据不变 无需通知 无需修改
        return true;
    }

    let propname = prop.toString();
    // 排除以_和__开头的方法
    if (propname.startsWith('_')) {
        Reflect.set(target, prop, value);
        return true;
    }

    const result = Reflect.set(target, prop, value);
    if (!dataInstance.__destroyed__) {
        const path = `${dataInstance.constructor.name}:${propname}`;
        notifyChange(path, dataInstance, value, true);
    }
    return result;
}

/**
 * 处理方法拦截的逻辑（只拦截数据类中的方法，排除constructor）
 */
function handleMethodGet(dataInstance: any, target: any, prop: string | symbol, receiver: any): any {
    const value = Reflect.get(target, prop, receiver);
    const propname = prop.toString();

    // 如果不是函数，直接返回
    if (typeof value !== 'function') {
        return value;
    }

    // 排除constructor方法
    if (propname === 'constructor') {
        return value;
    }

    // 排除以_和__开头的方法
    if (propname.startsWith('_')) {
        return value;
    }

    // 如果已经包装过，直接返回
    if (value.__kunpo_wrapped__) {
        return value;
    }

    const wrappedFunc = new Proxy(value, {
        apply: function (target: any, thisArg: any, args: any[]): any {
            // console.log('拦截到函数调用:', propname, args);
            let result = Reflect.apply(target, thisArg, args);
            const path = `${dataInstance.constructor.name}:${propname}`;
            notifyChange(path, dataInstance);
            return result;
        }
    });

    // 标记已包装，避免重复包装
    Object.defineProperty(wrappedFunc, '__kunpo_wrapped__', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
    });

    // 缓存包装后的函数
    Reflect.set(target, prop, wrappedFunc);
    return wrappedFunc;
}

/**
 * 设置对象的内部属性
 */
function setupInternalProperties(dataInstance: any): void {
    // 使用构造函数名作为类名，与装饰器保持一致
    const className = dataInstance.constructor.name;
    dataInstance.__data_id__ = `${className}-${nextId++}`;
    dataInstance.__watchers__ = new Set();

    // 定义不可枚举的内部属性，防止代码混淆问题
    Object.defineProperty(dataInstance, '__data_id__', {
        value: dataInstance.__data_id__,
        writable: false,
        enumerable: false,
        configurable: false
    });

    Object.defineProperty(dataInstance, '__watchers__', {
        value: dataInstance.__watchers__,
        writable: false,
        enumerable: false,
        configurable: false
    });

    Object.defineProperty(dataInstance, '__destroyed__', {
        value: false,
        writable: true,
        enumerable: false,
        configurable: false
    });
}

/**
 * 初始化已存在的直接子属性（不包含以_和__开头的属性，不进行深层递归）
 */
function initializeDirectProperties(dataInstance: any): void {
    for (const key in dataInstance) {
        // 跳过以_和__开头的属性和函数
        if (key.startsWith('_') || typeof dataInstance[key] === 'function') {
            continue;
        }
        const value = dataInstance[key];
        if (typeof value === 'object' && value !== null && !(value as any).__data_id__) {
            // 简单标记为已包装，但不创建深层代理
            Object.defineProperty(value, '__data_id__', {
                value: `${dataInstance.__data_id__}:${key}`,
                writable: false,
                enumerable: false,
                configurable: false
            });
        }
    }
}

export function ProxyObject(dataInstance: any) {
    const handler = {
        set: (target: any, prop: string | symbol, value: any): boolean => {
            return handlePropertySet(dataInstance, target, prop, value)
        },
        get: (target: any, prop: string | symbol, receiver: any): any => {
            return handleMethodGet(dataInstance, target, prop, receiver)
        }
    };

    setupInternalProperties(dataInstance);
    initializeDirectProperties(dataInstance);

    return new Proxy(dataInstance, handler);
}