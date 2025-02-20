/**
 * @Author: Gongxh
 * @Date: 2024-12-08
 * @Description: 窗口的一些类型配置 
 */

/** 窗口显示时，对其他窗口的隐藏处理类型 */
export enum WindowType {
    /** 不做任何处理 */
    Normal = 0,
    /** 关闭所有 */
    CloseAll = 1 << 0,
    /** 关闭上一个 */
    CloseOne = 1 << 1,
    /** 隐藏所有 */
    HideAll = 1 << 2,
    /** 隐藏上一个 */
    HideOne = 1 << 3,
}

/** 窗口适配类型，默认全屏 */
export enum AdapterType {
    /** 全屏适配 */
    Full = 0,
    /** 空出刘海 */
    Bang = 1,
    /** 固定的 不适配 */
    Fixed = 2,
}

