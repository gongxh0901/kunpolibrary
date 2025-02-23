# KunpoLib

基于 Cocos Creator 3.0+ 的一套游戏框架，提供了一系列实用模块，帮助开发者快速构建高质量的游戏项目。

项目持续优化中，敬请期待~~

## 目录
- [模块](#模块)
- [安装kunpocc](#安装kunpocc)
- [项目基础配置](#项目基础配置)
- [使用方法](#使用方法)
  - [一、UI 系统](#一ui-系统)
    - [UI 装饰器使用](#ui-装饰器使用)
    - [创建窗口](#创建窗口)
  - [二、实体组件系统（EC）](#二实体组件系统ec)
    - [creator插件`kunpo-ec`](#creator插件kunpo-ec)
    - [重点接口说明](#重点接口说明)
    - [使用](#使用)
  - [三、网络模块](#三-网络模块)
    - [HTTP 请求](#http-请求)
    - [请求方法](#请求方法)
    - [参数说明](#参数说明)
    - [响应处理](#响应处理)
  - [四、四叉树碰撞检测](#四四叉树碰撞检测)
    - [基本概念](#基本概念)
    - [使用示例](#使用示例)
    - [形状操作](#形状操作)
    - [性能优化建议](#性能优化建议)
  - [五、行为树系统](#五行为树系统)
    - [行为树基本概念](#行为树基本概念)
    - [行为树使用示例](#行为树使用示例)
    - [常用节点](#常用节点)
    - [注意事项](#注意事项)
  - [六、资源加载工具](#六资源加载工具)
    - [资源加载器](#资源加载器)
    - [资源池](#资源池)
  - [七、条件显示节点](#七条件显示节点用来处理游戏中的提示红点信息)
    - [定义条件](#定义条件)
    - [节点关联条件](#节点关联条件)
  - [八、全局事件系统](#八-全局事件系统)
  - [九、全局计时器](#九全局计时器)
  - [十、平台相关](#十平台相关)
    - [平台类型](#平台类型)
    - [平台判断](#平台判断)
    - [使用示例](#使用示例-2)
  - [十一、屏幕](#十一屏幕)
  - [十二、工具类](#十二工具类)
    - [数学工具 (MathTool)](#数学工具-mathtool)
    - [MD5 加密](#md5-加密)

## 模块

- **UI 系统 （基于 FairyGUI）**
  
  * 灵活的 UI 装饰器（配合插件  `kunpo-fgui` 使用，一键导出界面配置，省时省力省代码）
  
  * 控制窗口之间的相互关系（eg: 打开界面时，是隐藏/关闭前一个界面，还是隐藏/关闭所有界面）
  
  * 多窗口组管理
  
  * 顶部显示金币钻石的资源栏（header），一次实现，多界面复用，
  
  * 支持不同界面使用不同 header

- **EC 框架**

  *  不同实体上的组件更新顺序管理（`只根据注册的组件更新顺序更新，跟实体无关`）

  - 灵活的EC装饰器 （配合插件 `kunpo-ec` 使用，配置实体组件信息，一键导出）
  - 支持多世界（多战斗场景，互不影响）
  - 区分数据组件和逻辑组件，只更新逻辑组件

- **网络模块 （Http）**
  - HTTP 请求管理
  - 完整的请求响应接口
  
- **四叉树（碰撞查询）**
  
  * 矩形碰撞
  * 圆形碰撞
  * 多边形碰撞
  
- **行为树系统**
  - 用来实现复杂的怪物行为
  
- **资源管理**
  * 资源加载后放入资源池
  * 资源池 可通过路径或者uuid获取资源
  * 只适合手动管理资源，单无论加载多少次，卸载一次后删除
  
- **条件显示节点系统 （用来处理游戏中的提示红点信息）**
  
  * 主要是解耦用，条件单独实现，节点关联单条件或者多个条件
  
- **全局事件系统 `GlobalEvent`**
  
- **全局计时器 `GlobalTimer`**

- **平台相关 `Platform`**

- **屏幕尺寸 `Screen`**

- **数据结构**

  - 二叉堆（`BinaryHeap` 最大、最小堆）
  - 单向（`LinkedList`）、双向链表 （`DoublyLinkedList`）
  - 栈（`Stack`）

- **适配相关 `Adapter` (不需要关心) ** 

##  安装kunpocc

```bash
npm install kunpocc
```

## 项目基础配置

1. 新建项目，创建首场景文件

2. 编写入口脚本

   ```typescript
   import { _decorator } from "cc";
   /** 引入kunpocc入口 */
   import { CocosEntry, log } from "kunpocc";
   
   const { ccclass, property, menu } = _decorator;
   @ccclass("GameEntry")
   @menu("kunpo/GameEntry")
   export class GameEntry extends CocosEntry {
       @property(cc.Node)
       private root: cc.Node = null;
       onInit(): void {
           log("GameEntry onInit");
       }
   }
   ```

3. 创建入口节点`GameEntry`，创建UI模块节点 `UI` 、UI容器节点`window`， 并关联对应的脚本

   ![image-20250213102309047](https://gitee.com/gongxinhai/public-image/raw/master/image-20250213102309047.png)

4. 配置完毕



## 使用方法

### 一、UI 系统

> 注：UI制作需要使用 FairyGUI，[FairyGUI官方文档](https://www.fairygui.com/docs/editor)

> ![image-20250213105921142](https://gitee.com/gongxinhai/public-image/raw/master/image-20250213105921142.png)

#### *UI 装饰器使用*

> 注：只有使用了装饰器的内容才能在 `kunpo-fgui` 插件中识别，`kunpo-fgui`插件操作界面如下图

> ![image-20250213110353385](https://gitee.com/gongxinhai/public-image/raw/master/image-20250213110353385.png)



1. 窗口装饰器

   ```typescript
   import { Window, _uidecorator } from 'kunpocc';
   const { uiclass, uiprop, uiclick } = _uidecorator;
   
   /** 
   * 窗口装饰器
   * @param 参数1: 窗口容器节点名字
   * @param 参数2: FairyGUI中的UI包名
   * @param 参数3: FairyGUI中的组件名 必须和 class 类同名 这里是 MyWindow
   */
   @uiclass("Window", "UI包名", "MyWindow")
   export class MyWindow extends Window {
       // ... 窗口实现
   }
   ```

2. 窗口 Header 装饰器

   ```typescript
   import { WindowHeader, _uidecorator } from 'kunpocc';
   const { uiheader } = _uidecorator;
   
   /** 
   * 窗口顶部资源栏装饰器
   * @param 参数1: FairyGUI中的UI包名
   * @param 参数2: FairyGUI中的组件名 必须和 class 类同名 这里是 MyWindowHeader
   */
   @uiheader("UI包名", "WindowHeader")
   export class MyWindowHeader extends WindowHeader {
       // ... Header 实现
   }
   ```

3. UI组件装饰器

   ```typescript
   import { _uidecorator } from 'kunpocc';
   const { uicom, uiprop, uiclick } = _uidecorator;
   
   /** 
   * UI组件类装饰器
   * @param 参数1: FairyGUI中的UI包名
   * @param 参数2: FairyGUI中的组件名 必须和 class 类同名 这里是 MyComponent
   */
   @uicom("Home", "MyComponent")
   export class MyComponent {
       // ... 组件实现
   }
   ```

4. UI属性装饰器

   ```typescript
   import { Window, _uidecorator } from 'kunpocc';
   const { uiclass, uiprop, uiclick } = _uidecorator;
   
   @uiclass("Window", "Home", "MyWindow")
   export class MyWindow extends Window {
       // FairyGUI 组件属性装饰器
       @uiprop private btnConfirm: GButton;  // 按钮组件
       @uiprop private txtTitle: GTextField; // 文本组件
       @uiprop private listItems: GList;     // 列表组件
   }
   ```
   
5. 点击事件装饰器

   ```typescript
   import { Window, _uidecorator } from 'kunpocc';
   const { uiclass, uiprop, uiclick } = _uidecorator;
   
   @uiclass("Window", "Home", "MyWindow")
   export class MyWindow extends Window {
       // 点击事件装饰器
       @uiclick
       private onTouchEvent(event: cc.Event): void {
           console.log('确认按钮被点击');
       }
   }
   ```
   

#### *创建窗口*

1. 创建窗口类

   ```typescript
   /**
   * 窗口名必须和FairyGUI中的组件同名
   */
   import { Window, _uidecorator } from 'kunpocc';
   const { uiclass, uiprop, uiclick } = _uidecorator;
   
   @uiclass("Window", "UI包名", "MyWindow")
   export class MyWindow extends Window {
       protected onInit(): void {
           // 初始化窗口
       }
   
       protected onShow(userdata?: any): void {
           // 窗口显示时的逻辑
       }
   
       protected onClose(): void {
           // 窗口关闭时的逻辑
       }
   }
   ```

2. 窗口管理

   * 重要：显示窗口前必须确保窗口资源已加载 ！！！

   ```typescript
   // 显示窗口
   WindowManager.showWindow("MyWindow", { /* 用户数据 */ });
   
   // 关闭窗口
   WindowManager.closeWindow("MyWindow");
   
   // 获取窗口实例
   const window = WindowManager.getWindow<MyWindow>("MyWindow");
   
   // 获取当前最顶层窗口
   const topWindow = WindowManager.getTopWindow();
   
   // 检查窗口是否存在
   const exists = WindowManager.hasWindow("MyWindow");
   ```

3. 窗口生命周期
- `onInit`: 窗口初始化时调用
- `onShow`: 窗口显示时调用
- `onClose`: 窗口关闭时调用
- `onHide`: 窗口隐藏时调用
- `onShowFromHide`: 窗口从隐藏状态恢复时调用
- `onCover`: 窗口被覆盖时调用
- `onRecover`: 窗口恢复时调用
- `onEmptyAreaClick`: 点击窗口空白区域时调用



### 二、实体组件系统（EC）

* 不使用creator官方的挂载脚本的方式，有以下几个原因
    > 1. node挂脚本的方式效率低
    > 1. 支持多世界，方便管理
    > 3. 通过装饰器注册属性给creator插件 kunpo-ec 使用
    > 4. 组件分数据组件和逻辑组件，只更新逻辑组件
    
* 实体组件系统是一种用于游戏开发的架构模式，它将游戏对象（实体）的数据（组件）和行为分离。

#### *creator插件`kunpo-ec`*

> `kunpo-cc`可以方便创建、配置、导出实体，操作界面如下图：

![image-20250213111622050](https://gitee.com/gongxinhai/public-image/raw/master/image-20250213111622050.png)



#### *重点接口说明*

注：详细说明查看声明文件 `kunpocc.d.ts`

1. 总管理器 `ECManager`

   ```typescript
   /**注册所有组件 如果GameEntry因分包导致，组件的代码注册晚于CocosEntry的onInit函数, 则需要在合适的时机手动调用此方法*/
   public static registerComponents(): void
   
   /**
    * 创建EC世界 创建EC世界前必须先注册组件
    * @param {string} worldName 名称
    * @param {Node} node 世界节点
    * @param {number[]} componentUpdateOrderList 组件更新顺序列表 (只传需要更新的组件列表)
    * @param {number} [maxCapacityInPool=128] 实体池最大容量，多余的实体不会缓存
    * @param {number} [preloadEntityCount=32] 预加载Entity数量
    */
   public static createECWorld(worldName: string, node: Node, componentUpdateOrderList: number[], maxCapacityInPool = 128, preloadEntityCount = 32): EntityManager
   
   /** 获取EC世界 */
   public static getECWorld(worldName: string): EntityManager
   
   /** 获取EC世界节点 */
   public static getECWorldNode(worldName: string): Node
   
   /** 销毁EC世界 */
   public static destroyECWorld(worldName: string): void
   
   /**
    * 注册配置表中的实体信息
    * 如果在GameEntry中配置了ecConfig，则此方法会自动调用
    * @param config 实体配置信息，格式为 {实体名: {组件名: 组件数据}}
    */
   public static registerEntityConfig(config: { [entityName: string]: IEntityConfig }): void
   
   /**
    * 添加实体信息 (如果已经存在, 则数据组合)
    * 如果存在编辑器编辑不了的数据 用来给编辑器导出的实体信息 添加扩展数据
    * @param name 实体名
    * @param info 实体信息 
    */
   public static addEntityInfo(name: string, info: IEntityConfig): void
   
   /** 获取实体配置信息 */
   public static getEntityInfo(name: string): Record<string, any>
   
   /**
    * 创建实体
    * @param worldName 实体管理器名称
    * @param name 实体名字
    * @returns {kunpo.Entity} 实体
    */
   public static createEntity(worldName: string, name: string): Entity
   
   /**
    * 销毁实体
    * @param worldName 世界名称
    * @param entity 实体
    */
   public static destroyEntity(worldName: string, entity: Entity): void
   
   /**
    * 通过实体ID销毁实体
    * @param worldName 世界名称
    * @param entityId 实体ID
    */
   public static destroyEntityById(worldName: string, entityId: number): void
   ```

2. 实体管理器 （创建的world）`EntityManager ` 

   ```typescript
   /**
    * 通过实体ID获取实体
    * @param {EntityId} entityId 实体Id
    * @returns {(Entity | null)} 实体
    */
   public getEntity(entityId: EntityId): Entity | null
   
   /**
    * 获取指定标签的实体
    * @param {number} tag 标签
    * @returns {Entity[]} 返回的实体池
    */
   public getEntitiesByTag(tag: number): Entity[]
   
   /**
    * 根据实体ID判断实体是否存在
    * @param {EntityId} entityId 实体Id
    * @returns {boolean}
    */
   public exists(entityId: EntityId): boolean
   
   /** 添加单例组件 */
   public addSingleton(component: Component): void
   
   /** 获取单例组件 */
   public getSingleton<T extends Component>(componentType: number): T
   
   /** 删除单例组件 */
   public removeSingleton(componentType: number): void
   
   /** 是否存在对应的单例组件 */
   public hasSingleton(componentType: number): boolean
   
   /** 激活单例组件 */
   public activeSingleton(): void
   
   
   /** 更新 需要外部调用 */
   public update(dt: number): void
   ```

3. 实体 `Entity`

   ```typescript
   /** 实体名称 */
   public name: string;
   
   /** 实体ID */
   public id: EntityId;
   
   /** 实体标识 */
   public tags: Set<number>;
   
   /** 实体状态 */
   public states: Map<number, number>;
   
   /** 是否被激活 （添加到实体管理器时激活） */
   public active: boolean = false;
   
   /** 所属实体管理器 （实体创建后直接赋值） */
   public entityManager: EntityManager;
   
   /** 所有组件 */
   public readonly components: Map<number, Component> = new Map();
   
   /** 添加标签 标签除了表示Entity，还可以通过EntityManager获取指定标签的Entity */
   public addTag(...tag: number[]): void
   
   /** 删除标签 */
   public removeTag(tag: number): void
   
   /** 是否包含标签 */
   public hasTag(...tag: number[]): boolean
   
   /** 获取组件 */
   public getComponent<T extends Component>(componentType: number): T
   
   /** 添加组件 */
   public addComponent(component: Component): void
   
   /** 删除组件 */
   public removeComponent(componentType: number): void
   
   /** 删除所有组件 */
   public removeAllComponents(): void
   
   /** 
    * 是否包含组件
    * @param {number} componentType 组件类型
    */
   public hasComponent(componentType: number): boolean
   
   /** 销毁自己 */
   public destroy(): void {
       this.entityManager.destroyEntityById(this.id);
   }
   
   /**
    * 添加监听
    * @param eventName 监听的消息名
    * @param callback 回调
    * @param entityId 实体ID
    * @param once 是否单次监听
    */
   public addEvent(eventName: string, callback: (...args: any[]) => void, once: boolean = false): void
   
   /**
    * 发送消息
    * @param eventName 消息名
    * @param entityId 实体ID
    * @param args 发送参数
    */
   public sendListener(eventName: string, ...args: any[]): void
   
   /** 删除监听 */
   public removeListener(eventName: string, callback?: (...args: any[]) => void): void
   
   /**
    * 添加状态
    * 状态采用计数方式，对状态处理时需要保证addState和removeState成对存在
    * @param {number} state 状态类型
    */
   public addState(state: number): void
   
   /**
    * 删除状态
    * @param {number} state 状态类型
    * @returns {boolean} 如果计数为0或状态不存在，则返回true
    */
   public removeState(state: number): boolean
   
   /** 是否包含指定状态 */
   public hasState(state: number): boolean
   
   /** 清除状态 */
   public clearState(state: number): void
   
   /** 清除所有状态 */
   public clearAllStates(): void
   ```

   

4. 组件 `Component`

   ```typescript
   /** 组件名 */
   public name: string;
   
   /** 组件类型 */
   public type: number;
   
   /** 是否需要更新 */
   public needUpdate: boolean;
   
   /** 所属实体 */
   public entity: Entity;
   
   /** 所属组件管理器 */
   public componentManager: ComponentManager;
   
   /**
    * 获取同实体上的组件
    * @param {number} componentType 组件类型
    */
   public getComponent<T extends Component>(componentType: number): T
   
   /** 删除自己 */
   public destroySelf(): void
   
   /** 
    * 生命周期函数 
    * 被添加到实体 对应onDestroy
    */
   protected onAdd(): void
   
   /**
    * 生命周期函数 
    * 组件被销毁 对应onAdd
    */
   protected onDestroy(): void
   
   /** 
    * 生命周期函数 
    * 可在此方法获取实体其他组件
    */
   protected abstract onEnter(): void;
   
   /** 
    * 生命周期函数
    * 从实体中删除前执行的函数 在此函数中清理初始化的数据
    */
   protected abstract onRemove(): void;
   
   /**
    * 更新函数
    */
   protected onUpdate(dt: number): void
   ```

   

#### *使用*

1. 组件类型声明

   ```typescript
   /**
    * @Author: gongxh
    * @Date: 2025-01-23
    * @Description: 组件枚举
    */
   
   import { cc } from "../header";
   
   /** 数据组件类型 */
   enum DataComponentType {
       Health,
       Transform,
       RootNode,
       LimitMove,
       /** 渲染组件 (多个) */
       Render,
   }
   
   /** 逻辑组件类型 (组件更新数据从上到下) */
   export enum SystemComponentType {
       Move = 100000,
       ScreenRebound,
   
       /** 位置更新系统 */
       PositionUpdateSystem = 120000,
   }
   
   export const ComponentType = {
       ...DataComponentType,
       ...SystemComponentType
   };
   export type ComponentType = DataComponentType | SystemComponentType;
   
   /** 自定义组件更新顺序列表 */
   export const componentUpdateOrderList = cc.Enum.getList(cc.Enum(SystemComponentType)).map(item => item.value).sort((a, b) => a - b);
   ```

2. 编写组件脚本

   * 在组件的 onAdd 方法中，设置组件是否更新，只有需要更新的组件才需要设置

     ```typescript
         protected onAdd(): void {
             this.needUpdate = true;
         }
     ```

   

   组件完整示例内容如下:

   ```typescript
   import { AnimationClip, Asset, AudioClip, Color, Enum, JsonAsset, ParticleAsset, Prefab, Size, Skeleton, SpriteFrame, Vec2, Vec3 } from "cc";
   import { _ecdecorator, Component } from "kunpocc";
   import { ComponentType } from "../../ComponentTypes";
   const { ecclass, ecprop } = _ecdecorator;
   
   enum HealthType {
       HP = 1,
       Max = 2,
       Current = 3
   }
   
   // 注册组件 (必须)
   @ecclass("Health", ComponentType.Health, { describe: "血量组件" })
   export class Health extends Component {
     	// 注册组件属性 (可选: 使用kunpo-ec插件则必须注册)
       @ecprop({ type: "entity", defaultValue: "", displayName: "实体", tips: "实体" })
       private testentity: string = "";
     
       @ecprop({ type: "array", format: "entity", displayName: "实体数组", tips: "实体数组" })
       private testentityarray: string[] = [];
   
       @ecprop({ type: 'int', defaultValue: 0, displayName: "血量", tips: "当前血量提示" })
       private hp: number = 0;
   
       @ecprop({ type: 'float', defaultValue: 0, displayName: "最大血量", tips: "最大血量提示" })
       private maxHp: number = 0;
   
       @ecprop({ type: 'string', defaultValue: "", displayName: "字符串", tips: "字符串提示" })
       private string: string = "";
   
       @ecprop({ type: 'boolean', defaultValue: false, displayName: "布尔值", tips: "布尔值提示" })
       private bool: boolean = true;
   
       @ecprop({ type: "enum", format: Enum(HealthType), defaultValue: HealthType.Current, displayName: "枚举", tips: "枚举提示" })
       private hpeunm: HealthType = HealthType.Current;
   
       @ecprop({ type: "spriteframe", displayName: "精灵帧" })
       private spriteFrame: SpriteFrame;
   
       @ecprop({ type: "asset", displayName: "资源" })
       private asset: Asset;
   
       @ecprop({ type: "prefab", displayName: "预制体" })
       private prefab: Prefab;
   
       @ecprop({ type: "skeleton", displayName: "骨骼动画" })
       private skeleton: Skeleton;
   
       @ecprop({ type: "particle", displayName: "粒子" })
       private particle: ParticleAsset;
   
       @ecprop({ type: "animation", displayName: "动画" })
       private animation: AnimationClip;
   
       @ecprop({ type: "audio", displayName: "音频" })
       private audio: AudioClip;
   
       @ecprop({ type: "jsonAsset", displayName: "json资源" })
       private jsonAsset: JsonAsset;
   
       @ecprop({
           type: "object", format: {
               hp1: {
                   type: "object",
                   format: {
                       hp: "int",
                       max: "int"
                   }
               },
               hp2: {
                   type: "object",
                   format: {
                       hp: "int",
                       max: "int"
                   }
               },
           },
       })
       private obj: { hp1: { hp: number, max: number }, hp2: { hp: number, max: number } };
   
       @ecprop({
           type: "array", format: "int",
       })
       private arr: number[];
   
       @ecprop({
           type: "array", format: { type: "object", format: { hp: "int", max: "int" } }
       })
       private arrobj: { hp: number, max: number }[];
   
       @ecprop({ type: "vec2", displayName: "向量2" })
       private vec2: Vec2;
   
       @ecprop({ type: "vec3", displayName: "向量3" })
       private vec3: Vec3;
   
       @ecprop({ type: "color", defaultValue: Color.RED, displayName: "颜色" })
       private color: Color;
   
       @ecprop({ type: "size", displayName: "尺寸" })
       private size: Size;
   
       protected onAdd(): void {
           this.needUpdate = true;
       }
     
       protected onEnter(): void {
   				// 可在此获取同实体上的其他组件
   				let transform = this.getComponent(ComponentType.Transform);
           /** 获取单例组件 */
           let signleton = this.entity.entityManager.getSingleton(ComponentType.XXXX);
       }
   
       protected onRemove(): void {
   				// 清理组件数据
       }
   }
   ```

3. 创建ec世界，并设置更新

   ```typescript
   /**
    * @Author: Gongxh
    * @Date: 2025-01-16
    * @Description: 战斗界面
    */
   
   import { ECManager } from "kunpocc";
   import { componentUpdateOrderList } from "../../ec/ComponentTypes";
   import { cc, fgui, kunpo } from "../../header";
   const { uiclass, uiprop, uiclick } = kunpo._uidecorator;
   
   @uiclass("Window", "Game", "GameWindow")
   export class GameWindow extends kunpo.Window {
       @uiprop container: fgui.GComponent;
       public onInit() {
           console.log("GameWindow onInit");
           this.adapterType = kunpo.AdapterType.Full;
           this.type = kunpo.WindowType.CloseAll;
           this.bgAlpha = 0;
       }
   
       protected onShow() {
           console.log("GameWindow onShow");
           /** 创建一个ec世界的节点 */
           let node = new cc.Node();
           this.container.node.addChild(node);
   
           /** 
            * 创建一个ec世界 
            * 参数1: 世界名称
            * 参数2: 世界节点
            * 参数3: 组件更新顺序列表
            * 参数4: 实体池的最大缓存数量，多余的不会被缓存，根据需要调整
            * 参数5: 预创建的实体数量，根据需要调整
            */
           kunpo.log("需要更新的组件", componentUpdateOrderList);
           ECManager.createECWorld("world", node, componentUpdateOrderList, 100, 10);
       }
   
       protected onClose() {
           /** 退出游戏时 销毁ec世界 */
           ECManager.destroyECWorld("world");
       }
   
       @uiclick
       private onBack(): void {
           kunpo.WindowManager.showWindow("HomeWindow");
       }
   
       @uiclick
       private onCreateEntity(): void {
           /** 创建一个实体 */
           ECManager.createEntity("world", "entity1");
       }
   
       protected onUpdate(dt: number): void {
           /** 更新ec世界 */
           ECManager.getECWorld("world").update(dt);
       }
   }
   ```



### 三、 网络模块

#### *HTTP 请求*

```typescript
import { HttpManager, IHttpEvent, HttpResponseType } from 'kunpocc';

// 1. 使用回调方式处理响应
const event: IHttpEvent = {
    name: "login",
    onComplete: (response) => {
        console.log('请求成功:', response.data);
    },
    onError: (response) => {
        console.log('请求失败:', response.error);
    }
};

// POST 请求
HttpManager.post(
    "https://api.example.com/login",
    { username: "test", password: "123456" },
    "json",  // 响应类型：'json' | 'text' | 'arraybuffer'
    event,
    ["Content-Type", "application/json"],  // 请求头
    5  // 超时时间（秒）
);

// GET 请求
HttpManager.get(
    "https://api.example.com/users",
    { id: 1 },
    "json",
    event
);

// 2. 使用全局事件方式处理响应
GlobalEvent.add(HttpManager.HttpEvent, (result, response) => {
    if (result === "succeed") {
        console.log('请求成功:', response.data);
    } else {
        console.log('请求失败:', response.error);
    }
}, this);

// 发送请求（不传入 event 参数）
HttpManager.post("https://api.example.com/data", { /* data */ });
```

#### *请求方法*
- `post(url, data, responseType?, event?, headers?, timeout?)`
- `get(url, data, responseType?, event?, headers?, timeout?)`
- `put(url, data, responseType?, event?, headers?, timeout?)`
- `head(url, data, responseType?, event?, headers?, timeout?)`

#### *参数说明*
- `url`: 请求地址
- `data`: 请求数据
- `responseType`: 响应类型（可选，默认 'json'）
  - `'json'`: JSON 格式
  - `'text'`: 文本格式
  - `'arraybuffer'`: 二进制数据
- `event`: 请求事件回调（可选）
- `headers`: 请求头（可选）
- `timeout`: 超时时间，单位秒（可选，0表示不超时）

#### *响应处理*
1. 回调方式（通过 IHttpEvent）：
```typescript
const event: IHttpEvent = {
    name: "自定义名称",
    data?: "自定义数据",  // 可选
    onComplete: (response) => {
        // 成功回调
    },
    onError: (response) => {
        // 失败回调
    }
};
```

2. 全局事件方式：
```typescript
GlobalEvent.add(HttpManager.HttpEvent, (result, response) => {
    // result: "succeed" | "fail"
    // response: IHttpResponse
}, this);
```



### 四、四叉树碰撞检测

> 四叉树是一种用于高效进行空间划分和碰撞检测的数据结构。

#### *基本概念*

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

   
#### *使用示例*

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

   
#### *形状操作*

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

   
#### *性能优化建议*

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


### 五、行为树系统

> 行为树是一个强大的 AI 决策系统，用于实现复杂的游戏 AI 行为。

#### *行为树基本概念*

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

#### *行为树使用示例*

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

#### *常用节点*

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

   
#### *注意事项*

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



### 六、资源加载工具

#### *资源加载器*

> 注意：资源就算加载多次和一次效果一样

```typescript
interface IAssetConfig {
    /** 资源类型 */
    type: typeof Asset;
    /** 资源路径 */
    path: string;
    /** 是否是单个文件 默认是文件夹 */
    isFile?: boolean;
    /** 资源包名 默认 resources */
    bundle?: string;
}

/**
 * 开始加载资源
 * @param {IAssetConfig[]} res.configs 资源配置
 * @param {number} res.parallel 并行加载数量 默认 10
 * @param {number} res.retry 失败重试次数 默认 3
 * @param {Function} res.complete 加载完成回调
 * @param {Function} res.progress 加载进度回调
 * @param {Function} res.fail 加载失败回调
 */
public start(res: { configs: IAssetConfig[], parallel?: number, retry?: number, complete: () => void, fail: (msg: string, err: Error) => void, progress?: (percent: number) => void }): void

/** 重试 重新加载失败的资源 */
public retry(): void
```

#### *资源池*

```typescript
/** 资源是否已加载 */
public static has(path: string, bundlename: string = "resources"): boolean

/** 获取资源 */
public static get<T extends Asset>(path: string, bundlename: string = "resources"): T

/** 按 uuid 判断资源是否已加载 */
public static hasUUID(uuid: string): boolean

/** 按 uuid 获取资源 */
public static getByUUID<T extends Asset>(uuid: string): T

/** 按资源路径释放资源 */
public static releasePath(path: string, bundlename: string = "resources"): void

/** 按 bundle 和 文件夹释放资源 */
public static async releaseDir(dir: string, bundlename: string = "resources", asset: typeof Asset): Promise<void>

/** 按 uuid 释放资源 */
public static releaseUUID(uuid: string): void

/** 释放所有加载的资源 */
public static releaseAll(): void
```



### 七、条件显示节点（用来处理游戏中的提示红点信息）

#### *定义条件*

```typescript
// 定义条件类型枚举
enum ConditionType {
  condition1,
  condition2,
  condition3,
}

// 定义条件
@conditionClass(ConditionType.condition1)
export class Condition1 extends kunpo.ConditionBase {
    protected onInit(): void {
      // 监听条件发生变化, 则调用一次 this.tryUpdate();
        kunpo.GlobalEvent.add("condition1", () => {
            this.tryUpdate();
        }, this);
    }

    protected evaluate(): boolean {
      	//TODO:: 根据条件数据，返回true or false
        return true;
    }
}
```

#### *节点关联条件*

```typescript
/** 任意一个满足 显示节点 */
new kunpo.ConditionAnyNode(fgui.GObject, ConditionType.condition1, ConditionType.condition2);

/** 所有条件都满足 显示节点 */
new kunpo.ConditionAllNode(fgui.GObject, ConditionType.Condition1, ConditionType.Condition2, ConditionType.Condition3);
```



### 八、 全局事件系统

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



### 九、全局计时器

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

### 十、平台相关

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


### 十一、屏幕

```typescript
/** 屏幕宽度 */
public static ScreenWidth: number;
/** 屏幕高度 */
public static ScreenHeight: number;
/** 设计分辨率宽 */
public static DesignWidth: number;
/** 设计分辨率高 */
public static DesignHeight: number;
/** 安全区外一侧的高度 或 宽度 */
public static SafeAreaHeight: number;
/** 安全区的宽度 */
public static SafeWidth: number;
/** 安全区的高度 */
public static SafeHeight: number;
```



### 十二、工具类

#### *数学工具 (MathTool)*

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

#### *MD5 加密*

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

## 类型支持

该库完全使用 TypeScript 编写，提供完整的类型定义文件。

## 许可证

ISC License

## 作者

gongxh

## 联系作者

*  邮箱: gong.xinhai@163.com

## 仓库
[kunpocc github地址](https://github.com/Gongxh0901/kunpolibrary)

[github demo地址](https://github.com/Gongxh0901/KunpoDemo)

[gitee demo地址](https://gitee.com/gongxinhai/kunpo-demo)
