## 工具


#### 一、数学工具 (MathTool)

```typescript
import { MathTool } from 'kunpocc';

// 1. 数值限制
// 将数值限制在指定范围内
const value = MathTool.clampf(75, 0, 100);  // 返回75，因为在0-100范围内
const value2 = MathTool.clampf(150, 0, 100); // 返回100，因为超出上限
const value3 = MathTool.clampf(-50, 0, 100); // 返回0，因为低于下限

// 2. 随机数生成
// 生成指定范围内的整数（包含边界值）
const randomInt = MathTool.rand(1, 10);      // 返回1到10之间的整数

// 生成指定范围内的浮点数（包含最小值，不包含最大值）
const randomFloat = MathTool.randRange(0, 1); // 返回0到1之间的浮点数

// 3. 角度与弧度转换
// 角度转弧度
const radian = MathTool.rad(90);  // 90度转换为弧度：约1.57

// 弧度转角度
const degree = MathTool.deg(Math.PI); // π弧度转换为角度：180

// 4. 平滑过渡
// 用于实现数值的平滑变化，常用于相机跟随、UI动画等
const smoothValue = MathTool.smooth(
    0,    // 起始值
    100,  // 目标值
    0.16, // 已经过时间（秒）
    0.3   // 响应时间（秒）
);  // 返回一个平滑过渡的中间值
```

使用说明：

1. `clampf(value: number, min: number, max: number): number`
   - 将数值限制在指定范围内
   - 如果小于最小值，返回最小值
   - 如果大于最大值，返回最大值
   - 否则返回原值

2. `rand(min: number, max: number): number`
   - 生成指定范围内的随机整数
   - 包含最小值和最大值
   - 常用于随机选择、随机掉落等场景

3. `randRange(min: number, max: number): number`
   - 生成指定范围内的随机浮点数
   - 包含最小值，不包含最大值
   - 常用于需要精确浮点随机数的场景

4. `rad(angle: number): number`
   - 将角度转换为弧度
   - 计算公式：angle * Math.PI / 180

5. `deg(radian: number): number`
   - 将弧度转换为角度
   - 计算公式：radian * 180 / Math.PI

6. `smooth(current: number, target: number, elapsedTime: number, responseTime: number): number`
   - 计算平滑过渡的值
   - current: 当前值
   - target: 目标值
   - elapsedTime: 已经过时间（秒）
   - responseTime: 响应时间（秒）
   - 常用于实现平滑的相机移动、UI动画等

#### 二、MD5

```typescript
import { md5 } from 'kunpocc';

// 字符串 MD5 加密
const hash = md5('Hello, World!');
console.log(hash); // 输出32位MD5哈希值

// 注意：
// 1. 输入必须是字符串类型
// 2. 不能传入 undefined 或 null
try {
    md5(null);  // 将抛出错误
} catch (error) {
    console.error('MD5输入不能为null或undefined');
}
```

#### 三、数据结构
  - 二叉堆（`BinaryHeap` 最大、最小堆）
  - 单向（`LinkedList`）、双向链表 （`DoublyLinkedList`）
  - 栈（`Stack`）


#### 四、适配相关 `Adapter` (不需要关心) 