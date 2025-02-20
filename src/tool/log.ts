/**
 * @Author: Gongxh
 * @Date: 2024-12-05
 * @Description: log相关的api
 */

import { KUNPO_DEBUG } from "../global/header";

function log(...args: any[]) {
    console.log("kunpo:", ...args);
}

/**
 * 开启debug模式后 输出调试信息 
 * @param args 
 */
function debug(...args: any[]): void {
    KUNPO_DEBUG && console.log("kunpo:", ...args);
}

/**
 * 信息性消息 某些浏览器中会带有小图标，但颜色通常与 log 相同
 * @param args 
 */
function info(...args: any[]): void {
    console.info("kunpo:", ...args);
}

/**
 * 警告信息 黄色背景，通常带有警告图标
 * @param args 
 */
function warn(...args: any[]): void {
    console.warn("kunpo:", ...args);
}

/**
 * 错误消息 红色背景，通常带有错误图标
 * @param args 
 */
function error(...args: any[]): void {
    console.error("kunpo:", ...args);
}
export { debug, error, info, log, warn };
