/**
 * @Author: Gongxh
 * @Date: 2025-02-17
 * @Description: 条件2 关联数据condition2
 */
import { GlobalEvent } from 'kunpocc-event';
import { DataHelper } from '../Data/DataHelper';
import { kunpo } from '../header';
import { ConditionType } from './ConditionType';
const { conditionClass } = kunpo._conditionDecorator;

@conditionClass(ConditionType.Condition2)
export class Condition2 extends kunpo.ConditionBase {
    protected onInit(): void {
        GlobalEvent.add("condition2", () => {
            this.tryUpdate();
        }, this);
    }

    protected evaluate(): boolean {
        return DataHelper.getValue("condition2", true);
    }
}