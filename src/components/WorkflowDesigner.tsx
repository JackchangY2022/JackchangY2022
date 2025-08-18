import React, { useState } from 'react'
import LeftSidebar from './LeftSidebar'
import TopBar from './TopBar'
import WorkflowCanvas from './WorkflowCanvas'
import RightSidebar from './RightSidebar'

export interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
    config?: any
  }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  type: string
  label?: string
}

export interface Workflow {
  id: string
  name: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

const WorkflowDesigner: React.FC = () => {
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>({
    id: '2502',
    name: '2502转院备案撤销',
    nodes: [
      {
        id: 'start',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: '开始' }
      },
      {
        id: 'var1',
        type: 'variable',
        position: { x: 100, y: 200 },
        data: { label: '变量赋值', description: 'x=a' }
      },
      {
        id: 'public',
        type: 'process',
        position: { x: 100, y: 300 },
        data: { label: '公共报文格式' }
      },
      {
        id: 'json1',
        type: 'process',
        position: { x: 100, y: 400 },
        data: { label: '2502入', description: 'JSON' }
      },
      {
        id: 'var2',
        type: 'variable',
        position: { x: 100, y: 500 },
        data: { label: '变量赋值', description: 'x=a' }
      },
      {
        id: 'node2502',
        type: 'process',
        position: { x: 100, y: 600 },
        data: { label: '2502' }
      },
      {
        id: 'var3',
        type: 'variable',
        position: { x: 100, y: 700 },
        data: { label: '变量赋值', description: 'x=a' }
      },
      {
        id: 'condition',
        type: 'condition',
        position: { x: 300, y: 400 },
        data: { label: '条件判断' }
      },
      {
        id: 'json2',
        type: 'process',
        position: { x: 300, y: 300 },
        data: { label: '2502出', description: 'JSON' }
      },
      {
        id: 'error1',
        type: 'error',
        position: { x: 500, y: 400 },
        data: { label: '错误构造' }
      },
      {
        id: 'convert1',
        type: 'convert',
        position: { x: 500, y: 500 },
        data: { label: '类型转换' }
      },
      {
        id: 'exception',
        type: 'exception',
        position: { x: 700, y: 200 },
        data: { label: '异常' }
      },
      {
        id: 'error2',
        type: 'error',
        position: { x: 700, y: 300 },
        data: { label: '异常构造' }
      },
      {
        id: 'convert2',
        type: 'convert',
        position: { x: 700, y: 400 },
        data: { label: '类型转换' }
      },
      {
        id: 'service',
        type: 'process',
        position: { x: 100, y: 800 },
        data: { label: '服务输出' }
      },
      {
        id: 'end',
        type: 'end',
        position: { x: 300, y: 900 },
        data: { label: '结束' }
      }
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'var1', type: 'default' },
      { id: 'e2', source: 'var1', target: 'public', type: 'default' },
      { id: 'e3', source: 'public', target: 'json1', type: 'default' },
      { id: 'e4', source: 'json1', target: 'var2', type: 'default' },
      { id: 'e5', source: 'var2', target: 'node2502', type: 'default' },
      { id: 'e6', source: 'node2502', target: 'var3', type: 'default' },
      { id: 'e7', source: 'var3', target: 'service', type: 'default' },
      { id: 'e8', source: 'json1', target: 'condition', type: 'default' },
      { id: 'e9', source: 'condition', target: 'json2', type: 'default', label: '真' },
      { id: 'e10', source: 'condition', target: 'error1', type: 'default', label: '假' },
      { id: 'e11', source: 'json2', target: 'service', type: 'default' },
      { id: 'e12', source: 'error1', target: 'convert1', type: 'default' },
      { id: 'e13', source: 'exception', target: 'error2', type: 'default' },
      { id: 'e14', source: 'error2', target: 'convert2', type: 'default' },
      { id: 'e15', source: 'service', target: 'end', type: 'default' },
      { id: 'e16', source: 'convert1', target: 'end', type: 'default' },
      { id: 'e17', source: 'convert2', target: 'end', type: 'default' }
    ]
  })

  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const handleNodeSelect = (nodeId: string | null) => {
    setSelectedNode(nodeId)
  }

  const handleWorkflowChange = (workflow: Workflow) => {
    setCurrentWorkflow(workflow)
  }

  return (
    <div className="flex h-full">
      <LeftSidebar 
        currentWorkflow={currentWorkflow}
        onWorkflowSelect={handleWorkflowChange}
      />
      <div className="flex-1 flex flex-col">
        <TopBar 
          workflowName={currentWorkflow.name}
          onSave={() => console.log('保存工作流')}
        />
        <div className="flex-1 flex">
          <WorkflowCanvas
            workflow={currentWorkflow}
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
            onWorkflowChange={handleWorkflowChange}
          />
          <RightSidebar 
            selectedNode={selectedNode}
            workflow={currentWorkflow}
          />
        </div>
      </div>
    </div>
  )
}

export default WorkflowDesigner