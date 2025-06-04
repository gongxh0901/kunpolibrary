/**
 * @Author: Gongxh
 * @Date: 2024-12-07
 * @Description:cocos游戏入口 定义了游戏启动时的基本配置和初始化流程。
 */

import { _decorator, Component, director, game, JsonAsset, macro, sys } from "cc";
import { GlobalEvent } from "../global/GlobalEvent";
import { GlobalTimer } from "../global/GlobalTimer";
import { enableDebugMode, FrameConfig } from "../global/header";
import { InnerTimer } from "../global/InnerTimer";
import { Platform, PlatformType } from "../global/Platform";
import { ModuleBase } from "../module/ModuleBase";
import { debug, log } from "../tool/log";
import { Time } from "../tool/Time";
import { PropsHelper } from "../ui/PropsHelper";
import { CocosAdapter } from "./CocosAdapter";
const _global = (globalThis || window || global) as any;
const { property } = _decorator;
export abstract class CocosEntry extends Component {
    @property({ displayName: "uiConfig", type: JsonAsset, tooltip: "编辑器导出的UI配置, 可不设置, 之后通过 PropsHelper.setConfig 手动设置" }) uiConfig: JsonAsset = null;
    @property({ displayName: "游戏帧率" }) fps: number = 60;

    /**
     * 虚函数，子类需要实现
     * kunpo库初始化完成后调用
     */
    public abstract onInit(): void;

    public getConfig(): FrameConfig {
        return {};
    }

    /**
     * 开始初始化kunpo框架
     * @internal
     */
    protected start(): void {
        log("开始初始化kunpo框架");

        const config = this.getConfig();
        enableDebugMode(config.debug);

        // 设置游戏真帧率
        game.frameRate = this.fps;
        director.addPersistRootNode(this.node);
        this.node.setSiblingIndex(this.node.children.length - 1);
        PropsHelper.setConfig(this.uiConfig?.json);
        this.initPlatform();
        this.initEvent();
        this.initTime();
        this.initAdapter();
        this.initModule();
        log("kunpo框架初始化完成");
        this.onInit();
    }

    /**
     * 初始化平台
     * @internal
     */
    private initPlatform(): void {
        // 处理平台判断
        Platform.isNative = sys.isNative;
        Platform.isMobile = sys.isMobile;
        Platform.isNativeMobile = sys.isNative && sys.isMobile;

        switch (sys.os) {
            case sys.OS.ANDROID:
                Platform.isAndroid = true;
                debug("系统类型 Android");
                break;
            case sys.OS.IOS:
                Platform.isIOS = true;
                debug("系统类型 IOS");
                break;
            case sys.OS.OPENHARMONY:
                Platform.isHarmonyOS = true;
                debug("系统类型 HarmonyOS");
                break;
            default:
                break;
        }

        switch (sys.platform) {
            case sys.Platform.WECHAT_GAME:
                Platform.isWX = true;
                Platform.platform = PlatformType.WX;
                break;
            case sys.Platform.ALIPAY_MINI_GAME:
                Platform.isAlipay = true;
                Platform.platform = PlatformType.Alipay;
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:
                Platform.isBytedance = true;
                Platform.platform = PlatformType.Bytedance;
                break
            case sys.Platform.HUAWEI_QUICK_GAME:
                Platform.isHuaweiQuick = true;
                Platform.platform = PlatformType.HuaweiQuick;
                break;
            default:
                // 其他都设置为浏览器
                Platform.isBrowser = true;
                Platform.platform = PlatformType.Browser;
                break;
        }
        debug(`platform: ${PlatformType[Platform.platform]}`);
    }

    /**
     * 初始化事件
     * @internal
     */
    private initEvent(): void {
        GlobalEvent._initGlobalEvent();
    }

    /**
     * 初始化时间
     * @internal
     */
    private initTime(): void {
        Time._configBoot();
        InnerTimer.initTimer();
        GlobalTimer.initTimer();
        this.schedule(this.tick.bind(this), 0, macro.REPEAT_FOREVER);
    }

    /**
     * 初始化适配器
     * @internal
     */
    private initAdapter(): void {
        new CocosAdapter().init();
    }

    /**
     * 初始化模块
     * @internal
     */
    private initModule(): void {
        debug(`初始化模块`);
        // 递归查找自身或所有子节点中指定类型的组件。
        for (const module of this.getComponentsInChildren(ModuleBase)) {
            debug(`module:${module.moduleName}`);
            module.init();
        }
    }

    /**
     * 更新
     * @param dt 时间间隔
     * @internal
     */
    private tick(dt: number): void {
        InnerTimer.update(dt);
        GlobalTimer.update(dt);
    }
}