/**
 * @Author: Gongxh
 * @Date: 2024-12-07
 * @Description: 适配用的类
 */

import { ResolutionPolicy, view } from "cc";
import { debug } from "../tool/log";
import { WindowManager } from "../ui/WindowManager";
import { GlobalEvent } from "./GlobalEvent";
import { Screen } from "./Screen";
import { size } from "./header";

export abstract class Adapter {
    /** @internal */
    public init() {
        debug("初始化适配器");
        // 设计尺寸 不会变化
        let designSize = this.getDesignSize();
        Screen.DesignHeight = designSize.height;
        Screen.DesignWidth = designSize.width;
        view.setDesignResolutionSize(Screen.DesignWidth, Screen.DesignHeight, ResolutionPolicy.SHOW_ALL);

        this.resize();
        this.registerResizeCallback((...args: any) => {
            debug("屏幕发生变化", ...args);
            this.resize();
        });
    }

    /** @internal */
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
        // 发送屏幕尺寸发生变化的消息
        GlobalEvent.send("kunpo::adapter::resize");
    }

    /** @internal */
    private printScreen() {
        debug(`设计分辨率: ${Screen.DesignWidth}x${Screen.DesignHeight}`);
        debug(`屏幕分辨率: ${Screen.ScreenWidth}x${Screen.ScreenHeight}`);
        debug(`安全区域高度: ${Screen.SafeAreaHeight}`);
        debug(`安全区宽高: ${Screen.SafeWidth}x${Screen.SafeHeight}`);
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