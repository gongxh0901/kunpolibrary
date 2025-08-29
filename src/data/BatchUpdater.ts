import { BindManager } from './BindManager';
import { BindInfo, IDataEvent } from './types';

/**
 * 挂起更新信息
 */
interface PendingUpdate {
    /** 绑定器信息 */
    info: BindInfo;
    /** 路径变化事件 */
    event: IDataEvent;
}

/**
 * 批量更新调度器
 * 负责将同一帧内的多次数据变化合并为一次更新，提升性能
 */
export class BatchUpdater {
    /** 挂起的更新任务集合 */
    private static pendingUpdates = new Map<string, PendingUpdate>();
    /** 是否已调度批量更新 */
    private static isScheduled = false;
    /** 立即更新的绑定器集合（防重复触发） */
    private static immediateUpdates = new Set<string>();

    /**
     * 通知所有匹配的绑定器
     * @param event 路径变化事件
     */
    public static notifyBindings(event: IDataEvent): void {
        const bindInfos = BindManager.getMatchingBindings(event.path);

        for (const info of bindInfos) {
            if (info.immediate) {
                // 立即更新模式
                this.executeImmediateUpdate(info, event);
            } else {
                // 批量更新模式
                this.scheduleBatchUpdate(info, event);
            }
        }
    }

    /**
     * 执行立即更新（防止同一帧内重复触发）
     * @param info 绑定器
     * @param event 变化事件
     */
    private static executeImmediateUpdate(info: BindInfo, event: IDataEvent): void {
        const key = this.getBindingKey(info);

        // 防止同一帧内重复执行
        if (this.immediateUpdates.has(key)) {
            return;
        }

        this.immediateUpdates.add(key);

        try {
            info.callback.call(info.target, event);
        } catch (error) {
            console.error(`绑定器回调执行失败，路径：${event.path}`, error);
        } finally {
            // 下一帧清理标记
            setTimeout(() => {
                this.immediateUpdates.delete(key);
            }, 0);
        }
    }

    /**
     * 调度批量更新
     * @param info 绑定器
     * @param event 变化事件
     */
    private static scheduleBatchUpdate(info: BindInfo, event: IDataEvent): void {
        const key = this.getBindingKey(info);

        // 同一绑定器在一帧内只保留最后一次更新
        this.pendingUpdates.set(key, { info, event });

        // 如果还未调度，则调度一次批量更新
        if (!this.isScheduled) {
            this.isScheduled = true;
            setTimeout(() => this.flush(), 0);
        }
    }

    /**
     * 执行所有挂起的更新任务
     */
    private static flush(): void {
        // 先复制当前状态
        // 清理原始状态
        // 安全处理复制的数据
        const updates = Array.from(this.pendingUpdates.values());
        this.pendingUpdates.clear();
        this.isScheduled = false;

        for (const { info, event } of updates) {
            try {
                let target = info.target;
                if (info.isMethod) {
                    info.callback.call(target, event.target);
                } else {
                    info.callback.call(target, target[info.prop], event.isProp ? event.value : undefined, event.target);
                }
            } catch (error) {
                // 单个绑定器异常不影响其他绑定器的执行
                console.error(`绑定器回调执行失败，路径：${event.path}`, error);
            }
        }
    }

    /**
     * 生成绑定器唯一键
     * @param binding 绑定器
     */
    private static getBindingKey(info: BindInfo): string {
        if (info.isMethod) {
            return `${info.target.__data_id__}:${info.prop.toString()}`;
        }
        return `${info.target.__data_id__}:${info.prop.toString()}:${info.path}`;
    }
}