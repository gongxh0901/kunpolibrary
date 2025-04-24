## 项目配置

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

   ![image-basic-config](./../image/image-basic-config.png#pic_left)

4. 配置完毕