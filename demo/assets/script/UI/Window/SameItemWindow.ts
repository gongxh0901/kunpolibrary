/**
 * @Author: Gongxh
 * @Date: 2025-09-04
 * @Description: 
 */


import { kunpo } from "../../header";
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

@uiclass("Window", "Window", "SameItemWindow")
export class SameItemWindow extends kunpo.Window {
    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.HideOne;
    }

    @uiclick
    private onClickBtnClose(): void {
        kunpo.WindowManager.closeWindow(this.name);
    }
}
