/**
 * @Author: Gongxh
 * @Date: 2024-12-13
 * @Description: 
 */

import { assetManager, resources } from "cc";
import { UIObjectFactory, UIPackage } from "fairygui-cc";
import { warn } from "../tool/log";
import { IPackageConfigRes } from "./IPackageConfig";

export interface WindowInfo {
    /** 类的构造函数 */
    ctor: any;
    /** 窗口组名 */
    group: string;
    /** fgui包名 */
    pkg: string;
    /** 窗口名 */
    name: string;
    /** bundle名 */
    bundle: string;
}

export interface HeaderInfo {
    /** 类的构造函数 */
    ctor: any;
    /** fgui包名 */
    pkg: string;
    /** bundle名 */
    bundle: string;
}

/** @internal */
export class WindowResPool {
    /** 窗口信息池 @internal */
    protected _windowInfos: Map<string, WindowInfo> = new Map<string, any>();
    /** 窗口header信息池 @internal */
    protected _headerInfos: Map<string, HeaderInfo> = new Map<string, any>();
    /** UI包所在的bundle名 */
    private _pkgBundles: Map<string, string> = new Map<string, string>();

    /** 是否设置过配置内容 @internal */
    private _isInit: boolean = false;
    /** 窗口名对应的包名列表 @internal */
    private _windowPkgs: Map<string, string[]> = new Map();
    /** 包的引用计数 @internal */
    private _pkgRefs: { [pkg: string]: number } = {};

    /** UI包路径 @internal */
    // private _uipath: string = "";
    /** UI包在bundle中的路径 @internal */
    private _uiPaths: { [bundle: string]: string } = {};

    /** 手动管理的包 @internal */
    private _manualPackages: Set<string> = new Set();
    /** 立即释放的包 @internal */
    private _imReleasePackages: Set<string> = new Set();

    /** 注册的回调函数 @internal */
    private _showWaitWindow: () => void = null;
    /** 隐藏等待窗口的回调函数 @internal */
    private _hideWaitWindow: () => void = null;
    /** 加载失败回调函数 @internal */
    private _fail: (windowName: string, errmsg: string, pkgs: string[]) => void = null;

    /** 等待窗口的引用计数 @internal */
    private _waitRef: number = 0;

    /**
     * 注册窗口信息
     * @param info 
     */
    public add(ctor: any, group: string, pkg: string, name: string, bundle: string): void {
        if (this.has(name)) {
            return;
        }
        this._windowInfos.set(name, {
            ctor: ctor,
            group: group,
            pkg: pkg,
            name: name,
            bundle: bundle
        });
        this._pkgBundles.set(pkg, bundle || "resources");
        this.addWindowPkg(name, pkg);
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
    public addHeader(ctor: any, pkg: string, name: string, bundle: string): void {
        if (this.hasHeader(name)) {
            return;
        }
        this._headerInfos.set(name, {
            ctor: ctor,
            pkg: pkg,
            bundle: bundle
        });
        this._pkgBundles.set(pkg, bundle || "resources");
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

    /** 资源配置相关接口 */
    public initPackageConfig(res: IPackageConfigRes): void {
        if (!res || !res.config) {
            return;
        }
        if (this._isInit) {
            throw new Error("资源配置已初始化，请勿重复设置");
        }
        this._isInit = true;
        this._showWaitWindow = res?.showWaitWindow;
        this._hideWaitWindow = res?.hideWaitWindow;
        this._fail = res?.fail;

        this._uiPaths = res.config?.bundlePaths || {};
        this._uiPaths["resources"] = res.config?.uiPath || "";

        for (const bundle in this._uiPaths) {
            if (this._uiPaths[bundle] != "" && !this._uiPaths[bundle].endsWith("/")) {
                this._uiPaths[bundle] += "/";
            }
        }

        this._manualPackages = new Set(res.config.manualPackages || []);
        this._imReleasePackages = new Set(res.config.imReleasePackages || []);

        let windowPkgs = res.config.linkPackages || {};
        for (const windowName in windowPkgs) {
            let pkgs = windowPkgs[windowName];
            for (const pkg of pkgs || []) {
                this.addWindowPkg(windowName, pkg);
            }
        }

        // 遍历一遍，剔除手动管理的包
        this._windowPkgs.forEach((pkgs: string[], windowName: string) => {
            for (let i = pkgs.length - 1; i >= 0; i--) {
                if (this._manualPackages.has(pkgs[i])) {
                    pkgs.splice(i, 1);
                }
            }
            if (pkgs.length <= 0) {
                this._windowPkgs.delete(windowName);
            }
        });
    }
    /** 添加窗口对应的包名 */
    public addWindowPkg(windowName: string, pkgName: string): void {
        if (!this._windowPkgs.has(windowName)) {
            this._windowPkgs.set(windowName, [pkgName]);
        } else {
            this._windowPkgs.get(windowName).push(pkgName);
        }
    }

    /** 
     * 加载窗口需要的包资源
     * @param windowName 窗口名
     */
    public loadWindowRes(windowName: string, listenter: { complete: () => void, fail: (pkgs: string[]) => void }): void {
        // 资源配置未初始化 直接返回成功
        if (!this._isInit) {
            warn(`UI包信息未配置 将手动管理所有UI包资源的加载，如果需要配置，请使用 【WindowManager.initPackageConfig】接口`);
            listenter.complete();
            return;
        }
        // 不需要包资源 直接返回成功
        if (!this.hasWindowPkg(windowName)) {
            listenter.complete();
            return;
        }
        if (this._waitRef++ <= 0) {
            // 调用注入的回调函数 用来显示等待窗
            this._showWaitWindow?.();
        }
        this.loadPackages({
            pkgs: this.getWindowPkgs(windowName),
            complete: () => {
                if (--this._waitRef <= 0) {
                    // 调用注入的回调函数 关闭等待窗
                    listenter.complete();
                    this._hideWaitWindow?.();
                }
            },
            fail: (pkgs: string[]) => {
                warn(`界面${windowName}打开失败`);
                listenter.fail(pkgs);
                this._fail?.(windowName, "UI包加载失败", pkgs);
                if (--this._waitRef <= 0) {
                    // 调用注入的回调函数 关闭等待窗
                    this._hideWaitWindow?.();
                }
            }
        });
    }

    public addResRef(windowName: string): void {
        if (!this._isInit) {
            return;
        }
        // 不需要包资源 直接返回成功
        if (!this.hasWindowPkg(windowName)) {
            return;
        }
        let pkgs = this.getWindowPkgs(windowName);
        for (const pkg of pkgs) {
            this.addRef(pkg);
        }
    }

    /**
     * 释放窗口资源
     * @param windowName 窗口名
     */
    public releaseWindowRes(windowName: string): void {
        if (!this._isInit || !this.hasWindowPkg(windowName)) {
            return;
        }
        let pkgs = this.getWindowPkgs(windowName);
        for (const pkg of pkgs) {
            this.decRef(pkg);
        }
    }

    /**
     * 加载fgui包
     * @param pkgs 包名集合
     * @param progress 进度回调
     * @param complete 加载完成回调
     */
    private loadPackages(res: { pkgs: string[], complete: () => void, fail: (pkgs: string[]) => void }): void {
        // 过滤已经加载的包
        let needLoadPkgs = res.pkgs.filter(pkg => this.getRef(pkg) <= 0);

        let successPkgs: string[] = [];
        let failPkgs: string[] = [];
        let total: number = needLoadPkgs.length;
        if (total <= 0) {
            res.complete();
            return;
        }
        for (const pkg of needLoadPkgs) {
            let bundleName = this.getPkgBundle(pkg);
            let bundle = bundleName === "resources" ? resources : assetManager.getBundle(bundleName);
            if (!bundle) {
                throw new Error(`UI包【${pkg}】所在的bundle【${bundleName}】未加载`);
            }
            UIPackage.loadPackage(bundle, this.getPkgPath(pkg), (err: any) => {
                total--;
                err ? failPkgs.push(pkg) : successPkgs.push(pkg);
                if (total > 0) {
                    return;
                }
                if (failPkgs.length > 0) {
                    res.fail(failPkgs);
                } else {
                    res.complete();
                }
            });
        }
    }

    /** 获取UI包所在的bundle名 */
    private getPkgBundle(pkg: string): string {
        return this._pkgBundles.get(pkg) || "resources";
    }

    /** 获取UI包在bundle中的路径 */
    private getPkgPath(pkg: string): string {
        let bundle = this._pkgBundles.get(pkg);
        return this._uiPaths[bundle] + pkg;
    }

    /** 获取窗口对应的包名列表 */
    private getWindowPkgs(windowName: string): string[] {
        if (this._windowPkgs.has(windowName)) {
            return this._windowPkgs.get(windowName);
        }
        return [];
    }

    private hasWindowPkg(windowName: string): boolean {
        return this._windowPkgs.has(windowName);
    }

    /** 获取包的引用计数 */
    private getRef(pkg: string): number {
        return this._pkgRefs[pkg] ? this._pkgRefs[pkg] : 0;
    }

    /** 增加包的引用计数 */
    private addRef(pkg: string): void {
        this._pkgRefs[pkg] = this.getRef(pkg) + 1;
    }

    /** 减少包的引用计数 */
    private decRef(pkg: string): void {
        this._pkgRefs[pkg] = this.getRef(pkg) - 1;
        if (this.getRef(pkg) <= 0) {
            delete this._pkgRefs[pkg];

            // 如果需要立即释放 释放包资源
            if (this._imReleasePackages.has(pkg)) {
                UIPackage.removePackage(pkg);
            }
        }
    }
}