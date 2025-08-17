import { 
  Workflow, 
  WorkflowNode, 
  NodeType, 
  ValidationResult, 
  ValidationError, 
  ValidationWarning 
} from '@/types/workflow';

export class WorkflowValidator {
  private workflow: Workflow;
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];

  constructor(workflow: Workflow) {
    this.workflow = workflow;
  }

  validate(): ValidationResult {
    this.errors = [];
    this.warnings = [];

    this.validateBasicStructure();
    this.validateNodes();
    this.validateConnections();
    this.validateVariables();
    this.validateExpressions();

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  private validateBasicStructure() {
    // Check if workflow has a name
    if (!this.workflow.name || this.workflow.name.trim() === '') {
      this.warnings.push({
        message: '工作流缺少名称',
        type: 'warning'
      });
    }

    // Check if workflow has nodes
    if (!this.workflow.nodes || Object.keys(this.workflow.nodes).length === 0) {
      this.errors.push({
        message: '工作流至少需要包含一个节点',
        type: 'error'
      });
      return;
    }

    // Check if workflow has a start node
    const startNodes = Object.values(this.workflow.nodes).filter(
      node => node.type === NodeType.START
    );

    if (startNodes.length === 0) {
      this.errors.push({
        message: '工作流必须包含一个开始节点',
        type: 'error'
      });
    } else if (startNodes.length > 1) {
      this.errors.push({
        message: '工作流只能包含一个开始节点',
        type: 'error'
      });
    }

    // Check if workflow has an end node
    const endNodes = Object.values(this.workflow.nodes).filter(
      node => node.type === NodeType.END
    );

    if (endNodes.length === 0) {
      this.warnings.push({
        message: '建议工作流包含至少一个结束节点',
        type: 'warning'
      });
    }

    // Validate startId
    if (this.workflow.startId && !this.workflow.nodes[this.workflow.startId]) {
      this.errors.push({
        message: '指定的开始节点ID不存在',
        type: 'error'
      });
    }

    // Validate errorId
    if (this.workflow.errorId && !this.workflow.nodes[this.workflow.errorId]) {
      this.errors.push({
        message: '指定的错误处理节点ID不存在',
        type: 'error'
      });
    }
  }

  private validateNodes() {
    Object.values(this.workflow.nodes).forEach(node => {
      this.validateNode(node);
    });
  }

  private validateNode(node: WorkflowNode) {
    // Check if node has required fields
    if (!node.id) {
      this.errors.push({
        nodeId: node.id,
        message: '节点缺少ID',
        type: 'error'
      });
    }

    if (!node.name || node.name.trim() === '') {
      this.warnings.push({
        nodeId: node.id,
        message: `节点 ${node.id} 缺少名称`,
        type: 'warning'
      });
    }

    if (!node.type) {
      this.errors.push({
        nodeId: node.id,
        message: `节点 ${node.id} 缺少类型`,
        type: 'error'
      });
    }

    // Validate position
    if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
      this.errors.push({
        nodeId: node.id,
        message: `节点 ${node.id} 位置信息无效`,
        type: 'error'
      });
    }

    // Type-specific validations
    this.validateNodeTypeSpecific(node);

    // Validate connections
    this.validateNodeConnections(node);
  }

  private validateNodeTypeSpecific(node: WorkflowNode) {
    switch (node.type) {
      case NodeType.CONDITION:
        this.validateConditionNode(node);
        break;
      case NodeType.VARVALUE:
        this.validateVarValueNode(node);
        break;
      case NodeType.HTTP_REQUEST:
        this.validateHttpRequestNode(node);
        break;
      case NodeType.DATABASE:
        this.validateDatabaseNode(node);
        break;
      case NodeType.CALLFLOW:
        this.validateCallFlowNode(node);
        break;
    }
  }

  private validateConditionNode(node: WorkflowNode) {
    if (!node.data?.expression) {
      this.errors.push({
        nodeId: node.id,
        message: `条件节点 ${node.name} 缺少条件表达式`,
        type: 'error'
      });
    }

    // Check if condition node has both true and false branches
    const trueConnections = this.workflow.edges.filter(
      edge => edge.source === node.id && edge.type === 'success'
    );
    const falseConnections = this.workflow.edges.filter(
      edge => edge.source === node.id && edge.type === 'default'
    );

    if (trueConnections.length === 0) {
      this.warnings.push({
        nodeId: node.id,
        message: `条件节点 ${node.name} 缺少真分支连接`,
        type: 'warning'
      });
    }

    if (falseConnections.length === 0) {
      this.warnings.push({
        nodeId: node.id,
        message: `条件节点 ${node.name} 缺少假分支连接`,
        type: 'warning'
      });
    }
  }

  private validateVarValueNode(node: WorkflowNode) {
    if (!node.data?.assignments || !Array.isArray(node.data.assignments)) {
      this.warnings.push({
        nodeId: node.id,
        message: `变量赋值节点 ${node.name} 没有配置赋值操作`,
        type: 'warning'
      });
      return;
    }

    node.data.assignments.forEach((assignment: any, index: number) => {
      if (!assignment.variableId) {
        this.errors.push({
          nodeId: node.id,
          message: `变量赋值节点 ${node.name} 第 ${index + 1} 个赋值操作缺少变量ID`,
          type: 'error'
        });
      }

      if (!assignment.value && !assignment.expressionId) {
        this.warnings.push({
          nodeId: node.id,
          message: `变量赋值节点 ${node.name} 第 ${index + 1} 个赋值操作缺少值或表达式`,
          type: 'warning'
        });
      }

      // Check if variable exists
      if (assignment.variableId && !this.workflow.variables[assignment.variableId]) {
        this.errors.push({
          nodeId: node.id,
          message: `变量赋值节点 ${node.name} 引用的变量 ${assignment.variableId} 不存在`,
          type: 'error'
        });
      }
    });
  }

  private validateHttpRequestNode(node: WorkflowNode) {
    if (!node.data?.url) {
      this.errors.push({
        nodeId: node.id,
        message: `HTTP请求节点 ${node.name} 缺少URL`,
        type: 'error'
      });
    } else {
      // Validate URL format
      try {
        new URL(node.data.url);
      } catch {
        this.errors.push({
          nodeId: node.id,
          message: `HTTP请求节点 ${node.name} URL格式无效`,
          type: 'error'
        });
      }
    }

    if (!node.data?.method) {
      this.warnings.push({
        nodeId: node.id,
        message: `HTTP请求节点 ${node.name} 未指定请求方法，将使用默认的GET`,
        type: 'warning'
      });
    }
  }

  private validateDatabaseNode(node: WorkflowNode) {
    if (!node.data?.query) {
      this.errors.push({
        nodeId: node.id,
        message: `数据库节点 ${node.name} 缺少SQL查询`,
        type: 'error'
      });
    }

    if (!node.data?.connectionId) {
      this.errors.push({
        nodeId: node.id,
        message: `数据库节点 ${node.name} 缺少数据库连接ID`,
        type: 'error'
      });
    }
  }

  private validateCallFlowNode(node: WorkflowNode) {
    if (!node.data?.flowId) {
      this.errors.push({
        nodeId: node.id,
        message: `调用流程节点 ${node.name} 缺少流程ID`,
        type: 'error'
      });
    }
  }

  private validateNodeConnections(node: WorkflowNode) {
    // Check if non-start nodes have incoming connections
    if (node.type !== NodeType.START) {
      const incomingEdges = this.workflow.edges.filter(edge => edge.target === node.id);
      if (incomingEdges.length === 0) {
        this.warnings.push({
          nodeId: node.id,
          message: `节点 ${node.name} 没有输入连接`,
          type: 'warning'
        });
      }
    }

    // Check if non-end nodes have outgoing connections
    if (node.type !== NodeType.END) {
      const outgoingEdges = this.workflow.edges.filter(edge => edge.source === node.id);
      if (outgoingEdges.length === 0) {
        this.warnings.push({
          nodeId: node.id,
          message: `节点 ${node.name} 没有输出连接`,
          type: 'warning'
        });
      }
    }
  }

  private validateConnections() {
    this.workflow.edges.forEach(edge => {
      // Check if source node exists
      if (!this.workflow.nodes[edge.source]) {
        this.errors.push({
          message: `连接 ${edge.id} 的源节点 ${edge.source} 不存在`,
          type: 'error'
        });
      }

      // Check if target node exists
      if (!this.workflow.nodes[edge.target]) {
        this.errors.push({
          message: `连接 ${edge.id} 的目标节点 ${edge.target} 不存在`,
          type: 'error'
        });
      }

      // Check for self-connections
      if (edge.source === edge.target) {
        this.errors.push({
          message: `连接 ${edge.id} 不能连接到自身`,
          type: 'error'
        });
      }
    });

    // Check for cycles (simplified check)
    this.detectCycles();
  }

  private detectCycles() {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) {
        return true;
      }

      if (visited.has(nodeId)) {
        return false;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = this.workflow.edges.filter(edge => edge.source === nodeId);
      for (const edge of outgoingEdges) {
        if (hasCycle(edge.target)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const nodeId of Object.keys(this.workflow.nodes)) {
      if (!visited.has(nodeId)) {
        if (hasCycle(nodeId)) {
          this.warnings.push({
            message: '工作流中检测到循环依赖',
            type: 'warning'
          });
          break;
        }
      }
    }
  }

  private validateVariables() {
    Object.values(this.workflow.variables).forEach(variable => {
      if (!variable.name || variable.name.trim() === '') {
        this.errors.push({
          message: `变量 ${variable.id} 缺少名称`,
          type: 'error'
        });
      }

      if (variable.dataType === undefined || variable.dataType === null) {
        this.errors.push({
          message: `变量 ${variable.name} 缺少数据类型`,
          type: 'error'
        });
      }
    });

    // Check for duplicate variable names
    const variableNames = Object.values(this.workflow.variables).map(v => v.name);
    const duplicates = variableNames.filter((name, index) => variableNames.indexOf(name) !== index);
    
    if (duplicates.length > 0) {
      this.warnings.push({
        message: `存在重复的变量名称: ${[...new Set(duplicates)].join(', ')}`,
        type: 'warning'
      });
    }
  }

  private validateExpressions() {
    Object.values(this.workflow.expressions).forEach(expression => {
      if (!expression.name || expression.name.trim() === '') {
        this.errors.push({
          message: `表达式 ${expression.id} 缺少名称`,
          type: 'error'
        });
      }

      if (!expression.content || expression.content.length === 0) {
        this.errors.push({
          message: `表达式 ${expression.name} 缺少内容`,
          type: 'error'
        });
      }

      if (!expression.returnType) {
        this.warnings.push({
          message: `表达式 ${expression.name} 缺少返回类型`,
          type: 'warning'
        });
      }
    });
  }
}

// Utility function to validate a workflow
export function validateWorkflow(workflow: Workflow): ValidationResult {
  const validator = new WorkflowValidator(workflow);
  return validator.validate();
}

// Utility function to get validation summary
export function getValidationSummary(result: ValidationResult): string {
  if (result.isValid) {
    if (result.warnings.length === 0) {
      return '工作流验证通过，没有发现任何问题。';
    } else {
      return `工作流验证通过，但有 ${result.warnings.length} 个警告。`;
    }
  } else {
    return `工作流验证失败，发现 ${result.errors.length} 个错误和 ${result.warnings.length} 个警告。`;
  }
}