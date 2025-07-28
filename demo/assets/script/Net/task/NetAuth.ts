/**
 * @Author: Gongxh
 * @Date: 2024-05-20
 * @Description: 新版鉴权接口
 */
import { kunpo } from "../../header";
import { INetResponse } from "../header";
import { NetHelper } from "../NetHelper";
import { NetTaskBase } from "../NetTaskBase";

interface IAuthResponse extends INetResponse {
    token: string;
    uid: number;    // 用户id
    sdkId: string;
    channel: number;
    /** 注册渠道 */
    regChannel: number;
}

/** 账户认证 */
export class NetAuth extends NetTaskBase {
    name: string = "NetSocketAuth";
    url: string = '/api/game/auth';
    constructor() {
        super()
    }

    public start(): void {
        let data = {
            channel: 25,
            token: kunpo.Platform.deviceId,
            openid: kunpo.Platform.deviceId,
            sdkChannel: 25,
            distinctId: ''
        }
        NetHelper.send(this.url, data, this);
    }

    protected onTaskComplete(data: IAuthResponse): void {

    }
}


