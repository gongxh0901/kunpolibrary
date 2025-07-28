/**
 * @Author: Gongxh
 * @Date: 2024-12-21
 * @Description: 
 */

import { fgui, kunpo } from "../../header";
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

@uiclass("Window", "Window", "CloseOneWindow")
export class CloseOneWindow extends kunpo.Window {
    @uiprop btn_close: fgui.GButton;
    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.CloseOne;
    }

    protected onShow(userdata?: any): void {
        kunpo.log("CloseOneWindow onShow:", userdata);
    }

    protected onHide(): void {
        kunpo.log("CloseOneWindow onHide");
    }

    protected onCover(): void {
        kunpo.log("CloseOneWindow onCover");
    }

    protected onRecover(): void {
        kunpo.log("CloseOneWindow onRecover");
    }

    protected onShowFromHide(): void {
        kunpo.log("CloseOneWindow onShowFromHide");
    }

    protected onEmptyAreaClick(): void {
        kunpo.log("CloseOneWindow 点击空白区域");
    }

    protected onClose(): void {
        kunpo.log("CloseOneWindow onClose");
    }

    @uiclick
    private onClickBtnClose(): void {
        kunpo.WindowManager.closeWindow(this.name);
    }
}
