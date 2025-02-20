/**
 * 行为树数据
 */
interface ITreeData {
    nodeMemory: { [nodeScope: string]: any };
    openNodes: any[];
}

/** 平台 */
export class Blackboard {
    public interruptDefend: boolean = false; // 行为树打断保护
    public interrupt: boolean = false; // 打断行为树的标记
    private _baseMemory: any;
    private _treeMemory: { [treeScope: string]: ITreeData };

    constructor() {
        this._baseMemory = {};
        this._treeMemory = {};
    }

    clear(): void {
        this._baseMemory = {};
        this._treeMemory = {};
    }

    set(key: string, value: any, treeScope?: string, nodeScope?: string): void {
        let memory = this._getMemory(treeScope, nodeScope);
        memory[key] = value;
    }

    get(key: string, treeScope?: string, nodeScope?: string): any {
        let memory = this._getMemory(treeScope, nodeScope);
        return memory[key];
    }

    private _getTreeMemory(treeScope: string): ITreeData {
        if (!this._treeMemory[treeScope]) {
            this._treeMemory[treeScope] = {
                nodeMemory: {},
                openNodes: [],
            };
        }
        return this._treeMemory[treeScope];
    }

    private _getNodeMemory(treeMemory: ITreeData, nodeScope: string): { [key: string]: any } {
        let memory = treeMemory.nodeMemory;
        if (!memory[nodeScope]) {
            memory[nodeScope] = {};
        }
        return memory[nodeScope];
    }

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