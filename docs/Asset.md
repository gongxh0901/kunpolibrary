## 资源加载
> !!! 注意：资源加载多次和一次效果一样

### 特点
  * 可通过路径或者uuid获取资源
  * 只适合手动管理资源，单无论加载多少次，卸载一次后删除

### 使用
```typescript
    let paths: kunpo.IAssetConfig[] = [
        { path: "ui/manual", type: cc.Asset },
        { path: "prefab", type: cc.Prefab },
        { path: "icon", type: cc.SpriteFrame },
        { path: "texture/6101/spriteFrame", type: cc.SpriteFrame, isFile: true },
        { path: "pet", type: cc.SpriteFrame, bundle: "bundle_res" },
    ];
    let loader = new kunpo.AssetLoader("load");
    loader.start({
        configs: paths,
        complete: () => {
            console.log("加载完成");
        },
        fail: (msg: string, err: Error) => {
            console.log("加载失败", msg, err);
        },
        progress: (percent: number) => {
            console.log("加载进度", percent);
        }
    });
```

### 接口
#### *资源加载器*

```typescript
interface IAssetConfig {
    /** 资源类型 */
    type: typeof Asset;
    /** 资源路径 */
    path: string;
    /** 是否是单个文件 默认是文件夹 */
    isFile?: boolean;
    /** 资源包名 默认 resources */
    bundle?: string;
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
public start(res: { configs: IAssetConfig[], parallel?: number, retry?: number, complete: () => void, fail: (msg: string, err: Error) => void, progress?: (percent: number) => void }): void

/** 重试 重新加载失败的资源 */
public retry(): void
```

#### *资源池*

```typescript
/** 资源是否已加载 */
public static has(path: string, bundlename: string = "resources"): boolean

/** 获取资源 */
public static get<T extends Asset>(path: string, bundlename: string = "resources"): T

/** 按 uuid 判断资源是否已加载 */
public static hasUUID(uuid: string): boolean

/** 按 uuid 获取资源 */
public static getByUUID<T extends Asset>(uuid: string): T

/** 按资源路径释放资源 */
public static releasePath(path: string, bundlename: string = "resources"): void

/** 按 bundle 和 文件夹释放资源 */
public static releaseDir(dir: string, bundlename: string = "resources", asset: typeof Asset): Promise<boolean>

/** 按 uuid 释放资源 */
public static releaseUUID(uuid: string): void

/** 释放所有加载的资源 */
public static releaseAll(): void
```

