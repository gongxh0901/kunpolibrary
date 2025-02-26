## 计时器

### 使用

```typescript
import { GlobalTimer } from 'kunpocc';

// 启动一次性定时器（2秒后执行）
const timerId1 = GlobalTimer.startTimer(() => {
    console.log('2秒后执行一次');
}, 2);

// 启动循环定时器（每3秒执行一次，执行5次）
const timerId2 = GlobalTimer.startTimer(() => {
    console.log('每3秒执行一次，总共执行5次');
}, 3, 5);

// 启动无限循环定时器（每1秒执行一次）
const timerId3 = GlobalTimer.startTimer(() => {
    console.log('每1秒执行一次，无限循环');
}, 1, -1);

// 停止定时器
GlobalTimer.stopTimer(timerId1);
GlobalTimer.stopTimer(timerId2);
GlobalTimer.stopTimer(timerId3);
```

注意事项：
- 定时器的时间间隔单位为秒
- loop 参数说明：
  - 0：执行一次
  - 正整数 n：执行 n 次
  - -1：无限循环