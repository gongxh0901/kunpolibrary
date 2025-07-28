/**
 * @Author: Gongxh
 * @Date: 2025-03-22
 * @Description: 
 */

import { GlobalEvent } from "kunpocc-event";

export class SDKHelper {
    private static _manifestUrl: string = "";
    public static getSystemInfo(): Promise<{ version: string, build: number }> {
        return new Promise((resolve, reject) => {
            KunpoSDK.SDKHelper.getInstance().getSystemInfo();
            GlobalEvent.addOnce("calljs::getSystemInfo", (data: { version: string, build: number }) => {
                resolve(data);
            }, this);
        });
    }

    public static set manifestUrl(url: string) {
        this._manifestUrl = url;
    }

    public static get manifestUrl(): string {
        return this._manifestUrl;
    }
}
