/**
 * @Author: Gongxh
 * @Date: 2025-01-12
 * @Description: 
 */

import { fgui, kunpo } from "../../header";
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

@uiclass("Window", "Window", "PopWindow")
export class PopWindow extends kunpo.Window {
    @uiprop btn_close: fgui.GButton;
    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.Normal;
    }

    @uiclick
    private onCloseWindow(): void {
        kunpo.WindowManager.closeWindow(this.name);
    }
}
