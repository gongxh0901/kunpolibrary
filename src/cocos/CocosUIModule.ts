/**
 * @Author: Gongxh
 * @Date: 2024-12-07
 * @Description: cocos UI模块
 */
import { _decorator } from "cc";

import { GRoot } from "fairygui-cc";
import { ModuleBase } from "../module/ModuleBase";
import { debug } from "../tool/log";
import { _uidecorator } from "../ui/UIDecorator";
import { WindowManager } from "../ui/WindowManager";
import { WindowResPool } from "../ui/WindowResPool";
import { CocosWindowContainer } from "./CocosWindowContainer";

const { ccclass, menu, property } = _decorator;

@ccclass("CocosUIModule")
@menu("kunpo/UI/UIModule")
export class CocosUIModule extends ModuleBase {
    /** 模块名称 */
    public moduleName: string = "UI模块";
    /** 模块初始化 (内部使用) @internal */
    public init(): void {
        /** 初始化窗口管理系统 */
        WindowManager._init(new WindowResPool());
        GRoot.create();
        debug("初始化 WindowContainers");
        for (const child of this.node.children) {
            const containerComponent = child.getComponent(CocosWindowContainer);
            containerComponent?.init();
        }
        // fgui.UIObjectFactory.setLoaderExtension(GLoader);
        // this._uiInitializer = new UIInitializer(this.node, this.getPackageLoader());
        // this._uiInitializer.init(this.reAdaptWhenScreenResize, this.fullIfWideScreen);
        this.node.destroyAllChildren();
        /** 注册窗口信息 */
        WindowManager.registerUI();
        _uidecorator.setRegisterFinish();
        this.onInit();
    }

    /** 模块初始化完成后调用的函数 */
    protected onInit(): void {
        debug("UIModule init complete");
    }
}