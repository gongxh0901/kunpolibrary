/**
 * @Author: Gongxh
 * @Date: 2024-12-11
 * @Description: 
 */

import { AssetPool } from "kunpocc-assets";
import { cc, fgui, kunpo, KunpoAssets } from "../header";
const { uiclass, uiprop, uiclick, uicontrol, uitransition } = kunpo._uidecorator;

@uiclass("Window", "Home", "HomeWindow")
export class HomeWindow extends kunpo.Window {
    @uicontrol private status: fgui.Controller;
    @uicontrol private sta2: fgui.Controller;

    @uicontrol private bookCtrl: fgui.Controller;
    @uicontrol private doneCtrl: fgui.Controller;
    @uicontrol private resultCtrl: fgui.Controller;


    @uitransition private t0: fgui.Transition;
    @uitransition private t1: fgui.Transition;

    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.CloseAll;
    }

    protected onShow(userdata?: any): void {
        kunpo.log("HomeWindow onShow:", userdata);

        console.log("this.status", this.status);
        console.log("this.sta2", this.sta2);
        console.log("this.bookCtrl", this.bookCtrl);
        console.log("this.doneCtrl", this.doneCtrl);
        console.log("this.resultCtrl", this.resultCtrl);
    }

    @uiclick
    private onClickUI(): void {
        kunpo.WindowManager.showWindow("UIBaseWindow");
    }

    @uiclick
    private onSocketWindow(): void {
        kunpo.WindowManager.showWindow("SocketTestWindow");
    }

    @uiclick
    private onClickBtnCondition(): void {
        kunpo.WindowManager.showWindow("ConditionWindow");
    }


    @uiclick
    private onClickMiniGame(): void {
        if (kunpo.Platform.isWX || kunpo.Platform.isAlipay || kunpo.Platform.isBytedance) {
            kunpo.WindowManager.showWindow("MiniGameWindow");
        } else {
            kunpo.WindowManager.showWindowIm("ToastWindow", { text: "当前平台不是 微信/阿里/抖音小游戏" })
        }
    }

    @uiclick
    private onClickBtnHotUpdate(): void {
        if (kunpo.Platform.isNativeMobile) {
            kunpo.WindowManager.showWindow("HotUpdateWindow");
        } else {
            kunpo.WindowManager.showWindowIm("ToastWindow", { text: "只有原生平台才支持热更新" })
        }
    }

    @uiclick
    private onClickLoadBuffer(): void {
        let paths: KunpoAssets.IAssetConfig[] = [
            { path: "config/buffer", type: cc.BufferAsset },
        ];
        let loader = new KunpoAssets.AssetLoader("buffer");
        loader.setCallbacks({
            complete: () => {
                let basic = AssetPool.get<cc.BufferAsset>("config/buffer/basic");
                kunpo.log("basic", JSON.stringify(kunpo.Binary.toJson(basic.buffer())));

                let dict = AssetPool.get<cc.BufferAsset>("config/buffer/dict");
                kunpo.log("dict", JSON.stringify(kunpo.Binary.toJson(dict.buffer())));

                let listDict = AssetPool.get<cc.BufferAsset>("config/buffer/list_dict");
                kunpo.log("list_dict", JSON.stringify(kunpo.Binary.toJson(listDict.buffer())));

                let aaa = {
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4,
                    e: 5,
                };
                kunpo.log("aaa", JSON.stringify(kunpo.Binary.toJson(aaa)));
            },
            fail: (code: number, msg: string) => {
                kunpo.log("load buffer 加载失败:", code, msg);
            },
            progress: (percent: number) => {
                kunpo.log("load buffer 加载进度:", percent);
            }
        });
        loader.start(paths);
    }

    @uiclick
    private onClickData(): void {
        kunpo.WindowManager.showWindow("DataWindow");
    }

    public getHeaderInfo(): kunpo.WindowHeaderInfo {
        return kunpo.WindowHeaderInfo.create("WindowHeader", "aaa");
    }
}
