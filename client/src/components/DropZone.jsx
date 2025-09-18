import React from 'react';
import { useDrop } from 'react-dnd';

// Add onMovePlayer to the props
const DropZone = ({ zoneId, onDrop, onMovePlayer, children }) => {
  const [{ isOver }, drop] = useDrop({
    // Accept both types of items
    accept: ['player', 'playerOnPitch'], 
    
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const svg = document.getElementById('pitch');
      if (!svg) return;

      // Get coordinates relative to the SVG canvas
      const point = svg.createSVGPoint();
      point.x = clientOffset.x;
      point.y = clientOffset.y;
      const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());

      const itemType = monitor.getItemType();

      if (itemType === 'player') {
        // This is a new player from the carousel
        if (onDrop) {
          onDrop(item, zoneId, svgPoint.x, svgPoint.y);
        }
      } else if (itemType === 'playerOnPitch') {
        // This is an existing player being moved on the pitch
        if (onMovePlayer) {
          onMovePlayer(item.playerId, svgPoint.x, svgPoint.y);
        }
      }
      
      return { zoneId };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <g ref={drop} className={`zone ${isOver ? 'bg-green-500/10' : ''}`} data-zone-id={zoneId}>
      {children}
    </g>
  );
};

export default DropZone;
