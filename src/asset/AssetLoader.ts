/**
 * @Author: Gongxh
 * @Date: 2025-02-11
 * @Description: 资源加载器
 */

import { Asset, AssetManager, resources } from "cc";
import { log } from "../tool/log";
import { MathTool } from "../tool/Math";
import { AssetPool } from "./AssetPool";
import { AssetUtils } from "./AssetUtils";

export interface IAssetConfig {
    /** 资源类型 */
    type: typeof Asset;
    /** 资源路径 */
    path: string;
    /** 是否是单个文件 默认是文件夹 */
    isFile?: boolean;
    /** 资源包名 默认 resources */
    bundle?: string;
}

/** 资源加载的状态类型 */
enum StateType {
    Error,
    Wait,
    Loading,
    Finish,
}

export class AssetLoader {
    /** 资源加载器名称 */
    private _name: string = "";
    /** 资源总数 */
    private _total: number = 0;
    /** 最大并行加载数量 */
    private _maxParallel: number = 10;
    /** 当前并行加载数量 */
    private _parallel: number = 0;
    /** 失败重试次数 */
    private _maxRetry: number = 3;
    /** 失败重试次数 */
    private _retry: number = 0;

    /** 获取资源数量是否成功 */
    private _initSuccess: boolean = false;

    private _progress: (percent: number) => void;

    private _complete: () => void;
    private _fail: (msg: string, err: Error) => void;

    private _configs: IAssetConfig[] = [];
    private _items: { type: typeof Asset, bundle: string, path: string, isFile?: boolean, status: StateType, count: number }[] = [];
    /** load完成数量 */
    private _completeCounts: Map<string, number> = new Map();
    constructor(name?: string) {
        this._name = name || "AssetLoader";
    }

    /**
     * 开始加载资源
     * @param {IAssetConfig[]} res.configs 资源配置
     * @param {number} res.parallel 并行加载数量 默认 10
     * @param {number} res.retry 失败重试次数 默认 3
     * @param {Function} res.complete 加载完成回调
     * @param {Function} res.progress 加载进度回调
     * @param {Function} res.fail 加载失败回调
     */
    public start(res: { configs: IAssetConfig[], parallel?: number, retry?: number, complete: () => void, fail: (msg: string, err: Error) => void, progress?: (percent: number) => void }): void {
        this._configs = res.configs;
        this._maxParallel = res.parallel || 10;
        this._maxRetry = res.retry || 3;
        this._complete = res.complete;
        this._progress = res.progress;
        this._fail = res.fail;

        this._total = 0;
        this._initSuccess = false;
        this._items.length = 0;

        let initCount = res.configs.length;
        for (const item of res.configs) {
            let bundlename = item.bundle || "resources";
            let count = 0;
            if (bundlename == "resources") {
                count = AssetUtils.getResourceCount(item.path, item.type);
                this._total += count;

                this._items.push({ type: item.type, bundle: item.bundle || "resources", path: item.path, isFile: item.isFile || false, status: StateType.Wait, count: count })
                initCount--;

                initCount <= 0 && this.initSuccess();
            } else {
                AssetUtils.loadBundle(bundlename).then((bundle: AssetManager.Bundle) => {
                    count = AssetUtils.getResourceCount(item.path, item.type, bundle);
                    this._total += count;

                    this._items.push({ type: item.type, bundle: item.bundle || "resources", path: item.path, isFile: item.isFile || false, status: StateType.Wait, count: count })
                    initCount--;

                    initCount <= 0 && this.initSuccess();
                }).catch((err: Error) => {
                    if (this._retry < this._maxRetry) {
                        this.retryStart();
                    } else {
                        this._fail(`加载资源包[${bundlename}]失败`, err);
                    }
                });
            }
        }
    }

    /** 重试 (重新加载失败的资源) */
    public retry(): void {
        this._parallel = 0;
        this._retry = 0;
        if (!this._initSuccess) {
            this.retryStart();
        } else {
            this.retryLoad();
        }
    }

    /** 重试开始 */
    private retryStart(): void {
        this._retry++;
        this.start({
            configs: this._configs,
            parallel: this._maxParallel,
            retry: this._maxRetry,
            complete: this._complete,
            fail: this._fail,
            progress: this._progress
        });
    }

    /** 重试加载资源 */
    private retryLoad(): void {
        this._retry++;
        let count = this.resetErrorItem();
        let maxLoad = Math.min(count, this._maxParallel);
        for (let i = 0; i < maxLoad; i++) {
            this.loadNext();
        }
    }

    /** 初始化成功后，开始批量加载资源 */
    private initSuccess(): void {
        this._initSuccess = true;
        this._parallel = 0;
        let maxLoad = Math.min(this._items.length, this._maxParallel);
        for (let i = 0; i < maxLoad; i++) {
            this.loadNext();
        }
    }

    /** 加载下一个资源 */
    private loadNext(): void {
        // 找到第一个等待中的资源
        let index = this._items.findIndex(item => item.status == StateType.Wait);
        if (index > -1) {
            this.loadItem(index);
        } else if (!this._items.some(item => item.status != StateType.Finish)) {
            // 所有资源全部完成了
            this._complete();
        } else if (this._parallel <= 0 && this._retry < this._maxRetry) {
            this.retryLoad();
        }
    }

    /** 重置失败资源状态为等待中 */
    private resetErrorItem(): number {
        let count = 0;
        for (const item of this._items) {
            if (item.status == StateType.Error) {
                item.status = StateType.Wait;
                count++;
            }
        }
        return count;
    }

    private async loadItem(index: number): Promise<void> {
        let item = this._items[index];
        item.status = StateType.Loading;
        this._parallel++;

        let bundle = null;
        if (item.bundle == "resources") {
            bundle = resources;
        } else {
            bundle = await AssetUtils.loadBundle(item.bundle);
        }
        if (item.isFile) {
            this.loadFile(index, bundle);
        } else {
            this.loadDir(index, bundle);
        }
    }

    private loadDir(index: number, bundle: AssetManager.Bundle): void {
        let item = this._items[index];
        bundle.loadDir(item.path, item.type, (finish: number, total: number) => {
            if (total > 0 && finish > 0) {
                this._completeCounts.set(`${item.bundle}:${item.path}`, finish);
                this._progress && this.updateProgress();
            }
        }, (error: Error, assets: Array<Asset>) => {
            this._parallel--;
            if (error) {
                log(`load dir error, bundle:${item.bundle}, dir:${item.path}`);
                item.status = StateType.Error;
            } else {
                item.status = StateType.Finish;
                this._completeCounts.set(`${item.bundle}:${item.path}`, assets.length);
                AssetPool.add(assets, bundle);
            }
            this._progress && this.updateProgress();
            this.loadNext();
        });
    }

    private loadFile(index: number, bundle: AssetManager.Bundle): void {
        let item = this._items[index];
        bundle.load(item.path, item.type, (error: Error, asset: Asset) => {
            this._parallel--;
            if (error) {
                log(`load file error, bundle:${item.bundle}, filename:${item.path}`);
                item.status = StateType.Error;
            } else {
                item.status = StateType.Finish;
                this._completeCounts.set(`${item.bundle}:${item.path}`, 1);
                AssetPool.add(asset, bundle);
            }

            this._progress && this.updateProgress();
            this.loadNext();
        });
    }

    /** 更新进度 */
    private updateProgress(): void {
        let value = 0;
        for (const count of this._completeCounts.values()) {
            value += count;
        }
        this._progress(MathTool.clampf(value / this._total, 0, 1));
    }
}
