/**
 * @Author: Gongxh
 * @Date: 2024-12-08
 * @Description: 
 */

import { Component, _decorator } from "cc";
import { GComponent, GRoot } from "fairygui-cc";
import { Screen } from "../global/Screen";
import { info } from "../tool/log";
import { WindowGroup } from "../ui/WindowGroup";
import { WindowManager } from "../ui/WindowManager";
const { ccclass, property, menu } = _decorator;
@ccclass("CocosWindowContainer")
@menu("kunpo/UI/UIContainer")
export class CocosWindowContainer extends Component {
    @property({ displayName: "忽略顶部窗口查询", tooltip: "当通过窗口管理器获取顶部窗口时，是否忽略查询" }) ignoreQuery: boolean = false;
    @property({ displayName: "吞噬触摸事件", tooltip: "窗口组是否会吞噬触摸事件，防止层级下的窗口接收触摸事件" }) swallowTouch: boolean = false;
    @property({ displayName: "底部遮罩透明度", tooltip: "底部半透明遮罩的默认透明度", min: 0, max: 1, step: 0.01 }) bgAlpha: number = 0.75;
    /**
     * 初始化窗口容器
     */
    public init(): void {
        let name = this.node.name;
        info(`\tUIContainer name:${name} 忽略顶部窗口查询:${this.ignoreQuery} 吞噬触摸事件:${this.swallowTouch}`);
        const root = new GComponent();
        root.name = name;
        root.node.name = name;
        root.visible = false;
        root.opaque = this.swallowTouch;
        root.setSize(Screen.ScreenWidth, Screen.ScreenHeight, true);
        GRoot.inst.addChild(root);
        WindowManager._addWindowGroup(new WindowGroup(name, root, this.ignoreQuery, this.swallowTouch, this.bgAlpha));
    }
}