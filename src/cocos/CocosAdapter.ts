/**
 * @Author: Gongxh
 * @Date: 2024-12-08
 * @Description: 
 */

import { screen as ccScreen, view } from "cc";
import { Adapter } from "../global/Adapter";
import { size } from "../global/header";
import { debug } from "../tool/log";

export class CocosAdapter extends Adapter {
    /**
     * 获取屏幕像素尺寸
     * @returns {size}
     * @internal
     */
    protected getScreenSize(): size {
        let windowSize = ccScreen.windowSize;
        let width = Math.ceil(windowSize.width / view.getScaleX());
        let height = Math.ceil(windowSize.height / view.getScaleY());
        return { width, height };
    }

    /**
     * 获取设计尺寸
     * @returns {size}
     * @internal
     */
    protected getDesignSize(): size {
        let designSize = view.getDesignResolutionSize();
        return { width: designSize.width, height: designSize.height };
    }

    /**
     * 设置尺寸发生变化的监听
     * @param callback 回调
     * @internal
     */
    protected registerResizeCallback(callback: (...args: any) => void): void {
        ccScreen.on("window-resize", (...args: any) => {
            debug("window-resize");
            callback(...args);
        }, this);
        ccScreen.on("orientation-change", (...args: any) => {
            debug("orientation-change");
            callback(...args);
        }, this);
        ccScreen.on("fullscreen-change", (...args: any) => {
            debug("fullscreen-change");
            callback(...args);
        }, this);
    }
}
