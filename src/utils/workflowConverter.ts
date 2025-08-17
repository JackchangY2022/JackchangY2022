import { 
  Workflow, 
  WorkflowNode, 
  WorkflowEdge, 
  WorkflowVariable, 
  Expression, 
  NodeType, 
  DataType,
  ExpressionContent 
} from '@/types/workflow';
import { v4 as uuidv4 } from 'uuid';

interface OriginalWorkflow {
  ID: string;
  StartID: string;
  ErrorID?: string;
  FlowName: string;
  MaxParallel?: number;
  MaxQueueLength?: number;
  ExecutionTimeoutSecond?: number;
  ProcessDic: Record<string, any>;
  VariableDic?: Record<string, any>;
  ExpressionDic?: Record<string, any>;
}

export class WorkflowConverter {
  /**
   * 将原始工作流JSON转换为新的工作流格式
   */
  static convertFromOriginal(originalData: OriginalWorkflow): Workflow {
    const workflow: Workflow = {
      id: originalData.ID || uuidv4(),
      name: originalData.FlowName || '未命名工作流',
      startId: originalData.StartID,
      errorId: originalData.ErrorID,
      maxParallel: originalData.MaxParallel || 5,
      maxQueueLength: originalData.MaxQueueLength || 100,
      executionTimeoutSecond: originalData.ExecutionTimeoutSecond || 300,
      nodes: {},
      edges: [],
      variables: {},
      expressions: {}
    };

    // 转换节点
    if (originalData.ProcessDic) {
      Object.entries(originalData.ProcessDic).forEach(([nodeId, nodeData]) => {
        const convertedNode = this.convertNode(nodeId, nodeData);
        if (convertedNode) {
          workflow.nodes[nodeId] = convertedNode;
        }
      });
    }

    // 转换变量
    if (originalData.VariableDic) {
      Object.entries(originalData.VariableDic).forEach(([varId, varData]) => {
        const convertedVar = this.convertVariable(varId, varData);
        if (convertedVar) {
          workflow.variables[varId] = convertedVar;
        }
      });
    }

    // 转换表达式
    if (originalData.ExpressionDic) {
      Object.entries(originalData.ExpressionDic).forEach(([expId, expData]) => {
        const convertedExp = this.convertExpression(expId, expData);
        if (convertedExp) {
          workflow.expressions[expId] = convertedExp;
        }
      });
    }

    // 生成连接
    workflow.edges = this.generateEdges(workflow.nodes);

    return workflow;
  }

  private static convertNode(nodeId: string, nodeData: any): WorkflowNode | null {
    if (!nodeData || !nodeData.TypeCode) {
      return null;
    }

    // 映射节点类型
    const nodeType = this.mapNodeType(nodeData.TypeCode);
    if (!nodeType) {
      console.warn(`Unknown node type: ${nodeData.TypeCode}`);
      return null;
    }

    // 计算节点位置（简单的网格布局）
    const position = this.calculateNodePosition(nodeId, nodeData);

    const node: WorkflowNode = {
      id: nodeId,
      type: nodeType,
      name: nodeData.Name || nodeType,
      position,
      data: this.convertNodeData(nodeType, nodeData),
      nextId: nodeData.NextID,
      previousIds: nodeData.PreviousID || [],
      errorId: nodeData.ErrorID,
      color: nodeData.Color || this.getDefaultNodeColor(nodeType)
    };

    return node;
  }

  private static mapNodeType(originalType: string): NodeType | null {
    const typeMapping: Record<string, NodeType> = {
      'START': NodeType.START,
      'END': NodeType.END,
      'CONDITION': NodeType.CONDITION,
      'VARVALUE': NodeType.VARVALUE,
      'DATATYPECONVERT': NodeType.DATATYPECONVERT,
      'CALLFLOW': NodeType.CALLFLOW,
      'ERROR': NodeType.ERROR,
      'JsonToJson': NodeType.JSONTOJSON,
      'HTTP_REQUEST': NodeType.HTTP_REQUEST,
      'DATABASE': NodeType.DATABASE,
      'LOOP': NodeType.LOOP,
      'PARALLEL': NodeType.PARALLEL
    };

    return typeMapping[originalType] || null;
  }

  private static calculateNodePosition(nodeId: string, nodeData: any): { x: number; y: number } {
    // 简单的哈希算法来生成相对固定的位置
    let hash = 0;
    for (let i = 0; i < nodeId.length; i++) {
      const char = nodeId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    const x = 200 + (Math.abs(hash) % 800);
    const y = 100 + (Math.abs(hash >> 16) % 600);

    return { x, y };
  }

  private static convertNodeData(nodeType: NodeType, originalData: any): any {
    switch (nodeType) {
      case NodeType.CONDITION:
        return {
          expression: originalData.FunctionName || '',
          trueNodeId: originalData.TrueID || '',
          falseNodeId: originalData.FalseID || ''
        };

      case NodeType.VARVALUE:
        const assignments: any[] = [];
        if (originalData.VarIDAndExpID) {
          Object.entries(originalData.VarIDAndExpID).forEach(([varId, expId]) => {
            assignments.push({
              variableId: varId,
              expressionId: expId,
              value: ''
            });
          });
        }
        return { assignments };

      case NodeType.DATATYPECONVERT:
        return {
          sourceVariableId: originalData.SourceVarID || '',
          targetVariableId: originalData.OutVarID || '',
          sourceType: this.mapDataType(originalData.InDataType) || DataType.STRING,
          targetType: this.mapDataType(originalData.OutDataType) || DataType.STRING
        };

      case NodeType.CALLFLOW:
        return {
          flowId: originalData.FlowID || '',
          flowName: originalData.FlowName || '',
          variableMapping: originalData.FlowVarContrast || {}
        };

      case NodeType.HTTP_REQUEST:
        return {
          url: originalData.Url || '',
          method: originalData.Method || 'GET',
          headers: originalData.Headers || {},
          body: originalData.Body || ''
        };

      case NodeType.DATABASE:
        return {
          connectionId: originalData.ConnectionId || '',
          query: originalData.Query || '',
          parameters: originalData.Parameters || []
        };

      default:
        return originalData.Data || {};
    }
  }

  private static mapDataType(originalType: any): DataType | null {
    if (typeof originalType === 'string') {
      originalType = parseInt(originalType);
    }

    const typeMapping: Record<number, DataType> = {
      1: DataType.NUMBER,
      2: DataType.STRING,
      3: DataType.BOOLEAN,
      4: DataType.ARRAY,
      5: DataType.DATE,
      33: DataType.JSON
    };

    return typeMapping[originalType] || null;
  }

  private static convertVariable(varId: string, varData: any): WorkflowVariable | null {
    if (!varData) return null;

    return {
      id: varId,
      name: varData.Text || varData.name || `变量_${varId}`,
      dataType: this.mapDataType(varData.DataType) || DataType.STRING,
      defaultValue: varData.DefaultValue,
      description: varData.Note,
      lifeCycle: varData.LifeCycle === '持久' ? 'persistent' : 'single',
      jsonNodes: varData.JsonNodes || []
    };
  }

  private static convertExpression(expId: string, expData: any): Expression | null {
    if (!expData) return null;

    let content: ExpressionContent[] = [];

    if (expData.Content && Array.isArray(expData.Content)) {
      content = expData.Content.map((item: any) => {
        if (typeof item === 'string') {
          return { type: 'text' as const, value: item };
        } else if (item && item.Text) {
          return {
            type: 'variable' as const,
            value: item.Text,
            variableId: item.Id
          };
        } else {
          return { type: 'text' as const, value: String(item) };
        }
      });
    } else if (typeof expData.Content === 'string') {
      content = [{ type: 'text', value: expData.Content }];
    }

    return {
      id: expId,
      name: expData.FunctionName || `表达式_${expId}`,
      content,
      returnType: expData.ReturnType || 'string'
    };
  }

  private static generateEdges(nodes: Record<string, WorkflowNode>): WorkflowEdge[] {
    const edges: WorkflowEdge[] = [];

    Object.values(nodes).forEach(node => {
      // 处理普通的下一个节点连接
      if (node.nextId && nodes[node.nextId]) {
        edges.push({
          id: uuidv4(),
          source: node.id,
          target: node.nextId,
          type: 'default'
        });
      }

      // 处理条件节点的分支连接
      if (node.type === NodeType.CONDITION && node.data) {
        if (node.data.trueNodeId && nodes[node.data.trueNodeId]) {
          edges.push({
            id: uuidv4(),
            source: node.id,
            target: node.data.trueNodeId,
            type: 'success',
            label: '真'
          });
        }

        if (node.data.falseNodeId && nodes[node.data.falseNodeId]) {
          edges.push({
            id: uuidv4(),
            source: node.id,
            target: node.data.falseNodeId,
            type: 'default',
            label: '假'
          });
        }
      }

      // 处理错误连接
      if (node.errorId && nodes[node.errorId]) {
        edges.push({
          id: uuidv4(),
          source: node.id,
          target: node.errorId,
          type: 'error',
          label: '错误'
        });
      }
    });

    return edges;
  }

  private static getDefaultNodeColor(nodeType: NodeType): string {
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
    return colorMap[nodeType] || 'rgba(0, 0, 0, 1)';
  }

  /**
   * 将新格式的工作流转换回原始格式
   */
  static convertToOriginal(workflow: Workflow): any {
    const originalData: any = {
      ID: workflow.id,
      StartID: workflow.startId,
      ErrorID: workflow.errorId,
      FlowName: workflow.name,
      MaxParallel: workflow.maxParallel,
      MaxQueueLength: workflow.maxQueueLength,
      ExecutionTimeoutSecond: workflow.executionTimeoutSecond,
      ProcessDic: {},
      VariableDic: {},
      ExpressionDic: {}
    };

    // 转换节点
    Object.values(workflow.nodes).forEach(node => {
      originalData.ProcessDic[node.id] = this.convertNodeToOriginal(node);
    });

    // 转换变量
    Object.values(workflow.variables).forEach(variable => {
      originalData.VariableDic[variable.id] = this.convertVariableToOriginal(variable);
    });

    // 转换表达式
    Object.values(workflow.expressions).forEach(expression => {
      originalData.ExpressionDic[expression.id] = this.convertExpressionToOriginal(expression);
    });

    return originalData;
  }

  private static convertNodeToOriginal(node: WorkflowNode): any {
    const originalNode: any = {
      Name: node.name,
      NextID: node.nextId || '',
      PreviousID: node.previousIds || [],
      ErrorID: node.errorId || '',
      TypeCode: this.mapNodeTypeToOriginal(node.type),
      TypeName: node.name,
      NodeType: 1,
      ID: node.id,
      Color: node.color || 'rgba(0, 0, 0, 1)'
    };

    // 添加类型特定的数据
    switch (node.type) {
      case NodeType.CONDITION:
        originalNode.FunctionName = node.data?.expression || '';
        originalNode.TrueID = node.data?.trueNodeId || '';
        originalNode.FalseID = node.data?.falseNodeId || '';
        break;

      case NodeType.VARVALUE:
        originalNode.VarIDAndExpID = {};
        if (node.data?.assignments) {
          node.data.assignments.forEach((assignment: any) => {
            if (assignment.variableId && assignment.expressionId) {
              originalNode.VarIDAndExpID[assignment.variableId] = assignment.expressionId;
            }
          });
        }
        break;

      case NodeType.DATATYPECONVERT:
        originalNode.SourceVarID = node.data?.sourceVariableId || '';
        originalNode.OutVarID = node.data?.targetVariableId || '';
        originalNode.InDataType = this.mapDataTypeToOriginal(node.data?.sourceType);
        originalNode.OutDataType = this.mapDataTypeToOriginal(node.data?.targetType);
        break;

      case NodeType.CALLFLOW:
        originalNode.FlowID = node.data?.flowId || '';
        originalNode.FlowName = node.data?.flowName || '';
        originalNode.FlowVarContrast = node.data?.variableMapping || {};
        break;
    }

    return originalNode;
  }

  private static mapNodeTypeToOriginal(nodeType: NodeType): string {
    const typeMapping: Record<NodeType, string> = {
      [NodeType.START]: 'START',
      [NodeType.END]: 'END',
      [NodeType.CONDITION]: 'CONDITION',
      [NodeType.VARVALUE]: 'VARVALUE',
      [NodeType.DATATYPECONVERT]: 'DATATYPECONVERT',
      [NodeType.CALLFLOW]: 'CALLFLOW',
      [NodeType.ERROR]: 'ERROR',
      [NodeType.JSONTOJSON]: 'JsonToJson',
      [NodeType.HTTP_REQUEST]: 'HTTP_REQUEST',
      [NodeType.DATABASE]: 'DATABASE',
      [NodeType.LOOP]: 'LOOP',
      [NodeType.PARALLEL]: 'PARALLEL'
    };

    return typeMapping[nodeType] || nodeType;
  }

  private static mapDataTypeToOriginal(dataType: DataType | undefined): number {
    if (!dataType) return 2; // Default to string

    const typeMapping: Record<DataType, number> = {
      [DataType.NUMBER]: 1,
      [DataType.STRING]: 2,
      [DataType.BOOLEAN]: 3,
      [DataType.ARRAY]: 4,
      [DataType.DATE]: 5,
      [DataType.JSON]: 33
    };

    return typeMapping[dataType] || 2;
  }

  private static convertVariableToOriginal(variable: WorkflowVariable): any {
    return {
      Id: variable.id,
      Text: variable.name,
      name: variable.name,
      DataType: this.mapDataTypeToOriginal(variable.dataType),
      DefaultValue: variable.defaultValue,
      Note: variable.description,
      LifeCycle: variable.lifeCycle === 'persistent' ? '持久' : '单次',
      JsonNodes: variable.jsonNodes || []
    };
  }

  private static convertExpressionToOriginal(expression: Expression): any {
    const content = expression.content.map(item => {
      if (item.type === 'text') {
        return item.value;
      } else {
        return {
          Id: item.variableId,
          Text: item.value,
          // 其他原始格式需要的字段
        };
      }
    });

    return {
      FunctionName: expression.name,
      ReturnType: expression.returnType,
      Content: content
    };
  }
}