/**
 * @Author: Gongxh
 * @Date: 2024-12-08
 * @Description: 窗口组 (在同一个窗口容器的上的窗口)
 */

import { Color, warn } from "cc";
import { GComponent, GGraph, UIPackage } from "fairygui-cc";
import { WindowBase } from "../fgui/WindowBase";
import { WindowHeader } from "../fgui/WindowHeader";
import { Screen } from "../global/Screen";
import { WindowType } from "./header";
import { IWindow } from "./IWindow";
import { PropsHelper } from "./PropsHelper";
import { WindowManager } from "./WindowManager";
import { WindowInfo } from "./WindowResPool";

export class WindowGroup {
    /** 窗口组的名字 */
    private _name: string = "";
    /** 窗口组的根节点 */
    private _root: GComponent;
    /** 忽略顶部窗口查询 */
    private _ignoreQuery: boolean = false;
    /** 吞噬触摸事件 */
    private _swallowTouch: boolean = false;
    /** 窗口容器中的窗口名列表 */
    private _windowNames: string[] = [];
    /** 窗口顶部资源栏 */
    private _headers: Map<string, WindowHeader> = new Map();
    /** 半透明遮罩的透明度 */
    private _bgAlpha: number = 0;
    /** 半透明节点 */
    private _alphaGraph: GGraph;
    /** 半透明遮罩的颜色 */
    private _color: Color = new Color(0, 0, 0, 255);

    /**
     * 获取窗口组的名称。
     * @returns {string} 窗口组的名称。
     */
    public get name(): string {
        return this._name;
    }

    /**
     * 获取当前窗口组中窗口的数量。
     * @returns 窗口数量
     */
    public get size(): number {
        return this._windowNames.length;
    }

    /**
     * 获取是否忽略查询的状态。
     * @returns {boolean} 如果忽略查询，则返回 true，否则返回 false。
     */
    public get isIgnore(): boolean {
        return this._ignoreQuery;
    }

    /**
     * 实例化 
     * @param name 组名
     * @param root 窗口组的根节点 一个fgui的组件
     * @param ignoreQuery 是否忽略顶部窗口查询
     * @param swallowTouch 是否吞掉触摸事件
     */
    constructor(name: string, root: GComponent, ignoreQuery: boolean, swallowTouch: boolean, bgAlpha: number) {
        this._name = name;
        this._root = root;
        this._ignoreQuery = ignoreQuery;
        this._swallowTouch = swallowTouch;
        this._bgAlpha = bgAlpha;

        const alphaGraph = new GGraph();
        alphaGraph.touchable = false;
        alphaGraph.name = "bgAlpha";
        alphaGraph.setPosition(root.width * 0.5, root.height * 0.5);
        alphaGraph.setSize(root.width, root.height, true);
        alphaGraph.setPivot(0.5, 0.5, true);
        root.addChild(alphaGraph);
        this._alphaGraph = alphaGraph;
    }

    /**
     * 根据窗口名创建窗口 并添加到显示节点
     * @param windowName 窗口名
     */
    private _createWindow(pkg: string, name: string): WindowBase {
        let window = UIPackage.createObject(pkg, name) as WindowBase;
        window.name = name;
        PropsHelper.serializeProps(window, pkg);
        window._init(this._swallowTouch, this._bgAlpha);
        window._adapted();
        this._createHeader(window);
        // 添加到显示节点
        this._addWindow(window);
        return window;
    }

    private _addWindow(window: WindowBase): void {
        this._root.addChild(window);
        WindowManager._addWindow(window.name, window);
    }

    public showWindow(info: WindowInfo, userdata?: any): void {
        let name = info.name;
        let window = WindowManager.getWindow(name);
        if (window) {
            window._show(userdata);
        } else {
            window = this._createWindow(info.pkg, name);
            this._processWindowCloseStatus(window);
            this._windowNames.push(name);
            window._show(userdata);
        }
        this._moveWindowToTop(name);
        // 处理header的显示
        this._processHeaderStatus();
        // 显示窗口组
        this._root.visible = true;
    }

    /**
     * 移除指定名称的窗口。
     * @param name 窗口的名称。
     */
    public _removeWindow(name: string): void {
        let index = this._windowNames.lastIndexOf(name);
        let lastIndex = this.size - 1;
        if (index < 0) {
            warn(`窗口组${this._name}中未找到窗口${name} 删除失败`);
            return;
        }
        let window = WindowManager.getWindow<WindowBase>(name);
        let header = window.getHeader();
        header && this._removeHeader(header);

        this._windowNames.splice(index, 1);

        // 关闭窗口 并从窗口map中移除
        WindowManager._removeWindow(name);

        // 处理窗口显示和隐藏状态
        this._processWindowHideStatus(this.size - 1, true);
        if (this.size == 0) {
            // 窗口组中不存在窗口时 隐藏窗口组节点
            this._root.visible = false;
        } else if (lastIndex == index && index > 0) {
            // 删除的窗口是最后一个 并且前边还有窗口 调整半透明节点的显示层级
            let topName = this.getTopWindowName();
            let window = WindowManager.getWindow(topName);
            // 调整半透明遮罩
            this._adjustAlphaGraph(window);
            // 调整窗口的显示层级
            window._setDepth(this._root.numChildren - 1);
        }
        this._processHeaderStatus();
    }

    /**
     * 将指定名称的窗口移动到窗口组的最顶层。
     * @param name 窗口的名称。
     */
    public _moveWindowToTop(name: string): boolean {
        let isMoved = false;
        if (this.size == 0) {
            warn(`WindowGroup.moveWindowToTop: window group 【${this._name}】 is empty`);
            return;
        }
        if (this._windowNames[this.size - 1] == name) {
            // 已经在最顶层了
        } else {
            const index = this._windowNames.indexOf(name);
            if (index == -1) {
                warn(`WindowGroup.moveWindowToTop: window 【${name}】 not found in window group 【${this._name}】`);
                return;
            }
            if (index < this._windowNames.length - 1) {
                this._windowNames.splice(index, 1);
                // 放到数组的末尾
                this._windowNames.push(name);
                isMoved = true;
            }
        }

        let window = WindowManager.getWindow(name);
        // 先调整半透明遮罩
        this._adjustAlphaGraph(window);
        // 再调整窗口的显示层级
        window._setDepth(this._root.numChildren - 1);
        // 处理窗口显示和隐藏状态
        this._processWindowHideStatus(this.size - 1, isMoved);
    }

    /**
     * 处理index下层窗口的隐藏状态的私有方法。递归调用
     * @param index - 窗口索引
     * @param isRecursion - 是否递归调用
     */
    private _processWindowHideStatus(index: number, isRecursion: boolean = true): void {
        if (index < 0) {
            return;
        }
        let windowName = this._windowNames[index];
        let curWindow = WindowManager.getWindow(windowName);
        // 如果当前是当前组中的最后一个窗口并且当前窗口是隐藏状态 则恢复隐藏
        if (index == this.size - 1 && !curWindow.isShowing()) {
            curWindow._showFromHide();
        }
        if (index == 0) {
            return;
        }
        let windowType = curWindow.type;
        if (windowType == WindowType.HideAll) {
            for (let i = index - 1; i >= 0; --i) {
                let name = this._windowNames[i];
                const window = WindowManager.getWindow(name);
                window.isShowing() && window._hide();
            }
            return;
        } else if (windowType == WindowType.HideOne) {
            // 隐藏前一个
            let prevWindowName = this._windowNames[index - 1];
            let prevWindow = WindowManager.getWindow(prevWindowName);
            prevWindow.isShowing() && prevWindow._hide();
        } else {
            // 如果前一个窗口被隐藏了 需要恢复显示
            let prevWindowName = this._windowNames[index - 1];
            let prevWindow = WindowManager.getWindow(prevWindowName);
            !prevWindow.isShowing() && prevWindow._showFromHide();
        }
        isRecursion && this._processWindowHideStatus(index - 1, isRecursion);
    }

    /**
     * 新创建窗口时，根据新创建的窗口类型
     * 处理上一个窗口或者所有窗口的关闭
     */
    private _processWindowCloseStatus(window: IWindow): void {
        // 新创建窗口 如果需要关闭窗口或者关闭所有窗口 处理窗口的关闭
        if (window.type == WindowType.CloseOne) {
            let size = this.size;
            while (size > 0) {
                let name = this._windowNames.pop();
                let window = WindowManager.getWindow<WindowBase>(name);
                let header = window.getHeader();
                header && this._removeHeader(header);
                WindowManager._removeWindow(name);
                break;
            }
        } else if (window.type == WindowType.CloseAll) {
            let size = this.size;
            for (let i = size; i > 0;) {
                let name = this._windowNames[--i]
                let window = WindowManager.getWindow<WindowBase>(name);
                let header = window.getHeader();
                header && this._removeHeader(header);
                WindowManager._removeWindow(name);
            }
            this._windowNames.length = 0;
        }
    }

    /** 处理header的显示状态 并调整层级 */
    private _processHeaderStatus(): void {
        // 找到第一个要显示的header
        let firstHeader: WindowHeader = null;
        let firstWindow: IWindow = null;
        let index = this.size - 1;
        for (let i = this.size - 1; i >= 0; --i) {
            let name = this._windowNames[i];
            let window = WindowManager.getWindow<WindowBase>(name);;
            if (window.isShowing() && window.getHeader()) {
                firstWindow = window;
                firstHeader = window.getHeader();
                index = i;
                break;
            }
        }
        this._headers.forEach((header, name) => {
            this._root.setChildIndex(header, 0);
            if (!firstHeader && header.visible) {
                header._hide();
            } else if (firstHeader) {
                if (firstHeader.name == name && !header.visible) {
                    header._show(firstWindow);
                } else if (firstHeader.name != name && header.visible) {
                    header._hide();
                }
            }
        });
        if (firstHeader) {
            if (index == this.size - 1) {
                this._root.setChildIndex(firstHeader, this._root.numChildren - 1);
            } else {
                this._root.setChildIndex(firstHeader, this._root.numChildren - this.size + index - 1);
            }
        }
    }

    /**
     * 调整指定窗口的透明度图形。并根据窗口的背景透明度绘制半透明遮罩。
     * @param window - 需要调整透明度的窗口对象。
     */
    private _adjustAlphaGraph(window: IWindow): void {
        this._root.setChildIndex(this._alphaGraph, this._root.numChildren - 1);

        // 半透明遮罩绘制
        this._color.a = window.bgAlpha * 255;
        this._alphaGraph.clearGraphics();
        this._alphaGraph.drawRect(0, this._color, this._color);
    }

    public hasWindow(name: string): boolean {
        return this._windowNames.indexOf(name) >= 0;
    }

    /**
     * 获取窗口组中顶部窗口的名称。
     * @returns {string} 顶部窗口的名称。
     */
    public getTopWindowName(): string {
        if (this.size > 0) {
            return this._windowNames[this.size - 1];
        }
        warn(`WindowGroup.getTopWindowName: window group 【${this._name}】 is empty`);
    }


    /** 根据窗口 创建顶部资源栏 (内部方法) */
    private _createHeader(window: IWindow): void {
        // 只有创建界面的时候, 才会尝试创建顶部资源栏
        let headerInfo = window.getHeaderInfo();
        if (!headerInfo) {
            return;
        }
        let name = headerInfo.name;
        let header = this._getHeader(name);
        if (header) {
            window.setHeader(header);
            header._addRef();
        } else {
            // 创建header节点
            let { pkg } = WindowManager._getResPool().getHeader(name);
            let newHeader = UIPackage.createObject(pkg, name) as WindowHeader;
            newHeader.name = name;
            newHeader.opaque = false;
            window.setHeader(newHeader);
            newHeader.visible = false;
            PropsHelper.serializeProps(newHeader, pkg);
            newHeader._init();
            newHeader._adapted();
            this._root.addChild(newHeader);
            // 添加到显示节点
            newHeader._addRef();
            this._headers.set(newHeader.name, newHeader);
        }
    }

    /**
     * 顶部资源栏窗口 从管理器中移除 (内部方法)
     * @param header 资源栏
     */
    public _removeHeader(header: WindowHeader): void {
        if (this._headers.has(header.name)) {
            let refCount = header._decRef();
            if (refCount <= 0) {
                this._headers.delete(header.name);
                header._close();
            }
        }
    }

    /**
     * 获取顶部资源栏 (内部方法)
     * @param name 资源栏的名称
     */
    public _getHeader<T extends WindowHeader>(name: string): T | null {
        return this._headers.get(name) as T;
    }

    /** 屏幕大小改变时被调用 (内部方法) */
    public _screenResize(): void {
        this._headers.forEach((header) => {
            header._screenResize();
        });
        this._alphaGraph.setPosition(Screen.ScreenWidth * 0.5, Screen.ScreenHeight * 0.5);
        this._alphaGraph.setSize(Screen.ScreenWidth, Screen.ScreenHeight, true);
        this._alphaGraph.setPivot(0.5, 0.5, true);
    }
}
