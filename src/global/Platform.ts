/**
 * @Author: Gongxh
 * @Date: 2024-12-07
 * @Description: 平台相关
 */

export enum PlatformType {
    Android = 1,
    IOS,
    HarmonyOS,
    /** 微信小游戏 */
    WX,
    /** 支付宝小游戏 */
    Alipay,
    /** 字节小游戏 */
    Bytedance,
    /** 华为快游戏 */
    HuaweiQuick,
    /** 其他都为Browser */
    Browser,
}

export class Platform {
    /**
     * 是否为原生平台
     * @type {boolean}
     */
    public static isNative: boolean = false;

    /**
     * 是否为移动平台
     * @type {boolean}
     */
    public static isMobile: boolean = false;

    /**
     * 是否为原生移动平台
     * @type {boolean}
     */
    public static isNativeMobile: boolean = false;

    /**
     * 是否为安卓平台
     * @type {boolean}
     */
    public static isAndroid: boolean = false;

    /**
     * 是否为IOS平台
     * @type {boolean}
     */
    public static isIOS: boolean = false;

    /**
     * 是否为HarmonyOS平台
     * @type {boolean}
     */
    public static isHarmonyOS: boolean = false;

    /**
     * 是否为微信小游戏
     * @type {boolean}
     */
    public static isWX: boolean = false;

    /**
     * 是否为支付宝小游戏
     * @type {boolean}
     */
    public static isAlipay: boolean = false;

    /**
     * 是否为字节小游戏
     * @type {boolean}
     */
    public static isBytedance: boolean = false;

    /** 
     * 是否是华为快游戏
     * @type {boolean}
     */
    public static isHuaweiQuick: boolean = false;

    /**
     * 是否为浏览器
     * @type {boolean}
     */
    public static isBrowser: boolean = false;

    /**
     * 平台名
     * @type {string}
     */
    public static platform: PlatformType;

    /**
     * 设备ID
     * @type {string}
     */
    public static deviceId: string;
}