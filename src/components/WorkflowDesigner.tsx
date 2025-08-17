import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Connection,
  ConnectionMode,
  ReactFlowProvider,
  ReactFlowInstance,
  useReactFlow,
  MarkerType,
} from 'reactflow';
import { WorkflowNode } from './nodes/WorkflowNode';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { PropertyPanel } from './PropertyPanel';
import { useWorkflowStore } from '@/store/workflowStore';
import { NodeType } from '@/types/workflow';
import { downloadFile, readFile, formatDate } from '@/lib/utils';
import { convertDemoWorkflow } from '@/utils/demoWorkflow';
import { WorkflowConverter } from '@/utils/workflowConverter';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
  workflowNode: WorkflowNode,
};

const WorkflowDesignerContent: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isPropertyPanelVisible, setIsPropertyPanelVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState<NodeType | null>(null);

  const {
    workflow,
    selectedNodeId,
    selectedEdgeId,
    createWorkflow,
    loadWorkflow,
    updateWorkflow,
    addNode,
    updateNode,
    deleteNode,
    selectNode,
    addEdge: addWorkflowEdge,
    deleteEdge,
    selectEdge,
    clearSelection,
  } = useWorkflowStore();

  // Sync workflow with React Flow state
  useEffect(() => {
    if (workflow) {
      const flowNodes: Node[] = Object.values(workflow.nodes).map((node) => ({
        id: node.id,
        type: 'workflowNode',
        position: node.position,
        data: {
          type: node.type,
          name: node.name,
          description: node.data?.description,
          color: node.color,
        },
        selected: node.id === selectedNodeId,
      }));

      const flowEdges: Edge[] = workflow.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'default',
        label: edge.label,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edge.type === 'error' ? '#ef4444' : edge.type === 'success' ? '#22c55e' : '#6b7280',
        },
        style: {
          stroke: edge.type === 'error' ? '#ef4444' : edge.type === 'success' ? '#22c55e' : '#6b7280',
        },
        selected: edge.id === selectedEdgeId,
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [workflow, selectedNodeId, selectedEdgeId, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        const edgeType = params.sourceHandle === 'error' ? 'error' : 
                        params.sourceHandle === 'true' ? 'success' : 'default';
        addWorkflowEdge(params.source, params.target, edgeType);
      }
    },
    [addWorkflowEdge]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      selectNode(node.id);
      setIsPropertyPanelVisible(true);
    },
    [selectNode]
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      selectEdge(edge.id);
      setIsPropertyPanelVisible(true);
    },
    [selectEdge]
  );

  const onPaneClick = useCallback(() => {
    clearSelection();
    setIsPropertyPanelVisible(false);
  }, [clearSelection]);

  const onNodeDragStart = useCallback((nodeType: NodeType) => {
    setDraggedNodeType(nodeType);
    setIsDragging(true);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);

      const nodeType = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!nodeType || !reactFlowInstance || !workflow) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeId = addNode(nodeType, position);
      selectNode(nodeId);
      setIsPropertyPanelVisible(true);
    },
    [reactFlowInstance, workflow, addNode, selectNode]
  );

  const handleSave = useCallback(() => {
    if (!workflow) return;
    
    const data = JSON.stringify(workflow, null, 2);
    downloadFile(data, `${workflow.name || 'workflow'}.json`);
  }, [workflow]);

  const handleLoad = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const content = await readFile(file);
          const workflowData = JSON.parse(content);
          loadWorkflow(workflowData);
        } catch (error) {
          alert('文件格式错误，无法加载工作流');
        }
      }
    };
    input.click();
  }, [loadWorkflow]);

  const handleExport = useCallback(() => {
    if (!workflow) return;
    
    const exportData = {
      workflow,
      version: '1.0.0',
      exportDate: formatDate(new Date()),
    };
    
    const data = JSON.stringify(exportData, null, 2);
    downloadFile(data, `${workflow.name || 'workflow'}_export.json`);
  }, [workflow]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const content = await readFile(file);
          const importData = JSON.parse(content);
          
          // 检查是否是原始格式的工作流
          if (importData.ProcessDic && importData.FlowName) {
            // 原始格式，使用转换器
            const convertedWorkflow = WorkflowConverter.convertFromOriginal(importData);
            loadWorkflow(convertedWorkflow);
          } else if (importData.workflow) {
            // 新格式的导出文件
            loadWorkflow(importData.workflow);
          } else {
            // 直接的工作流对象
            loadWorkflow(importData);
          }
        } catch (error) {
          alert('导入失败，文件格式错误');
        }
      }
    };
    input.click();
  }, [loadWorkflow]);

  const handleLoadDemo = useCallback(() => {
    const demoWorkflow = convertDemoWorkflow();
    loadWorkflow(demoWorkflow);
  }, [loadWorkflow]);

  const handleDelete = useCallback(() => {
    if (selectedNodeId) {
      if (window.confirm('确定要删除选中的节点吗？')) {
        deleteNode(selectedNodeId);
        setIsPropertyPanelVisible(false);
      }
    } else if (selectedEdgeId) {
      if (window.confirm('确定要删除选中的连接吗？')) {
        deleteEdge(selectedEdgeId);
        setIsPropertyPanelVisible(false);
      }
    }
  }, [selectedNodeId, selectedEdgeId, deleteNode, deleteEdge]);

  const handleNewWorkflow = useCallback(() => {
    const name = prompt('请输入工作流名称:', '新建工作流');
    if (name) {
      createWorkflow(name);
    }
  }, [createWorkflow]);

  const handleZoomIn = useCallback(() => {
    reactFlowInstance?.zoomIn();
  }, [reactFlowInstance]);

  const handleZoomOut = useCallback(() => {
    reactFlowInstance?.zoomOut();
  }, [reactFlowInstance]);

  const handleFitView = useCallback(() => {
    reactFlowInstance?.fitView();
  }, [reactFlowInstance]);

  // Initialize with a default workflow if none exists
  useEffect(() => {
    if (!workflow) {
      createWorkflow('默认工作流');
    }
  }, [workflow, createWorkflow]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar onNodeDragStart={onNodeDragStart} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <Toolbar
          onSave={handleSave}
          onLoad={handleLoad}
          onExport={handleExport}
          onImport={handleImport}
          onDelete={handleDelete}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
          onSettings={() => alert('设置功能开发中')}
          onPreview={() => alert('预览功能开发中')}
          onRun={() => alert('运行功能开发中')}
          onCopy={() => alert('复制功能开发中')}
          onLoadDemo={handleLoadDemo}
        />

        {/* Canvas */}
        <div className="flex-1 relative">
          <div ref={reactFlowWrapper} className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              fitView
              className="bg-gray-100"
            >
              <Controls />
              <MiniMap 
                nodeColor={(node) => {
                  const workflowNode = workflow?.nodes[node.id];
                  return workflowNode?.color || '#6b7280';
                }}
                className="!bg-white !border !border-gray-300"
              />
              <Background variant="dots" gap={20} size={1} />
            </ReactFlow>
          </div>

          {/* New Workflow Button */}
          {!workflow && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  欢迎使用工作流设计器
                </h2>
                <p className="text-gray-600 mb-6">
                  开始创建您的第一个工作流
                </p>
                <button
                  onClick={handleNewWorkflow}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  创建新工作流
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property Panel */}
      {isPropertyPanelVisible && (
        <PropertyPanel
          isVisible={isPropertyPanelVisible}
          onClose={() => setIsPropertyPanelVisible(false)}
        />
      )}
    </div>
  );
};

export const WorkflowDesigner: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowDesignerContent />
    </ReactFlowProvider>
  );
};