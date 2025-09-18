import React, { useRef, useEffect, useState } from 'react';
import DropZone from './DropZone';
import PlayerOnPitch from './PlayerOnPitch';

// The props are updated to reflect what App.jsx now provides.
const Pitch = ({
  gameMode,
  playersOnPitch,
  ballPosition,
  drawingTool,
  color,
  lineWidth,
  teamDetails,
  onDropPlayer,
  onDragEndPlayer,
  onRightClick
}) => {
  const pitchRef = useRef(null);
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Canvas and drawing logic remains the same...
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    setCtx(context);
    const resizeCanvas = () => {
      if (!pitchRef.current) return;
      const rect = pitchRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.globalCompositeOperation = drawingTool === 'eraser' ? 'destination-out' : 'source-over';
  }, [ctx, color, lineWidth, drawingTool]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if (drawingTool === 'select') return;
    e.preventDefault();
    setIsDrawing(true);
    const pos = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    e.preventDefault();
    const pos = getCanvasCoords(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    ctx.closePath();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isDrawing, ctx, drawingTool]); // Dependencies are correct

  const renderZones = () => {
    const zones = [];
    const cols = gameMode === 'single' ? 3 : 6;
    const totalWidth = 1046;
    const totalHeight = 676;
    const colWidth = totalWidth / cols;
    const rowHeight = totalHeight / 3;
    for (let c = 1; c <= cols; c++) {
      for (let r = 1; r <= 3; r++) {
        const zoneId = `${c},${r}`;
        zones.push(
          <DropZone key={zoneId} zoneId={zoneId} onDrop={onDropPlayer} onMovePlayer={onDragEndPlayer}>
            <rect
              className="zone"
              x={2 + (c - 1) * colWidth}
              y={2 + (r - 1) * rowHeight}
              width={colWidth}
              height={rowHeight}
              data-zone-id={zoneId}
            />
          </DropZone>
        );
      }
    }
    return zones;
  };

  // **This is the key change**
  // The renderPlayers function is now corrected to use the new data structure.
  const renderPlayers = () => {
    return playersOnPitch.map((player) => {
      // Find the full team object from teamDetails using the player's teamId
      const team = teamDetails[player.teamId];
      
      // Don't render if the team for this player isn't loaded yet
      if (!team) return null;

      return (
        <PlayerOnPitch
          key={player._id}
          player={player}
          team={team}
          onDragEnd={onDragEndPlayer}
          onRightClick={onRightClick}
        />
      );
    });
  };

  const renderBall = () => {
    if (!ballPosition) return null;
    return (
      <g className="ball-on-pitch" transform={`translate(${ballPosition.x}, ${ballPosition.y})`}>
        <circle cx="0" cy="0" r="20" stroke="white" strokeWidth="3" fill="none" />
        <image href="https://static.vecteezy.com/system/resources/previews/015/082/027/original/classic-soccer-ball-or-football-png.png" x="-20" y="-20" width="40" height="40" />
      </g>
    );
  };

  return (
    <div id="pitch-container" className="w-full h-full max-w-5xl aspect-[105/68] relative shadow-2xl rounded-lg overflow-hidden">
      <svg ref={pitchRef} id="pitch" className="pitch w-full h-full" viewBox="0 0 1050 680" preserveAspectRatio="xMidYMid meet">
        {/* Pitch lines */}
        <rect className="pitch-line" x="2" y="2" width="1046" height="676" />
        <line className="pitch-line" x1="525" y1="2" x2="525" y2="678" />
        <circle className="pitch-line" cx="525" cy="340" r="91.5" />
        <circle className="pitch-line" cx="525" cy="340" r="4" fill="white" />
        <rect className="pitch-line" x="2" y="138.5" width="165" height="403" />
        <rect className="pitch-line" x="2" y="248.5" width="55" height="183" />
        <circle className="pitch-line" cx="110" cy="340" r="4" fill="white" />
        <rect className="pitch-line" x="883" y="138.5" width="165" height="403" />
        <rect className="pitch-line" x="993" y="248.5" width="55" height="183" />
        <circle className="pitch-line" cx="940" cy="340" r="4" fill="white" />
        
        <g id="zones-container">
          {renderZones()}
        </g>

        <g id="players-on-pitch-container">
          {renderPlayers()}
          {renderBall()}
        </g>
      </svg>
      <canvas ref={canvasRef} id="drawing-canvas" className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: drawingTool === 'select' ? 'none' : 'auto' }} />
    </div>
  );
};

export default Pitch;
