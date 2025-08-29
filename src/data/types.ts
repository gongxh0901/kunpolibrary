/**
 * 绑定器信息
 */
export interface BindInfo {
    /** 监听目标对象 */
    target: any;
    /** 属性或方法名 */
    prop: string | symbol;
    /** 监听的路径 */
    path: string;
    /** 回调函数 */
    callback: Function;
    /** 是否立即更新 */
    immediate: boolean;
    /** 是否为方法监听 */
    isMethod: boolean;
}

/**
 * 路径变化事件
 */
export interface IDataEvent {
    /** 变化的属性路径 */
    path: string;
    /** 目标对象 */
    target: any;
    /** 是否是属性变化 */
    isProp?: boolean;
    /** 变化后的值 */
    value?: any;
}