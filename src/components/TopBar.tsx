import React from 'react'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Type, 
  PenTool, 
  ArrowRight, 
  ArrowUpRight, 
  Square, 
  Maximize2, 
  Trash2, 
  Undo2, 
  Redo2, 
  ChevronsUpDown, 
  Hash, 
  AlignLeft, 
  Save, 
  MousePointer,
  Workflow
} from 'lucide-react'

interface TopBarProps {
  workflowName: string
  onSave: () => void
}

const TopBar: React.FC<TopBarProps> = ({ workflowName, onSave }) => {
  return (
    <div className="h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left Controls */}
      <div className="flex items-center space-x-2">
        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Active Tab */}
      <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
        <Workflow className="w-5 h-5 text-blue-600" />
        <span className="font-medium text-gray-800">{workflowName}</span>
        <button className="ml-2 text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-1">
        {/* Text Formatting */}
        <div className="relative">
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            <Type className="w-5 h-5" />
          </button>
        </div>

        {/* Pen Tool */}
        <div className="relative">
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            <PenTool className="w-5 h-5" />
          </button>
        </div>

        {/* Arrow Tools */}
        <div className="flex items-center space-x-1">
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>

        {/* Shape Tools */}
        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
          <Square className="w-5 h-5" />
        </button>

        {/* View Controls */}
        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Delete */}
        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
          <Trash2 className="w-5 h-5" />
        </button>

        {/* History */}
        <div className="flex items-center space-x-1">
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            <Undo2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            <Redo2 className="w-5 h-5" />
          </button>
        </div>

        {/* Layout */}
        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
          <ChevronsUpDown className="w-5 h-5" />
        </button>

        {/* Numbering */}
        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
          <Hash className="w-5 h-5" />
        </button>

        {/* Alignment */}
        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
          <AlignLeft className="w-5 h-5" />
        </button>

        {/* Save */}
        <button 
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          onClick={onSave}
        >
          <Save className="w-5 h-5" />
        </button>

        {/* Selection Tool */}
        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
          <MousePointer className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default TopBar