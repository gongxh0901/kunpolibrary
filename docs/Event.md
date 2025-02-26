## 全局事件系统

### 使用

```typescript
import { GlobalEvent } from 'kunpocc';

// 添加事件监听
GlobalEvent.add('eventName', (arg1, arg2) => {
    console.log('事件触发:', arg1, arg2);
}, this);

// 添加一次性事件监听
GlobalEvent.addOnce('oneTimeEvent', (data) => {
    console.log('一次性事件触发:', data);
}, this);

// 发送事件
GlobalEvent.send('eventName', 'arg1', 'arg2');

// 发送事件到指定目标
GlobalEvent.sendToTarget('eventName', target, 'arg1', 'arg2');

// 移除事件监听
GlobalEvent.remove('eventName', callback, this);

// 移除指定目标的所有事件监听
GlobalEvent.removeByTarget(this);

// 移除指定事件名和目标的事件监听
GlobalEvent.removeByNameAndTarget('eventName', this);
```
