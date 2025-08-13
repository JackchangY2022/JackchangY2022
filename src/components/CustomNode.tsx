import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { 
  Play, 
  Square, 
  Settings, 
  AlertCircle, 
  RotateCcw, 
  FileJson,
  Database,
  Zap
} from 'lucide-react'

const CustomNode: React.FC<NodeProps> = ({ data, type, selected }) => {
  const getNodeIcon = () => {
    switch (type) {
      case 'start':
        return <Play className="w-6 h-6 text-green-600" />
      case 'end':
        return <Square className="w-6 h-6 text-red-600" />
      case 'variable':
        return <Zap className="w-6 h-6 text-blue-600" />
      case 'process':
        return <Settings className="w-6 h-6 text-blue-600" />
      case 'condition':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-600" />
      case 'exception':
        return <AlertCircle className="w-6 h-6 text-orange-600" />
      case 'convert':
        return <RotateCcw className="w-6 h-6 text-purple-600" />
      default:
        return <Settings className="w-6 h-6 text-gray-600" />
    }
  }

  const getNodeClass = () => {
    const baseClass = "workflow-node p-4 min-w-[120px] text-center"
    const typeClass = `workflow-node-${type}`
    const selectedClass = selected ? 'selected' : ''
    
    return `${baseClass} ${typeClass} ${selectedClass}`.trim()
  }

  return (
    <div className={getNodeClass()}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex flex-col items-center space-y-2">
        {getNodeIcon()}
        
        <div className="text-sm font-medium text-gray-800">
          {data.label}
        </div>
        
        {data.description && (
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {data.description}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

export default CustomNode