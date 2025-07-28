/**
 * @Author: Gongxh
 * @Date: 2025-01-12
 * @Description: 
 */
import { fgui, kunpo } from '../../../header';
const { uiheader, uiprop, uiclick } = kunpo._uidecorator;

@uiheader("Basics", "WindowHeader")
export class WindowHeader extends kunpo.WindowHeader {
    @uiprop btn_close: fgui.GButton;
    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;

        this.btn_close.onClick(() => {
            kunpo.log("WindowHeader btn_close");
        }, this);
    }

    protected onShow(window: kunpo.Window, userdata?: any): void {
        kunpo.log("WindowHeader onShow:");
    }

    protected onHide(): void {
        kunpo.log("WindowHeader onHide");
    }

    protected onClose(): void {
        kunpo.log("WindowHeader onClose");
    }
}
