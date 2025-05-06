/**
 * @Author: Gongxh
 * @Date: 2025-02-11
 * @Description: 资源池
 */

import { Asset, AssetManager, resources } from "cc";
import { log } from "../tool/log";
import { AssetUtils } from "./AssetUtils";

export class AssetPool {
    /** 
     * 资源名对应的资源
     * @internal
     */
    private static _assets: { [path: string]: Asset } = {};
    /** 
     * uuid 对应的资源名
     * @internal
    */
    private static _uuidToName: Map<string, string> = new Map();
    /** 
     * 资源加载批次对应的资源名
     * @internal
     */
    private static _batchAssetNames: Map<string, string[]> = new Map();

    /** 批量添加资源 */
    public static add(asset: Asset[] | Asset, bundle: AssetManager.Bundle = resources, batchName: string = ""): void {
        if (Array.isArray(asset)) {
            for (const item of asset) {
                this.add(item, bundle, batchName);
            }
        } else {
            let uuid = asset.uuid;
            if (this._uuidToName.has(uuid)) {
                return;
            }
            // 增加引用计数
            asset.addRef();
            let info = bundle.getAssetInfo(uuid);
            let key = this.getKey(info.path, bundle.name);
            // log(`>>>uuid:${uuid}, path:${info.path}`);
            this._uuidToName.set(uuid, key);
            this._assets[key] = asset;

            if (batchName) {
                let names = this._batchAssetNames.get(batchName) || [];
                names.push(key);
                this._batchAssetNames.set(batchName, names);
            }
        }
    }

    public static has(path: string, bundlename: string = "resources"): boolean {
        let key = this.getKey(path, bundlename);
        if (!this._assets[key]) {
            return false;
        }
        return true;
    }

    public static get<T extends Asset>(path: string, bundlename: string = "resources"): T {
        let key = this.getKey(path, bundlename);
        if (!this._assets[key]) {
            log(`获取资源失败: 资源 bundle:${bundlename}, path:${path} 未加载`);
        }
        return this._assets[key] as T;
    }

    /** 按 uuid 判断资源是否存在 */
    public static hasUUID(uuid: string): boolean {
        if (!this._uuidToName.has(uuid)) {
            return false;
        }
        return true;
    }

    /** 按 uuid 获取资源 */
    public static getByUUID<T extends Asset>(uuid: string): T {
        if (!this._uuidToName.has(uuid)) {
            log(`获取资源失败: 资源 uuid:${uuid} 未加载`);
        }
        let key = this._uuidToName.get(uuid);
        return this._assets[key] as T;
    }

    /** 
     * 按资源加载批次释放资源
     * @param batchName 资源加载批次名 对应 AssetLoader 实例化时传入的 name
     */
    public static releaseBatchAssets(batchName: string): void {
        if (!this._batchAssetNames.has(batchName)) {
            return;
        }
        let names = this._batchAssetNames.get(batchName);
        for (const name of names) {
            this.release(name);
        }
        this._batchAssetNames.delete(batchName);
    }

    /** 按资源路径释放资源 */
    public static releasePath(path: string, bundlename: string = "resources"): void {
        let key = this.getKey(path, bundlename);
        this.release(key);
    }

    /** 按 bundle 和 文件夹释放资源 */
    public static releaseDir(dir: string, bundlename: string = "resources", asset: typeof Asset): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (bundlename == "resources") {
                let uuids = AssetUtils.getUUIDs(dir, asset, resources);
                for (const uuid of uuids) {
                    this.releaseUUID(uuid);
                }
                resolve(true);
            } else {
                AssetUtils.loadBundle(bundlename).then((bundle: AssetManager.Bundle) => {
                    let uuids = AssetUtils.getUUIDs(dir, asset, bundle);
                    for (const uuid of uuids) {
                        this.releaseUUID(uuid);
                    }
                    resolve(true);
                }).catch((err: Error) => {
                    reject(false);
                });
            }
        });
    }

    /** 按 uuid 释放资源 */
    public static releaseUUID(uuid: string): void {
        if (this._uuidToName.has(uuid)) {
            let key = this._uuidToName.get(uuid);
            this.release(key);
        }
    }

    /** 释放所有加载的资源 */
    public static releaseAll(): void {
        for (const key in this._assets) {
            this._assets[key].decRef();
        }
        this._assets = {};
        this._uuidToName.clear();
        this._batchAssetNames.clear();
    }

    /** 
     * 按key释放资源
     * @internal
     */
    private static release(key: string): void {
        if (this._assets[key]) {
            this._uuidToName.delete(this._assets[key].uuid);

            this._assets[key].decRef();
            delete this._assets[key];
        }
    }

    /** 
     * 获取资源 key
     * @internal
     */
    private static getKey(path: string, bundlename: string = "resources"): string {
        return `${bundlename}:${path}`;
    }
}
