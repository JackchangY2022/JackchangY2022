import React, { useCallback, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  EdgeTypes,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Workflow, WorkflowNode, WorkflowEdge } from './WorkflowDesigner'
import CustomNode from './CustomNode'
import CustomEdge from './CustomEdge'

interface WorkflowCanvasProps {
  workflow: Workflow
  selectedNode: string | null
  onNodeSelect: (nodeId: string | null) => void
  onWorkflowChange: (workflow: Workflow) => void
}

const nodeTypes: NodeTypes = {
  start: CustomNode,
  end: CustomNode,
  variable: CustomNode,
  process: CustomNode,
  condition: CustomNode,
  error: CustomNode,
  exception: CustomNode,
  convert: CustomNode,
}

const edgeTypes: EdgeTypes = {
  default: CustomEdge,
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  workflow,
  selectedNode,
  onNodeSelect,
  onWorkflowChange,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes as Node[])
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow.edges as Edge[])

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        id: `e${Date.now()}`,
        source: params.source!,
        target: params.target!,
        type: 'default',
      }
      setEdges((eds) => addEdge(newEdge, eds))
      
      // Update workflow
      const newWorkflow = {
        ...workflow,
        edges: [...edges, newEdge] as WorkflowEdge[]
      }
      onWorkflowChange(newWorkflow)
    },
    [edges, setEdges, workflow, onWorkflowChange]
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    onNodeSelect(node.id)
  }, [onNodeSelect])

  const onPaneClick = useCallback(() => {
    onNodeSelect(null)
  }, [onNodeSelect])

  // Update nodes and edges when workflow changes
  React.useEffect(() => {
    setNodes(workflow.nodes as Node[])
    setEdges(workflow.edges as Edge[])
  }, [workflow, setNodes, setEdges])

  // Update workflow when nodes or edges change
  React.useEffect(() => {
    const newWorkflow = {
      ...workflow,
      nodes: nodes as WorkflowNode[],
      edges: edges as WorkflowEdge[]
    }
    onWorkflowChange(newWorkflow)
  }, [nodes, edges, workflow, onWorkflowChange])

  return (
    <div className="flex-1 bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange as OnNodesChange}
        onEdgesChange={onEdgesChange as OnEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default WorkflowCanvas