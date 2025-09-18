import React from 'react';
import { useDrag } from 'react-dnd';

const PlayerOnPitch = ({ player, team, onDragEnd, onRightClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'playerOnPitch', // Distinguishes from players in the carousel
    item: { 
      playerId: player._id, // Use MongoDB _id
      currentX: player.x,
      currentY: player.y
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      // If the player was dragged and dropped outside of any valid DropZone
      if (item && !monitor.didDrop()) {
        // This calls onDragEndPlayer in App.jsx to remove the player
        onDragEnd(item.playerId, null, null); 
      }
      // If dropped ON a zone, the zone's onDrop handler is responsible.
    },
  });

  const handleRightClick = (e) => {
    e.preventDefault();
    if (onRightClick) onRightClick(player._id); // Use MongoDB _id
  };

  // DIRECTIVE 4: Implement Mobile Tap
  const handleTap = (e) => {
    e.preventDefault();
    if (onRightClick) onRightClick(player._id); // Re-use the same logic
  };

  return (
    <g
      ref={drag}
      className={`player-on-pitch ${isDragging ? 'opacity-50' : ''} cursor-move`}
      transform={`translate(${player.x || 0}, ${player.y || 0})`}
      onContextMenu={handleRightClick}
      onTouchStart={handleTap} // Add touch handler for mobile
    >
      <circle r="25" fill={team.color} stroke="white" strokeWidth="2" />
      <text textAnchor="middle" dy="0.3em" fill={team.textColor} fontSize="14px" fontWeight="bold">
        {player.role || ''}
      </text>
      <text textAnchor="middle" y="40" fill="white" fontSize="12px" fontWeight="600">
        {player.name?.split(' ')[0] || 'Player'}
      </text>
    </g>
  );
};

export default PlayerOnPitch;
