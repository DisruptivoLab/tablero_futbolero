import React from 'react';
import DraggablePlayer from './DraggablePlayer';

const TeamsCarousel = ({ localTeam, visitorTeam }) => {
  const teamOrder = [
    { team: localTeam, label: 'Local' },
    { team: visitorTeam, label: 'Visitante' }
  ];

  return (
    <div id="teams-container" className="flex flex-col space-y-3">
      {teamOrder.map((teamInfo, index) => {
        const { team, label } = teamInfo;
        if (!team || !team.players) return null;

        return (
          <div key={team._id || index} className="team-container w-full bg-gray-800/50 p-2 rounded-lg">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center">
                <img src={team.logo} alt={`${team.name} Logo`} className="w-6 h-6 mr-2" />
                <h3 className="text-md font-semibold">{team.name}</h3>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            </div>
            <div className="relative">
              <div className={`carousel-body-${index} flex flex-row overflow-x-auto space-x-2 pb-2 scroll-smooth scrollbar-hide`}>
                {team.players.map(player => (
                  <DraggablePlayer
                    key={player._id}
                    player={player}
                    team={team} // Pass the entire team object
                  />
                ))}
              </div>
              <button className="carousel-arrow absolute top-1/2 left-0 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60 focus:outline-none z-10" onClick={() => {
                const carousel = document.querySelector(`.carousel-body-${index}`);
                if (carousel) carousel.scrollBy({ left: -250, behavior: 'smooth' });
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="carousel-arrow absolute top-1/2 right-0 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60 focus:outline-none z-10" onClick={() => {
                const carousel = document.querySelector(`.carousel-body-${index}`);
                if (carousel) carousel.scrollBy({ left: 250, behavior: 'smooth' });
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamsCarousel;