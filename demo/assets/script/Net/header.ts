/**
 * @Author: Gongxh
 * @Date: 2024-12-28
 * @Description: 
 */

export interface INetResponse {
    responseStatus: number;
    packet: any;
}

export interface IServerInfo {
    /** 名称 */
    name: string,
    /** http地址 */
    url: string,
    /** 应用id */
    appid: string,
    /** 密钥 */
    secret: string,
}

export const ServerConfig: IServerInfo = {
    name: "dev-gblnn",
    url: "",
    appid: "",
    secret: "",
}