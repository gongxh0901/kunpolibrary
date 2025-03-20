/**
 * @Author: Gongxh
 * @Date: 2025-03-20
 * @Description: 热更新管理器
 */

import { Asset, game, native, sys } from "cc";
import { Platform } from "../global/Platform";
import { log, warn } from "../tool/log";

const TAG = "hotupdate:";

export class HotUpdateManager {
    private static instance: HotUpdateManager;
    public static getInstance(): HotUpdateManager {
        if (!HotUpdateManager.instance) {
            HotUpdateManager.instance = new HotUpdateManager();
        }
        return HotUpdateManager.instance;
    }

    /** 版本号 */
    private _version: string = '';
    /** 可写路径 */
    private _writablePath: string = '';
    /** 资源管理器 */
    private _am: native.AssetsManager = null;
    /** 是否正在更新 或者 正在检查更新 */
    private _updating: boolean = false;

    /** 检查更新的回调 */
    private _checkSucceed: (need: boolean, size: number) => void = null;
    private _checkFail: (code: number, message: string) => void = null;

    /** 更新回调 */
    private _updateProgress: (kb: number, total: number) => void = null;
    private _updateFail: (code: number, message: string) => void = null;
    private _updateError: (code: number, message: string) => void = null;
    /**
     * 1. 初始化热更新管理器
     * @param manifest 传入manifest文件
     * @param version 传入游戏版本号 eg: 1.0.0
     */
    public init(manifest: Asset, version: string): void {
        if (!Platform.isNativeMobile) {
            return;
        }
        if (this._am) {
            warn(`${TAG}请勿重复初始化`);
            return;
        }
        this._version = version;

        let writablePath = native?.fileUtils?.getWritablePath() || "";
        if (!writablePath.endsWith("/")) {
            writablePath += "/";
        }
        this._writablePath = `${writablePath}hot-update/${version}/`;
        log(`${TAG}可写路径:${this._writablePath}`);

        // 创建 am 对象
        this._am = native.AssetsManager.create("", this._writablePath);
        this._am.setVersionCompareHandle(this._versionCompareHandle);
        this._am.setVerifyCallback(this._verifyCallback);
        // 加载本地的 manifest
        log(`${TAG} 加载本地的 manifest:${manifest.nativeUrl}`);
        this._am.loadLocalManifest(manifest.nativeUrl);
    }

    /** 
     * 2. 检查是否有新的热更版本
     * @param res.succeed.need 是否需要更新
     * @param res.succeed.size 需要更新的资源大小 (KB)
     * 
     * @param res.fail 检查失败的回调 
     * @param res.fail.code
     * -1000: 未初始化 
     * -1001: 正在更新或者正在检查更新
     * -1002: 本地manifest文件错误
     * -1004: 解析远程manifest文件失败
     */
    public checkUpdate(res: { succeed: (need: boolean, size: number) => void, fail: (code: number, message: string) => void }): void {
        this._checkSucceed = res.succeed;
        this._checkFail = res.fail;
        if (this._updating) {
            res.fail(-1001, "正在更新或者正在检查更新");
            return;
        }
        if (!Platform.isNativeMobile) {
            res.succeed(false, 0);
            return;
        }
        if (!this._am) {
            res.fail(-1000, "未初始化, 需要先调用init方法");
            return;
        }
        this._updating = true;
        // 设置回调
        this._am.setEventCallback(this._checkCb.bind(this));
        // 检查更新
        this._am.checkUpdate();
    }

    /**
     * 3. 开始热更新
     * @param res.progress 更新进度回调 kb: 已下载的资源大小, total: 总资源大小 (kb)
     * @param res.fail 更新失败 可以重试
     * @param res.fail.code 更新失败错误码
     * -10001: 更新失败 需要重试
     * @param res.error 更新错误 无法重试
     * @param res.error.code 更新错误错误码
     * -1000: 未初始化
     * -1001: 正在更新或者正在检查更新
     * -10002: 资源更新错误
     * -10003: 解压错误
     */
    public startUpdate(res: {
        progress: (kb: number, total: number) => void,
        fail: (code: number, message: string) => void,
        error: (code: number, message: string) => void
    }): void {
        this._updateProgress = res.progress;
        this._updateFail = res.fail;
        this._updateError = res.error;

        log(`${TAG} 开始热更新`);
        if (this._updating) {
            res.error(-1001, "正在更新或者正在检查更新");
            return;
        }
        if (!this._am) {
            res.error(-1000, "未初始化, 需要先调用init方法");
            return;
        }
        this._updating = true;
        this._am.setEventCallback(this._updateCb.bind(this));
        this._am.update();
    }

    /** 重试失败的资源 */
    public retryUpdate(): void {
        this._am.downloadFailedAssets();
    }

    /** 检查更新的回调 */
    private _checkCb(event: native.EventAssetsManager) {
        let eventCode = event.getEventCode();
        log(`${TAG} 检查更新回调code:${eventCode}`);
        this._updating = false;
        switch (eventCode) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this._checkFail(-1002, "本地没有manifest文件");
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                // this._checkFail(-1003, "下载manifest文件失败");
                this._checkSucceed(false, 0);
                break;
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this._checkFail(-1004, "解析远程manifest文件失败");
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                this._checkSucceed(false, 0);
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                // 发现新版本
                this._checkSucceed(true, this._am.getTotalBytes() / 1024);
                break;
            default:
                return;
        }
        this._am.setEventCallback(null);
    }

    /** 更新的回调 */
    private _updateCb(event: native.EventAssetsManager) {
        let eventCode = event.getEventCode();
        log(`${TAG} 更新回调code:${eventCode}`);
        let needRestart = false;
        switch (eventCode) {
            case native.EventAssetsManager.UPDATE_PROGRESSION:
                let bytes = event.getDownloadedBytes() / 1024;
                let total = event.getTotalBytes() / 1024;
                this._updateProgress(bytes, total);
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                // 更新完成 自动重启
                needRestart = true;
                break;
            case native.EventAssetsManager.UPDATE_FAILED:
                this._updating = false;
                this._updateFail(-10001, event.getMessage());
                break;
            case native.EventAssetsManager.ERROR_UPDATING:
                this._updating = false;
                this._updateError(-10002, event.getMessage());
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
                this._updating = false;
                this._updateError(-10003, event.getMessage());
                break;
            default:
                break;
        }
        if (needRestart) {
            this._am.setEventCallback(null);

            // Prepend the manifest's search path
            let searchPaths = native.fileUtils.getSearchPaths();
            log(`${TAG} 当前搜索路径:${JSON.stringify(searchPaths)}`);

            let newPaths = this._am.getLocalManifest().getSearchPaths();
            log(`${TAG} 新搜索路径:${JSON.stringify(newPaths)}`);

            Array.prototype.unshift.apply(searchPaths, newPaths);
            sys.localStorage.setItem('hotupdate::version', this._version);
            sys.localStorage.setItem('hotupdate::searchpaths', JSON.stringify(searchPaths));
            native.fileUtils.setSearchPaths(searchPaths);

            // 重启游戏
            setTimeout(() => {
                game.restart()
            }, 500);
        }
    }

    /**
     * 版本号比较
     * @param version1 本地版本号
     * @param version2 远程版本号
     * 如果返回值大于0，则version1大于version2
     * 如果返回值等于0，则version1等于version2
     * 如果返回值小于0，则version1小于version2
     */
    private _versionCompareHandle(version1: string, version2: string): number {
        log(`${TAG}本地资源版本号:${version1} 远程资源版本号:${version2}`);
        let v1 = version1.split('.');
        let v2 = version2.split('.');
        for (let i = 0; i < v1.length; ++i) {
            let a = parseInt(v1[i]);
            let b = parseInt(v2[i] || '0');
            if (a === b) {
                continue;
            } else {
                return a - b;
            }
        }
        if (v2.length > v1.length) {
            return -1;
        }
        return 0;
    }

    private _verifyCallback(path: string, asset: native.ManifestAsset): boolean {
        // 资源是否被压缩, 如果压缩我们不需要检查它的md5值
        let compressed = asset.compressed;
        if (compressed) {
            return true;
        }
        // 预期的md5
        let expectedMD5 = asset.md5;
        // 资源大小
        let size = asset.size;
        // 验证资源md5
        log(`${TAG} 记录的md5:${expectedMD5} 文件大小:${size} 文件相对路径:${asset.path} 绝对路径:${path}`);
        return true;
    }
}
