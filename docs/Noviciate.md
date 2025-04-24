## 给纯小白的使用手册

#### 项目配置

1. 新建项目，到项目根目录下执行命令

   ```bash
   npm install kunpocc
   ```

2. 重启creator

3. 在你的脚本目录下，写一个header.ts脚本，引入`kunpocc`和`fgui`库，并导出，内容如下

   ```typescript
   
   import * as fgui from "fairygui-cc";
   import * as kunpo from "kunpocc";
   
   export { fgui, kunpo };
   
   ```

4. 编写入口脚本，

   ```typescript
   import { _decorator } from "cc";
   /** 引入kunpocc入口 */
   import { fgui, kunpo } from './header';
   
   const { ccclass, property, menu } = _decorator;
   @ccclass("GameEntry")
   @menu("kunpo/GameEntry")
   export class GameEntry extends kunpo.CocosEntry {
       onInit(): void {
           kunpo.log("GameEntry onInit");
       }
   }
   ```

5. 创建一个scene

6. 在新创建的scene中创建入口节点`GameEntry`，创建UI模块节点 `UI` 、窗口容器节点`window`  窗口容器节点可以有多个， 并关联第4步写的入口脚本
   ![image-basic-config](./../image/image-basic-config.png#pic_left)

7. 项目配置完毕，点击运行，此时控制台就能输出 

   ```text
   GameEntry onInit
   ```

   

#### 打开第一个界面，需要自学fgui

[fgui官方文档: https://www.fairygui.com/docs/editor](https://www.fairygui.com/docs/editor)

1. 使用fgui创建一个包，包下新建一个组件，放置一些内容进去， 比如包名是`Home`,  组件名是`HomeWindow`， 注意：**组件需要设置为导出**

2. 导出fgui到creator项目的 `resources`目录下一个ui文件夹下

   ![fgui-export](./../image/fgui-export.png#pic_left)

3. 写 `HomeWindow`窗口脚本

   ```typescript
   import { fgui, kunpo } from "../header";
   const { uiclass } = kunpo._uidecorator;
   
   /**
    * 窗口装饰器
    * @param {string} groupName 窗口容器节点名称
    * @param {string} pkgName fgui包名
    * @param {string} name 窗口名 (与fgui中的组件名一一对应)
    */
   @uiclass("Window", "Home", "HomeWindow")
   export class HomeWindow extends kunpo.Window {
       protected onInit(): void {
         	// 这两行代表的含义可以跳转进去自己看下，有完整的注释
           this.adapterType = kunpo.AdapterType.Bang;
           this.type = kunpo.WindowType.CloseAll;
   				/** 窗口下层遮罩的透明度 */
   				this.bgAlpha = 0;
       }
   
       protected onShow(userdata?: any): void {
           kunpo.log("HomeWindow onShow:", userdata);
       }
   		
     	// 这个是窗口header，具体的可以到配套的demo中查看
       // public getHeaderInfo(): kunpo.WindowHeaderInfo {
       //     return kunpo.WindowHeaderInfo.create("WindowHeader", "aaa");
       // }
   }
   ```

   

4. 配置UI相关内容，新建一个脚本文件，可以起名叫 `UIPackageRegister.ts`, 内容如下，根据自己的需求，自由配置

   ```typescript
   import { kunpo } from './header';
   export class UIPackageRegister {
       public static Register(): void {
           kunpo.WindowManager.initPackageConfig({
               config: {
                   /** fgui导出的界面资源所在resources中的路径 */
                   uiPath: "ui",
                   /**
                    * 手动管理资源的包
                    * 1. 用于基础UI包, 提供一些最基础的组件，所有其他包都可能引用其中的内容
                    * 2. 资源header所在的包
                    * 3. 用于一些特殊场景, 比如需要和其他资源一起加载
                    */
                   manualPackages: ["Home"],
                   /**
                    * 不推荐配置 只是提供一种特殊需求的实现方式
                    * 窗口引用到其他包中的资源 需要的配置信息
                    */
                   linkPackages: {},
                   /**
                    * 关闭界面后，需要立即释放资源的包名（建议尽量少）
                    * 一般不建议包进行频繁装载卸载，因为每次装载卸载必然是要消耗CPU时间（意味着耗电）和产生大量GC的。UI系统占用的内存是可以精确估算的，你可以按照包的使用频率设定哪些包是需要立即释放的。
                    * 不包括手动管理的包
                    */
                   imReleasePackages: [],
               },
               showWaitWindow: this._showWaitWindow,
               hideWaitWindow: this._hideWaitWindow,
               fail: this._fail,
           });
       }
   
       private static _showWaitWindow(): void {
           console.log("显示资源加载等待窗");
           // kunpo.WindowManager.showWindow("LoadUIWindow");
       }
   
       private static _hideWaitWindow(): void {
           console.log("关闭资源加载等待窗");
           // kunpo.WindowManager.closeWindow("LoadUIWindow");
       }
   
       private static _fail(windowName: string, errmsg: string, pkgs: string[]): void {
           console.log("资源加载失败", windowName, errmsg, pkgs);
       }
   }
   ```

5. 完善入口脚本 `GameEntry`

   ```typescript
   import { _decorator } from "cc";
   /** 引入kunpocc入口 */
   import { fgui, kunpo } from './header';
   import { UIPackageRegister } from './UIPackageRegister';
   
   const { ccclass, property, menu } = _decorator;
   @ccclass("GameEntry")
   @menu("kunpo/GameEntry")
   export class GameEntry extends kunpo.CocosEntry {
       onInit(): void {
           kunpo.log("GameEntry onInit");
         	// 这里加上第4步写的脚本的注册
         	UIPackageRegister.Register();
         	// 写一个加载资源的函数，用来加载游戏初始用到的资源
   	      this.loadBaseResources();
       }
     
     	/** 1. 加载基础资源 */
       private loadBaseResources(): void {
         	// 这里为了不在游戏初始场景中显示界面遮罩，手动加载刚才创建的Home包资源
           let paths: kunpo.IAssetConfig[] = [
               { path: "ui/Home_atlas0", type: cc.Asset, isFile: true },
               { path: "ui/Home", type: cc.Asset, isFile: true },
           ];
           let loader = new kunpo.AssetLoader("load");
           loader.start({
               configs: paths,
               complete: () => {
                 	// 手动加载资源的fgui包
                   fgui.UIPackage.addPackage("ui/Home");
   
                 	this.allTaskFinish();
               },
               fail: (msg: string, err: Error) => {
   
               },
               progress: (percent: number) => {
   								// 这里是加载进度 可以给首场景添加一个进度条，用来显示加载进度
               }
           });
       }
     
       private allTaskFinish(): void {
         	// 显示第一个窗口 (showWindowIm 这个接口用于显示已加载过资源的窗口)
           kunpo.WindowManager.showWindowIm("HomeWindow", "这是一个测试窗口");
         
        		// (showWindow 这个接口用于显示未加载资源的窗口，会自动加载UI包)
        		// kunpo.WindowManager.showWindow("HomeWindow", "这是一个测试窗口");
       }
   }
   ```

6. 再次运行，第一个界面就可以显示出来了

