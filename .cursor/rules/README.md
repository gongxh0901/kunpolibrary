# KunpoCC Cursor Rules

这个目录包含了 KunpoCC 项目的 Cursor AI 编程助手规则文件。这些规则帮助 Cursor 更好地理解项目架构和编码规范，提供更准确的代码建议和自动完成。

## 规则文件结构

### 📋 [project-overview.mdc](./project-overview.mdc)
**总体项目规范** - 始终应用
- 项目架构和目录结构
- 开发流程和质量保证
- 版本管理和部署规范
- 适用范围：所有文件

### 🔧 [typescript-general.mdc](./typescript-general.mdc) 
**TypeScript 通用规范** - 始终应用
- 命名约定和代码风格
- 类型定义和泛型使用
- JSDoc 注释规范
- 错误处理模式
- 适用范围：`src/**/*.ts`

### 🎮 [cocos-creator.mdc](./cocos-creator.mdc)
**Cocos Creator 开发规范**
- Component 基类设计模式
- 生命周期管理
- 平台适配和节点管理
- 适配器模式应用
- 适用范围：`src/cocos/**/*.ts`, `src/global/**/*.ts`

### 🖼️ [fairygui.mdc](./fairygui.mdc)
**FairyGUI UI 系统规范**
- 窗口基类和生命周期
- 窗口管理器模式
- 装饰器系统使用
- 资源管理和屏幕适配
- 适用范围：`src/fgui/**/*.ts`, `src/ui/**/*.ts`

### 🎨 [decorator-patterns.mdc](./decorator-patterns.mdc)
**装饰器模式规范**
- namespace 封装模式
- 类装饰器和属性装饰器
- 方法装饰器和元数据管理
- 动态注册支持
- 适用范围：`**/*Decorator*.ts`, `**/*decorator*.ts`

### 📊 [data-binding.mdc](./data-binding.mdc)
**数据绑定系统规范**
- DataBase 基类设计
- 强类型绑定装饰器
- 绑定管理器和批量更新
- 路径解析和类型安全
- 适用范围：`src/data/**/*.ts`, `**/*Data*.ts`

### 🐛 [logging-debugging.mdc](./logging-debugging.mdc)
**日志系统和调试规范** - 始终应用
- 统一日志接口和级别
- 调试模式管理
- 全局调试工具
- 性能监控日志
- 适用范围：`src/tool/log.ts`, `**/*.ts`

### 🏗️ [architecture-patterns.mdc](./architecture-patterns.mdc)
**架构模式规范**
- 单例管理器模式
- 抽象基类设计
- 接口和契约定义
- 工厂模式和适配器模式
- 适用范围：`src/**/*.ts`

### 📱 [minigame-platform.mdc](./minigame-platform.mdc)
**小游戏平台规范**
- 平台检测和分类
- 平台适配器设计
- 统一接口封装
- 平台特定功能实现
- 适用范围：`src/minigame/**/*.ts`, `src/global/Platform.ts`

### 🔄 [hot-update.mdc](./hot-update.mdc)
**热更新系统规范**
- 管理器单例模式
- Promise 结果模式
- manifest 管理
- 进度监控和错误处理
- 适用范围：`src/hotupdate/**/*.ts`

## 规则应用方式

### 自动应用的规则
以下规则会自动应用到相关文件：
- `project-overview.mdc` - 所有文件
- `typescript-general.mdc` - 所有 TypeScript 文件
- `logging-debugging.mdc` - 所有文件

### 条件应用的规则
其他规则通过文件路径模式匹配自动应用到相关文件。

### 手动引用规则
你也可以在与 Cursor 的对话中手动引用特定的规则文件：
```
请参考 FairyGUI 规范来实现这个窗口类
请按照数据绑定规范来设计这个数据类
```

## 使用建议

### 开发新功能时
1. 先查看 `project-overview.mdc` 了解整体架构
2. 根据功能类型查看相应的专门规范
3. 遵循 `typescript-general.mdc` 的基本编码规范

### 重构代码时
1. 参考 `architecture-patterns.mdc` 的设计模式
2. 检查是否符合相关模块的特定规范
3. 确保日志和错误处理符合规范

### 添加新平台支持时
1. 参考 `minigame-platform.mdc` 的适配模式
2. 遵循统一接口设计原则
3. 添加相应的平台检测和错误处理

## 规则维护

### 更新规则
- 当项目架构发生重大变更时，及时更新相关规则
- 新增功能模块时，考虑是否需要新的规则文件
- 定期检查规则的准确性和完整性

### 规则版本控制
- 规则文件纳入版本控制
- 重大规则变更记录在项目 CHANGELOG 中
- 确保团队成员了解规则更新

这些规则文件帮助确保代码质量和一致性，同时让 Cursor AI 能够更好地理解项目上下文，提供更准确的编程辅助。
