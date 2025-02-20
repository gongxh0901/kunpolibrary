/**
 * @Author: Gongxh
 * @Date: 2024-12-07
 * @Description: 模块接口
 */

export interface IModule {
    /** 模块名称 */
    moduleName: string;

    /** 模块初始化 */
    init(): void;
}