/**
 * @Author: Gongxh
 * @Date: 2024-12-21
 * @Description: 
 */

import { fgui, kunpo } from "../../header";
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

@uiclass("Window", "Window", "HideOneWindow")
export class HideOneWindow extends kunpo.Window {
    @uiprop btn_close: fgui.GButton;
    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.HideOne;
    }

    protected onShow(userdata?: any): void {
        kunpo.log("HideOneWindow onShow:", userdata);
    }

    protected onHide(): void {
        kunpo.log("HideOneWindow onHide");
    }

    protected onCover(): void {
        kunpo.log("HideOneWindow onCover");
    }

    protected onRecover(): void {
        kunpo.log("HideOneWindow onRecover");
    }

    protected onShowFromHide(): void {
        kunpo.log("HideOneWindow onShowFromHide");
    }

    protected onEmptyAreaClick(): void {
        kunpo.log("HideOneWindow 点击空白区域");
    }

    protected onClose(): void {
        kunpo.log("HideOneWindow onClose");
    }

    @uiclick
    private onClickBtnClose(): void {
        kunpo.WindowManager.closeWindow(this.name);
    }
}
