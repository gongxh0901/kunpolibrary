import { Debug } from './Debug';
import { cc, fgui, kunpo, KunpoAssets } from './header';
import { SDKHelper } from './Helper/SDKHelper';
import { UIPackageRegister } from './UIPackageRegister';
const { ccclass, property, menu } = cc._decorator;
@ccclass("GameEntry")
@menu("kunpo/GameEntry")
export class GameEntry extends kunpo.CocosEntry {
    @property(cc.Node)
    private root: cc.Node = null;
    @property(cc.Asset)
    private manifest: cc.Asset = null;

    public getConfig(): kunpo.FrameConfig {
        return {
            debug: false
        };
    }

    onInit(): void {
        let deviceId = cc.sys.localStorage.getItem('xBBres');
        if (!deviceId || deviceId === "") {
            deviceId = "browser@" + Date.now().toString();
            cc.sys.localStorage.setItem('xBBres', deviceId);
        }
        kunpo.Platform.deviceId = deviceId;

        Debug.Register();
        UIPackageRegister.Register();
        SDKHelper.manifestUrl = this.manifest?.nativeUrl;
        this.loadBaseResources();
    }

    /** 1. 加载基础资源 */
    private loadBaseResources(): void {
        let paths: KunpoAssets.IAssetConfig[] = [
            { path: "ui/manual", type: cc.Asset }, // 手动加载UI基础资源
        ];
        let loader = new KunpoAssets.AssetLoader("basic");
        loader.setCallbacks({
            complete: () => {
                kunpo.log("load basic 加载成功");
                fgui.UIPackage.addPackage("ui/manual/Basics");
                fgui.UIPackage.addPackage("ui/manual/Home");
                this.loadResources();
            },
            fail: (code: number, msg: string) => {
                kunpo.log("load basic 加载失败:", code, msg);
            },
            progress: (percent: number) => {
                kunpo.log("load basic 加载进度:", percent);
            }
        });
        loader.start(paths);
    }

    /** 2. 加载剩余资源 */
    private loadResources(): void {
        let paths: KunpoAssets.IAssetConfig[] = [
            { path: "prefab", type: cc.Prefab },
            { path: "config/buffer", type: cc.BufferAsset },
            // { path: "icon", type: cc.SpriteFrame },
            // { path: "texture/6101/spriteFrame", type: cc.SpriteFrame, isFile: true },
            // { path: "pet", type: cc.SpriteFrame, bundle: "bundle_res" },
        ];
        let loader = new KunpoAssets.AssetLoader("resources");
        loader.setCallbacks({
            complete: () => {
                kunpo.log("load resources 加载成功");
                this.loadComplete();
            },
            fail: (code: number, msg: string) => {
                kunpo.log("load resources 加载失败:", code, msg);
            },
            progress: (percent: number) => {
                kunpo.log("load resources 加载进度:", percent);
            }
        });
        loader.start(paths);
    }


    private loadComplete(): void {
        kunpo.WindowManager.showWindow("HomeWindow", "这是一个测试窗口").then(() => {
            kunpo.log("窗口显示成功");
            this.root.active = false;
        });
    }
}