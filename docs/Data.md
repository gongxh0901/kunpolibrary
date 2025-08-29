## 数据绑定（Data Binding）

本库的数据绑定面向“简单直接”的 UI 同步：当数据类的属性被设置或数据类上的公开方法被调用时，触发与之匹配的装饰器回调，用最少样板代码完成 UI 更新。复杂交互（动画、跨模块协作、节流/并发控制）仍建议使用事件系统或显式逻辑处理。

- 优势
  - 精简：无需注册/注销一堆事件监听，几行装饰器即可完成 UI 同步
  - 类型安全：通过 selector 函数选择数据路径，配合 TS 编译期检查
  - 零侵入：数据类只需继承 `DataBase`，代理自动拦截属性设置与方法调用
  - 高性能：同一帧内变更合并批量分发（`BatchUpdater`）
- 适用边界
  - 简单、直接的属性展示或方法触发的轻量级反馈
  - 复杂动画链路、跨系统通信、长时流程控制 → 使用事件系统更明确可控

### 基本概念

- 数据类：继承 `DataBase`。属性赋值和公开方法调用都会发出变更通知
- 绑定路径：`ClassName:memberName`，由装饰器通过 selector 推导
- selector 约束：仅支持 `d => d.xxx.yyy` 或 `function(d){ return d.xxx.yyy; }` 的直链式访问；不支持动态表达式/可选链/解构
- 触发时机：
  - 属性变更：设置新值且与旧值不同才触发（以 `_` 开头的属性被忽略）
  - 方法调用：公开方法被调用即触发（`constructor` 与以 `_` 开头的方法被忽略）
- 生命周期：
  - 初始化：`data.initializeBindings(this)`（FGUI/窗口基类已内置自动调用）
  - 清理：`data.cleanupBindings(this)`（FGUI 组件 `dispose` 已内置调用）
- 即时更新：装饰器 `immediate` 参数，默认 false；为 true 时属性变更会立刻执行一次回调

### API 速览

```ts
import { data } from "kunpocc"; // 实际从 src/data/DataDecorator 导出
import { DataBase } from "kunpocc";

// 属性绑定（装饰到“UI字段”上）
data.bindProp<T extends DataBase>(
  dataClass: new () => T,
  selector: (d: T) => any,
  callback: (item: any, value?: any, data?: T) => void,
  immediate: boolean = false,
)

// 方法绑定（装饰到“UI方法”上）
data.bindMethod<T extends DataBase>(
  dataClass: new () => T,
  selector: (d: T) => any, // 选择数据类上的某个“公开方法”
  immediate: boolean = false,
)
```

回调参数说明（属性绑定）：
- `item`：被装饰的 UI 字段（例如某 `Label`）
- `value`：属性新值（仅属性变更时有值）
- `data`：当前数据类实例（便于读取其它字段）

方法绑定回调时机：当目标数据方法被调用后触发，默认不传 `value`，你可以在回调内读取 `data` 的当前状态。

---

### 使用方式（从简到难）

#### 1) 属性装饰器（同一窗口类中合并展示“单个/多个装饰器”）

```ts
import * as fgui from "fairygui-cc";
import { DataBase, data, Window, _uidecorator } from "kunpocc";

const { uiclass, uiprop } = _uidecorator;

// 示例数据类
class Level extends DataBase {
  public levelid = 1;
  public storey = 1;
}

// 使用窗口（继承 kunpo.Window），同一类中分别演示：
// A) 单个装饰器    B) 多个装饰器（同一 UI 属性上堆叠多个装饰器）
@uiclass("Window", "Data", "DataWindow")
export class DataWindow extends Window {
  // --- A) 单个装饰器：仅响应 storey ---
  @uiprop
  @data.bindProp(Level, d => d.storey, (item: fgui.GTextField, value: number) => {
    item.text = `层数：${value}`;
  })
  private lab_storey!: fgui.GTextField;

  // --- B) 多个装饰器：同一属性上堆叠，分别响应 storey 与 levelid ---
  @uiprop
  @data.bindProp(Level, d => d.storey, (item: fgui.GTextField, value: number, model: Level) => {
    item.text = `关卡：${model.levelid} 层数：${value}`;
  })
  @data.bindProp(Level, d => d.levelid, (item: fgui.GTextField, value: number, model: Level) => {
    item.text = `关卡：${value} 层数：${model.storey}`;
  })
  private lab_level!: fgui.GTextField;
}

// 触发（示意）
const level = new Level();
level.storey = 2;  // 触发 lab_storey 与 lab_level 的第一个装饰器
level.levelid = 10; // 触发 lab_level 的第二个装饰器
```

要点：
- A/B 两段示例均在“窗口类”中，满足“属性装饰器使用窗口”的要求
- “多个装饰器”强调“同一个 UI 属性”上堆叠多个 `@bindProp`，参考 demo 的 `DataWindow.ts` 与 `DataItem.ts`
- `immediate` 可按需加在装饰器末参数，设为 true 时“属性变更会立即执行一次回调”（首帧对齐）

#### 2) 方法装饰器（同一自定义组件中合并展示“单个/多个装饰器”）

```ts
import * as fgui from "fairygui-cc";
import { DataBase, data, _uidecorator } from "kunpocc";

const { uicom } = _uidecorator;

// 示例数据类
class Inventory extends DataBase {
  public addItem(it: string) { /* ... */ }
  public reset() { /* ... */ }
}

// 使用自定义组件（继承 fgui.GComponent），同一类中分别演示：
// A) 单个方法装饰器    B) 多个方法装饰器（同一 UI 方法上堆叠多个装饰器）
@uicom("Data", "DataItem")
export class DataItem extends fgui.GComponent {
  // --- A) 单个方法装饰器：仅响应 addItem ---
  @data.bindMethod(Inventory, d => d.addItem)
  onAddItem(inv: Inventory) {
    // 轻量反馈：刷新一次列表/播放提示
    // this.refresh(inv);
  }

  // --- B) 多个方法装饰器：同一 UI 方法上堆叠，响应 reset 与 addItem ---
  @data.bindMethod(Inventory, d => d.reset)
  @data.bindMethod(Inventory, d => d.addItem)
  onAny(inv: Inventory) {
    // 统一刷新
    // this.refresh(inv);
  }
}

// 触发（示意）
const inv = new Inventory();
inv.addItem("Potion"); // 触发 onAddItem 与 onAny
inv.reset();            // 仅触发 onAny
```

要点：
- 示例放在“自定义组件”中，满足“方法装饰器使用自定义组件”的要求
- “多个装饰器”强调“同一个 UI 方法”上堆叠多个 `@bindMethod`，参考 demo 的 `DataWindow.ts`（`refreshData`）
- 方法绑定不关心入参与返回值，调用即触发；复杂动画仍建议事件系统编排

---

### 生命周期与集成

- FGUI 自定义组件与窗口基类已内置：
  - 构造（onConstruct）时：`data.initializeBindings(this)`
  - `dispose()` 时：`data.cleanupBindings(this)`
- 非集成场景（如普通类）：
  - 初始化后手动调用 `data.initializeBindings(this)`
  - 销毁前调用 `data.cleanupBindings(this)`

参考代码位置：
- `src/ui/ComponentExtendHelper.ts` 内在构造与 `dispose` 中已自动处理
- `src/fgui/WindowBase.ts` 同样在生命周期中调用了初始化

---

### 最佳实践与注意事项

- 关注点内聚：属性绑定仅做“值到视图”的即时映射；复杂动作用事件系统
- 避免回调里递归触发同一数据的写操作，防止无意义的级联更新
- 以 `_` 或 `__` 开头的属性/方法不会触发绑定，不要用作绑定目标
- `selector` 必须是直链式访问：`d => d.foo.bar`，不要写表达式/调用/条件语句
- `immediate` 用于是否立即触发更新，默认关闭以避免不必要开销

---

### 调试小贴士

```ts
import { BindManager } from "kunpocc";
BindManager.getAllPaths();         // 查看已注册的所有路径
BindManager.getTotalBindingCount(); // 总绑定数量
```

如果绑定无效：检查数据类是否继承了 `DataBase`、`selector` 是否为直链式、是否在生命周期内完成了 `initializeBindings`。

