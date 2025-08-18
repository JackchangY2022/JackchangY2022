# 工作流设计器 (Workflow Designer)

一个现代化的低代码/无代码工作流设计器应用，基于React和ReactFlow构建。

## 功能特性

- 🎯 **可视化工作流设计** - 拖拽式节点连接，直观的工作流构建
- 🎨 **现代化UI界面** - 基于Tailwind CSS的美观界面设计
- 📱 **响应式布局** - 支持不同屏幕尺寸
- 🔧 **丰富的节点类型** - 支持开始、结束、条件、处理等多种节点
- 📊 **实时预览** - 所见即所得的工作流设计体验
- 💾 **工作流管理** - 支持多个工作流的创建和管理
- 🔍 **智能搜索** - 快速定位组件和工作流

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **工作流引擎**: ReactFlow
- **图标库**: Lucide React
- **状态管理**: React Hooks

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/           # React组件
│   ├── WorkflowDesigner.tsx    # 主设计器组件
│   ├── LeftSidebar.tsx         # 左侧边栏
│   ├── TopBar.tsx             # 顶部工具栏
│   ├── WorkflowCanvas.tsx     # 工作流画布
│   ├── RightSidebar.tsx       # 右侧边栏
│   ├── CustomNode.tsx         # 自定义节点
│   └── CustomEdge.tsx         # 自定义边
├── App.tsx              # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 使用说明

### 基本操作

1. **选择工作流**: 在左侧边栏选择要编辑的工作流
2. **添加节点**: 从右侧组件库拖拽组件到画布
3. **连接节点**: 点击节点上的连接点并拖拽到目标节点
4. **编辑节点**: 点击节点查看和编辑属性
5. **保存工作流**: 使用顶部工具栏的保存按钮

### 节点类型

- **开始节点**: 工作流的起始点
- **结束节点**: 工作流的终止点
- **变量赋值**: 设置变量值
- **处理节点**: 执行具体业务逻辑
- **条件判断**: 根据条件分支流程
- **异常处理**: 处理错误和异常情况
- **类型转换**: 数据格式转换

## 自定义开发

### 添加新节点类型

1. 在 `CustomNode.tsx` 中添加新的节点渲染逻辑
2. 在 `WorkflowDesigner.tsx` 中注册新节点类型
3. 在右侧组件库中添加新组件

### 扩展工作流功能

1. 修改 `Workflow` 接口添加新属性
2. 在画布组件中实现新的交互逻辑
3. 添加新的工具栏功能

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！
