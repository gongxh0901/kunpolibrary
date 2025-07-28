/**
 * @Author: Gongxh
 * @Date: 2024-12-14
 * @Description: 
 */

import { fgui, kunpo } from "../../header";
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

@uiclass("Window", "Window", "PopWindowHeader1")
export class PopWindowHeader1 extends kunpo.Window {
    @uiprop btn_close: fgui.GButton;
    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.Normal;
    }

    getHeaderInfo(): kunpo.WindowHeaderInfo {
        return kunpo.WindowHeaderInfo.create("WindowHeader", "aaa");
    }

    @uiclick
    private onCloseWindow(): void {
        kunpo.WindowManager.closeWindow(this.name);
    }
}
