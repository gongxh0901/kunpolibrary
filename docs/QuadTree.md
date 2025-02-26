## 四叉树
> 四叉树是一种通过空间划分来进行高效碰撞查询的数据结构。

#### 基本概念

1. 形状类型

   ```typescript
   import { QuadTree, Box, Circle, Polygon } from 'kunpocc';
   
   // 1. 矩形
   const box = new Box(x, y, width, height, tag);
   
   // 2. 圆形
   const circle = new Circle(x, y, radius, tag);
   
   // 3. 多边形
   const points = [v2(x1, y1), v2(x2, y2), v2(x3, y3)];
   const polygon = new Polygon(points, tag);
   ```

2. 配置参数

   ```typescript
   // 四叉树配置
   const QTConfig = {
       MAX_SHAPES: 12,  // 每个节点最大形状数量
       MAX_LEVELS: 5,   // 最大深度
   }
   ```

   
#### 使用示例

1. 创建和初始化

   ```typescript
   import { QuadTree, Box, rect } from 'kunpocc';
   
   // 创建四叉树（参数：区域范围，层级，绘制组件）
   const bounds = rect(0, 0, 800, 600);  // x, y, width, height
   const quadTree = new QuadTree(bounds);
   
   // 添加形状
   const player = new Box(100, 100, 50, 50, 1);  // 玩家碰撞体，tag=1
   const enemy = new Circle(200, 200, 25, 2);    // 敌人碰撞体，tag=2
   quadTree.insert(player);
   quadTree.insert(enemy);
   ```

2. 碰撞检测

   ```typescript
   // 检测指定形状与特定标签的碰撞
   const collisions = quadTree.collide(player, 2);  // 检测玩家与 tag=2 的形状碰撞
   if (collisions.length > 0) {
       console.log('发生碰撞！');
       for (const target of collisions) {
           // 处理碰撞逻辑
       }
   }
   ```

3. 动态更新

   ```typescript
   // 在游戏循环中更新四叉树
   function update() {
       // 更新形状位置
       player.position = v2(newX, newY);
       enemy.position = v2(newX, newY);
       
       // 更新四叉树
       quadTree.update();
       
       // 检测碰撞
       const collisions = quadTree.collide(player, 2);
   }
   ```

4. 清理

   ```typescript
   // 清理四叉树
   quadTree.clear();
   ```

   
#### 形状操作

1. 位置和缩放

   ```typescript
   // 设置位置
   shape.position = v2(x, y);
   
   // 设置缩放
   shape.scale = 1.5;
   
   // 获取包围盒
   const boundingBox = shape.getBoundingBox();
   ```

2. 特定形状操作

   ```typescript
   // 矩形重置
   box.resetPoints(x, y, width, height);
   
   // 圆形半径
   circle.radius = newRadius;
   
   // 多边形顶点
   polygon.points = newPoints;
   ```

   
#### 性能优化建议

1. 合理设置配置参数：
   - `MAX_SHAPES`：较小的值会导致更频繁的分裂，较大的值会降低查询效率
   - `MAX_LEVELS`：控制树的最大深度，防止过度分割

2. 碰撞检测优化：
   - 使用合适的标签系统，只检测需要的碰撞
   - 根据游戏需求选择合适的形状（圆形计算最快）
   - 避免使用过于复杂的多边形

3. 更新策略：
   - 仅在必要时更新四叉树
   - 对于静态物体，可以使用单独的四叉树
   - 动态物体频繁更新时，考虑使用更大的边界范围