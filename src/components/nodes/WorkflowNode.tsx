import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
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
  Layers
} from 'lucide-react';
import { NodeType } from '@/types/workflow';
import { cn } from '@/lib/utils';

interface WorkflowNodeData {
  type: NodeType;
  name: string;
  description?: string;
  color?: string;
}

const nodeIcons = {
  [NodeType.START]: Play,
  [NodeType.END]: Square,
  [NodeType.CONDITION]: GitBranch,
  [NodeType.VARVALUE]: Variable,
  [NodeType.DATATYPECONVERT]: RotateCcw,
  [NodeType.CALLFLOW]: Phone,
  [NodeType.ERROR]: AlertTriangle,
  [NodeType.JSONTOJSON]: ArrowLeftRight,
  [NodeType.HTTP_REQUEST]: Globe,
  [NodeType.DATABASE]: Database,
  [NodeType.LOOP]: IterationCw,
  [NodeType.PARALLEL]: Layers,
};

const nodeStyles = {
  [NodeType.START]: 'workflow-node-start',
  [NodeType.END]: 'workflow-node-end',
  [NodeType.CONDITION]: 'workflow-node-condition',
  [NodeType.VARVALUE]: 'workflow-node-varvalue',
  [NodeType.DATATYPECONVERT]: 'workflow-node-datatypeconvert',
  [NodeType.CALLFLOW]: 'workflow-node-callflow',
  [NodeType.ERROR]: 'workflow-node-error',
  [NodeType.JSONTOJSON]: 'workflow-node-jsontojson',
  [NodeType.HTTP_REQUEST]: 'workflow-node-http',
  [NodeType.DATABASE]: 'workflow-node-database',
  [NodeType.LOOP]: 'workflow-node-loop',
  [NodeType.PARALLEL]: 'workflow-node-parallel',
};

export const WorkflowNode = memo<NodeProps<WorkflowNodeData>>(({ data, selected }) => {
  const Icon = nodeIcons[data.type];
  const nodeStyleClass = nodeStyles[data.type];
  
  const hasInputHandle = data.type !== NodeType.START;
  const hasOutputHandle = data.type !== NodeType.END;
  const hasErrorHandle = data.type !== NodeType.START && data.type !== NodeType.END;
  
  // Condition nodes have multiple output handles
  const hasMultipleOutputs = data.type === NodeType.CONDITION;

  return (
    <div 
      className={cn(
        'workflow-node',
        nodeStyleClass,
        selected && 'selected'
      )}
      style={{
        backgroundColor: data.color ? `${data.color}20` : undefined,
        borderColor: data.color || undefined,
      }}
    >
      {/* Input Handle */}
      {hasInputHandle && (
        <Handle
          type="target"
          position={Position.Top}
          id="input"
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
        />
      )}

      {/* Node Content */}
      <div className="flex items-center justify-center space-x-2 min-h-[40px]">
        {Icon && <Icon size={16} />}
        <span className="text-sm font-medium truncate max-w-[100px]">
          {data.name}
        </span>
      </div>

      {/* Output Handles */}
      {hasOutputHandle && !hasMultipleOutputs && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="output"
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
        />
      )}

      {/* Multiple Output Handles for Condition Node */}
      {hasMultipleOutputs && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            className="!w-3 !h-3 !bg-green-500 !border-2 !border-white"
            style={{ top: '50%', right: '-6px' }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="!w-3 !h-3 !bg-red-500 !border-2 !border-white"
            style={{ bottom: '-6px' }}
          />
        </>
      )}

      {/* Error Handle */}
      {hasErrorHandle && (
        <Handle
          type="source"
          position={Position.Left}
          id="error"
          className="!w-2 !h-2 !bg-red-500 !border-2 !border-white !rounded-full"
          style={{ top: '20%', left: '-4px' }}
        />
      )}

      {/* Description Tooltip */}
      {data.description && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          {data.description}
        </div>
      )}
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';