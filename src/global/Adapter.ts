/**
 * @Author: Gongxh
 * @Date: 2024-12-07
 * @Description: 适配用的类
 */

import { ResolutionPolicy, view } from "cc";
import { info } from "../tool/log";
import { WindowManager } from "../ui/WindowManager";
import { Screen } from "./Screen";
import { size } from "./header";

export abstract class Adapter {
    public init() {
        // 设计尺寸 不会变化
        let designSize = this.getDesignSize();
        Screen.DesignHeight = designSize.height;
        Screen.DesignWidth = designSize.width;
        view.setDesignResolutionSize(Screen.DesignWidth, Screen.DesignWidth, ResolutionPolicy.SHOW_ALL);

        this.resize();
        this.registerResizeCallback((...args: any) => {
            info("屏幕发生变化", ...args);
            this.resize();
        });
    }

    protected resize(): void {
        Screen.SafeAreaHeight = 60;
        // 屏幕像素尺寸
        const winSize = this.getScreenSize();
        const isDesignLandscape = Screen.DesignWidth > Screen.DesignHeight;
        const isLandscape = winSize.width > winSize.height;
        if (isDesignLandscape == isLandscape) {
            Screen.ScreenWidth = winSize.width;
            Screen.ScreenHeight = winSize.height;
        } else {
            Screen.ScreenWidth = winSize.height;
            Screen.ScreenHeight = winSize.width;
        }
        if (isDesignLandscape) {
            // 横屏
            /** 安全区的宽度 */
            Screen.SafeWidth = Screen.ScreenWidth - Screen.SafeAreaHeight * 2;
            /** 安全区的高度 */
            Screen.SafeHeight = Screen.ScreenHeight;
        } else {
            // 竖屏
            /** 安全区的宽度 */
            Screen.SafeWidth = Screen.ScreenWidth;
            /** 安全区的高度 */
            Screen.SafeHeight = Screen.ScreenHeight - Screen.SafeAreaHeight * 2;
        }
        WindowManager._screenResize();
        this.printScreen();
    }

    private printScreen() {
        info(`设计分辨率: ${Screen.DesignWidth}x${Screen.DesignHeight}`);
        info(`屏幕分辨率: ${Screen.ScreenWidth}x${Screen.ScreenHeight}`);
        info(`安全区域高度: ${Screen.SafeAreaHeight}`);
        info(`安全区宽高: ${Screen.SafeWidth}x${Screen.SafeHeight}`);
    }

    /**
     * 获取屏幕尺寸
     * @abstract 子类实现
     * @returns {size}
     */
    protected abstract getScreenSize(): size;

    /**
     * 获取设计尺寸
     * @abstract 子类实现
     * @returns {size}
     */
    protected abstract getDesignSize(): size;

    /**
     * 设置尺寸发生变化的监听
     * @abstract 子类实现
     * @param callback 
     */
    protected abstract registerResizeCallback(callback: () => void): void;
}