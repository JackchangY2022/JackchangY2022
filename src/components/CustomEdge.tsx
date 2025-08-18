import React from 'react'
import { BaseEdge, EdgeLabelRenderer, getBezierPath, EdgeProps } from 'reactflow'

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        {data?.label && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              fontWeight: 500,
              backgroundColor: '#f3f4f6',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            {data.label}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  )
}

export default CustomEdge