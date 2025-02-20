/**
 * @Author: Gongxh
 * @Date: 2024-12-08
 * @Description: 一些数据结构
 */

import { warn } from "../tool/log";

export interface size {
    width: number;
    height: number;
}

export interface FrameConfig {
    /** 开启debug 默认: false */
    debug?: boolean;
}

export let KUNPO_DEBUG: boolean = false;
/**
 * 启用或禁用调试模式。
 * @param enable - 如果为 true，则启用调试模式；如果为 false，则禁用调试模式。不设置默认不开启
 */
export function enableDebugMode(enable: boolean): void {
    if (enable == true) {
        KUNPO_DEBUG = true;
        warn("调试模式已开启");
    } else {
        KUNPO_DEBUG = false;
    }
}