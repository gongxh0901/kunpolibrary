## 条件显示节点

### 特点
  * 用于在游戏中显示或隐藏特定UI元素。
  * 一般用于红点提示
  * 主要是解耦用，条件单独实现，节点关联单条件或者多个条件



### 使用

#### *定义条件*

```typescript
// 定义条件类型枚举
enum ConditionType {
  condition1,
  condition2,
  condition3,
}

// 定义条件
@conditionClass(ConditionType.condition1)
export class Condition1 extends kunpo.ConditionBase {
    protected onInit(): void {
      // 监听条件发生变化, 则调用一次 this.tryUpdate();
        kunpo.GlobalEvent.add("condition1", () => {
            this.tryUpdate();
        }, this);
    }

    protected evaluate(): boolean {
      	//TODO:: 根据条件数据，返回true or false
        return true;
    }
}
```

#### *节点关联条件*

```typescript
/** 任意一个满足 显示节点 */
new kunpo.ConditionAnyNode(fgui.GObject, ConditionType.condition1, ConditionType.condition2);

/** 所有条件都满足 显示节点 */
new kunpo.ConditionAllNode(fgui.GObject, ConditionType.Condition1, ConditionType.Condition2, ConditionType.Condition3);
```