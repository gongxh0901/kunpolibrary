/**
 * @Author: Gongxh
 * @Date: 2025-02-17
 * @Description: 条件4 关联数据condition4
 */
import { GlobalEvent } from 'kunpocc-event';
import { DataHelper } from '../Data/DataHelper';
import { kunpo } from '../header';
import { ConditionType } from './ConditionType';
const { conditionClass } = kunpo._conditionDecorator;

@conditionClass(ConditionType.Condition4)
export class Condition4 extends kunpo.ConditionBase {
    protected onInit(): void {
        GlobalEvent.add("condition4", () => {
            this.tryUpdate();
        }, this);
    }

    protected evaluate(): boolean {
        return DataHelper.getValue("condition4", true);
    }
}