

import { kunpo } from '../../../header';
const { uiclass, uiprop } = kunpo._uidecorator;

/** UI界面资源加载等待界面 */
@uiclass("Wait", "Basics", "LoadUIWindow")
export class LoadUIWindow extends kunpo.Window {
    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Full;
        this.type = kunpo.WindowType.Normal;
    }
}