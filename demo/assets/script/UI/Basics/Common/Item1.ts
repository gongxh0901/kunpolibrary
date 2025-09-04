/**
 * @Author: Gongxh
 * @Date: 2025-09-04
 * @Description: 
 */

import { fgui, kunpo } from "../../../header";

const { uiheader, uiprop, uicom, uiclick } = kunpo._uidecorator;
const { bindMethod, bindProp } = kunpo.data;

@uicom("Basics", "Item1")
export class Item1 extends fgui.GComponent {
    @uiprop
    private lab_desc: fgui.GTextField;

    public onInit(): void {
        console.log("Basics Item1 onInit", this.lab_desc);
    }
}
