/**
 * @Author: Gongxh
 * @Date: 2025-02-26
 * @Description: 
 */
import { kunpo } from './header';
export class UIPackageRegister {
    public static Register(): void {
        kunpo.WindowManager.initPackageConfig({
            config: {
                /** UI所在resources中的路径 */
                uiPath: "ui",
                /**
                 * 手动管理资源的包
                 * 1. 用于基础UI包, 提供一些最基础的组件，所有其他包都可能引用其中的内容
                 * 2. 资源header所在的包
                 * 3. 用于一些特殊场景, 比如需要和其他资源一起加载, 并且显示进度条的包
                 */
                manualPackages: ["Basics", "Home"],
                /**
                 * 不推荐配置 只是提供一种特殊需求的实现方式
                 * 窗口引用到其他包中的资源 需要的配置信息
                 */
                linkPackages: {},
                /**
                 * 关闭界面后，需要立即释放资源的包名（建议尽量少）
                 * 一般不建议包进行频繁装载卸载，因为每次装载卸载必然是要消耗CPU时间（意味着耗电）和产生大量GC的。UI系统占用的内存是可以精确估算的，你可以按照包的使用频率设定哪些包是需要立即释放的。
                 * 不包括手动管理的包
                 */
                imReleasePackages: [],
            },
            showWaitWindow: this._showWaitWindow,
            hideWaitWindow: this._hideWaitWindow,
            fail: this._fail,
        });
    }

    private static _showWaitWindow(): void {
        console.log("显示资源加载等待窗");
        kunpo.WindowManager.showWindow("LoadUIWindow");
    }

    private static _hideWaitWindow(): void {
        console.log("关闭资源加载等待窗");
        kunpo.WindowManager.closeWindow("LoadUIWindow");
    }

    private static _fail(windowName: string, errmsg: string, pkgs: string[]): void {
        console.log("资源加载失败", windowName, errmsg, pkgs);
    }
}
