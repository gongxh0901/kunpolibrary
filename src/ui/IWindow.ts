/**
 * @Author: Gongxh
 * @Date: 2024-12-08
 * @Description: 
 */

import { AdapterType, WindowType } from "./header";
import { IWindowHeader } from "./IWindowHeader";
import { WindowHeaderInfo } from "./WindowHeaderInfo";

export interface IWindow {
    /** 窗口类型 */
    type: WindowType;
    /** 窗口适配类型 */
    adapterType: AdapterType;
    /** 底部遮罩的透明度 */
    bgAlpha: number;
    /**
     * 窗口适配  (框架内部使用)
     */
    _adapted(): void;

    /**
     * 初始化方法 (框架内部使用)
     * @param swallowTouch 是否吞噬触摸事件
     */
    _init(swallowTouch: boolean, bgAlpha: number): void;
    /** 
     * 窗口关闭 (框架内部使用)
     */
    _close(): void;
    /**
     * 显示窗口 (框架内部使用)
     * @param userdata 用户自定义数据
     */
    _show(userdata?: any): void;
    /**
     * 从隐藏状态恢复显示
     */
    _showFromHide(): void;
    /** 
     * 隐藏窗口 (框架内部使用)
     */
    _hide(): void;
    /**
     * 窗口被遮挡 被同组或者不同组的其他窗口覆盖 (框架内部使用)
     */
    _cover(): void;
    /**
     * 恢复窗口遮挡 被同组或者不同组的其他窗口覆盖恢复 (框架内部使用)
     */
    _recover(): void;

    /**
     * 调整窗口的显示层级
     * @param depth 
     */
    _setDepth(depth: number): void;

    /**
     * 窗口是否显示
     */
    isShowing(): boolean;

    /**
     * 窗口是否被遮挡了
     */
    isCover(): boolean;

    /** 
     * 窗口尺寸发生改变时被调用 
     */
    screenResize(): void;

    /** 获取资源栏数据 */
    getHeaderInfo(): WindowHeaderInfo;

    setHeader(header: IWindowHeader): void;
}