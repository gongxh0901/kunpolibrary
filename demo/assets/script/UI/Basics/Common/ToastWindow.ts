/*
 * @Description: 通用Toast提示
 * @Author: Gongxh
 * @Date: 2021-04-27 09:20:14
 */

import { cc, fgui, kunpo } from "../../../header";
interface ToastData {
    text: string, // 文本
    duration?: number, // 持续时间
    swallowTouch?: boolean, // 吞噬touch事件
    showMask?: boolean, // 显示遮罩
    align?: cc.HorizontalTextAlignment // 对齐方式
}

const { uiclass, uiprop } = kunpo._uidecorator;
@uiclass("Toast", "Basics", "ToastWindow")
export class ToastWindow extends kunpo.Window {
    @uiprop private toast: fgui.GComponent;
    @uiprop private labTips: fgui.GTextField;
    @uiprop private bgMask: fgui.GGraph;

    private _showTransition: fgui.Transition;
    private _hideTransition: fgui.Transition;

    private _swallowTouch: boolean = false; // 吞噬touch事件
    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Full;
        this.type = kunpo.WindowType.Normal;
        this.bgAlpha = 0;

        this._showTransition = this.toast.getTransition("show");
        this._hideTransition = this.toast.getTransition("hide");
    }

    /**
     * 参数说明
     * @param {string} data.text toast文本
     * @param {number} data.duration 存在时间（ < 0）为常驻 default 2秒
     * @param {boolean} data.swallowTouch 吞噬touch事件 default 不吞噬
     * @param {boolean} data.showMask 是否显示半透明遮罩 (当显示遮罩时，必定吞噬touch事件) default 不显示
     * @param {cc.HorizontalTextAlignment} data.align 横向文本对齐方式 default 居中对齐
     */
    protected onShow(data: ToastData): void {
        this.bgMask.visible = data.showMask;
        this._swallowTouch = data.showMask ? true : (data.swallowTouch || false);
        this.opaque = this._swallowTouch;
        // if (this._swallowTouch) {
        //     this.node.on(cc.Node.EventType.TOUCH_END, () => { }, this.node);
        // } else {
        //     this.node.targetOff(this.node);
        // }

        this.labTips.text = data.text;

        let align = data.align || cc.HorizontalTextAlignment.CENTER;
        this.labTips.align = align;
        this.labTips.autoSize = fgui.AutoSizeType.Both;
        this.labTips.ensureSizeCorrect();
        // 调整文本尺寸
        let maxWidht = 504;
        if (this.labTips.width > maxWidht) {
            this.labTips.autoSize = fgui.AutoSizeType.Height;
            this.labTips.width = maxWidht;
            this.labTips.ensureSizeCorrect();
        } else {
            this.labTips.autoSize = fgui.AutoSizeType.Both;
        }


        this._showTransition.stop(true);
        this._hideTransition.stop(true);
        this._showTransition.play(() => {
            let duration = data.duration || 2.0
            if (duration > 0) {
                this._hideTransition.play(() => {
                    kunpo.WindowManager.closeWindow(this.name);
                }, 1, duration);
            }
        }, 1, 0);
    }

    protected onClose(): void {

    }
}