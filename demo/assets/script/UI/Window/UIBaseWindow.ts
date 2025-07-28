/**
 * @Author: Gongxh
 * @Date: 2025-04-19
 * @Description: 
 */

import { kunpo } from "../../header";
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

@uiclass("Window", "Window", "UIBaseWindow")
export class UIBaseWindow extends kunpo.Window {
    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.HideAll;
    }

    protected onShow(userdata?: any): void {
        kunpo.log("UIBaseWindow onShow:", userdata);
    }

    protected onHide(): void {
        kunpo.log("UIBaseWindow onHide");
    }

    protected onCover(): void {
        kunpo.log("UIBaseWindow onCover");
    }

    protected onRecover(): void {
        kunpo.log("UIBaseWindow onRecover");
    }

    protected onShowFromHide(): void {
        kunpo.log("UIBaseWindow onShowFromHide");
    }

    protected onEmptyAreaClick(): void {
        kunpo.log("UIBaseWindow 点击空白区域");
    }

    protected onClose(): void {
        kunpo.log("UIBaseWindow onClose");
    }

    @uiclick
    private onClickBtnClose(): void {
        kunpo.WindowManager.closeWindow(this.name);
    }

    @uiclick
    private onClickBtnHeader1(): void {
        kunpo.WindowManager.showWindow("PopWindowHeader1");
    }

    @uiclick
    private onClickBtnHeader2(): void {
        kunpo.WindowManager.showWindow("PopWindowHeader2");
    }

    @uiclick
    private onClickBtnEmpty(): void {
        kunpo.WindowManager.showWindow("PopWindow");
    }

    @uiclick
    private onClickBtnCloseOne(): void {
        kunpo.WindowManager.showWindow("CloseOneWindow");
    }

    @uiclick
    private onClickBtnCloseAll(): void {
        kunpo.WindowManager.showWindow("CloseAllWindow");
    }

    @uiclick
    private onClickBtnHideOne(): void {
        kunpo.WindowManager.showWindow("HideOneWindow");
    }

    @uiclick
    private onClickBtnHideAll(): void {
        kunpo.WindowManager.showWindow("HideAllWindow");
    }

    public getHeaderInfo(): kunpo.WindowHeaderInfo {
        return kunpo.WindowHeaderInfo.create("WindowHeader", "aaa");
    }
}
