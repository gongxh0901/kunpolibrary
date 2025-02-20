/**
 * @Author: Gongxh
 * @Date: 2025-02-11
 * @Description: 资源工具类
 */

import { Asset, AssetManager, assetManager, resources } from "cc";


export class AssetUtils {
    /** 获取资源数量 */
    public static getResourceCount(dir: string, type: typeof Asset, bundle: AssetManager.Bundle = resources): number {
        dir = assetManager.utils.normalize(dir);
        if (dir[dir.length - 1] === "/") {
            dir = dir.slice(0, -1);
        }
        let list = bundle.getDirWithPath(dir, type);
        return list.length;
    }

    /** 获取资源名称 */
    public static getUUIDs(dir: string, type: typeof Asset, bundle: AssetManager.Bundle = resources): string[] {
        let uuids: string[] = [];
        let path = assetManager.utils.normalize(dir);
        if (path[path.length - 1] === "/") {
            path = path.slice(0, -1);
        }
        let list = bundle.getDirWithPath(path, type);
        for (const asset of list) {
            uuids.push(asset.uuid);
        }
        return uuids;
    }

    /** 加载 bundle */
    public static async loadBundle(bundlename: string): Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            let bundle = assetManager.getBundle(bundlename);
            if (bundle) {
                resolve(bundle);
            } else {
                assetManager.loadBundle(bundlename, (err: Error, bundle: AssetManager.Bundle) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(bundle);
                    }
                });
            }
        });
    }
}
