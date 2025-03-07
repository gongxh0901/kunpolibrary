/**
 * @Author: Gongxh
 * @Date: 2024-12-14
 * @Description: 窗口基类
 */

import { GComponent } from "fairygui-cc";
import { Screen } from "../global/Screen";
import { AdapterType, WindowType } from "../ui/header";
import { IWindow } from "../ui/IWindow";
import { IWindowHeader } from "../ui/IWindowHeader";
import { WindowHeaderInfo } from "../ui/WindowHeaderInfo";
import { WindowHeader } from "./WindowHeader";

export abstract class WindowBase extends GComponent implements IWindow {
    /** 窗口类型 */
    public type: WindowType = WindowType.Normal;
    /** 窗口适配类型 */
    public adapterType: AdapterType = AdapterType.Full;
    /** 底部遮罩的透明度 */
    public bgAlpha: number;
    /** header (内部使用) @internal */
    private _header: IWindowHeader = null;
    /** 窗口是否被遮挡了 @internal */
    private _isCover: boolean = false;
    /**
     * 初始化方法 (框架内部使用)
     * @param swallowTouch 是否吞噬触摸事件
     * @param bgAlpha 底部遮罩的透明度
     * @internal
     */
    public _init(swallowTouch: boolean, bgAlpha: number): void {
        if (swallowTouch) {
            // 吞噬触摸事件，需要一个全屏的节点, 窗口本身可能留有安全区的边
            let bgNode = new GComponent();
            bgNode.setSize(Screen.ScreenWidth, Screen.ScreenHeight, true);
            bgNode.setPivot(0.5, 0.5, true);
            bgNode.setPosition(Screen.ScreenWidth * 0.5, Screen.ScreenHeight * 0.5);
            this.addChild(bgNode);
            // 调整显示层级
            bgNode.parent.setChildIndex(bgNode, 0);
            bgNode.onClick(this.onEmptyAreaClick, this);
            bgNode.opaque = swallowTouch;
        }
        // 窗口自身也要设置是否吞噬触摸
        this.opaque = swallowTouch;
        this.bgAlpha = bgAlpha;
        this.onInit();
    }

    /**
     * 适配窗口
     * @internal
     */
    public _adapted(): void {
        this.setPosition(Screen.ScreenWidth * 0.5, Screen.ScreenHeight * 0.5);
        this.setPivot(0.5, 0.5, true);
        switch (this.adapterType) {
            case AdapterType.Full:
                this.setSize(Screen.ScreenWidth, Screen.ScreenHeight, true);
                break;
            case AdapterType.Bang:
                this.setSize(Screen.SafeWidth, Screen.SafeHeight, true);
                break;
            default:
                break;
        }
        this.onAdapted();
    }

    /** 
     * 窗口关闭 (框架内部使用)
     * @internal
     */
    public _close(): void {
        this.onClose();
        this.dispose();
    }
    /**
     * 显示窗口 (框架内部使用)
     * @param userdata 用户自定义数据
     * @internal
     */
    public _show(userdata?: any): void {
        this.visible = true;
        this.onShow(userdata);
    }
    /** 
     * 隐藏窗口 (框架内部使用)
     * @internal
     */
    public _hide(): void {
        this.visible = false;
        this.onHide();
    }
    /**
     * 从隐藏状态恢复显示
     * @internal
     */
    public _showFromHide(): void {
        this.visible = true;
        this.onShowFromHide();
    }

    /**
     * 遮挡窗口 被同组或者不同组的其他窗口覆盖 (框架内部使用)
     * @internal
     */
    public _cover(): void {
        this._isCover = true;
        this.onCover();
    }
    /**
     * 遮挡恢复窗口 被同组或者不同组的其他窗口覆盖恢复 (框架内部使用)
     * @internal
     */
    public _recover(): void {
        this._isCover = false;
        this.onRecover();
    }

    /**
     * 设置窗口深度
     * @param depth 深度
     * @internal
     */
    public _setDepth(depth: number): void {
        this.parent.setChildIndex(this, depth);
    }

    public isShowing(): boolean {
        return this.visible;
    }

    public isCover(): boolean {
        return this._isCover;
    }

    /** @internal */
    public screenResize(): void {
        this._adapted();
    }

    /**
     * 获取窗口顶部资源栏数据 默认返回空数组
     * @returns {WindowHeaderInfo[]}
     */
    public getHeaderInfo(): WindowHeaderInfo {
        return null;
    }

    public getHeader<T extends WindowHeader>(): T | null {
        return this._header as T;
    }

    /** @internal */
    public _setHeader<T extends IWindowHeader>(header: T): void {
        this._header = header;
    }

    protected abstract onAdapted(): void;

    protected abstract onInit(): void;
    protected abstract onClose(): void;

    protected abstract onShow(userdata?: any): void;
    protected abstract onShowFromHide(): void;
    protected abstract onHide(): void;

    protected abstract onCover(): void;
    protected abstract onRecover(): void;

    protected abstract onEmptyAreaClick(): void;
}