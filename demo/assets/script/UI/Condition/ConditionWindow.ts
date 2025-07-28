/**
 * @Author: Gongxh
 * @Date: 2025-02-17
 * @Description: 
 */

import { ConditionType } from "../../condition/ConditionType";
import { DataHelper } from "../../Data/DataHelper";
import { fgui, kunpo } from "../../header";
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

@uiclass("Window", "Condition", "ConditionWindow")
export class ConditionWindow extends kunpo.Window {
    @uiprop reddot1: fgui.GComponent;
    @uiprop reddot2: fgui.GComponent;

    @uiprop btn_condition1: fgui.GButton;
    @uiprop btn_condition2: fgui.GButton;
    @uiprop btn_condition3: fgui.GButton;
    @uiprop btn_condition4: fgui.GButton;

    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.HideOne;

        /** 初始化注册的所有条件 (临时写到这里，应该放到项目数据初始化之后 调用这个方法)  */
        kunpo.ConditionManager.initCondition();

        this.btn_condition1.title = `条件1: ${DataHelper.getValue("condition1", true)}`;
        this.btn_condition2.title = `条件2: ${DataHelper.getValue("condition2", true)}`;
        this.btn_condition3.title = `条件3: ${DataHelper.getValue("condition3", true)}`;
        this.btn_condition4.title = `条件4: ${DataHelper.getValue("condition4", true)}`;

        /** 任意一个满足 显示节点 */
        new kunpo.ConditionAnyNode(this.reddot1, ConditionType.Condition1, ConditionType.Condition2, ConditionType.Condition3, ConditionType.Condition4);

        /** 所有条件都满足 显示节点 */
        new kunpo.ConditionAllNode(this.reddot2, ConditionType.Condition1, ConditionType.Condition2, ConditionType.Condition3, ConditionType.Condition4);
    }

    protected onShow(userdata?: any): void {

    }

    protected onClose(): void {

    }

    @uiclick
    private onClickBtnClose(): void {
        kunpo.WindowManager.closeWindow(this.name);
    }

    @uiclick
    private onClickBtnCondition1(): void {
        const value = DataHelper.getValue("condition1", true);
        DataHelper.setValue("condition1", !value);

        this.btn_condition1.title = `条件1: ${!value}`;
    }

    @uiclick
    private onClickBtnCondition2(): void {
        const value = DataHelper.getValue("condition2", true);
        DataHelper.setValue("condition2", !value);
        this.btn_condition2.title = `条件2: ${!value}`;
    }

    @uiclick
    private onClickBtnCondition3(): void {
        const value = DataHelper.getValue("condition3", true);
        DataHelper.setValue("condition3", !value);
        this.btn_condition3.title = `条件3: ${!value}`;
    }

    @uiclick
    private onClickBtnCondition4(): void {
        const value = DataHelper.getValue("condition4", true);
        DataHelper.setValue("condition4", !value);
        this.btn_condition4.title = `条件4: ${!value}`;
    }
}
