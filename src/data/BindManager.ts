import { BindInfo } from './types';

export class BindManager {
    /** 
     * 绑定器集合
     * 键：路径
     * 值：绑定器集合
     */
    private static _bindings = new Map<string, Set<BindInfo>>();

    static addBinding(info: BindInfo): void {
        // 延迟初始化：在第一次添加绑定时确保实例已正确初始化
        this._ensureInstanceInitialized(info.target);

        if (!this._bindings.has(info.path)) {
            this._bindings.set(info.path, new Set());
        }
        this._bindings.get(info.path)!.add(info);
    }

    /**
     * 确保实例已正确初始化（延迟初始化策略）
     * 这样可以适配所有场景：独立使用、@uicom、@uiclass
     */
    private static _ensureInstanceInitialized(instance: any): void {
        // 如果已经初始化过，直接返回
        if (instance.__bindings_initialized__) {
            return;
        }
        const ctor = instance.constructor as any;
        // 生成唯一ID
        if (!instance.__data_id__) {
            instance.__data_id__ = `${ctor.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        }

        // 标记已初始化
        instance.__bindings_initialized__ = true;
    }

    static removeBinding(info: BindInfo): void {
        const pathBindings = this._bindings.get(info.path);
        if (pathBindings) {
            pathBindings.delete(info);
            if (pathBindings.size === 0) {
                this._bindings.delete(info.path);
            }
        }
    }

    static getMatchingBindings(path: string): Set<BindInfo> {
        // 直接通过路径获取绑定器集合，避免不必要的遍历
        return this._bindings.get(path) || new Set<BindInfo>();
    }

    static cleanup(target: any): void {
        const toRemove: BindInfo[] = [];

        for (const bindingSet of this._bindings.values()) {
            bindingSet.forEach(binding => {
                if (binding.target === target) {
                    toRemove.push(binding);
                }
            });
        }

        toRemove.forEach(binding => this.removeBinding(binding));
    }

    static clearAll(): void {
        this._bindings.clear();
    }

    /************** 调试用 **************/
    static getBindingsForPath(path: string): Set<BindInfo> {
        return this._bindings.get(path) || new Set();
    }

    static getTotalBindingCount(): number {
        let count = 0;
        for (const bindingSet of this._bindings.values()) {
            count += bindingSet.size;
        }
        return count;
    }

    static getAllPaths(): string[] {
        return Array.from(this._bindings.keys());
    }
    /************** 调试用 **************/
}