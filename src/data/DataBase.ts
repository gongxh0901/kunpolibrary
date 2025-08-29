import { BindManager } from './BindManager';
import { ProxyObject } from './ProxyHandler';
import { BindInfo } from './types';

/**
 * 响应式数据基类
 * 通过 Proxy 拦截属性访问，实现零侵入式响应式数据绑定
 */
export class DataBase {
    /** 响应式对象唯一标识 */
    private __data_id__: string;
    /** 绑定器集合 */
    private __watchers__: Set<BindInfo>;
    /** 是否已销毁 */
    private __destroyed__: boolean = false;

    constructor() {
        // 返回包装后的对象，自动使用 constructor.name
        return ProxyObject(this);
    }

    /**
     * 销毁响应式对象，清理所有绑定器
     */
    public destroy(): void {
        this.__destroyed__ = true;
        this.__watchers__.clear();

        BindManager.cleanup(this);
    }

    /**
     * 获取响应式对象ID
     */
    public getDataId(): string {
        return this.__data_id__;
    }

    /**
     * 检查是否已销毁
     */
    public isDestroyed(): boolean {
        return this.__destroyed__;
    }
}