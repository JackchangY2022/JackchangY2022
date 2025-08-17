import { WorkflowConverter } from './workflowConverter';

// 基于原始flow1.txt的简化演示数据
export const originalDemoWorkflow = {
  "ID": "049FD372E4704F508D08AD2870D8B309",
  "StartID": "CBB2F97AB84BD4BE0A8B8391398F645BD",
  "ErrorID": "CF144E567CE494F3F9437514BBB75CABF",
  "FlowName": "门诊登记演示",
  "MaxParallel": 5,
  "MaxQueueLength": 100,
  "ExecutionTimeoutSecond": 300,
  "ProcessDic": {
    "CBB2F97AB84BD4BE0A8B8391398F645BD": {
      "Name": "开始",
      "NextID": "CC28453BD02D04D67959BDC9014558154",
      "PreviousID": [],
      "ErrorID": "",
      "TypeCode": "START",
      "TypeName": "开始",
      "NodeType": 1,
      "ID": "CBB2F97AB84BD4BE0A8B8391398F645BD",
      "Color": "rgba(34, 197, 94, 1)"
    },
    "CC28453BD02D04D67959BDC9014558154": {
      "VarIDAndExpID": {
        "DDD4EB7310AF45D2A8AC5FA5DEBA44FB": "FCE711E2FAED574A4A89F667CDD4082232",
        "332380548C854C6D8CF72ECEBEEC6F7F": "FC2DD2DC0D0ADE4BD9BE231055ED6966D2"
      },
      "Name": "变量赋值",
      "NextID": "C397201582EA4454B8C5FFCD5001C9105",
      "PreviousID": [],
      "ErrorID": "",
      "TypeCode": "VARVALUE",
      "TypeName": "变量赋值",
      "NodeType": 1,
      "ID": "CC28453BD02D04D67959BDC9014558154",
      "Color": "rgba(59, 130, 246, 1)"
    },
    "C397201582EA4454B8C5FFCD5001C9105": {
      "FunctionName": "FC8DF2AB68F33D40C88A4D80F9AFCE4ED5",
      "TrueID": "C7029C8451993440EA4DC3302D97E9A3F",
      "FalseID": "CDD331AAF87114BB69A18BA870A72F84E",
      "Name": "条件判断",
      "NextID": "",
      "PreviousID": [],
      "ErrorID": "",
      "TypeCode": "CONDITION",
      "TypeName": "条件判断",
      "NodeType": 1,
      "ID": "C397201582EA4454B8C5FFCD5001C9105",
      "Color": "rgba(251, 191, 36, 1)"
    },
    "C7029C8451993440EA4DC3302D97E9A3F": {
      "Name": "类型转换",
      "NextID": "C18B160624A1141F9ADA93E899452A07C",
      "PreviousID": [],
      "ErrorID": "",
      "TypeCode": "DATATYPECONVERT",
      "TypeName": "类型转换",
      "InDataType": 2,
      "OutDataType": 33,
      "SourceVarID": "4B65048041F947A59A3502788432BA1C",
      "OutVarID": "277D3F273CE8494C8CE5F0F3C23AA4B2",
      "NodeType": 0,
      "ID": "C7029C8451993440EA4DC3302D97E9A3F",
      "Color": "rgba(168, 85, 247, 1)"
    },
    "C18B160624A1141F9ADA93E899452A07C": {
      "Name": "JSON转换",
      "NextID": "C0030BC370BAD486D913CA0365A71BCC5",
      "PreviousID": [],
      "ErrorID": "",
      "TypeCode": "JsonToJson",
      "TypeName": "JSON转换",
      "NodeType": 1,
      "ID": "C18B160624A1141F9ADA93E899452A07C",
      "Color": "rgba(14, 165, 233, 1)"
    },
    "C0030BC370BAD486D913CA0365A71BCC5": {
      "VarIDAndExpID": {
        "9E1F23BEB81B49809EF0AAB369787DCB": "FC7D9FC58C24394A788DA630E887A654F6"
      },
      "Name": "服务输出",
      "NextID": "CB693162F78B24914944E1425E8ACB7CD",
      "PreviousID": [],
      "ErrorID": "",
      "TypeCode": "VARVALUE",
      "TypeName": "变量赋值",
      "NodeType": 1,
      "ID": "C0030BC370BAD486D913CA0365A71BCC5",
      "Color": "rgba(59, 130, 246, 1)"
    },
    "CB693162F78B24914944E1425E8ACB7CD": {
      "ReturnMsgID": "9E1F23BEB81B49809EF0AAB369787DCB",
      "Name": "结束",
      "NextID": "",
      "PreviousID": [],
      "ErrorID": "",
      "TypeCode": "END",
      "TypeName": "结束",
      "NodeType": 1,
      "ID": "CB693162F78B24914944E1425E8ACB7CD",
      "Color": "rgba(239, 68, 68, 1)"
    },
    "CDD331AAF87114BB69A18BA870A72F84E": {
      "Name": "异常处理",
      "NextID": "CF144E567CE494F3F9437514BBB75CABF",
      "PreviousID": [],
      "ErrorID": "",
      "TypeCode": "ERROR",
      "TypeName": "异常处理",
      "NodeType": 1,
      "ID": "CDD331AAF87114BB69A18BA870A72F84E",
      "Color": "rgba(239, 68, 68, 1)"
    },
    "CF144E567CE494F3F9437514BBB75CABF": {
      "ReturnMsgID": "9E5515061B0E48D693FAD56997E2339B",
      "Name": "异常",
      "NextID": "",
      "PreviousID": [],
      "ErrorID": "",
      "TypeCode": "ERROR",
      "TypeName": "异常",
      "NodeType": 1,
      "ID": "CF144E567CE494F3F9437514BBB75CABF",
      "Color": "rgba(239, 68, 68, 1)"
    }
  },
  "VariableDic": {
    "DDD4EB7310AF45D2A8AC5FA5DEBA44FB": {
      "Id": "DDD4EB7310AF45D2A8AC5FA5DEBA44FB",
      "Text": "P_J_Input",
      "DataType": 33,
      "DefaultValue": null,
      "Note": "输入参数"
    },
    "9E1F23BEB81B49809EF0AAB369787DCB": {
      "Id": "9E1F23BEB81B49809EF0AAB369787DCB",
      "Text": "P_J_Output",
      "DataType": 33,
      "DefaultValue": null,
      "Note": "输出参数"
    },
    "332380548C854C6D8CF72ECEBEEC6F7F": {
      "Id": "332380548C854C6D8CF72ECEBEEC6F7F",
      "Text": "P_S_HOSPCODE",
      "DataType": 2,
      "DefaultValue": null,
      "Note": "医院编码"
    },
    "4B65048041F947A59A3502788432BA1C": {
      "Id": "4B65048041F947A59A3502788432BA1C",
      "Text": "P_S_INPUT",
      "DataType": 2,
      "DefaultValue": null,
      "Note": "输入字符串"
    },
    "277D3F273CE8494C8CE5F0F3C23AA4B2": {
      "Id": "277D3F273CE8494C8CE5F0F3C23AA4B2",
      "Text": "P_J_CONVERTED",
      "DataType": 33,
      "DefaultValue": null,
      "Note": "转换后的JSON"
    }
  },
  "ExpressionDic": {
    "FCE711E2FAED574A4A89F667CDD4082232": {
      "Content": ["return \"H123456789\";"],
      "FunctionName": "FCE711E2FAED574A4A89F667CDD4082232",
      "ReturnType": "string"
    },
    "FC2DD2DC0D0ADE4BD9BE231055ED6966D2": {
      "Content": ["return \"门诊登记接口\";"],
      "FunctionName": "FC2DD2DC0D0ADE4BD9BE231055ED6966D2",
      "ReturnType": "string"
    },
    "FC8DF2AB68F33D40C88A4D80F9AFCE4ED5": {
      "Content": [
        "if (",
        {
          "Id": "DDD4EB7310AF45D2A8AC5FA5DEBA44FB",
          "Text": "P_J_Input",
          "DataType": "33"
        },
        " != null) return true; else return false;"
      ],
      "FunctionName": "FC8DF2AB68F33D40C88A4D80F9AFCE4ED5",
      "ReturnType": "boolean"
    },
    "FC7D9FC58C24394A788DA630E887A654F6": {
      "Content": [
        "return ",
        {
          "Id": "277D3F273CE8494C8CE5F0F3C23AA4B2",
          "Text": "P_J_CONVERTED",
          "DataType": "33"
        },
        ";"
      ],
      "FunctionName": "FC7D9FC58C24394A788DA630E887A654F6",
      "ReturnType": "string"
    }
  }
};

/**
 * 转换演示工作流为新格式
 */
export function convertDemoWorkflow() {
  return WorkflowConverter.convertFromOriginal(originalDemoWorkflow);
}

/**
 * 获取演示工作流的JSON字符串，用于导入测试
 */
export function getDemoWorkflowJSON() {
  return JSON.stringify(originalDemoWorkflow, null, 2);
}