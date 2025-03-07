
/**
 * @Author: Gongxh
 * @Date: 2024-12-07
 * @Description: 模块基类
 */

import { Component } from "cc";
import { IModule } from "../global/IModule";

export abstract class ModuleBase extends Component implements IModule {
    /** 模块名称 */
    public moduleName: string;

    /** 模块初始化 (内部使用) */
    public init(): void { }

    /** 模块初始化完成后调用的函数 */
    protected abstract onInit(): void;
}
