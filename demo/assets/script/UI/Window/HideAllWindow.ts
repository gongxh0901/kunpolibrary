/**
 * @Author: Gongxh
 * @Date: 2024-12-21
 * @Description: 
 */
import { fgui, kunpo } from "../../header";
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

@uiclass("Window", "Window", "HideAllWindow")
export class HideAllWindow extends kunpo.Window {
    @uiprop btn_close: fgui.GButton;
    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.HideAll;
    }

    protected onShow(userdata?: any): void {
        kunpo.log("HideAllWindow onShow:", userdata);
    }

    protected onHide(): void {
        kunpo.log("HideAllWindow onHide");
    }

    protected onCover(): void {
        kunpo.log("HideAllWindow onCover");
    }

    protected onRecover(): void {
        kunpo.log("HideAllWindow onRecover");
    }

    protected onShowFromHide(): void {
        kunpo.log("HideAllWindow onShowFromHide");
    }

    protected onEmptyAreaClick(): void {
        kunpo.log("HideAllWindow 点击空白区域");
    }

    protected onClose(): void {
        kunpo.log("HideAllWindow onClose");
    }

    @uiclick
    private onClickBtnClose(): void {
        kunpo.WindowManager.closeWindow(this.name);
    }
}
