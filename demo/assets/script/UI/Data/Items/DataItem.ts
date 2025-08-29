/**
 * @Author: Gongxh
 * @Date: 2025-08-30
 * @Description: 
 */


import { Level } from "../../../Data/global/Level";
import { fgui, kunpo } from "../../../header";
const { uiheader, uiprop, uicom, uiclick } = kunpo._uidecorator;
const { bindMethod, bindProp } = kunpo.data;

@uicom("Data", "DataItem")
export class DataItem extends fgui.GComponent {
    @uiprop
    @bindProp(Level, data => data.levelid, (item: fgui.GTextField, value: number, data: Level) => {
        item.text = `关卡回调\n关卡:${value}\n层数:${data.storey}`;
    })
    @bindProp(Level, data => data.storey, (item: fgui.GTextField, value: number, data: Level) => {
        item.text = `层数回调\n关卡:${data.levelid}\n层数:${value}`;
    })
    private lab_level: fgui.GTextField;

    public onInit(): void {
    }
}
