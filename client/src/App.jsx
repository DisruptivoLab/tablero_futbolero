import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import Pitch from './components/Pitch';
import TeamsCarousel from './components/TeamsCarousel';
import RoleModal from './components/RoleModal';
import AuthModal from './components/AuthModal'; // Importar AuthModal
import { useAuth } from './context/AuthContext'; // Importar useAuth
import html2canvas from 'html2canvas';
import './index.css';

// Zone maps remain the same
const singleTeamZoneMap = {
  '1,1': [{ role: 'DFI', line: 'defense' }, { role: 'LTI', line: 'defense' }], 
  '1,2': [{ role: 'DFC', line: 'defense' }], 
  '1,3': [{ role: 'DFD', line: 'defense' }, { role: 'LTD', line: 'defense' }],
  '2,1': [{ role: 'MI', line: 'midfield' }], 
  '2,2': [{ role: 'MC', line: 'midfield' }, { role: 'MCD', line: 'midfield' }, { role: 'MCO', line: 'midfield' }], 
  '2,3': [{ role: 'MD', line: 'midfield' }],
  '3,1': [{ role: 'EI', line: 'attack' }, { role: 'SDI', line: 'attack' }], 
  '3,2': [{ role: 'DC', line: 'attack' }], 
  '3,3': [{ role: 'ED', line: 'attack' }, { role: 'SDD', line: 'attack' }],
};

const dualTeamZoneMap = {
  // Local Team (left to right)
  '1,1': [{ role: 'DFI', line: 'defense' }, { role: 'LTI', line: 'defense' }], 
  '1,2': [{ role: 'DFC', line: 'defense' }], 
  '1,3': [{ role: 'DFD', line: 'defense' }, { role: 'LTD', line: 'defense' }],
  '2,1': [{ role: 'MI', line: 'midfield' }], 
  '2,2': [{ role: 'MC', line: 'midfield' }, { role: 'MCD', line: 'midfield' }, { role: 'MCO', line: 'midfield' }], 
  '2,3': [{ role: 'MD', line: 'midfield' }],
  '3,1': [{ role: 'EI', line: 'attack' }, { role: 'SDI', line: 'attack' }], 
  '3,2': [{ role: 'DC', line: 'attack' }], 
  '3,3': [{ role: 'ED', line: 'attack' }, { role: 'SDD', line: 'attack' }],
  
  // Visitor Team (right to left)
  '4,3': [{ role: 'EI', line: 'attack' }, { role: 'SDI', line: 'attack' }], 
  '4,2': [{ role: 'DC', line: 'attack' }], 
  '4,1': [{ role: 'ED', line: 'attack' }, { role: 'SDD', line: 'attack' }],
  '5,3': [{ role: 'MI', line: 'midfield' }], 
  '5,2': [{ role: 'MC', line: 'midfield' }, { role: 'MCD', line: 'midfield' }, { role: 'MCO', line: 'midfield' }], 
  '5,1': [{ role: 'MD', line: 'midfield' }],
  '6,3': [{ role: 'DFI', line: 'defense' }, { role: 'LTI', line: 'defense' }], 
  '6,2': [{ role: 'DFC', line: 'defense' }], 
  '6,1': [{ role: 'DFD', line: 'defense' }, { role: 'LTD', line: 'defense' }],
};

// Forzando la actualización para Vercel
function App() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Core board state
  const [gameMode, setGameMode] = useState('single');
  const [playersOnPitch, setPlayersOnPitch] = useState([]);
  const [mainTeamKey, setMainTeamKey] = useState(null); // This should be a team ID now
  const [ballPosition, setBallPosition] = useState(null);
  const [formation, setFormation] = useState('-');
  
  // UI and tools state
  const [drawingTool, setDrawingTool] = useState('select');
  const [color, setColor] = useState('#FFFF00');
  const [lineWidth, setLineWidth] = useState(4);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Dynamic Data State
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [localTeam, setLocalTeam] = useState(null);
  const [visitorTeam, setVisitorTeam] = useState(null);
  
  // This will hold the full team objects with players, keyed by team ID
  const [teamDetails, setTeamDetails] = useState({});

  // --- DATA FETCHING ---
  useEffect(() => {
    axios.get('/api/leagues')
      .then(response => {
        setLeagues(response.data);
        if (response.data.length > 0) {
          setSelectedLeague(response.data[0]._id);
        }
      })
      .catch(error => console.error('Error fetching leagues:', error));
  }, []);

  useEffect(() => {
    if (!selectedLeague) return;
    axios.get(`/api/teams?leagueId=${selectedLeague}`)
      .then(response => {
        const fetchedTeams = response.data;
        setTeams(fetchedTeams);
        
        const newTeamDetails = {};
        fetchedTeams.forEach(team => {
            newTeamDetails[team._id] = team;
        });
        setTeamDetails(newTeamDetails);

        if (fetchedTeams.length > 0) {
          setLocalTeam(fetchedTeams[0]);
        }
        if (fetchedTeams.length > 1) {
          setVisitorTeam(fetchedTeams[1]);
        } else {
          setVisitorTeam(null);
        }
      })
      .catch(error => console.error('Error fetching teams:', error));
  }, [selectedLeague]);


  // --- HANDLERS ---

  const handleToggleChange = (e) => {
    const newMode = e.target.checked ? 'dual' : 'single';
    setGameMode(newMode);
    // DIRECTIVE 2: Do NOT clear players on pitch
  };

  const takeScreenshot = async () => {
    const pitchArea = document.getElementById('pitch-container');
    if (!pitchArea) return;
    const toolbar = document.querySelector('.fixed.bottom-4');
    if (toolbar) toolbar.style.display = 'none';
    const canvas = await html2canvas(pitchArea, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null
    });
    if (toolbar) toolbar.style.display = 'flex';
    const link = document.createElement('a');
    link.download = 'pizarra-tactica.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleDropPlayer = (item, zoneId, x, y) => {
    const team = teamDetails[item.teamId];
    if (!team) return;
    // Assuming the player object from the backend has _id
    const playerData = team.players.find(p => p._id === item.playerId);
    if (!playerData) return;

    const zoneMap = gameMode === 'single' ? singleTeamZoneMap : dualTeamZoneMap;
    const rolesInZone = zoneMap[zoneId] || [];
    const assignedRoleInfo = rolesInZone[0] || { role: '-', line: 'none' };

    const newPlayer = {
      ...playerData,
      role: assignedRoleInfo.role,
      line: assignedRoleInfo.line,
      x,
      y,
      teamId: item.teamId,
    };

    setPlayersOnPitch(prev => {
      const existingIndex = prev.findIndex(p => p._id === item.playerId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = newPlayer;
        return updated;
      }
      return [...prev, newPlayer];
    });

    if (gameMode === 'single' && !mainTeamKey) {
      setMainTeamKey(item.teamId);
    }
  };

  const handleDragEndPlayer = (playerId, newX, newY) => {
    if (newX !== null && newY !== null) {
      setPlayersOnPitch(prev => prev.map(p => p._id === playerId ? { ...p, x: newX, y: newY } : p));
    } else {
      setPlayersOnPitch(prev => prev.filter(p => p._id !== playerId));
    }
  };

  const handleRightClick = (playerId) => {
    const player = playersOnPitch.find(p => p._id === playerId);
    if (player && player.position !== 'GK') {
      setSelectedPlayer(player);
      setShowRoleModal(true);
    }
  };

  const handleSelectRole = (role, line) => {
    if (selectedPlayer) {
      setPlayersOnPitch(prev => prev.map(p => p._id === selectedPlayer._id ? { ...p, role, line } : p));
      setShowRoleModal(false);
      setSelectedPlayer(null);
    }
  };
  
  const calculateFormation = () => {
    if (gameMode === 'single') {
      const playersToCount = mainTeamKey ? playersOnPitch.filter(p => p.teamId === mainTeamKey) : [];
      const outfield = playersToCount.filter(p => p.position !== 'GK');
      const defense = outfield.filter(p => p.line === 'defense').length;
      const midfield = outfield.filter(p => p.line === 'midfield').length;
      const attack = outfield.filter(p => p.line === 'attack').length;
      return outfield.length > 0 ? `${defense}-${midfield}-${attack}` : '-';
    } else {
      // DIRECTIVE 3: Implement "Respect the Zone"
      const localPlayers = playersOnPitch.filter(p => localTeam && p.teamId === localTeam._id && p.x < 525);
      const visitorPlayers = playersOnPitch.filter(p => visitorTeam && p.teamId === visitorTeam._id && p.x >= 525);

      const localForm = localPlayers.filter(p => p.position !== 'GK').reduce((acc, p) => {
        acc[p.line] = (acc[p.line] || 0) + 1;
        return acc;
      }, { defense: 0, midfield: 0, attack: 0 });

      const visitorForm = visitorPlayers.filter(p => p.position !== 'GK').reduce((acc, p) => {
        acc[p.line] = (acc[p.line] || 0) + 1;
        return acc;
      }, { defense: 0, midfield: 0, attack: 0 });

      const localString = localTeam && localPlayers.length > 0 ? `${localTeam.name}: ${localForm.defense}-${localForm.midfield}-${localForm.attack}` : '';
      const visitorString = visitorTeam && visitorPlayers.length > 0 ? `${visitorTeam.name}: ${visitorForm.defense}-${visitorForm.midfield}-${visitorForm.attack}` : '';
      
      return [localString, visitorString].filter(Boolean).join(' | ') || '-';
    }
  };

  useEffect(() => {
    setFormation(calculateFormation());
  }, [playersOnPitch, gameMode, mainTeamKey, localTeam, visitorTeam]);


  // --- RENDER ---
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-gray-900 text-white overflow-hidden h-screen flex flex-col">
        <header className="w-full bg-gray-900 border-b border-gray-700 p-3 flex-wrap">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)} className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm">
                        <option value="">Selecciona Liga</option>
                        {leagues.map(league => <option key={league._id} value={league._id}>{league.name}</option>)}
                    </select>
                    <select value={localTeam?._id || ''} onChange={(e) => setLocalTeam(teams.find(t => t._id === e.target.value))} className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm">
                        <option value="">Equipo Local</option>
                        {teams.map(team => <option key={team._id} value={team._id}>{team.name}</option>)}
                    </select>
                    <select value={visitorTeam?._id || ''} onChange={(e) => setVisitorTeam(teams.find(t => t._id === e.target.value))} className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm">
                        <option value="">Equipo Visitante</option>
                        {teams.map(team => <option key={team._id} value={team._id}>{team.name}</option>)}
                    </select>
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium">Hola, {user.username}</span>
                            <button 
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Login / Registro
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-2">
                <TeamsCarousel localTeam={localTeam} visitorTeam={visitorTeam} teamDetails={teamDetails} />
            </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-800/50 overflow-hidden">
          <div className="flex items-center space-x-4 mb-4">
            <div id="formation-display" className="text-2xl md:text-3xl font-bold tracking-wider text-white bg-black/30 px-6 py-2 rounded-lg shadow-lg">
              {formation}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400 mb-1">Modo de Juego</span>
              <label className="toggle-switch">
                <input type="checkbox" id="mode-toggle" checked={gameMode === 'dual'} onChange={handleToggleChange} />
                <span className="slider">
                  <div className="slider-text">
                    <span>1 Equipo</span>
                    <span>2 Equipos</span>
                  </div>
                </span>
              </label>
            </div>
          </div>

          <Pitch 
            gameMode={gameMode}
            playersOnPitch={playersOnPitch}
            ballPosition={ballPosition}
            setBallPosition={setBallPosition}
            drawingTool={drawingTool}
            color={color}
            lineWidth={lineWidth}
            teamDetails={teamDetails}
            onDropPlayer={handleDropPlayer}
            onDragEndPlayer={handleDragEndPlayer}
            onRightClick={handleRightClick}
          />
        </main>
        
        <RoleModal 
          isOpen={showRoleModal} 
          onClose={() => setShowRoleModal(false)} 
          onSelectRole={handleSelectRole}
          playerName={selectedPlayer ? selectedPlayer.name.split(' ')[0] : ''}
          roles={selectedPlayer ? (dualTeamZoneMap['1,1'] || []) : []}
        />

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

        {/* Other modals and the toolbar would need to be re-added and adapted */}

      </div>
    </DndProvider>
  );
}

export default App;
