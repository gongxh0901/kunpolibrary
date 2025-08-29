import { BindManager } from './BindManager';
import { DataBase } from './DataBase';
import { BindInfo } from './types';

export namespace data {
    /**
     * @bindAPI 装饰器元数据存储键
     */
    const BIND_METADATA_KEY = Symbol('__bind_metadata__');

    /**
     * 为实例初始化绑定器（在装饰器收集完所有绑定信息后调用）
     * @param instance 目标实例
     */
    export function initializeBindings(instance: any) {
        const ctor = instance.constructor as any;
        const binds = ctor[BIND_METADATA_KEY] || [];

        for (const info of binds) {
            const bindInfo: BindInfo = {
                target: instance,
                prop: info.prop,
                callback: info.isMethod ? instance[info.prop].bind(instance) : info.callback.bind(instance),
                path: info.path,
                immediate: info.immediate,
                isMethod: info.isMethod
            };
            // 注册到全局绑定器管理器（BindManager 会自动处理延迟初始化）
            BindManager.addBinding(bindInfo);
        }
    }

    /**
     * 强类型属性绑定装饰器
     * 
     * @param dataClass 显示传入数据类，用于获取类名
     * @param selector 类型安全的路径选择器函数
     * @param callback.item: 当前装饰的类属性 
     * @param callback.value: 如果绑定的是数据属性，则value为数据属性值，否则为undefined  
     * @param callback.data: 数据类实例
     * @param immediate 是否立即触发，默认true
     */
    export function bindProp<T extends DataBase>(dataClass: new () => T, selector: (data: T) => any, callback: (item: any, value?: any, data?: T) => void, immediate: boolean = false) {
        return function (target: any, prop: string | symbol) {
            // 解析路径
            const path = `${dataClass.name}:${extractPathFromSelector(selector)}`;
            // console.log('绑定属性的监听路径', path);

            let ctor = target.constructor;
            // 存储绑定元数据
            ctor[BIND_METADATA_KEY] = ctor[BIND_METADATA_KEY] || [];
            ctor[BIND_METADATA_KEY].push({
                target: null,
                prop,
                callback,
                path: path,
                immediate,
                isMethod: false
            });
        };
    }

    /**
     * 强类型方法绑定装饰器
     * 在编译期验证路径有效性，防止重构时出现绑定失效
     * 
     * @param dataClass 显示传入数据类，用于获取类名
     * @param selector 类型安全的路径选择器函数
     * @param immediate 是否立即触发，默认false
     */
    export function bindMethod<T extends DataBase>(dataClass: new () => T, selector: (data: T) => any, immediate: boolean = false) {
        return function (target: any, method: string | symbol, descriptor?: PropertyDescriptor) {
            // 解析路径
            const path = `${dataClass.name}:${extractPathFromSelector(selector)}`;
            // console.log('绑定方法的监听路径', path);
            // 存储绑定元数据
            let ctor = target.constructor;
            ctor[BIND_METADATA_KEY] = ctor[BIND_METADATA_KEY] || [];

            ctor[BIND_METADATA_KEY].push({
                target: null,
                prop: method,
                callback: descriptor!.value,
                path: path,
                immediate,
                isMethod: true
            });
            return descriptor;
        };
    }

    /**
     * 从选择器函数中提取路径字符串
     * 这是运行时路径解析，配合TypeScript编译期检查使用
     */
    function extractPathFromSelector(selector: Function): string {
        const fnString = selector.toString();

        // 匹配箭头函数: data => data.property.path
        let match = fnString.match(/\w+\s*=>\s*\w+\.(.+)/);

        if (!match) {
            // 匹配普通函数: function(data) { return data.property.path; }
            match = fnString.match(/return\s+\w+\.(.+);?\s*}/);
        }

        if (!match) {
            throw new Error('无效的路径选择器函数，请使用 data => data.property.path 或 function(data) { return data.property.path; } 的形式');
        }

        return match[1].trim();
    }

    /**
     * 手动清理目标对象的所有绑定器
     * @param target 目标对象
     */
    export function cleanupBindings(target: any): void {
        BindManager.cleanup(target);

        if (target.__watchers__) {
            target.__watchers__.clear();
        }
    }
}