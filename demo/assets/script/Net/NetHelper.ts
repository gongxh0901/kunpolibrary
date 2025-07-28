/**
 * @Author: Gongxh
 * @Date: 2024-05-20
 * @Description: 
 */
import { HttpManager, IHttpEvent } from "kunpocc-net";
import { kunpo } from "../header";
import { ServerConfig } from "./header";


export class NetHelper {
    public static get url(): string { return ServerConfig.url };
    public static get appid(): string { return ServerConfig.appid };
    public static get secret(): string { return ServerConfig.secret };

    public static send(url: string, data: any, netEvent: IHttpEvent) {
        netEvent.data = new Date().getTime();
        let sendData = JSON.stringify(data);
        console.log(`http request\n name:${netEvent.name}\n   url=${this.url + url}\n   data=${sendData}`);
        HttpManager.post(this.url + url, sendData, "json", netEvent, this.formatHeaders(netEvent.data, data), 5);
    }

    private static formatHeaders(time: number, data: any): any[] {
        return ["content-type", "application/json", "sign", this.signCalculateJSON(time, data), "time", encodeURIComponent(String(time)), "authorization", ""];
    }

    /** 计算签名 */
    public static signCalculateJSON(time: number, data: any): string {
        let signData = {
            appid: this.appid,
            signkey: this.secret,
            time: time,
            body: JSON.stringify(data)
        }
        let keys = Object.keys(signData);
        keys.sort();
        let signStr = [];
        for (let key of keys) {
            signStr.push(`${key}=${signData[key]}&`);
        }
        return encodeURIComponent(kunpo.md5(signStr.join("")));
    }
}