/**
 * @Author: Gongxh
 * @Date: 2024-12-11
 * @Description: UI 装饰器
 */

import { ObjectHelper } from "../tool/helper/ObjectHelper";
export namespace _uidecorator {
    /** @internal */
    const UIPropMeta = "__uipropmeta__"
    /** @internal */
    const UICBMeta = "__uicbmeta__"


    /** @internal */
    interface IUIInfoBase {
        /** 构造函数 */
        ctor: any;
        /** 属性 */
        props: Record<string, 1>;
        /** 方法 */
        callbacks: Record<string, Function>;
    }

    /**
     * 窗口属性注册数据结构
     * @internal
     */
    interface UIWindowInfo extends IUIInfoBase {
        /** 配置信息 */
        res: {
            /** 窗口组名称 */
            group: string;
            /** fgui包名 */
            pkg: string;
            /** 窗口名 */
            name: string;
        };
    }
    /** 用来存储窗口注册信息 @internal */
    const uiclassMap: Map<any, UIWindowInfo> = new Map();

    /** 获取窗口注册信息 */
    export function getWindowMaps(): Map<any, UIWindowInfo> {
        return uiclassMap;
    }

    /**
     * 窗口装饰器
     * @param {string} groupName 窗口组名称
     * @param {string} pkgName fgui包名
     * @param {string} name 窗口名 (与fgui中的组件名一一对应)
     */
    export function uiclass(groupName: string, pkgName: string, name: string): Function {
        /** target 类的构造函数 */
        return function (ctor: any): void {
            // debug(`uiclass >${JSON.stringify(res)}<`);
            // debug(`uiclass prop >${JSON.stringify(ctor[UIPropMeta] || {})}<`);
            uiclassMap.set(ctor, {
                ctor: ctor,
                props: ctor[UIPropMeta] || null,
                callbacks: ctor[UICBMeta] || null,
                res: {
                    group: groupName,
                    pkg: pkgName,
                    name: name,
                },
            });
        };
    }


    /**
     * 组件属性注册数据结构
     * @internal
     */
    interface IUIComInfo extends IUIInfoBase {
        /** 配置信息 */
        res: {
            /** fgui包名 */
            pkg: string;
            /** 组件名 */
            name: string;
        };
    }
    /** 用来存储组件注册信息 @internal */
    let uicomponentMap: Map<string, IUIComInfo> = new Map();

    /** 获取组件注册信息 */
    export function getComponentMaps(): Map<any, IUIComInfo> {
        return uicomponentMap;
    }

    /**
     * UI组件装饰器
     * @param {string} pkg 包名
     * @param {string} name 组件名
     */
    export function uicom(pkg: string, name: string): Function {
        return function (ctor: any): void {
            // log(`pkg:【${pkg}】 uicom prop >${JSON.stringify(ctor[UIPropMeta] || {})}<`);
            uicomponentMap.set(ctor, {
                ctor: ctor,
                props: ctor[UIPropMeta] || null,
                callbacks: ctor[UICBMeta] || null,
                res: {
                    pkg: pkg,
                    name: name,
                }
            });
        };
    }

    /**
     * header属性注册数据结构
     * @internal
     */
    interface IUIHeaderInfo extends IUIInfoBase {
        /** 配置信息 */
        res: {
            /** fgui包名 */
            pkg: string;
            /** 组件名 */
            name: string;
        };
    }
    /** 用来存储组件注册信息 @internal */
    let uiheaderMap: Map<string, IUIHeaderInfo> = new Map();

    /** 获取header注册信息 */
    export function getHeaderMaps(): Map<any, IUIHeaderInfo> {
        return uiheaderMap;
    }

    /**
     * UI header装饰器
     * @param {string} pkg 包名
     * @param {string} name 组件名
     */
    export function uiheader(pkg: string, name: string): Function {
        return function (ctor: any): void {
            // log(`pkg:【${pkg}】 uiheader prop >${JSON.stringify(ctor[UIPropMeta] || {})}<`);
            uiheaderMap.set(ctor, {
                ctor: ctor,
                props: ctor[UIPropMeta] || null,
                callbacks: ctor[UICBMeta] || null,
                res: {
                    pkg: pkg,
                    name: name,
                }
            });
        };
    }

    /**
     * UI属性装饰器
     * @param {Object} target 实例成员的类的原型
     * @param {string} name 属性名
     * 
     * example: @uiprop node: GObject
     */
    export function uiprop(target: Object, name: string): any {
        // debug("属性装饰器:", target.constructor, name);
        ObjectHelper.getObjectProp(target.constructor, UIPropMeta)[name] = 1;
    }

    /**
     * 方法装饰器 (给点击事件用)
     * @param {Object} target 实例成员的类的原型
     * @param {string} name 方法名
     */
    export function uiclick(target: Object, name: string, descriptor: PropertyDescriptor): void {
        // debug("方法装饰器:", target.constructor, name, descriptor);
        ObjectHelper.getObjectProp(target.constructor, UICBMeta)[name] = descriptor.value;
    }
}

let _global = globalThis || window || global;
(_global as any)["getKunpoRegisterWindowMaps"] = function () {
    return _uidecorator.getWindowMaps() as any;
};
(_global as any)["getKunpoRegisterComponentMaps"] = function () {
    return _uidecorator.getComponentMaps() as any;
};
(_global as any)["getKunpoRegisterHeaderMaps"] = function () {
    return _uidecorator.getHeaderMaps() as any;
};