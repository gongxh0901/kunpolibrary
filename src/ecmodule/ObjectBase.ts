export class ObjectBase {
    /** 是否被回收 */
    public recycled: boolean;

    /** 对象类型 */
    public objectType: number;

    /** 回收 */
    public _recycle(): void {
        this.recycled = true;
    }

    /** 重新利用 */
    public _reuse(): void {
        this.recycled = false;
    }
}