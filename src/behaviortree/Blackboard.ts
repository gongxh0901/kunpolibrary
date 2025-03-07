/**
 * 行为树数据
 */
interface ITreeData {
    nodeMemory: { [nodeScope: string]: any };
    openNodes: any[];
}

/** 平台 */
export class Blackboard {
    /** 行为树打断保护 */
    public interruptDefend: boolean = false;
    /** 打断行为树的标记 */
    public interrupt: boolean = false;
    /** 基础记忆 @internal */
    private _baseMemory: any;
    /** 树记忆 @internal */
    private _treeMemory: { [treeScope: string]: ITreeData };

    constructor() {
        this._baseMemory = {};
        this._treeMemory = {};
    }

    /**
     * 清除
     */
    public clear(): void {
        this._baseMemory = {};
        this._treeMemory = {};
    }

    /**
     * 设置
     * @param key 键
     * @param value 值
     * @param treeScope 树范围
     * @param nodeScope 节点范围
     */
    public set(key: string, value: any, treeScope?: string, nodeScope?: string): void {
        let memory = this._getMemory(treeScope, nodeScope);
        memory[key] = value;
    }

    /**
     * 获取
     * @param key 键
     * @param treeScope 树范围
     * @param nodeScope 节点范围
     * @returns 值
     */
    public get(key: string, treeScope?: string, nodeScope?: string): any {
        let memory = this._getMemory(treeScope, nodeScope);
        return memory[key];
    }

    /**
     * 获取树记忆
     * @param treeScope 树范围
     * @returns 树记忆
     * @internal
     */
    private _getTreeMemory(treeScope: string): ITreeData {
        if (!this._treeMemory[treeScope]) {
            this._treeMemory[treeScope] = {
                nodeMemory: {},
                openNodes: [],
            };
        }
        return this._treeMemory[treeScope];
    }

    /**
     * 获取节点记忆
     * @param treeMemory 树记忆
     * @param nodeScope 节点范围
     * @returns 节点记忆
     * @internal
     */
    private _getNodeMemory(treeMemory: ITreeData, nodeScope: string): { [key: string]: any } {
        let memory = treeMemory.nodeMemory;
        if (!memory[nodeScope]) {
            memory[nodeScope] = {};
        }
        return memory[nodeScope];
    }

    /**
     * 获取记忆
     * @param treeScope 树范围
     * @param nodeScope 节点范围
     * @returns 记忆
     * @internal
     */
    private _getMemory(treeScope?: string, nodeScope?: string): { [key: string]: any } {
        let memory = this._baseMemory;
        if (treeScope) {
            memory = this._getTreeMemory(treeScope);
            if (nodeScope) {
                memory = this._getNodeMemory(memory, nodeScope);
            }
        }
        return memory;
    }
}