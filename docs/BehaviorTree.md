## 行为树

> 行为树是一种强大的 AI 决策系统，用于实现复杂的游戏 AI 行为。

#### 基本概念

1. 节点状态
```typescript
enum Status {
    SUCCESS,  // 成功
    FAILURE,  // 失败
    RUNNING   // 运行中
}
```

2. 节点类型
- **动作节点 (Action)**：执行具体行为的叶子节点
- **组合节点 (Composite)**：控制子节点执行顺序的节点
- **条件节点 (Condition)**：判断条件的节点
- **装饰节点 (Decorator)**：修饰其他节点行为的节点

#### 使用示例

```typescript
import { 
    BehaviorTree, 
    Sequence, 
    Selector, 
    Parallel,
    Success,
    Failure,
    WaitTime,
    Agent,
    Blackboard
} from 'kunpocc';

// 1. 创建行为树
const tree = new BehaviorTree(
    new Sequence(  // 顺序节点：按顺序执行所有子节点
        new WaitTime(2),  // 等待2秒
        new Selector(  // 选择节点：选择一个可执行的子节点
            new Success(() => {
                console.log("执行成功动作");
            }),
            new Failure(() => {
                console.log("执行失败动作");
            })
        )
    )
);

// 2. 创建代理和黑板
const agent = new Agent();  // AI代理
const blackboard = new Blackboard();  // 共享数据黑板

// 3. 执行行为树
tree.tick(agent, blackboard);
```

#### 常用节点

1. 组合节点

   ```typescript
   // 顺序节点：按顺序执行所有子节点，直到遇到失败或运行中的节点
   new Sequence(childNode1, childNode2, childNode3);
   
   // 选择节点：选择第一个成功或运行中的子节点
   new Selector(childNode1, childNode2, childNode3);
   
   // 并行节点：同时执行所有子节点
   new Parallel(childNode1, childNode2, childNode3);
   
   // 记忆顺序节点：记住上次执行的位置
   new MemSequence(childNode1, childNode2, childNode3);
   
   // 记忆选择节点：记住上次执行的位置
   new MemSelector(childNode1, childNode2, childNode3);
   
   // 随机选择节点：随机选择一个子节点执行
   new RandomSelector(childNode1, childNode2, childNode3);
   ```

2. 动作节点

   ```typescript
   // 成功节点
   new Success(() => {
       // 执行动作
   });
   
   // 失败节点
   new Failure(() => {
       // 执行动作
   });
   
   // 运行中节点
   new Running(() => {
       // 持续执行的动作
   });
   
   // 等待节点
   new WaitTime(2);  // 等待2秒
   new WaitTicks(5);  // 等待5个tick
   ```

3. 使用黑板共享数据

   ```typescript
   // 在节点中使用黑板
   class CustomAction extends Action {
       tick(ticker: Ticker): Status {
           // 获取数据
           const data = ticker.blackboard.get("key");
           
           // 设置数据
           ticker.blackboard.set("key", "value");
           
           return Status.SUCCESS;
       }
   }
   ```

   
#### 注意事项

1. 节点状态说明：
   - `SUCCESS`：节点执行成功
   - `FAILURE`：节点执行失败
   - `RUNNING`：节点正在执行中
2. 组合节点特性：
   - `Sequence`：所有子节点返回 SUCCESS 才返回 SUCCESS
   - `Selector`：任一子节点返回 SUCCESS 就返回 SUCCESS
   - `Parallel`：并行执行所有子节点
   - `MemSequence/MemSelector`：会记住上次执行位置
3. 性能优化：
   - 使用黑板共享数据，避免重复计算
   - 合理使用记忆节点，减少重复执行
   - 控制行为树的深度，避免过于复杂


