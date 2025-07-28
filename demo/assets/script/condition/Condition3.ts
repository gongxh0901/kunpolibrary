/**
 * @Author: Gongxh
 * @Date: 2025-02-17
 * @Description: 条件3 关联数据condition3
 */
import { GlobalEvent } from 'kunpocc-event';
import { DataHelper } from '../Data/DataHelper';
import { kunpo } from '../header';
import { ConditionType } from './ConditionType';
const { conditionClass } = kunpo._conditionDecorator;

@conditionClass(ConditionType.Condition3)
export class Condition3 extends kunpo.ConditionBase {
    protected onInit(): void {
        GlobalEvent.add("condition3", () => {
            this.tryUpdate();
        }, this);
    }

    protected evaluate(): boolean {
        return DataHelper.getValue("condition3", true);
    }
}