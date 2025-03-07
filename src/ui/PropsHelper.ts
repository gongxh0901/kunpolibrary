/**
 * @Author: Gongxh
 * @Date: 2025-01-09
 * @Description: 属性辅助类
 */

import { GComponent } from "fairygui-cc";
import { warn } from "../tool/log";

interface IPropsConfig {
    [packageName: string]: { [componentName: string]: IPropsInfo };
}

interface IPropsInfo {
    props: (string | number)[];
    callbacks: (string | number)[];
}

/** @internal */
export class PropsHelper {
    /** @internal */
    private static _config: IPropsConfig = {};
    /** @internal */
    public static setConfig(config: IPropsConfig): void {
        this._config = config;
    }

    /** 序列化属性 @internal */
    public static serializeProps(component: GComponent, packageName: string): void {
        if (!this._config) {
            return;
        }
        const config = this._config[packageName];
        if (!config) {
            return;
        }
        const componentName = component.name;
        const propsInfo = config[componentName];
        if (!propsInfo) {
            return;
        }
        // 设置属性
        const props = propsInfo.props;
        this.serializationPropsNode(component, props);

        // 设置回调
        const callbacks = propsInfo.callbacks;
        this.serializationCallbacksNode(component, callbacks);
    }

    /** 给界面中定义的属性赋值 @internal */
    private static serializationPropsNode(component: GComponent, props: (string | number)[]) {
        const propsCount = props.length;
        // [name1, len, ...props1, name2, len, ...props2, ...]
        let index = 0;
        while (index < propsCount) {
            const propName = props[index++] as string;
            const endIndex = index + (props[index] as number);
            let uinode = component;
            while (++index <= endIndex) {
                uinode = uinode.getChildAt(props[index] as number);
                if (!uinode) {
                    warn(`无法对UI类（${component.name}）属性（${propName}）赋值，请检查节点配置是否正确`);
                    break;
                }
            }
            (component as any)[propName] = (uinode == component ? null : uinode);
        }
    }

    /** 给界面中定义的回调赋值 @internal */
    private static serializationCallbacksNode(component: GComponent, callbacks: (string | number)[]) {
        const propsCount = callbacks.length;
        // [name1, len, ...props1, name2, len, ...props2, ...]
        let index = 0;
        while (index < propsCount) {
            const propName = callbacks[index++] as string;
            const endIndex = index + (callbacks[index] as number);
            let uinode = component;
            while (++index <= endIndex) {
                uinode = uinode.getChildAt(callbacks[index] as number);
                if (!uinode) {
                    warn(`无法对UI类（${component.name}）的（${propName}）设置回调，请检查节点配置是否正确`);
                    break;
                }
            }
            if (uinode != component) {
                uinode.onClick((component as any)[propName], component);
            }
        }
    }
}

