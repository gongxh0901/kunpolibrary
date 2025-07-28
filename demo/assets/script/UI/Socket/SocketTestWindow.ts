/**
 * @Author: Gongxh
 * @Date: 2025-03-29
 * @Description: 
 */
import { Socket } from "kunpocc-net";
import { fgui, kunpo } from "../../header";
import { ProtoInfos } from "../../Socket/ProtoInfos";
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

@uiclass("Window", "Socket", "SocketTestWindow")
export class SocketTestWindow extends kunpo.Window {
    @uiprop private text_input: fgui.GTextInput;
    @uiprop private text_input_message: fgui.GTextInput;

    private _status: fgui.Controller;
    private socket: Socket;
    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.Normal;

        this._status = this.getController("status");

        this.text_input.text = "ws://10.8.36.142:8080";
    }

    @uiclick
    private onCloseWindow(): void {
        kunpo.WindowManager.closeWindow(this.name);
    }

    @uiclick
    private onConnection(): void {
        if (this.socket) {
            kunpo.WindowManager.showWindowIm("ToastWindow", { text: "已经存在一个连接" });
            return;
        }
        this.socket = new Socket(this.text_input.text, { binaryType: "arraybuffer" });
        this.socket.onopen = () => {
            kunpo.log("连接成功");
            kunpo.WindowManager.showWindowIm("ToastWindow", { text: "连接成功" });
            this._status.setSelectedIndex(1);
        }
        this.socket.onmessage = (data: any) => {
            kunpo.log("收到消息", data);
        }

        this.socket.onclose = (code: number, reason: string) => {
            kunpo.log("连接关闭", code, reason);
            this._status.setSelectedIndex(0);
            kunpo.WindowManager.showWindowIm("ToastWindow", { text: `连接断开 code:${code} reason:${reason}` });
            this.socket = null;
        }
    }

    @uiclick
    private onDisconnect(): void {
        this.socket?.close(3001, "主动断开");
    }

    @uiclick
    private onSendText(): void {
        if (!this.text_input_message.text) {
            kunpo.WindowManager.showWindowIm("ToastWindow", { text: "请输入要发送的消息" });
            return;
        }
        this.socket?.send(this.text_input_message.text);
    }

    /**
     * 发送二进制这里使用 protobuf
     */
    @uiclick
    private onSendBinary(): void {
        if (!this.text_input_message.text) {
            kunpo.WindowManager.showWindowIm("ToastWindow", { text: "请输入要发送的消息" });
            return;
        }
        let protoInfos = new ProtoInfos();
        let buffer = protoInfos.encodeData(1, this.text_input_message.text);
        this.socket?.sendBuffer(buffer);
    }
}
