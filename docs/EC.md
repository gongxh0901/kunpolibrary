## 实体组件模块 
> 实体组件系统是一种用于游戏开发的架构模式，它将游戏对象（实体）的数据（组件）和行为分离。

### 特点
  *  不同实体上的组件更新顺序管理（`只根据注册的组件更新顺序更新，跟实体无关`）
  * 灵活的EC装饰器 （配合插件 `kunpo-ec` 使用，配置实体组件信息，一键导出）
  * 支持多世界（多战斗场景，互不影响）
  * 区分数据组件和逻辑组件，只更新逻辑组件

### 插件链接

* **kunpo-ec**:  [https://store.cocos.com/app/detail/7311](https://store.cocos.com/app/detail/7311)

### 使用

#### *creator插件`kunpo-ec`*
> `kunpo-cc`可以方便创建、配置、导出实体，操作界面如下图：

![image-20250213111622050](https://gitee.com/gongxinhai/public-image/raw/master/image-20250213111622050.png)

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
           // 设置组件是否更新，只有需要更新的组件才设置
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

#### 重点接口

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

   