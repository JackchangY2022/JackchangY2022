import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Plus, 
  Minus, 
  Eye, 
  EyeOff,
  Code,
  Database,
  Globe,
  Variable,
  GitBranch
} from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { NodeType, DataType } from '@/types/workflow';
import { cn } from '@/lib/utils';

interface PropertyPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ isVisible, onClose }) => {
  const { 
    workflow, 
    selectedNodeId, 
    selectedEdgeId, 
    updateNode, 
    updateEdge, 
    clearSelection 
  } = useWorkflowStore();

  const [localData, setLocalData] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);

  const selectedNode = selectedNodeId && workflow ? workflow.nodes[selectedNodeId] : null;
  const selectedEdge = selectedEdgeId && workflow ? workflow.edges.find(e => e.id === selectedEdgeId) : null;

  useEffect(() => {
    if (selectedNode) {
      setLocalData({ ...selectedNode });
      setHasChanges(false);
    } else if (selectedEdge) {
      setLocalData({ ...selectedEdge });
      setHasChanges(false);
    } else {
      setLocalData({});
      setHasChanges(false);
    }
  }, [selectedNode, selectedEdge]);

  const handleSave = () => {
    if (selectedNode && hasChanges) {
      updateNode(selectedNode.id, localData);
      setHasChanges(false);
    } else if (selectedEdge && hasChanges) {
      updateEdge(selectedEdge.id, localData);
      setHasChanges(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleNestedChange = (path: string[], value: any) => {
    setLocalData(prev => {
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newData;
    });
    setHasChanges(true);
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('有未保存的更改，确定要关闭吗？')) {
        clearSelection();
        onClose();
      }
    } else {
      clearSelection();
      onClose();
    }
  };

  if (!isVisible || (!selectedNode && !selectedEdge)) {
    return null;
  }

  return (
    <div className="property-panel w-80 h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Settings size={16} />
          <h3 className="font-semibold text-gray-800">
            {selectedNode ? '节点属性' : '连接属性'}
          </h3>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {selectedNode && (
          <NodeProperties
            node={localData}
            onChange={handleChange}
            onNestedChange={handleNestedChange}
            workflow={workflow}
          />
        )}
        
        {selectedEdge && (
          <EdgeProperties
            edge={localData}
            onChange={handleChange}
          />
        )}
      </div>

      {/* Footer */}
      {hasChanges && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              保存更改
            </button>
            <button
              onClick={() => {
                if (selectedNode) {
                  setLocalData({ ...selectedNode });
                } else if (selectedEdge) {
                  setLocalData({ ...selectedEdge });
                }
                setHasChanges(false);
              }}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface NodePropertiesProps {
  node: any;
  onChange: (field: string, value: any) => void;
  onNestedChange: (path: string[], value: any) => void;
  workflow: any;
}

const NodeProperties: React.FC<NodePropertiesProps> = ({ 
  node, 
  onChange, 
  onNestedChange, 
  workflow 
}) => {
  if (!node) return null;

  return (
    <div className="space-y-0">
      {/* Basic Properties */}
      <div className="property-section">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">基本属性</h4>
        
        <div className="space-y-3">
          <div>
            <label className="property-label">节点名称</label>
            <input
              type="text"
              value={node.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              className="property-input"
              placeholder="请输入节点名称"
            />
          </div>

          <div>
            <label className="property-label">节点类型</label>
            <input
              type="text"
              value={getNodeTypeName(node.type)}
              disabled
              className="property-input bg-gray-50"
            />
          </div>

          <div>
            <label className="property-label">节点颜色</label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={node.color || '#000000'}
                onChange={(e) => onChange('color', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={node.color || ''}
                onChange={(e) => onChange('color', e.target.value)}
                className="flex-1 property-input"
                placeholder="rgba(0, 0, 0, 1)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Type-specific Properties */}
      {renderTypeSpecificProperties(node, onChange, onNestedChange, workflow)}
    </div>
  );
};

interface EdgePropertiesProps {
  edge: any;
  onChange: (field: string, value: any) => void;
}

const EdgeProperties: React.FC<EdgePropertiesProps> = ({ edge, onChange }) => {
  return (
    <div className="property-section">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">连接属性</h4>
      
      <div className="space-y-3">
        <div>
          <label className="property-label">连接类型</label>
          <select
            value={edge.type || 'default'}
            onChange={(e) => onChange('type', e.target.value)}
            className="property-select"
          >
            <option value="default">默认</option>
            <option value="success">成功</option>
            <option value="error">错误</option>
          </select>
        </div>

        <div>
          <label className="property-label">标签</label>
          <input
            type="text"
            value={edge.label || ''}
            onChange={(e) => onChange('label', e.target.value)}
            className="property-input"
            placeholder="连接标签"
          />
        </div>

        <div>
          <label className="property-label">源节点</label>
          <input
            type="text"
            value={edge.source || ''}
            disabled
            className="property-input bg-gray-50"
          />
        </div>

        <div>
          <label className="property-label">目标节点</label>
          <input
            type="text"
            value={edge.target || ''}
            disabled
            className="property-input bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
};

function renderTypeSpecificProperties(
  node: any, 
  onChange: (field: string, value: any) => void,
  onNestedChange: (path: string[], value: any) => void,
  workflow: any
) {
  const nodeType = node.type as NodeType;
  
  switch (nodeType) {
    case NodeType.CONDITION:
      return (
        <div className="property-section">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <GitBranch size={14} className="mr-1" />
            条件设置
          </h4>
          <div className="space-y-3">
            <div>
              <label className="property-label">条件表达式</label>
              <textarea
                value={node.data?.expression || ''}
                onChange={(e) => onNestedChange(['data', 'expression'], e.target.value)}
                className="property-textarea h-20"
                placeholder="请输入条件表达式"
              />
            </div>
            <div>
              <label className="property-label">真分支节点ID</label>
              <input
                type="text"
                value={node.data?.trueNodeId || ''}
                onChange={(e) => onNestedChange(['data', 'trueNodeId'], e.target.value)}
                className="property-input"
                placeholder="真分支节点ID"
              />
            </div>
            <div>
              <label className="property-label">假分支节点ID</label>
              <input
                type="text"
                value={node.data?.falseNodeId || ''}
                onChange={(e) => onNestedChange(['data', 'falseNodeId'], e.target.value)}
                className="property-input"
                placeholder="假分支节点ID"
              />
            </div>
          </div>
        </div>
      );

    case NodeType.VARVALUE:
      return (
        <div className="property-section">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Variable size={14} className="mr-1" />
            变量赋值
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="property-label mb-0">赋值列表</label>
                <button
                  onClick={() => {
                    const assignments = node.data?.assignments || [];
                    onNestedChange(['data', 'assignments'], [
                      ...assignments,
                      { variableId: '', expressionId: '', value: '' }
                    ]);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="添加赋值"
                >
                  <Plus size={12} />
                </button>
              </div>
              {(node.data?.assignments || []).map((assignment: any, index: number) => (
                <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                  <select
                    value={assignment.variableId || ''}
                    onChange={(e) => {
                      const assignments = [...(node.data?.assignments || [])];
                      assignments[index] = { ...assignments[index], variableId: e.target.value };
                      onNestedChange(['data', 'assignments'], assignments);
                    }}
                    className="flex-1 property-select text-xs"
                  >
                    <option value="">选择变量</option>
                    {workflow && Object.values(workflow.variables).map((variable: any) => (
                      <option key={variable.id} value={variable.id}>
                        {variable.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={assignment.value || ''}
                    onChange={(e) => {
                      const assignments = [...(node.data?.assignments || [])];
                      assignments[index] = { ...assignments[index], value: e.target.value };
                      onNestedChange(['data', 'assignments'], assignments);
                    }}
                    className="flex-1 property-input text-xs"
                    placeholder="值或表达式"
                  />
                  <button
                    onClick={() => {
                      const assignments = [...(node.data?.assignments || [])];
                      assignments.splice(index, 1);
                      onNestedChange(['data', 'assignments'], assignments);
                    }}
                    className="p-1 hover:bg-red-100 rounded"
                    title="删除"
                  >
                    <Minus size={12} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case NodeType.HTTP_REQUEST:
      return (
        <div className="property-section">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Globe size={14} className="mr-1" />
            HTTP请求设置
          </h4>
          <div className="space-y-3">
            <div>
              <label className="property-label">请求URL</label>
              <input
                type="text"
                value={node.data?.url || ''}
                onChange={(e) => onNestedChange(['data', 'url'], e.target.value)}
                className="property-input"
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div>
              <label className="property-label">请求方法</label>
              <select
                value={node.data?.method || 'GET'}
                onChange={(e) => onNestedChange(['data', 'method'], e.target.value)}
                className="property-select"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label className="property-label">请求头</label>
              <textarea
                value={JSON.stringify(node.data?.headers || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value);
                    onNestedChange(['data', 'headers'], headers);
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                className="property-textarea h-20 font-mono text-xs"
                placeholder='{"Content-Type": "application/json"}'
              />
            </div>
            <div>
              <label className="property-label">请求体</label>
              <textarea
                value={node.data?.body || ''}
                onChange={(e) => onNestedChange(['data', 'body'], e.target.value)}
                className="property-textarea h-24 font-mono text-xs"
                placeholder="请求体内容"
              />
            </div>
          </div>
        </div>
      );

    case NodeType.DATABASE:
      return (
        <div className="property-section">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Database size={14} className="mr-1" />
            数据库操作
          </h4>
          <div className="space-y-3">
            <div>
              <label className="property-label">连接ID</label>
              <input
                type="text"
                value={node.data?.connectionId || ''}
                onChange={(e) => onNestedChange(['data', 'connectionId'], e.target.value)}
                className="property-input"
                placeholder="数据库连接ID"
              />
            </div>
            <div>
              <label className="property-label">SQL查询</label>
              <textarea
                value={node.data?.query || ''}
                onChange={(e) => onNestedChange(['data', 'query'], e.target.value)}
                className="property-textarea h-32 font-mono text-xs"
                placeholder="SELECT * FROM table WHERE id = ?"
              />
            </div>
            <div>
              <label className="property-label">参数</label>
              <textarea
                value={JSON.stringify(node.data?.parameters || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parameters = JSON.parse(e.target.value);
                    onNestedChange(['data', 'parameters'], parameters);
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                className="property-textarea h-20 font-mono text-xs"
                placeholder='["param1", "param2"]'
              />
            </div>
          </div>
        </div>
      );

    case NodeType.CALLFLOW:
      return (
        <div className="property-section">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">调用流程设置</h4>
          <div className="space-y-3">
            <div>
              <label className="property-label">流程ID</label>
              <input
                type="text"
                value={node.data?.flowId || ''}
                onChange={(e) => onNestedChange(['data', 'flowId'], e.target.value)}
                className="property-input"
                placeholder="要调用的流程ID"
              />
            </div>
            <div>
              <label className="property-label">流程名称</label>
              <input
                type="text"
                value={node.data?.flowName || ''}
                onChange={(e) => onNestedChange(['data', 'flowName'], e.target.value)}
                className="property-input"
                placeholder="流程名称"
              />
            </div>
            <div>
              <label className="property-label">变量映射</label>
              <textarea
                value={JSON.stringify(node.data?.variableMapping || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const mapping = JSON.parse(e.target.value);
                    onNestedChange(['data', 'variableMapping'], mapping);
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                className="property-textarea h-24 font-mono text-xs"
                placeholder='{"localVar": "remoteVar"}'
              />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

function getNodeTypeName(type: NodeType): string {
  const typeNames = {
    [NodeType.START]: '开始节点',
    [NodeType.END]: '结束节点',
    [NodeType.CONDITION]: '条件判断',
    [NodeType.VARVALUE]: '变量赋值',
    [NodeType.DATATYPECONVERT]: '类型转换',
    [NodeType.CALLFLOW]: '调用流程',
    [NodeType.ERROR]: '异常处理',
    [NodeType.JSONTOJSON]: 'JSON转换',
    [NodeType.HTTP_REQUEST]: 'HTTP请求',
    [NodeType.DATABASE]: '数据库操作',
    [NodeType.LOOP]: '循环',
    [NodeType.PARALLEL]: '并行处理'
  };
  return typeNames[type] || type;
}