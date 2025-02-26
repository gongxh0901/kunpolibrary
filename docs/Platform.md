## 平台


> Platform 类提供了游戏运行平台的相关信息和判断方法。

#### *平台类型*

```typescript
import { Platform, PlatformType } from 'kunpocc';

// 平台类型枚举
enum PlatformType {
    Android = 1,    // 安卓
    IOS,            // iOS
    HarmonyOS,      // 鸿蒙
    WX,             // 微信小游戏
    Alipay,         // 支付宝小游戏
    Bytedance,      // 字节小游戏
    HuaweiQuick,    // 华为快游戏
    Browser         // 浏览器
}

// 获取当前平台类型
const currentPlatform = Platform.platform;
```

#### *平台判断*

```typescript
import { Platform } from 'kunpocc';

// 原生平台判断
if (Platform.isNative) {
    console.log('当前是原生平台');
}

// 移动平台判断
if (Platform.isMobile) {
    console.log('当前是移动平台');
}

// 原生移动平台判断
if (Platform.isNativeMobile) {
    console.log('当前是原生移动平台');
}

// 具体平台判断
if (Platform.isAndroid) {
    console.log('当前是安卓平台');
}

if (Platform.isIOS) {
    console.log('当前是iOS平台');
}

if (Platform.isHarmonyOS) {
    console.log('当前是鸿蒙系统');
}

// 小游戏平台判断
if (Platform.isWX) {
    console.log('当前是微信小游戏');
}

if (Platform.isAlipay) {
    console.log('当前是支付宝小游戏');
}

if (Platform.isBytedance) {
    console.log('当前是字节小游戏');
}

if (Platform.isHuaweiQuick) {
    console.log('当前是华为快游戏');
}

// 浏览器判断
if (Platform.isBrowser) {
    console.log('当前是浏览器环境');
}
```

#### *使用示例*

```typescript
import { Platform, PlatformType } from 'kunpocc';

// 根据平台类型执行不同逻辑
switch (Platform.platform) {
    case PlatformType.Android:
        // 安卓平台特定逻辑
        break;
    case PlatformType.IOS:
        // iOS平台特定逻辑
        break;
    case PlatformType.WX:
        // 微信小游戏特定逻辑
        break;
    default:
        // 其他平台逻辑
        break;
}

// 针对不同平台进行适配
if (Platform.isNativeMobile) {
    // 原生移动平台的处理
    if (Platform.isAndroid) {
        // 安卓特有功能
    } else if (Platform.isIOS) {
        // iOS特有功能
    }
} else if (Platform.isWX || Platform.isAlipay || Platform.isBytedance) {
    // 小游戏平台的处理
} else {
    // 浏览器平台的处理
}
```