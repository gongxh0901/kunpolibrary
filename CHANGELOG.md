
## 1.0.25
- 添加Time时间工具，支持同步服务器时间；提供一系列时间格式化方法，。
## 1.0.27
- 添加socket网络模块，支持所有平台，抹平微信、支付宝、抖音小游戏和web以及原生平台的使用差异；
## 1.0.28
- 添加小游戏激励视频、支付、和通用信息获取接口 (支付宝小游戏、抖音小游戏、微信小游戏)
## 1.0.29
- 添加原生平台热更新支持
## 1.0.30
- 修复已知bug
- 调整微信和抖音小游戏广告实现
## 1.0.31
- 修改资源加载器，自定义加载批次，支持按加载批次释放资源，详情见 [资源管理](./docs/Asset.md)
## 1.0.32
- 修复热更新manifest文件cdn缓存导致检测不到更新的问题
## 1.0.33
- UI模块添加fgui控制器和动画装饰器，详情见 [UI模块](./docs/UI.md)
## 1.0.34
- 兼容性修改，兼容creator3.7及之后的版本
## 1.0.35
- 修复未配置GameEntiry中的ecConfig时报错的问题
## 1.0.38
- 修复适配器设计尺寸设置错误的问题

## 1.1.0 模块拆分
- 拆分资源管理模块，使用 `npm install kunpocc-assets` 安装
    * 仓库地址: https://github.com/Gongxh0901/kunpocc-assets

- 拆分ec模块，使用 `npm install kunpocc-ec` 安装
    * 仓库地址: https://github.com/Gongxh0901/kunpo-ec

- 拆分ecs模块，使用 `npm install kunpocc-ecs` 安装
    * 仓库地址: https://github.com/Gongxh0901/kunpo-esc

- 拆分四叉树模块，使用 `npm install kunpocc-quadtree` 安装
    * 仓库地址: https://github.com/Gongxh0901/kunpo-quadtree

- 拆分行为树模块，使用 `npm install kunpocc-behaviortree` 安装
    * 仓库地址: https://github.com/Gongxh0901/kunpocc-behaviortree
  
## 1.1.4 事件模块拆分
- 拆分事件模块，使用 `npm install kunpocc-event` 安装
    * 仓库地址: https://github.com/Gongxh0901/kunpocc-event

## 1.1.5 网络模块拆分
- 拆分网络模块，使用 `npm install kunpocc-net` 安装
    * 仓库地址: https://github.com/Gongxh0901/kunpocc-net