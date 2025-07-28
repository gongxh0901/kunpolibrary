/**
 * @Author: Gongxh
 * @Date: 2024-12-26
 * @Description: 
 */

import { fgui, kunpo } from "../../../header";
const { uiheader, uiprop, uicom, uiclick } = kunpo._uidecorator;

@uicom("Window", "CustomComponents")
export class CustomComponents extends fgui.GComponent {
    @uiprop n1: fgui.GTextField;

    public onInit(): void {
        kunpo.log("CustomComponents onInit");
    }
}
