import React from 'react'
import { Search, AlertTriangle, GitBranch, Workflow, Database, RotateCcw, Settings, ChevronUp } from 'lucide-react'
import { Workflow as WorkflowType, WorkflowNode } from './WorkflowDesigner'

interface RightSidebarProps {
  selectedNode: string | null
  workflow: WorkflowType
}

const RightSidebar: React.FC<RightSidebarProps> = ({ selectedNode, workflow }) => {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    'control': true
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const selectedNodeData = workflow.nodes.find(node => node.id === selectedNode)

  const componentCategories = [
    {
      name: '异常',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      name: '多条件',
      icon: GitBranch,
      color: 'text-blue-600'
    },
    {
      name: '条件判断',
      icon: GitBranch,
      color: 'text-yellow-600'
    },
    {
      name: '调用流程',
      icon: Workflow,
      color: 'text-green-600'
    },
    {
      name: '变量赋值',
      icon: Settings,
      color: 'text-purple-600'
    },
    {
      name: '错误队列',
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ]

  const controlComponents = [
    {
      name: '类型转换',
      icon: RotateCcw,
      color: 'text-purple-600'
    },
    {
      name: '格式映射',
      icon: Settings,
      color: 'text-blue-600'
    },
    {
      name: '数据库查询',
      icon: Database,
      color: 'text-green-600'
    }
  ]

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Component Palette */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h3 className="font-medium text-gray-800 mb-3">组件库</h3>
        
        {/* Basic Components */}
        <div className="space-y-2">
          {componentCategories.map((component, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
            >
              <component.icon className={`w-5 h-5 ${component.color}`} />
              <span className="text-sm text-gray-700">{component.name}</span>
            </div>
          ))}
        </div>

        {/* Control Components */}
        <div>
          <div 
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors"
            onClick={() => toggleSection('control')}
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">控制环节</span>
            </div>
            <ChevronUp 
              className={`w-4 h-4 text-gray-500 transition-transform ${
                expandedSections.control ? 'rotate-180' : ''
              }`} 
            />
          </div>
          
          {expandedSections.control && (
            <div className="mt-2 ml-4 space-y-2">
              {controlComponents.map((component, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <component.icon className={`w-5 h-5 ${component.color}`} />
                  <span className="text-sm text-gray-700">{component.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Node Properties */}
      {selectedNodeData && (
        <div className="border-t border-gray-200 p-4">
          <h3 className="font-medium text-gray-800 mb-3">节点属性</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                节点名称
              </label>
              <input
                type="text"
                value={selectedNodeData.data.label}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            
            {selectedNodeData.data.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <input
                  type="text"
                  value={selectedNodeData.data.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                节点类型
              </label>
              <input
                type="text"
                value={selectedNodeData.type}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RightSidebar