/**
 * @Author: Gongxh
 * @Date: 2025-08-19
 * @Description: 
 */
import { Level } from "../../Data/global/Level";
import { fgui, kunpo } from "../../header";
import { DataHelper } from "../../Helper/DataHelper";

const { bindMethod, bindProp } = kunpo.data;
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

@uiclass("Window", "Data", "DataWindow")
export class DataWindow extends kunpo.Window {
    @uiprop
    @bindProp(Level, data => data.storey, (item: fgui.GTextField, value: number, data: Level) => {
        item.text = `关卡：${data.levelid} 层数：${value}`;
    })
    @bindProp(Level, data => data.levelid, (item: fgui.GTextField, value: number, data: Level) => {
        item.text = `关卡：${value} 层数：${data.storey}`;
    })
    private lab_level: fgui.GTextField;


    @uiprop
    @bindProp(Level, data => data.storey, (item: fgui.GTextField, value: number, data: Level) => {
        item.text = `层数：${value}`;
    })
    private lab_storey: fgui.GTextField;

    @uiprop
    @bindProp(Level, data => data.refreshMin, (item: fgui.GTextField) => {
        item.text = `最小值：${DataHelper.level.data.min}`;
    })
    private lab_min: fgui.GTextField;

    @uiprop
    @bindProp(Level, data => data.refreshMax, (item: fgui.GTextField) => {
        item.text = `最大值：${DataHelper.level.data.max}`;
    })
    private lab_max: fgui.GTextField;

    @uiprop
    @bindProp(Level, data => data.ispassed, (item: fgui.GTextField) => {
        item.text = `是否通过：${DataHelper.level.ispassed ? '是' : '否'}`;
    })
    private lab_ispassed: fgui.GTextField;

    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.Normal;
    }

    protected onShow(userdata?: any): void {

    }

    protected onClose(): void {

    }

    @uiclick
    private onRefreshLevel(): void {
        DataHelper.level.refreshLevel(DataHelper.level.levelid + 1);
    }

    @uiclick
    private onRefreshStorey(): void {
        DataHelper.level.refreshStorey(DataHelper.level.storey + 1);
    }

    @uiclick
    private onRefreshBool(): void {
        DataHelper.level.refreshBool(!DataHelper.level.ispassed);
    }


    @uiclick
    private onRefreshData(): void {
        DataHelper.level.data = { min: 1, max: 100 };
    }

    @uiclick
    private onRefreshMin(): void {
        DataHelper.level.refreshMin(DataHelper.level.data.min + 1);
    }

    @uiclick
    private onRefreshMax(): void {
        DataHelper.level.refreshMax(DataHelper.level.data.max - 1);
    }

    @uiclick
    private onRefreshAll(): void {
        DataHelper.level.init({ min: 1, max: 100, ispassed: true, levelid: 1, storey: 1 });
    }

    @uiclick
    private onTouchClose(): void {
        kunpo.WindowManager.closeWindow(this.name);
    }

    @bindMethod(Level, data => data.ispassed)
    private refreshBool(level: Level): void {
        this.lab_ispassed.text = `是否通过：${level.ispassed ? '是' : '否'}`;
    }

    @bindMethod(Level, data => data.refreshMin)
    private refreshMin(level: Level): void {
        this.lab_min.text = `对象属性min：${level.data.min}`;
    }

    @bindMethod(Level, data => data.refreshMax)
    private refreshMax(level: Level): void {
        this.lab_max.text = `对象属性max：${level.data.max}`;
    }

    @bindMethod(Level, data => data.refreshMax)
    @bindMethod(Level, data => data.refreshMin)
    @bindMethod(Level, data => data.init)
    @bindMethod(Level, data => data.data)
    private refreshData(level: Level): void {
        console.log('触发回调了');
        this.lab_min.text = `对象属性min：${level.data.min}`;
        this.lab_max.text = `对象属性max：${level.data.max}`;
    }
}
