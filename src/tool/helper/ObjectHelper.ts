/**
 * @Author: Gongxh
 * @Date: 2024-12-12
 * @Description: 对象帮助类
 */
export class ObjectHelper {
    public static getObjectProp(obj: Record<string, any>, key: string): any {
        if (obj.hasOwnProperty(key)) {
            return obj[key];
        }
        return (obj[key] = Object.assign({}, obj[key]));
    }
}