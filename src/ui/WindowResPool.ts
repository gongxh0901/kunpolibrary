/**
 * @Author: Gongxh
 * @Date: 2024-12-13
 * @Description: 
 */

import { UIObjectFactory } from "fairygui-cc";

export interface WindowInfo {
    /** 类的构造函数 */
    ctor: any;
    /** 窗口组名 */
    group: string;
    /** fgui包名 */
    pkg: string;
    /** 窗口名 */
    name: string;
}

export interface HeaderInfo {
    ctor: any;
    pkg: string;
}

export class WindowResPool {
    /** 窗口信息池 */
    protected _windowInfos: Map<string, WindowInfo> = new Map<string, any>();
    /** 窗口header信息池 */
    protected _headerInfos: Map<string, HeaderInfo> = new Map<string, any>();

    /** 可扩展 窗口资源引用计数 */

    /**
     * 注册窗口信息
     * @param info 
     */
    public add(ctor: any, group: string, pkg: string, name: string): void {
        if (this.has(name)) {
            throw new Error(`窗口【${name}】信息已注册 请勿重复注册`);
        }
        this._windowInfos.set(name, {
            ctor: ctor,
            group: group,
            pkg: pkg,
            name: name
        });
        // 窗口组件扩展
        UIObjectFactory.setExtension(`ui://${pkg}/${name}`, ctor);
    }

    public has(name: string): boolean {
        return this._windowInfos.has(name);
    }

    public get(name: string): WindowInfo {
        if (!this.has(name)) {
            throw new Error(`窗口【${name}】未注册，请使用 _uidecorator.uiclass 注册窗口`);
        }
        return this._windowInfos.get(name);
    }

    /**
     * 注册窗口header信息
     * @param info 
     */
    public addHeader(ctor: any, pkg: string, name: string): void {
        this._headerInfos.set(name, {
            ctor: ctor,
            pkg: pkg
        });
        // 窗口header扩展
        UIObjectFactory.setExtension(`ui://${pkg}/${name}`, ctor);
    }

    public hasHeader(name: string): boolean {
        return this._headerInfos.has(name);
    }

    public getHeader(name: string): HeaderInfo {
        if (!this.hasHeader(name)) {
            throw new Error(`窗口header【${name}】未注册，请使用 _uidecorator.uiheader 注册窗口header`);
        }
        return this._headerInfos.get(name);
    }
}