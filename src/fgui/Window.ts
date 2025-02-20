/**
 * @Author: Gongxh
 * @Date: 2024-12-14
 * @Description: 
 */
import { WindowBase } from "./WindowBase";

export abstract class Window extends WindowBase {
    protected onAdapted(): void {

    }
    /**
     * 初始化窗口时调用的方法。
     * 子类必须实现的方法，用来设置窗口的属性。
     */
    protected abstract onInit(): void
    /**
     * 窗口关闭时的处理逻辑。
     * 子类可以重写此方法以实现自定义的关闭行为。
     */
    protected onClose(): void {

    }

    /**
     * 窗口显示时的回调函数。
     * @param userdata 可选参数，传递给窗口显示时的用户数据。
     */
    protected onShow(userdata?: any): void {

    }
    /**
     * 隐藏窗口时的处理逻辑。
     * 重写此方法以实现自定义的隐藏行为。
     */
    protected onHide(): void {

    }

    /**
     * 当窗口从隐藏状态变为显示状态时调用。
     * 这个方法可以被子类重写以实现特定的显示逻辑。
     */
    protected onShowFromHide(): void {

    }

    /**
     * 当窗口被覆盖时触发的事件处理函数。
     * 子类可以重写此方法以添加自定义行为。
     */
    protected onCover(): void {

    }
    /**
     * 恢复窗口状态时的处理逻辑。
     * 此方法在窗口从隐藏或最小化状态恢复时被调用。
     */
    protected onRecover(): void {

    }

    /**
     * 空白区域点击事件处理函数。
     * 当用户点击窗口的空白区域时触发此方法。
     */
    protected onEmptyAreaClick(): void {

    }
}