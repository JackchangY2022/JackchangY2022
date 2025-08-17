import React from 'react';
import { 
  Play, 
  Square, 
  GitBranch, 
  Variable, 
  RotateCcw, 
  Phone, 
  AlertTriangle,
  ArrowLeftRight,
  Globe,
  Database,
  IterationCw,
  Layers,
  Plus,
  Minus,
  Settings
} from 'lucide-react';
import { NodeType, NodeTemplate, DataType } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';
import { cn } from '@/lib/utils';

const nodeTemplates: NodeTemplate[] = [
  {
    type: NodeType.START,
    name: '开始',
    icon: 'Play',
    description: '工作流开始节点',
    defaultData: {},
    configurable: false
  },
  {
    type: NodeType.END,
    name: '结束',
    icon: 'Square',
    description: '工作流结束节点',
    defaultData: {},
    configurable: false
  },
  {
    type: NodeType.CONDITION,
    name: '条件判断',
    icon: 'GitBranch',
    description: '根据条件选择执行路径',
    defaultData: { expression: '', trueNodeId: '', falseNodeId: '' },
    configurable: true
  },
  {
    type: NodeType.VARVALUE,
    name: '变量赋值',
    icon: 'Variable',
    description: '为变量赋值',
    defaultData: { assignments: [] },
    configurable: true
  },
  {
    type: NodeType.DATATYPECONVERT,
    name: '类型转换',
    icon: 'RotateCcw',
    description: '转换数据类型',
    defaultData: { sourceVariableId: '', targetVariableId: '', sourceType: DataType.STRING, targetType: DataType.STRING },
    configurable: true
  },
  {
    type: NodeType.CALLFLOW,
    name: '调用流程',
    icon: 'Phone',
    description: '调用其他工作流',
    defaultData: { flowId: '', flowName: '', variableMapping: {} },
    configurable: true
  },
  {
    type: NodeType.ERROR,
    name: '异常处理',
    icon: 'AlertTriangle',
    description: '处理异常情况',
    defaultData: {},
    configurable: true
  },
  {
    type: NodeType.JSONTOJSON,
    name: 'JSON转换',
    icon: 'ArrowLeftRight',
    description: 'JSON数据转换',
    defaultData: {},
    configurable: true
  },
  {
    type: NodeType.HTTP_REQUEST,
    name: 'HTTP请求',
    icon: 'Globe',
    description: '发送HTTP请求',
    defaultData: { url: '', method: 'GET', headers: {}, body: '' },
    configurable: true
  },
  {
    type: NodeType.DATABASE,
    name: '数据库操作',
    icon: 'Database',
    description: '执行数据库操作',
    defaultData: { query: '', connectionId: '', parameters: [] },
    configurable: true
  },
  {
    type: NodeType.LOOP,
    name: '循环',
    icon: 'IterationCw',
    description: '循环执行操作',
    defaultData: { condition: '', maxIterations: 100 },
    configurable: true
  },
  {
    type: NodeType.PARALLEL,
    name: '并行处理',
    icon: 'Layers',
    description: '并行执行多个分支',
    defaultData: { branches: [] },
    configurable: true
  }
];

const iconComponents = {
  Play,
  Square,
  GitBranch,
  Variable,
  RotateCcw,
  Phone,
  AlertTriangle,
  ArrowLeftRight,
  Globe,
  Database,
  IterationCw,
  Layers
};

interface SidebarProps {
  onNodeDragStart: (nodeType: NodeType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNodeDragStart }) => {
  const { 
    workflow, 
    addVariable, 
    updateVariable, 
    deleteVariable,
    addExpression,
    updateExpression,
    deleteExpression
  } = useWorkflowStore();

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    onNodeDragStart(nodeType);
  };

  const handleAddVariable = () => {
    const name = prompt('请输入变量名称:');
    if (name) {
      addVariable(name, DataType.STRING);
    }
  };

  const handleAddExpression = () => {
    const name = prompt('请输入表达式名称:');
    if (name) {
      const content = prompt('请输入表达式内容:', 'return "";');
      if (content) {
        addExpression(name, content);
      }
    }
  };

  return (
    <div className="sidebar w-64 h-full custom-scrollbar">
      {/* Node Templates Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">节点模板</h3>
        <div className="space-y-2">
          {nodeTemplates.map((template) => {
            const IconComponent = iconComponents[template.icon as keyof typeof iconComponents];
            return (
              <div
                key={template.type}
                className="node-template group"
                draggable
                onDragStart={(e) => handleDragStart(e, template.type)}
                title={template.description}
              >
                <div className="node-template-icon">
                  <IconComponent size={16} />
                </div>
                <span className="node-template-name">{template.name}</span>
                {template.configurable && (
                  <Settings size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Variables Section */}
      <div className="sidebar-section">
        <div className="flex items-center justify-between mb-3">
          <h3 className="sidebar-title mb-0">变量</h3>
          <button
            onClick={handleAddVariable}
            className="p-1 hover:bg-gray-100 rounded"
            title="添加变量"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {workflow && Object.values(workflow.variables).map((variable) => (
            <div
              key={variable.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border group"
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-700 truncate">
                  {variable.name}
                </div>
                <div className="text-xs text-gray-500">
                  {getDataTypeName(variable.dataType)}
                </div>
              </div>
              <button
                onClick={() => deleteVariable(variable.id)}
                className="p-1 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="删除变量"
              >
                <Minus size={12} className="text-red-500" />
              </button>
            </div>
          ))}
          {(!workflow || Object.keys(workflow.variables).length === 0) && (
            <div className="text-xs text-gray-500 text-center py-4">
              暂无变量
            </div>
          )}
        </div>
      </div>

      {/* Expressions Section */}
      <div className="sidebar-section">
        <div className="flex items-center justify-between mb-3">
          <h3 className="sidebar-title mb-0">表达式</h3>
          <button
            onClick={handleAddExpression}
            className="p-1 hover:bg-gray-100 rounded"
            title="添加表达式"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {workflow && Object.values(workflow.expressions).map((expression) => (
            <div
              key={expression.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border group"
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-700 truncate">
                  {expression.name}
                </div>
                <div className="text-xs text-gray-500">
                  {expression.returnType}
                </div>
              </div>
              <button
                onClick={() => deleteExpression(expression.id)}
                className="p-1 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="删除表达式"
              >
                <Minus size={12} className="text-red-500" />
              </button>
            </div>
          ))}
          {(!workflow || Object.keys(workflow.expressions).length === 0) && (
            <div className="text-xs text-gray-500 text-center py-4">
              暂无表达式
            </div>
          )}
        </div>
      </div>

      {/* Workflow Info Section */}
      {workflow && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">工作流信息</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">节点数量:</span>
              <span className="font-medium">{Object.keys(workflow.nodes).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">连接数量:</span>
              <span className="font-medium">{workflow.edges.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">变量数量:</span>
              <span className="font-medium">{Object.keys(workflow.variables).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">表达式数量:</span>
              <span className="font-medium">{Object.keys(workflow.expressions).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">最大并行:</span>
              <span className="font-medium">{workflow.maxParallel || 5}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">超时时间:</span>
              <span className="font-medium">{workflow.executionTimeoutSecond || 300}s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getDataTypeName(dataType: DataType): string {
  const typeNames = {
    [DataType.STRING]: '字符串',
    [DataType.NUMBER]: '数字',
    [DataType.BOOLEAN]: '布尔',
    [DataType.JSON]: 'JSON',
    [DataType.ARRAY]: '数组',
    [DataType.DATE]: '日期'
  };
  return typeNames[dataType] || '未知';
}