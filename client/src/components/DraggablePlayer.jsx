import React from 'react';
import { useDrag } from 'react-dnd';

const DraggablePlayer = ({ player, team }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'player',
    // Correctly set the item with MongoDB _ids
    item: { playerId: player._id, teamId: team._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    // The end logic is handled by the DropZone (Pitch) via onDropPlayer,
    // so no complex end handler is needed here.
  });

  return (
    <div
      ref={drag}
      className={`player-chip sidebar-player flex items-center p-1.5 rounded-md text-sm flex-shrink-0 ${isDragging ? 'opacity-50' : ''}`}
      style={{ backgroundColor: team.color, color: team.textColor }}
      data-player-id={player._id}
      data-team-id={team._id}
    >
      <span className="font-bold w-6 text-center">{player.position}</span>
      <span className="ml-2">{player.name}</span>
    </div>
  );
};

export default DraggablePlayer;
