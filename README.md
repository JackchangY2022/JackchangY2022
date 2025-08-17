# 工作流设计器 (Workflow Designer)

一个现代化的、可配置的工作流设计界面，基于React、TypeScript和React Flow构建。支持可视化设计复杂的工作流程，包含多种节点类型、拖拽操作、属性配置等功能。

## ✨ 主要特性

### 🎨 可视化设计
- **拖拽式操作**: 从侧边栏拖拽节点到画布创建工作流
- **直观的连接**: 通过拖拽节点连接点创建流程连接
- **实时预览**: 实时查看工作流的视觉效果
- **缩放和平移**: 支持画布缩放、平移和适应视图

### 🔧 丰富的节点类型
- **开始节点**: 工作流入口点
- **结束节点**: 工作流终点
- **条件判断**: 基于表达式的分支逻辑
- **变量赋值**: 为变量赋值操作
- **类型转换**: 数据类型转换
- **HTTP请求**: 发送HTTP请求
- **数据库操作**: 执行SQL查询
- **调用流程**: 调用其他工作流
- **异常处理**: 错误处理机制
- **JSON转换**: JSON数据转换
- **循环**: 循环执行操作
- **并行处理**: 并行执行多个分支

### ⚙️ 强大的配置功能
- **属性面板**: 详细的节点属性配置
- **变量管理**: 创建和管理工作流变量
- **表达式编辑**: 创建和编辑表达式
- **连接类型**: 支持默认、成功、错误三种连接类型
- **节点样式**: 自定义节点颜色和外观

### 📊 工作流管理
- **导入导出**: 支持JSON格式的工作流导入导出
- **格式转换**: 支持原始工作流格式与新格式的相互转换
- **验证检查**: 全面的工作流验证和错误检查
- **保存加载**: 本地文件保存和加载功能

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 🏗️ 项目结构

```
src/
├── components/          # React组件
│   ├── nodes/          # 节点组件
│   ├── Toolbar.tsx     # 工具栏组件
│   ├── Sidebar.tsx     # 侧边栏组件
│   ├── PropertyPanel.tsx # 属性面板组件
│   └── WorkflowDesigner.tsx # 主设计器组件
├── store/              # 状态管理
│   └── workflowStore.ts # Zustand工作流状态
├── types/              # TypeScript类型定义
│   └── workflow.ts     # 工作流类型
├── utils/              # 工具函数
│   ├── workflowValidator.ts # 工作流验证
│   └── workflowConverter.ts # 格式转换
├── lib/                # 库文件
│   └── utils.ts        # 通用工具函数
└── index.css           # 全局样式
```

## 📖 使用指南

### 创建工作流
1. 点击"创建新工作流"按钮
2. 输入工作流名称
3. 开始设计工作流

### 添加节点
1. 从左侧侧边栏选择节点类型
2. 拖拽到画布上的目标位置
3. 节点会自动添加到工作流中

### 连接节点
1. 点击源节点的输出连接点
2. 拖拽到目标节点的输入连接点
3. 释放鼠标完成连接

### 配置节点
1. 点击选中节点
2. 右侧属性面板会显示节点配置选项
3. 修改配置并保存

### 管理变量
1. 在左侧侧边栏的变量区域点击"+"按钮
2. 输入变量名称和类型
3. 变量可在节点配置中使用

### 保存工作流
1. 点击工具栏的"保存"按钮
2. 工作流将以JSON格式下载

### 加载工作流
1. 点击工具栏的"打开"按钮
2. 选择JSON格式的工作流文件
3. 工作流将加载到设计器中

## 🔍 工作流验证

设计器内置了全面的工作流验证功能：

### 基本结构验证
- 检查工作流是否包含开始节点
- 验证节点连接的完整性
- 检测循环依赖

### 节点特定验证
- **条件节点**: 验证表达式和分支连接
- **变量赋值**: 检查变量引用和赋值配置
- **HTTP请求**: 验证URL格式和请求配置
- **数据库操作**: 检查SQL查询和连接配置

### 数据验证
- 变量定义完整性
- 表达式语法正确性
- 节点配置完整性

## 🎯 支持的节点类型详解

### 开始节点 (START)
- 工作流的入口点
- 每个工作流只能有一个开始节点
- 不需要配置参数

### 结束节点 (END)
- 工作流的终点
- 可以有多个结束节点
- 可配置返回值

### 条件判断 (CONDITION)
- 基于表达式进行分支判断
- 支持真/假两个分支
- 需要配置判断表达式

### 变量赋值 (VARVALUE)
- 为工作流变量赋值
- 支持多个变量同时赋值
- 支持表达式赋值

### HTTP请求 (HTTP_REQUEST)
- 发送HTTP请求到外部服务
- 支持GET、POST、PUT、DELETE等方法
- 可配置请求头和请求体

### 数据库操作 (DATABASE)
- 执行SQL查询
- 支持参数化查询
- 需要配置数据库连接

## 🛠️ 技术栈

- **React 18**: 现代React框架
- **TypeScript**: 类型安全的JavaScript
- **React Flow**: 流程图和节点编辑器
- **Zustand**: 轻量级状态管理
- **Tailwind CSS**: 实用优先的CSS框架
- **Lucide React**: 现代图标库
- **Vite**: 快速构建工具

## 📄 数据格式

### 工作流格式
```typescript
interface Workflow {
  id: string;
  name: string;
  startId: string;
  nodes: Record<string, WorkflowNode>;
  edges: WorkflowEdge[];
  variables: Record<string, WorkflowVariable>;
  expressions: Record<string, Expression>;
}
```

### 节点格式
```typescript
interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  position: { x: number; y: number };
  data: NodeData;
  nextId?: string;
  previousIds: string[];
}
```

## 🤝 贡献

欢迎提交问题和功能请求！如果您想贡献代码，请：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🆘 支持

如果您遇到问题或需要帮助：

1. 查看 [Issues](https://github.com/your-repo/workflow-designer/issues) 页面
2. 创建新的 Issue 描述您的问题
3. 提供详细的重现步骤和环境信息

## 🎉 致谢

感谢以下开源项目：
- [React Flow](https://reactflow.dev/) - 强大的流程图库
- [Zustand](https://github.com/pmndrs/zustand) - 简单的状态管理
- [Tailwind CSS](https://tailwindcss.com/) - 实用的CSS框架
- [Lucide](https://lucide.dev/) - 美观的图标集

---

**工作流设计器** - 让工作流设计变得简单而强大！ 🚀
