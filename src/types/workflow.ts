export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  position: { x: number; y: number };
  data: NodeData;
  nextId?: string;
  previousIds: string[];
  errorId?: string;
  color?: string;
}

export interface NodeData {
  [key: string]: any;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'success' | 'error';
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  startId: string;
  errorId?: string;
  maxParallel?: number;
  maxQueueLength?: number;
  executionTimeoutSecond?: number;
  nodes: Record<string, WorkflowNode>;
  edges: WorkflowEdge[];
  variables: Record<string, WorkflowVariable>;
  expressions: Record<string, Expression>;
}

export interface WorkflowVariable {
  id: string;
  name: string;
  dataType: DataType;
  defaultValue?: any;
  description?: string;
  lifeCycle?: 'single' | 'persistent';
  jsonNodes?: JsonNode[];
}

export interface JsonNode {
  id: string;
  parentId?: string;
  name: string;
  dataType: string;
  nodeType: 'node' | 'array';
  children?: JsonNode[];
}

export interface Expression {
  id: string;
  name: string;
  content: ExpressionContent[];
  returnType: string;
}

export interface ExpressionContent {
  type: 'text' | 'variable';
  value: string;
  variableId?: string;
}

export enum NodeType {
  START = 'START',
  END = 'END',
  CONDITION = 'CONDITION',
  VARVALUE = 'VARVALUE',
  DATATYPECONVERT = 'DATATYPECONVERT',
  CALLFLOW = 'CALLFLOW',
  ERROR = 'ERROR',
  JSONTOJSON = 'JsonToJson',
  HTTP_REQUEST = 'HTTP_REQUEST',
  DATABASE = 'DATABASE',
  LOOP = 'LOOP',
  PARALLEL = 'PARALLEL'
}

export enum DataType {
  STRING = 2,
  NUMBER = 1,
  BOOLEAN = 3,
  JSON = 33,
  ARRAY = 4,
  DATE = 5
}

export interface NodeTemplate {
  type: NodeType;
  name: string;
  icon: string;
  description: string;
  defaultData: NodeData;
  configurable: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  nodeId?: string;
  message: string;
  type: 'error';
}

export interface ValidationWarning {
  nodeId?: string;
  message: string;
  type: 'warning';
}

export interface WorkflowExportData {
  workflow: Workflow;
  version: string;
  exportDate: string;
}