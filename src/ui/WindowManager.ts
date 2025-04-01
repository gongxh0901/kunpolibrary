/**
 * @Author: Gongxh
 * @Date: 2024-12-07
 * @Description: 窗口管理类
 */

import { debug, warn } from "../tool/log";
import { ComponentExtendHelper } from "./ComponentExtendHelper";
import { IPackageConfigRes } from "./IPackageConfig";
import { IWindow } from "./IWindow";
import { _uidecorator } from "./UIDecorator";
import { WindowGroup } from "./WindowGroup";
import { WindowResPool } from "./WindowResPool";

export class WindowManager {
    /** 窗口组 @internal */
    private static _groups: Map<string, WindowGroup> = new Map();
    /** 不忽略查询的窗口组名 @internal */
    private static _queryGroupNames: string[] = [];
    /** 所有窗口全部放到这个map中 @internal */
    private static _windows: Map<string, IWindow> = new Map();
    /** 初始化时传入实例 @internal */
    private static _resPool: WindowResPool;

    /** 配置UI包的一些信息 (可以不配置 完全手动管理) */
    public static initPackageConfig(res: IPackageConfigRes): void {
        this._resPool.initPackageConfig(res);
    }

    /**
     * 异步打开一个窗口 (如果UI包的资源未加载, 会自动加载 配合 WindowManager.initPackageConfig一起使用)
     * @param windowName 窗口名
     * @param userdata 用户数据
     */
    public static showWindow(windowName: string, userdata?: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this._resPool.loadWindowRes(windowName, {
                complete: () => {
                    this.showWindowIm(windowName, userdata);
                    resolve();
                },
                fail: (pkgs: string[]) => {
                    reject(pkgs);
                }
            });
        });
    }

    /**
     * 显示指定名称的窗口，并传递可选的用户数据。(用于已加载过资源的窗口)
     * @param windowName - 窗口的名称。
     * @param userdata - 可选参数，用于传递给窗口的用户数据。
     */
    public static showWindowIm(windowName: string, userdata?: any): void {
        const info = this._resPool.get(windowName);
        const windowGroup = this.getWindowGroup(info.group);
        this._resPool.addResRef(windowName);
        windowGroup.showWindow(info, userdata);
    }

    /**
     * 关闭窗口
     * @param windowName 窗口名
     */
    public static closeWindow(windowName: string): void {
        if (!this._windows.has(windowName)) {
            warn(`窗口不存在 ${windowName} 不需要关闭`);
            return;
        }
        // 先在窗口组中移除
        let info = this._resPool.get(windowName);
        const windowGroup = this.getWindowGroup(info.group);
        windowGroup._removeWindow(windowName);
        // 窗口组中没有窗口了
        if (windowGroup.size == 0) {
            let index = this._queryGroupNames.indexOf(windowGroup.name);
            if (index > 0 && windowGroup.name == this.getTopGroupName()) {
                do {
                    const groupName = this._queryGroupNames[--index];
                    let group = this.getWindowGroup(groupName);
                    if (group.size > 0) {
                        this.getWindow(group.getTopWindowName())._recover();
                        break;
                    }
                } while (index >= 0);
            }
        }
    }

    /**
     * 关闭所有窗口
     * @param ignoreNames 忽略关闭的窗口名
     */
    public static closeAllWindow(ignoreNames: string[] = []): void {
        let existIgnore = ignoreNames.length > 0;
        this._windows.forEach((window: IWindow, name: string) => {
            if (!existIgnore) {
                this.closeWindow(name);
            } else if (!ignoreNames.includes(name)) {
                this.closeWindow(name);
            }
        });

        if (!existIgnore) {
            this._windows.clear();
        }
    }

    /**
     * 获取当前最顶层的窗口实例。
     * @template T - 窗口实例的类型，必须继承自 IWindow 接口。
     * @returns {T | null} - 返回最顶层的窗口实例，如果没有找到则返回 null。
     * @description 该方法会遍历所有窗口组，找到最顶层的窗口并返回其实例。
     */
    public static getTopWindow<T extends IWindow>(): T | null {
        let len = this._queryGroupNames.length;
        for (let i = len; i > 0;) {
            let group = this.getWindowGroup(this._queryGroupNames[--i]);
            if (group.size > 0) {
                return this.getWindow<T>(group.getTopWindowName());
            }
        }
        return null;
    }

    /**
     * 根据窗口名称获取窗口实例。
     * @template T 窗口类型，必须继承自IWindow接口。
     * @param name 窗口的名称。
     * @returns 如果找到窗口，则返回对应类型的窗口实例；否则返回null。
     */
    public static getWindow<T extends IWindow>(name: string): T | null {
        return this._windows.get(name) as T;
    }

    /**
     * 检查是否存在指定名称的窗口。
     * @param name 窗口的名称。
     * @returns 如果存在指定名称的窗口，则返回 true，否则返回 false。
     */
    public static hasWindow(name: string): boolean {
        return this._windows.has(name);
    }

    /**
     * 根据给定的组名获取窗口组。如果组不存在，则抛出错误。
     * @param groupName 窗口组的名称。
     * @returns 返回找到的窗口组。
     */
    public static getWindowGroup(groupName: string): WindowGroup {
        if (this._groups.has(groupName)) {
            return this._groups.get(groupName);
        }
        throw new Error(`WindowManager.getWindowGroup: window group 【${groupName}】 not found`);
    }


    /**
     * 获取当前顶层窗口组的名称。
     * 返回第一个包含至少一个窗口的窗口组名称。(该方法只检查不忽略查询的窗口组)
     * 如果没有找到任何包含窗口的组，则返回空字符串。
     */
    public static getTopGroupName(): string {
        let len = this._queryGroupNames.length;
        for (let i = len - 1; i >= 0; i--) {
            let name = this._queryGroupNames[i];
            let group = this._groups.get(name);
            if (group.size > 0) {
                return name;
            }
        }
        return "";
    }

    /**
     * 初始化窗口管理器，设置资源池。 （框架内部使用）
     * @param resPool - 窗口资源池实例。
     * @internal
     */
    public static _init(resPool: WindowResPool): void {
        this._resPool = resPool;
    }

    /**
     * 向窗口管理器添加一个新窗口。 (框架内部使用)
     * @param name 窗口的唯一标识符。
     * @param window 要添加的窗口对象，需实现 IWindow 接口。
     * @internal
     */
    public static _addWindow(name: string, window: IWindow): void {
        this._windows.set(name, window);
    }

    /**
     * 移除指定名称的窗口。 (框架内部使用)
     * @param name 窗口的名称。
     * @internal
     */
    public static _removeWindow(name: string): void {
        if (this.hasWindow(name)) {
            this._windows.get(name)._close();
            this._windows.delete(name);
            this._resPool.releaseWindowRes(name);
        }
    }

    /**
     * 注册所有UI窗口类到资源池中。 （框架内部使用）
     * 该方法遍历所有通过_uidecorator.getWindowMaps()获取的窗口映射，
     * 并将每个窗口的资源名称、构造函数、分组和包信息添加到资源池中。
     */
    public static registerUI(): void {
        // 窗口注册
        for (const { ctor, res } of _uidecorator.getWindowMaps().values()) {
            debug(`窗口注册  窗口名:${res.name} 包名:${res.pkg} 组名:${res.group}`);
            this._resPool.add(ctor, res.group, res.pkg, res.name);

        }
        // 窗口header注册
        for (const { ctor, res } of _uidecorator.getHeaderMaps().values()) {
            debug(`header注册  header名:${res.name} 包名:${res.pkg}`);
            this._resPool.addHeader(ctor, res.pkg, res.name);
        }
        // 组件注册
        ComponentExtendHelper.register();
    }

    /**
     * 向窗口管理器添加一个窗口组 如果窗口组名称已存在，则抛出错误. (内部方法)
     * @param group 要添加的窗口组
     * @internal
     */
    public static _addWindowGroup(group: WindowGroup): void {
        if (this._groups.has(group.name)) {
            throw new Error(`WindowManager._addWindowGroup: window group 【${group.name}】 already exists`);
        }
        this._groups.set(group.name, group);
        // 不忽略查询 加到列表中
        !group.isIgnore && this._queryGroupNames.push(group.name);
    }

    /**
     * 屏幕大小改变时 调用所有窗口的screenResize方法 (内部方法)
     * @internal
     */
    public static _screenResize(): void {
        this._windows.forEach((window: IWindow) => {
            window.screenResize();
        });
        this._groups.forEach((group: WindowGroup) => {
            group._screenResize();
        });
    }

    /**
     * 获取资源池实例 (内部方法)
     * @returns {WindowResPool} 资源池实例
     * @internal
     */
    public static _getResPool(): WindowResPool {
        return this._resPool;
    }
}
