import { cc, fgui, kunpo } from '../../../header';
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

interface WindowData {
    content: string;
    title?: string;
    okTitle?: string;
    cancelTitle?: string;
    showClose?: boolean; // 显示关闭按钮
    emptyAreaClose?: boolean; // 点击空白区域关闭
    align?: cc.HorizontalTextAlignment; // 内容文本水平对齐方式  default:居中对齐
    leading?: number;//行距
    okNotClose?: boolean; // 点击OK按钮时不关闭本界面
    cancelNotClose?: boolean; // 点击取消按钮时不关闭本界面
    complete?: () => void; // 确定按钮的回调
    cancel?: () => void; // 取消按钮的回调
    close?: () => void; // 关闭界面的回调 (只有点击关闭按钮和空白位置关闭时才会触发)
}


@uiclass("Window", "Basics", "AlertWindow")
export class AlertWindow extends kunpo.Window {
    @uiprop private bg: fgui.GLoader;
    @uiprop private lab_title: fgui.GTextField;
    @uiprop private lab_content: fgui.GTextField;
    @uiprop private btn_close: fgui.GButton;
    @uiprop private btn_ok: fgui.GButton;
    @uiprop private btn_cancel: fgui.GButton;

    private _isEmptyAreaClose: boolean = false;
    private _window_data: WindowData = null;

    private _complete: () => void;
    private _cancel: () => void;
    private _closeFunc: () => void;

    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Full;
        this.type = kunpo.WindowType.Normal;
    }

    protected onAdapted() {
    }

    protected onShow(data: WindowData): void {
        this._complete = data.complete;
        this._cancel = data.cancel;
        this._closeFunc = data.close;
        this._window_data = data;

        // 标题
        if (data.title) {
            this.lab_title.text = data.title;
        } else {
            this.lab_title.visible = false;
        }

        // 关闭按钮
        this.btn_close.visible = !!data.showClose;

        // 空白位置关闭标记
        this._isEmptyAreaClose = !!data.emptyAreaClose;

        // 确定按钮
        if (data.okTitle) {
            this.btn_ok.title = data.okTitle;
        } else {
            this.btn_ok.visible = false;
        }

        // 取消按钮
        if (data.cancelTitle) {
            this.btn_cancel.text = data.cancelTitle;
        } else {
            this.btn_cancel.visible = false;
        }

        this.lab_content.text = data.content;
        let align = typeof data.align == "number" ? data.align : cc.Label.HorizontalAlign.CENTER;
        let leading = typeof data.leading == "number" ? data.leading : this.lab_content.leading;
        this.lab_content.align = align;
        this.lab_content.leading = leading;
        this.lab_content.ensureSizeCorrect();

        // 限制背景框高度
        if (this.bg.height < 500) {
            this.bg.height = 500;
        }

        // 确定取消按钮位置调整
        if (this.btn_ok.visible && !this.btn_cancel.visible) {
            this.btn_ok.x = this.bg.x + (this.bg.width - this.btn_ok.width) * 0.5;
        } else if (this.btn_cancel.visible && !this.btn_ok.visible) {
            this.btn_cancel.x = this.bg.x + (this.bg.width - this.btn_cancel.width) * 0.5;
        }
    }

    protected onClose(): void {

    }

    protected onEmptyAreaClick(): void {
        if (this._isEmptyAreaClose) {
            kunpo.WindowManager.closeWindow(this.name);
            this._closeFunc && this._closeFunc();
        }
    }

    @uiclick
    private onClickBtnClose(): void {
        kunpo.WindowManager.closeWindow(this.name);
        this._closeFunc && this._closeFunc();
    }

    @uiclick
    private onClickBtnOk(): void {
        !this._window_data.okNotClose && kunpo.WindowManager.closeWindow(this.name);
        this._complete && this._complete();
    }

    @uiclick
    private onClickBtnCancel(): void {
        !this._window_data.cancelNotClose && kunpo.WindowManager.closeWindow(this.name);
        this._cancel && this._cancel();
    }
}