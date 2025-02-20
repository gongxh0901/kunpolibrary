/**
 * @Author: Gongxh
 * @Date: 2024-12-26
 * @Description: 自定义组件扩展帮助类
 */
import { UIObjectFactory } from "fairygui-cc";
import { debug } from "../tool/log";
import { PropsHelper } from "./PropsHelper";
import { _uidecorator } from "./UIDecorator";

export class ComponentExtendHelper {
    public static register(): void {
        for (const { ctor, res } of _uidecorator.getComponentMaps().values()) {
            debug(`自定义组件注册  组件名:${res.name} 包名:${res.pkg}`);
            this.registerComponent(ctor, res.pkg, res.name);
        }
    }

    /**
     * 注册自定义组件信息
     * @param info 
     */
    private static registerComponent(ctor: any, pkg: string, name: string): void {
        // 自定义组件扩展
        const onConstruct = function (this: any): void {
            PropsHelper.serializeProps(this, pkg);
            this.onInit && this.onInit();
        };
        ctor.prototype.onConstruct = onConstruct;
        // 自定义组件扩展
        UIObjectFactory.setExtension(`ui://${pkg}/${name}`, ctor);
    }
}