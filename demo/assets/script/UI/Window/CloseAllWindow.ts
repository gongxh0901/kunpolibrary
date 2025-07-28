/**
 * @Author: Gongxh
 * @Date: 2024-12-21
 * @Description: 
 */
import { fgui, kunpo } from "../../header";
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

@uiclass("Window", "Window", "CloseAllWindow")
export class CloseAllWindow extends kunpo.Window {
    @uiprop btn_close: fgui.GButton;
    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.CloseAll;
    }

    protected onShow(userdata?: any): void {
        kunpo.log("CloseAllWindow onShow:", userdata);
    }

    protected onHide(): void {
        kunpo.log("CloseAllWindow onHide");
    }

    protected onCover(): void {
        kunpo.log("CloseAllWindow onCover");
    }

    protected onRecover(): void {
        kunpo.log("CloseAllWindow onRecover");
    }

    protected onShowFromHide(): void {
        kunpo.log("CloseAllWindow onShowFromHide");
    }

    protected onEmptyAreaClick(): void {
        kunpo.log("CloseAllWindow 点击空白区域");
    }

    protected onClose(): void {
        kunpo.log("CloseAllWindow onClose");
    }

    @uiclick
    private onClickBtnClose(): void {
        kunpo.WindowManager.closeWindow(this.name);
    }
}
