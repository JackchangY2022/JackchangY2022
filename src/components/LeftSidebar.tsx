import React from 'react'
import { Search, Folder, Workflow, ChevronRight, ChevronDown } from 'lucide-react'
import { Workflow as WorkflowType } from './WorkflowDesigner'

interface LeftSidebarProps {
  currentWorkflow: WorkflowType
  onWorkflowSelect: (workflow: WorkflowType) => void
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ currentWorkflow, onWorkflowSelect }) => {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    'process': true,
    'personnel': true
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const workflows = [
    { id: '2501', name: '2501转院备案申请', type: 'workflow' },
    { id: '2502', name: '2502转院备案撤销', type: 'workflow' },
    { id: '2503', name: '2503人员备案申请', type: 'workflow' },
    { id: '2504', name: '2504人员备案撤销', type: 'workflow' }
  ]

  return (
    <div className="w-80 bg-gray-800 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Workflow className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold">工作区: 全国医保</div>
            <div className="text-sm text-gray-400">Workspace: National Medical Insurance</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Process Configuration */}
        <div className="p-4">
          <div className="flex items-center justify-between text-blue-400 font-medium cursor-pointer">
            <div className="flex items-center space-x-2">
              <Folder className="w-5 h-5" />
              <span>流程配置</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* 3101 Pre-event */}
        <div className="px-4 py-2">
          <div className="flex items-center space-x-2 text-yellow-400 cursor-pointer">
            <Folder className="w-5 h-5" />
            <span>3101事前</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* One-code Payment */}
        <div className="px-4 py-2">
          <div className="flex items-center space-x-2 text-yellow-400 cursor-pointer">
            <Folder className="w-5 h-5" />
            <span>一码付</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Internal Interface */}
        <div className="px-4 py-2">
          <div className="flex items-center space-x-2 text-yellow-400 cursor-pointer">
            <Folder className="w-5 h-5" />
            <span>内部接口</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* New National Medical Insurance Interface */}
        <div className="px-4 py-2">
          <div className="flex items-center space-x-2 text-yellow-400 cursor-pointer">
            <Folder className="w-5 h-5" />
            <span>新全国医保接...</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Personnel Filing */}
        <div className="px-4 py-2">
          <div 
            className="flex items-center justify-between text-yellow-400 cursor-pointer"
            onClick={() => toggleSection('personnel')}
          >
            <div className="flex items-center space-x-2">
              <Folder className="w-5 h-5" />
              <span>人员备案</span>
            </div>
            {expandedSections.personnel ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
          
          {expandedSections.personnel && (
            <div className="ml-6 mt-2 space-y-1">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded cursor-pointer ${
                    currentWorkflow.id === workflow.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-blue-300 hover:bg-gray-700'
                  }`}
                  onClick={() => onWorkflowSelect({
                    ...currentWorkflow,
                    id: workflow.id,
                    name: workflow.name
                  })}
                >
                  <Workflow className="w-4 h-4" />
                  <span className="text-sm">{workflow.name}</span>
                  <div className="w-2 h-2 bg-gray-500 rounded-full ml-auto"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeftSidebar