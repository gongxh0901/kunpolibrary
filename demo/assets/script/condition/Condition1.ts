/**
 * @Author: Gongxh
 * @Date: 2025-02-17
 * @Description: 条件1 关联数据conditon1
 */
import { GlobalEvent } from 'kunpocc-event';
import { DataHelper } from '../Data/DataHelper';
import { kunpo } from '../header';
import { ConditionType } from './ConditionType';
const { conditionClass } = kunpo._conditionDecorator;

@conditionClass(ConditionType.Condition1)
export class Condition1 extends kunpo.ConditionBase {
    protected onInit(): void {
        GlobalEvent.add("condition1", () => {
            this.tryUpdate();
        }, this);
    }

    protected evaluate(): boolean {
        return DataHelper.getValue("condition1", true);
    }
}