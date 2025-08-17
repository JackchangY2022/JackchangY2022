import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { 
  Workflow, 
  WorkflowNode, 
  WorkflowEdge, 
  WorkflowVariable, 
  Expression, 
  NodeType,
  DataType 
} from '@/types/workflow';

interface WorkflowState {
  // Current workflow
  workflow: Workflow | null;
  
  // UI state
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isLoading: boolean;
  
  // Actions
  createWorkflow: (name: string) => void;
  loadWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (updates: Partial<Workflow>) => void;
  
  // Node actions
  addNode: (type: NodeType, position: { x: number; y: number }) => string;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  
  // Edge actions
  addEdge: (sourceId: string, targetId: string, type?: 'default' | 'success' | 'error') => string;
  updateEdge: (edgeId: string, updates: Partial<WorkflowEdge>) => void;
  deleteEdge: (edgeId: string) => void;
  selectEdge: (edgeId: string | null) => void;
  
  // Variable actions
  addVariable: (name: string, dataType: DataType) => string;
  updateVariable: (variableId: string, updates: Partial<WorkflowVariable>) => void;
  deleteVariable: (variableId: string) => void;
  
  // Expression actions
  addExpression: (name: string, content: string) => string;
  updateExpression: (expressionId: string, updates: Partial<Expression>) => void;
  deleteExpression: (expressionId: string) => void;
  
  // Utility actions
  clearSelection: () => void;
  reset: () => void;
}

const createDefaultWorkflow = (name: string): Workflow => {
  const startNodeId = uuidv4();
  const endNodeId = uuidv4();
  
  return {
    id: uuidv4(),
    name,
    startId: startNodeId,
    maxParallel: 5,
    maxQueueLength: 100,
    executionTimeoutSecond: 300,
    nodes: {
      [startNodeId]: {
        id: startNodeId,
        type: NodeType.START,
        name: '开始',
        position: { x: 100, y: 100 },
        data: {},
        previousIds: [],
        color: 'rgba(34, 197, 94, 1)'
      },
      [endNodeId]: {
        id: endNodeId,
        type: NodeType.END,
        name: '结束',
        position: { x: 400, y: 100 },
        data: {},
        previousIds: [],
        color: 'rgba(239, 68, 68, 1)'
      }
    },
    edges: [],
    variables: {},
    expressions: {}
  };
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflow: null,
  selectedNodeId: null,
  selectedEdgeId: null,
  isLoading: false,

  createWorkflow: (name: string) => {
    const workflow = createDefaultWorkflow(name);
    set({ workflow, selectedNodeId: null, selectedEdgeId: null });
  },

  loadWorkflow: (workflow: Workflow) => {
    set({ workflow, selectedNodeId: null, selectedEdgeId: null });
  },

  updateWorkflow: (updates: Partial<Workflow>) => {
    set(state => ({
      workflow: state.workflow ? { ...state.workflow, ...updates } : null
    }));
  },

  addNode: (type: NodeType, position: { x: number; y: number }) => {
    const nodeId = uuidv4();
    const nodeName = getDefaultNodeName(type);
    
    set(state => {
      if (!state.workflow) return state;
      
      const newNode: WorkflowNode = {
        id: nodeId,
        type,
        name: nodeName,
        position,
        data: getDefaultNodeData(type),
        previousIds: [],
        color: getDefaultNodeColor(type)
      };
      
      return {
        workflow: {
          ...state.workflow,
          nodes: {
            ...state.workflow.nodes,
            [nodeId]: newNode
          }
        }
      };
    });
    
    return nodeId;
  },

  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => {
    set(state => {
      if (!state.workflow) return state;
      
      const existingNode = state.workflow.nodes[nodeId];
      if (!existingNode) return state;
      
      return {
        workflow: {
          ...state.workflow,
          nodes: {
            ...state.workflow.nodes,
            [nodeId]: { ...existingNode, ...updates }
          }
        }
      };
    });
  },

  deleteNode: (nodeId: string) => {
    set(state => {
      if (!state.workflow) return state;
      
      const { [nodeId]: deletedNode, ...remainingNodes } = state.workflow.nodes;
      const remainingEdges = state.workflow.edges.filter(
        edge => edge.source !== nodeId && edge.target !== nodeId
      );
      
      return {
        workflow: {
          ...state.workflow,
          nodes: remainingNodes,
          edges: remainingEdges
        },
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId
      };
    });
  },

  selectNode: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId, selectedEdgeId: null });
  },

  addEdge: (sourceId: string, targetId: string, type = 'default' as const) => {
    const edgeId = uuidv4();
    
    set(state => {
      if (!state.workflow) return state;
      
      const newEdge: WorkflowEdge = {
        id: edgeId,
        source: sourceId,
        target: targetId,
        type
      };
      
      // Update target node's previousIds
      const targetNode = state.workflow.nodes[targetId];
      if (targetNode && !targetNode.previousIds.includes(sourceId)) {
        targetNode.previousIds.push(sourceId);
      }
      
      // Update source node's nextId (for single next node types)
      const sourceNode = state.workflow.nodes[sourceId];
      if (sourceNode && (sourceNode.type === NodeType.START || sourceNode.type === NodeType.VARVALUE)) {
        sourceNode.nextId = targetId;
      }
      
      return {
        workflow: {
          ...state.workflow,
          edges: [...state.workflow.edges, newEdge],
          nodes: {
            ...state.workflow.nodes,
            [targetId]: targetNode,
            [sourceId]: sourceNode
          }
        }
      };
    });
    
    return edgeId;
  },

  updateEdge: (edgeId: string, updates: Partial<WorkflowEdge>) => {
    set(state => {
      if (!state.workflow) return state;
      
      const edgeIndex = state.workflow.edges.findIndex(edge => edge.id === edgeId);
      if (edgeIndex === -1) return state;
      
      const updatedEdges = [...state.workflow.edges];
      updatedEdges[edgeIndex] = { ...updatedEdges[edgeIndex], ...updates };
      
      return {
        workflow: {
          ...state.workflow,
          edges: updatedEdges
        }
      };
    });
  },

  deleteEdge: (edgeId: string) => {
    set(state => {
      if (!state.workflow) return state;
      
      const edge = state.workflow.edges.find(e => e.id === edgeId);
      if (!edge) return state;
      
      const remainingEdges = state.workflow.edges.filter(e => e.id !== edgeId);
      
      // Update target node's previousIds
      const targetNode = state.workflow.nodes[edge.target];
      if (targetNode) {
        targetNode.previousIds = targetNode.previousIds.filter(id => id !== edge.source);
      }
      
      // Update source node's nextId
      const sourceNode = state.workflow.nodes[edge.source];
      if (sourceNode && sourceNode.nextId === edge.target) {
        sourceNode.nextId = undefined;
      }
      
      return {
        workflow: {
          ...state.workflow,
          edges: remainingEdges,
          nodes: {
            ...state.workflow.nodes,
            [edge.target]: targetNode,
            [edge.source]: sourceNode
          }
        },
        selectedEdgeId: state.selectedEdgeId === edgeId ? null : state.selectedEdgeId
      };
    });
  },

  selectEdge: (edgeId: string | null) => {
    set({ selectedEdgeId: edgeId, selectedNodeId: null });
  },

  addVariable: (name: string, dataType: DataType) => {
    const variableId = uuidv4();
    
    set(state => {
      if (!state.workflow) return state;
      
      const newVariable: WorkflowVariable = {
        id: variableId,
        name,
        dataType,
        lifeCycle: 'single'
      };
      
      return {
        workflow: {
          ...state.workflow,
          variables: {
            ...state.workflow.variables,
            [variableId]: newVariable
          }
        }
      };
    });
    
    return variableId;
  },

  updateVariable: (variableId: string, updates: Partial<WorkflowVariable>) => {
    set(state => {
      if (!state.workflow) return state;
      
      const existingVariable = state.workflow.variables[variableId];
      if (!existingVariable) return state;
      
      return {
        workflow: {
          ...state.workflow,
          variables: {
            ...state.workflow.variables,
            [variableId]: { ...existingVariable, ...updates }
          }
        }
      };
    });
  },

  deleteVariable: (variableId: string) => {
    set(state => {
      if (!state.workflow) return state;
      
      const { [variableId]: deletedVariable, ...remainingVariables } = state.workflow.variables;
      
      return {
        workflow: {
          ...state.workflow,
          variables: remainingVariables
        }
      };
    });
  },

  addExpression: (name: string, content: string) => {
    const expressionId = uuidv4();
    
    set(state => {
      if (!state.workflow) return state;
      
      const newExpression: Expression = {
        id: expressionId,
        name,
        content: [{ type: 'text', value: content }],
        returnType: 'string'
      };
      
      return {
        workflow: {
          ...state.workflow,
          expressions: {
            ...state.workflow.expressions,
            [expressionId]: newExpression
          }
        }
      };
    });
    
    return expressionId;
  },

  updateExpression: (expressionId: string, updates: Partial<Expression>) => {
    set(state => {
      if (!state.workflow) return state;
      
      const existingExpression = state.workflow.expressions[expressionId];
      if (!existingExpression) return state;
      
      return {
        workflow: {
          ...state.workflow,
          expressions: {
            ...state.workflow.expressions,
            [expressionId]: { ...existingExpression, ...updates }
          }
        }
      };
    });
  },

  deleteExpression: (expressionId: string) => {
    set(state => {
      if (!state.workflow) return state;
      
      const { [expressionId]: deletedExpression, ...remainingExpressions } = state.workflow.expressions;
      
      return {
        workflow: {
          ...state.workflow,
          expressions: remainingExpressions
        }
      };
    });
  },

  clearSelection: () => {
    set({ selectedNodeId: null, selectedEdgeId: null });
  },

  reset: () => {
    set({
      workflow: null,
      selectedNodeId: null,
      selectedEdgeId: null,
      isLoading: false
    });
  }
}));

// Helper functions
function getDefaultNodeName(type: NodeType): string {
  const nameMap = {
    [NodeType.START]: '开始',
    [NodeType.END]: '结束',
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
  return nameMap[type] || type;
}

function getDefaultNodeData(type: NodeType): any {
  switch (type) {
    case NodeType.CONDITION:
      return { expression: '', trueNodeId: '', falseNodeId: '' };
    case NodeType.VARVALUE:
      return { assignments: [] };
    case NodeType.DATATYPECONVERT:
      return { sourceVariableId: '', targetVariableId: '', sourceType: DataType.STRING, targetType: DataType.STRING };
    case NodeType.CALLFLOW:
      return { flowId: '', flowName: '', variableMapping: {} };
    case NodeType.HTTP_REQUEST:
      return { url: '', method: 'GET', headers: {}, body: '' };
    case NodeType.DATABASE:
      return { query: '', connectionId: '', parameters: [] };
    default:
      return {};
  }
}

function getDefaultNodeColor(type: NodeType): string {
  const colorMap = {
    [NodeType.START]: 'rgba(34, 197, 94, 1)',
    [NodeType.END]: 'rgba(239, 68, 68, 1)',
    [NodeType.CONDITION]: 'rgba(251, 191, 36, 1)',
    [NodeType.VARVALUE]: 'rgba(59, 130, 246, 1)',
    [NodeType.DATATYPECONVERT]: 'rgba(168, 85, 247, 1)',
    [NodeType.CALLFLOW]: 'rgba(236, 72, 153, 1)',
    [NodeType.ERROR]: 'rgba(239, 68, 68, 1)',
    [NodeType.JSONTOJSON]: 'rgba(14, 165, 233, 1)',
    [NodeType.HTTP_REQUEST]: 'rgba(34, 197, 94, 1)',
    [NodeType.DATABASE]: 'rgba(156, 163, 175, 1)',
    [NodeType.LOOP]: 'rgba(251, 146, 60, 1)',
    [NodeType.PARALLEL]: 'rgba(139, 92, 246, 1)'
  };
  return colorMap[type] || 'rgba(0, 0, 0, 1)';
}