## 小游戏接口

### 特点

* 封装小游戏常用接口，一套api，适用多平台
* 支持微信小游戏、支付宝小游戏、抖音小游戏

### 支持

* 常用小游戏api  

* 广告
* 小游戏android支付

### 使用

##### 通用接口

```typescript
/** 获取冷启动参数 */
getLaunchOptions(): Record<string, any>;

/** 获取热启动参数 */
getHotLaunchOptions(): Record<string, any>;

/** 获取基础库版本号 */
getLibVersion(): string;

/** 
 * 获取运行平台 合法值（ios | android | ohos | windows | mac | devtools | iPad）
 * 微信上 iPad 会返回 ios
 */
getPlatform(): 'ios' | 'android' | 'ohos' | 'windows' | 'mac' | 'devtools' | 'iPad';

/**
 * 获取运行类型
 * 合法值（release | debug）
 */
getEnvType(): 'release' | 'debug';

/** 宿主程序版本 (这里指微信、抖音、支付宝版本) */
getHostVersion(): string;

/** 获取屏幕尺寸 */
getScreenSize(): { width: number, height: number };

/** 退出小程序 */
exitMiniProgram(): void;

/** 复制到剪切板 */
setClipboardData(text: string): void;
```

##### 广告

* 初始化

  ```typescript
  // 初始化广告 传入广告ID
  MiniHelper.ad().init(adUnitId);
  ```

* 展示广告

  ```typescript
  // 展示广告
  MiniHelper.ad().showAds({
  		success: () => {
     			log("广告展示完成，发放奖励")   
      }, 
    	fail: (errCode: number, errMsg: string) => {
      		log("广告展示失败 code:" + errCode + " msg:" + errMsg);
      }
  });
  ```

##### 支付

* 初始化

  ```typescript
  /**
   * 初始化 (不需要的参数传null)
   * @param offerId 商户号 (只有微信小游戏需要)
   * @param unitPriceQuantity 1元可以购买的游戏币数量
   */
  MiniHelper.pay().init(offerId, unitPriceQuantity);
  ```

* 判定

  ```typescript
  /** 统一价格限制列表 (微信、支付宝和字节 取交集) */
  const PriceLimitList = [1, 3, 6, 8, 12, 18, 25, 30, 40, 45, 50, 60, 68, 73, 78, 88, 98, 108, 118, 128, 148, 168, 188, 198, 328, 648, 998, 1998, 2998];
  
  /** 
   * 是否满足限定的价格等级 这里为了保持多平台统一，抽取了一部分价位
   * @param rmb 价格 (元)
   * @returns 是否满足限定的价格等级
   */
  MiniHelper.pay().isPayable(rmb);
  ```

* 拉起支付

  ```typescript
  MiniHelper.pay().pay({
      rmb: 1, // 拉起支付的价格(元)
      orderId: "唯一订单号",
      shopId: "商品id 字符串",
      shopName: "商品名",
      success: () => {
          kunpo.log("支付调用成功 去服务端验单");
      },
      fail: (res) => {
          kunpo.log("支付调用失败", res.errCode, res.errMsg);
      }
  });
  ```
