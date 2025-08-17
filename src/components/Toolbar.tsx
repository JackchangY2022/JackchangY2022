import React from 'react';
import { 
  Save, 
  FolderOpen, 
  Download, 
  Upload, 
  Undo, 
  Redo, 
  Play, 
  Square,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Settings,
  Eye,
  Copy
} from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  onSave?: () => void;
  onLoad?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onRun?: () => void;
  onStop?: () => void;
  onDelete?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onSettings?: () => void;
  onPreview?: () => void;
  onCopy?: () => void;
  onLoadDemo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isRunning?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onLoad,
  onExport,
  onImport,
  onUndo,
  onRedo,
  onRun,
  onStop,
  onDelete,
  onZoomIn,
  onZoomOut,
  onFitView,
  onSettings,
  onPreview,
  onCopy,
  onLoadDemo,
  canUndo = false,
  canRedo = false,
  isRunning = false,
}) => {
  const { workflow, selectedNodeId, selectedEdgeId } = useWorkflowStore();
  
  const hasSelection = selectedNodeId || selectedEdgeId;
  const hasWorkflow = !!workflow;

  return (
    <div className="toolbar flex items-center justify-between px-4 py-2 h-12">
      {/* File Operations */}
      <div className="flex items-center space-x-1">
        <button
          onClick={onSave}
          disabled={!hasWorkflow}
          className={cn(
            'toolbar-button',
            !hasWorkflow && 'opacity-50 cursor-not-allowed'
          )}
          title="保存工作流 (Ctrl+S)"
        >
          <Save size={16} />
          <span className="ml-1">保存</span>
        </button>
        
        <button
          onClick={onLoad}
          className="toolbar-button"
          title="打开工作流 (Ctrl+O)"
        >
          <FolderOpen size={16} />
          <span className="ml-1">打开</span>
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button
          onClick={onExport}
          disabled={!hasWorkflow}
          className={cn(
            'toolbar-button',
            !hasWorkflow && 'opacity-50 cursor-not-allowed'
          )}
          title="导出工作流"
        >
          <Download size={16} />
          <span className="ml-1">导出</span>
        </button>
        
        <button
          onClick={onImport}
          className="toolbar-button"
          title="导入工作流"
        >
          <Upload size={16} />
          <span className="ml-1">导入</span>
        </button>
        
        <button
          onClick={onLoadDemo}
          className="toolbar-button text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          title="加载演示工作流"
        >
          <span className="ml-1">演示</span>
        </button>
      </div>

      {/* Edit Operations */}
      <div className="flex items-center space-x-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            'toolbar-button',
            !canUndo && 'opacity-50 cursor-not-allowed'
          )}
          title="撤销 (Ctrl+Z)"
        >
          <Undo size={16} />
        </button>
        
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={cn(
            'toolbar-button',
            !canRedo && 'opacity-50 cursor-not-allowed'
          )}
          title="重做 (Ctrl+Y)"
        >
          <Redo size={16} />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button
          onClick={onCopy}
          disabled={!hasSelection}
          className={cn(
            'toolbar-button',
            !hasSelection && 'opacity-50 cursor-not-allowed'
          )}
          title="复制 (Ctrl+C)"
        >
          <Copy size={16} />
        </button>
        
        <button
          onClick={onDelete}
          disabled={!hasSelection}
          className={cn(
            'toolbar-button text-red-600 hover:text-red-700 hover:bg-red-50',
            !hasSelection && 'opacity-50 cursor-not-allowed'
          )}
          title="删除 (Delete)"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Workflow Name */}
      <div className="flex-1 flex justify-center">
        <div className="text-lg font-semibold text-gray-800">
          {workflow?.name || '未命名工作流'}
        </div>
      </div>

      {/* Execution Controls */}
      <div className="flex items-center space-x-1">
        <button
          onClick={onPreview}
          disabled={!hasWorkflow}
          className={cn(
            'toolbar-button',
            !hasWorkflow && 'opacity-50 cursor-not-allowed'
          )}
          title="预览工作流"
        >
          <Eye size={16} />
          <span className="ml-1">预览</span>
        </button>
        
        {!isRunning ? (
          <button
            onClick={onRun}
            disabled={!hasWorkflow}
            className={cn(
              'toolbar-button text-green-600 hover:text-green-700 hover:bg-green-50',
              !hasWorkflow && 'opacity-50 cursor-not-allowed'
            )}
            title="运行工作流 (F5)"
          >
            <Play size={16} />
            <span className="ml-1">运行</span>
          </button>
        ) : (
          <button
            onClick={onStop}
            className="toolbar-button text-red-600 hover:text-red-700 hover:bg-red-50"
            title="停止工作流"
          >
            <Square size={16} />
            <span className="ml-1">停止</span>
          </button>
        )}
      </div>

      {/* View Controls */}
      <div className="flex items-center space-x-1">
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button
          onClick={onZoomIn}
          className="toolbar-button"
          title="放大 (Ctrl++)"
        >
          <ZoomIn size={16} />
        </button>
        
        <button
          onClick={onZoomOut}
          className="toolbar-button"
          title="缩小 (Ctrl+-)"
        >
          <ZoomOut size={16} />
        </button>
        
        <button
          onClick={onFitView}
          className="toolbar-button"
          title="适应视图 (Ctrl+0)"
        >
          <Maximize size={16} />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button
          onClick={onSettings}
          className="toolbar-button"
          title="设置"
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};