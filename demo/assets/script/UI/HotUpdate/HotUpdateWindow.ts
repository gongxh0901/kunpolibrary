/**
 * @Author: Gongxh
 * @Date: 2025-04-18
 * @Description: 
 */

import { HotUpdateCode, log } from "kunpocc";
import { fgui, kunpo } from "../../header";
import { SDKHelper } from "../../Helper/SDKHelper";
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

@uiclass("Window", "HotUpdate", "HotUpdateWindow")
export class HotUpdateWindow extends kunpo.Window {
    @uiprop lab_version: fgui.GTextField = null;
    @uiprop lab_desc: fgui.GTextField = null;

    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.HideAll;
    }

    protected onShow(userdata?: any): void {
        let version = KunpoSDK.SDKHelper.getInstance().getVersionCode()
        kunpo.HotUpdateManager.getInstance().init(SDKHelper.manifestUrl, version);
        this.lab_version.text = `当前资源版本号:` + kunpo.HotUpdateManager.getInstance().resVersion;

        this.lab_desc.text = "点击检查更新按钮，检查是否有新版本 或者 点击更新按钮，直接更新 hahaha";
    }

    protected onClose(): void {
        kunpo.log("CloseAllWindow onClose");
    }

    private refreshTips(tips: string, touchable: boolean = false): void {
        this.lab_desc.text = tips;
        this.touchable = touchable;
    }

    @uiclick
    private onClickClose(): void {
        kunpo.WindowManager.closeWindow(this.name);
    }

    @uiclick
    private onCheckUpdate(): void {
        this.refreshTips("正在检查更新...  请稍后", false);

        kunpo.HotUpdateManager.getInstance().checkUpdate().then((res: kunpo.ICheckUpdatePromiseResult) => {
            kunpo.log("发现热更新:", JSON.stringify(res));
            this.refreshTips(`发现热更新 需更新大小:${Math.floor(res.size / 1024 * 1000) * 0.001}MB`, true);
            kunpo.WindowManager.showWindowIm("AlertWindow", {
                title: "提示",
                content: `发现热更新 需更新大小:${Math.floor(res.size / 1024 * 1000) * 0.001}MB`,
                okTitle: "更新",
                cancelTitle: "取消",
                complete: () => {
                    this.startUpdate(true);
                },
                cancel: () => {
                    kunpo.log("取消");
                },
            });
        }).catch((res: any) => {
            log("检查热更新出错了", JSON.stringify(res));
            if (res.code == HotUpdateCode.LatestVersion) {
                this.refreshTips(`已经是最新版本了`, true);
                kunpo.WindowManager.showWindowIm("AlertWindow", {
                    title: "提示",
                    content: `已经是最新版本了`,
                    okTitle: "知道了",
                });
            } else {
                this.refreshTips(`出错了 code:${res.code} message:${res.message}`, true);
                kunpo.WindowManager.showWindowIm("AlertWindow", {
                    title: "提示",
                    content: `出错了 code:${res.code} message:${res.message}`,
                    okTitle: "知道了",
                });
            }
        });
    }

    @uiclick
    private onStartUpdate(): void {
        this.startUpdate(false);
    }

    private startUpdate(skipCheck: boolean = false): void {
        this.refreshTips(`正在更新...  请稍后`, false);

        kunpo.HotUpdateManager.getInstance().startUpdate({
            skipCheck: skipCheck,
            progress: (kb: number, total: number) => {
                kunpo.log("热更新进度", kb, total);
                this.refreshTips(`正在更新...  请稍后  ${Math.floor(kb / total * 100)}% `, false);
            },
            complete: (code: HotUpdateCode, message: string) => {
                kunpo.log("热更新完成", code, message);
                if (code == HotUpdateCode.LatestVersion) {
                    this.refreshTips(`已经是最新版了 不需要更新`, true);
                    // 已经是最新版了
                    kunpo.WindowManager.showWindowIm("AlertWindow", {
                        title: "提示",
                        content: `已经是最新版了 不需要更新`,
                        okTitle: "知道了",
                    });
                } else if (code == HotUpdateCode.UpdateFailed) {
                    this.refreshTips(`更新失败了 code:${code} message:${message}`, true);
                    kunpo.WindowManager.showWindowIm("AlertWindow", {
                        title: "提示",
                        content: `热更新失败了 是否重试失败的资源 message:${message}`,
                        okTitle: "重试",
                        cancelTitle: "取消",
                        complete: () => {
                            kunpo.HotUpdateManager.getInstance().retryUpdate();
                        },
                        cancel: () => {
                            kunpo.log("取消");
                        },
                    });
                } else if (code == HotUpdateCode.LoadVersionFailed || code == HotUpdateCode.ParseVersionFailed) {
                    this.refreshTips(`更新失败了 code:${code} message:${message}`, true);
                    kunpo.WindowManager.showWindowIm("AlertWindow", {
                        title: "提示",
                        content: `更新失败了 code:${code} message:${message} 可以选择跳过热更新`,
                        okTitle: "知道了",
                    });
                } else {
                    this.refreshTips(`更新失败了 code:${code} message:${message}`, true);
                    kunpo.WindowManager.showWindowIm("AlertWindow", {
                        title: "提示",
                        content: `热更新失败了, 根据code的值，看是重启游戏，还是跳过更新 message:${message}`,
                        okTitle: "知道了",
                    });
                }
            }
        });
    }
}