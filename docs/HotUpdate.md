## 热更新

* 完全使用creator官方的热更新方案

* 重新封装，使用更简单

* <u>**支持动态变更资源路径**</u>

* cdn上资源结构

  ![image_hotupdate1](https://gitee.com/gongxinhai/public-image/raw/master/image_hotupdate1.jpeg#pic_left)

### 规则

* 和版本号绑定，版本更新后之前的热更新资源失效，（版本号指的是初始化函数中传入的版本号 推荐使用游戏版本号）

* 在构建完成之后的main.js中添加以下内容，可以使用构建模版，或者用脚本修改

  ```javascript
  (function () {
      if (typeof window.jsb === 'object') {
          let saveVersion = localStorage.getItem('hotupdate::version');
          let searchPaths = localStorage.getItem('hotupdate::searchpaths');
          //TODO::版本号 这里需要根据自己的项目修改
          let version = "0.0.2";
          if (!saveVersion || saveVersion != version ) {
              localStorage.setItem('hotupdate::searchpaths', null);
              searchPaths = null;
          }
          if (searchPaths) {
              let paths = JSON.parse(searchPaths);
              jsb.fileUtils.setSearchPaths(paths);
  
              let fileList = [];
              let storagePath = paths[0] || '';
              let tempPath = storagePath + '_temp/';
              let baseOffset = tempPath.length;
  
              if (jsb.fileUtils.isDirectoryExist(tempPath) && !jsb.fileUtils.isFileExist(tempPath + 'project.manifest.temp')) {
                  jsb.fileUtils.listFilesRecursively(tempPath, fileList);
                  fileList.forEach(srcPath => {
                      let relativePath = srcPath.substr(baseOffset);
                      let dstPath = storagePath + relativePath;
  
                      if (srcPath[srcPath.length] == '/') {
                          jsb.fileUtils.createDirectory(dstPath);
                      } else {
                          if (jsb.fileUtils.isFileExist(dstPath)) {
                              jsb.fileUtils.removeFile(dstPath);
                          }
                          jsb.fileUtils.renameFile(srcPath, dstPath);
                      }
                  })
                  jsb.fileUtils.removeDirectory(tempPath);
              }
          }
      }
  })();
  ```

### 使用

一些枚举类型

```typescript
export enum HotUpdateCode {
    /** 成功 */
    Succeed = 0,
    /** 平台不支持 不需要热更新 */
    PlatformNotSupported = -1000,
    /** 未初始化 */
    NotInitialized = -1001,
    /** 是最新版本 */
    LatestVersion = -1002,
    /** 更新中 */
    Updating = -1003,
    /** 加载本地manifest失败 */
    LoadManifestFailed = -1004,
    /** 下载manifest文件失败 */
    ParseManifestFailed = -1005,

    /** 下载version.manifest失败 */
    LoadVersionFailed = -1006,
    /** 解析version.manifest失败 */
    ParseVersionFailed = -1007,


    /** 更新失败 需要重试 */
    UpdateFailed = -1008,
    /** 更新错误 */
    UpdateError = -1009,
    /** 解压错误 */
    DecompressError = -1010,
}
```

* 初始化 【必须】

  ```typescript
  /**
   * 初始化热更新管理器
   * @param manifestUrl 传入本地manifest文件地址 creator资源Asset下的属性nativeUrl
   * @param version 游戏版本号 eg: 1.0.0
   */
  kunpocc.HotUpdateManager.getInstance().init(manifestUrl: string, version: string)
  ```

* 检查更新

  ```typescript
  interface ICheckResult {
      /** 0:成功 其他:失败 */
      code: number;
      /** 失败信息 */
      message: string;;
      /** 需要更新的资源大小 (KB) */
      size?: number;
  }
  
  kunpo.HotUpdateManager.getInstance().checkUpdate().then((res: ICheckResult) => {
      console.log(`发现更新  资源大小:${res.size}kb`);
      // 直接更新
      // this.startUpdate(true);
  }).catch((err: any) => {
      log("检查热更新出错了", JSON.stringify(err));
  	  if (res.code == HotUpdateCode.LatestVersion) {
          console.log(`已经是最新版本了`);
      } else {
          console.log(`出错了 code:${res.code} message:${res.message}`);
        	// 根据 HotUpdateCode 中的错误码, 做后续处理，或提示，或跳过本次更新等
      }
  });
  ```

* 直接尝试更新

  ```typescript
  kunpo.HotUpdateManager.getInstance().startUpdate({
      skipCheck: skipCheck, // 是否跳过检查更新，如果没有提前使用
      progress: (kb: number, total: number) => {
          kunpo.log("热更新进度", kb, total);
      },
      complete: (code: HotUpdateCode, message: string) => {
          kunpo.log("热更新成功或者失败了", code, message);
          if (code == HotUpdateCode.LatestVersion) {
  		        console.log(`已经是最新版了`);
          } else if (code == HotUpdateCode.UpdateFailed) {
            	console.log(`更新失败了 code:${code} message:${message}`);
            	// 可以在这里重试失败的资源
            	// kunpo.HotUpdateManager.getInstance().retryUpdate();
          } else if (code == HotUpdateCode.LoadVersionFailed || code == HotUpdateCode.ParseVersionFailed) {
            	console.log(`更新失败了 可以选择跳过热更新 code:${code} message:${message}`);
          } else {
            	console.log(`其他的失败 code:${code} message:${message}`);
          }
      }
  });
  ```

  

